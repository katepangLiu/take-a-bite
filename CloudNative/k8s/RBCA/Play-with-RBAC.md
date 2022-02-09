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



```shell
kubectl config set-credentials pang --client-certificate=/root/develop/k8s-account/pang/pang.crt --client-key=/root/develop/k8s-account/pang/pang.key

kubectl config set-context pang --cluster=kubernetes --user=pang
```





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
kubectl create rolebinding podreader-binding --role=pod-reader --user=pang
kubectl config use-context pang
kubectl get pods
kubectl get pods -A #failed
```



```shell
kubectl config use-context kubernetes-admin@kubernetes
kubectl apply -f clusterrole-pod-reader.yaml
kubectl create clusterrolebinding cluster-podreader-binding --clusterrole=cluster-pod-reader --user=pang

kubectl config use-context pang
kubectl get pods
kubectl get pods -A #succeed
```

