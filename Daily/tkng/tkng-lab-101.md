```shell
# kind setup cluster k8s-guide
make setup

# kind load images
# 需要魔法来加速下载镜像到本地，再加载到kind内部
kind load docker-image ghcr.io/fluxcd/helm-controller:v0.11.1 --name k8s-guide
kind load docker-image ghcr.io/fluxcd/kustomize-controller:v0.13.2 --name k8s-guide
kind load docker-image ghcr.io/fluxcd/notification-controller:v0.15.0 --name k8s-guide
kind load docker-image ghcr.io/fluxcd/source-controller:v0.15.3 --name k8s-guide
kind load docker-image nicolaka/netshoot --name k8s-guide

# install flux
make up
```

