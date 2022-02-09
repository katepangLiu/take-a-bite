

# Play with RBAC

- Role
  - resources
  - verbs
- Binding
  - Role
  - Subjects
    - Groups
    - Users 
    - ServiceAccounts



## Role



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



## User

### New credential

```shell
# create private key
openssl genrsa -out pang.key 2048
# create certificate
openssl req -new -key pang.key -out pang.csr -subj "/CN=pang/ O=examplegroup"
# sign certificate
openssl x509 -req -in pang.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out pang.crt
# check certificate
openssl x509 -in pang.crt -text
```

### Set credential for user

```shell
kubectl config set-credentials pang --client-certificate=/root/develop/k8s-account/pang/pang.crt --client-key=/root/develop/k8s-account/pang/pang.key

kubectl config set-context pang --cluster=kubernetes --user=pang
```



### kubectl with special user

```shell
kubectl create rolebinding podreader-binding --role=pod-reader --user=pang
kubectl config use-context pang
kubectl get pods
kubectl get pods -A #Forbidden
```



```shell
kubectl config use-context kubernetes-admin@kubernetes
kubectl create clusterrolebinding cluster-podreader-binding --clusterrole=cluster-pod-reader --user=pang

kubectl config use-context pang
kubectl get pods
kubectl get pods -A #Succeed
```



## ServiceAcount



```shell
kubectl create serviceaccount pang
```



### Deployment nginx , enter the pod

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
      # specify serviceAccount
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



### Get pod's credential

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



### API Accessing

```shell
# without binding clusterrole=cluster-pod-reader , 403
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/pods

# with binding clusterrole=cluster-pod-reader , 200
kubectl create clusterrolebinding cluster-svc-podreader-binding --clusterrole=cluster-pod-reader --serviceaccount=default:pang
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/pods

# without binding clusterrole=cluster-pod-reader , 403
kubectl delete clusterrolebinding cluster-svc-podreader-binding
curl --cacert ${CACERT} --header "Authorization: Bearer ${TOKEN}" -X GET ${APISERVER}/api/v1/pods
```



