

# Access Kubernetes API

API Server 的访问主体大体可以分为2类，都可以通过RBAC进行资源权限控制

- User, 在k8s集群外对API进行访问
  - 不是API资源类型
  - 由 k8s集群的CA认证颁发的User，才是合法用户
  - 需要手动生成 crt, key
- ServiceAccount，在集群内部对API进行访问(Pod内)
  - API资源类型
    - 可以通过API创建，自动生成 crt, token
    - 可以通过API获取一个ServiceAccount的Token，用于请求访问认证
  - 在创建Pod时，可以指定serviceaccount，默认是 default/default
    - pod创建成功后，serviceaccount, crt, token 在 pod内部可以获取到



可以使用 client库进行API访问，也可以直接使用curl进行访问
访问API时，需要 crt + token 或者 crt + key

- `curl --cert <crt> --key <kubectl.key> -X GET ${APISERVER}/api`
- `curl --cacert <crt> --header "Authorization: Bearer <TOKEN> -X GET ${APISERVER}/api`



## API Server



### `kubectl config`命令行获取

```shell
export CLUSTER_NAME=<ClusterName>
APISERVER=$(kubectl config view -o jsonpath="{.clusters[?(@.name==\"$CLUSTER_NAME\")].cluster.server}")
```



### 直接从 `~/.kube/config` 文件中读取

```shell
APISERVER=`cat  ~/.kube/config |grep server | awk -F ' ' '{print $2}'`
```



## User



### 使用 kubectl 的管理员 User

`kubernetes-admin@kubernetes`

```shell
cat /root/.kube/config |grep client-certificate-data | awk -F ' ' '{print $2}' |base64 -d > ./kubectl.crt
cat /root/.kube/config |grep client-key-data | awk -F ' ' '{print $2}' |base64 -d > ./kubectl.key


# kubectl
kubectl get pods

# curl
curl --cert ./kubectl.crt --key ./kubectl.key -k $APISERVER/api/v1/pods
```



### 创建 User

```shell
openssl genrsa -out pang.key 2048
openssl req -new -key pang.key -out pang.csr -subj "/CN=pang/ O=examplegroup"

# kubernetes CA 对用户进行签发
openssl x509 -req -in pang.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out pang.crt

# check
openssl x509 -in pang.crt -text
```



### 使用 User

```shell
# kubectl 切换上下文，来切换user
kubectl config set-credentials pang --client-certificate=./pang.crt --client-key=./pang.key
kubectl config set-context pang --cluster=kubernetes --user=pang
kubectl config use-context pang

# curl with crt
curl --cert ./pang.crt --key ./pang.key -k $APISERVER/api/v1/pods
```



### 权限控制

[RBAC](#RBAC)



## ServiceAccount

### 创建 ServiceAccount

```shell
# 未指定namespace则为default
kubectl create serviceaccount pang

kubectl create serviceaccount <namespace>/<serviceaccount>
```



### 以指定的ServiceAccount部署pod

```yaml
# deployment-nginx.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # tells deployment to run 2 pods matching the template
  template:
    metadata:
      labels:
        app: nginx
    spec:
      # 指定 serviceAccount
      serviceAccountName: pang
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```



```shell
kubectl apply -f deployment-nginx.yaml
kubectl get pods
kubectl exec --stdin --tty <pod-name> -- /bin/bash
```



### 获取 Pod 的 serviceaccount, token, cacert

```shell
# Point to the internal API server hostname
APISERVER=https://kubernetes.default.svc

# Path to ServiceAccount token
SERVICEACCOUNT=/var/run/secrets/kubernetes.io/serviceaccount

# Read this Pod's namespace
NAMESPACE=$(cat ${SERVICEACCOUNT}/namespace)

# Read the ServiceAccount bearer token
TOKEN=$(cat ${SERVICEACCOUNT}/token)

# Reference the internal certificate authority (CA)
CACERT=${SERVICEACCOUNT}/ca.crt
```



### 使用 serviceaccount

```shell
# with binding clusterrole=cluster-pod-reader , 200
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/pods

# without binding clusterrole=cluster-pod-reader , 403
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/pods
```



### 权限控制

[RBAC](#RBAC)



## RBAC

<span id="RBAC">RBAC, 即基于角色的访问控制</span>

User 和 ServiceAccount 都可以通过 Role和 Rolebinding 来授权对特定API资源的权限，大体结构如下所示：

- Role
  - resources
  - verbs
- Binding
  - Role
  - Subjects
    - Groups
    - Users 
    - ServiceAccounts



```yaml
# role-pod-reader.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

```yaml
# clusterrole-pod-reader.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: cluster-pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```



```shell
kubectl apply -f role-pod-reader.yaml
kubectl apply -f clusterrole-pod-reader.yaml
```

```shell
# binding to user
kubectl create rolebinding rolebinding-pod-reader --role=role-pod-reader --user=pang
kubectl create clusterrolebinding clusterrolebinding-pod-reader --clusterrole=clusterrole-pod-reader --user=pang

# binding to serviceaccount --serviceaccount=namespace:serviceaccount
kubectl create clusterrolebinding cluster-svc-podreader-binding --clusterrole=cluster-pod-reader --serviceaccount=default:pang
```

