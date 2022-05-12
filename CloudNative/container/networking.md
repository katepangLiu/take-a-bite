# Container Networking

## Single-Host Container Networking

**Modes for Docker Networking**
- Bridge mode
- Host mode
- Container mode
- No networking

## Multi-Host Container Networking

**options**
- Flannel
- Weave Net
- Project Calico
- Open vSwitch
- OpenVPN

## CNI
CNI, container network interface.

### Overview
- container runtimes 
  - takes some configuration
    - network configuration: JSON format
	  - mandatory fields (name, type ...)
	  - type-specific fields
  - issues a command to a plug-in
- plug-in
  - configures the network

### CNI operations
- Add container to one or more networks
- Delete container from network
- Report CNI version

### CNI plug-ins
- Built-in
  - loopback
  - bridge
  - ipvlan
  - ipam (IP Address Management)
  - dhcp
  - flannel
- Third-party
  - calico
    - manages a flat layer 3 network, assigning each workload a fully routable IP address
  - cilium
    - A BPF-based solution providing connectivity between containers, operating at layer 3/4 to provide networking and security services as well as layer 7 to protect modern protocols such as HTTP and gRPC.
  - weave
    - A multi-host Docker network by Weaveworks
  - Infoblox
  - Bonding
    - A CNI plug-in for failover and high availability of networking in cloudnative environments, by Intel.
  
### CNI configuration
- CNI command
- JSON configuration

```shell
CNI_COMMAND=ADD \
 CNI_CONTAINERID=875410a4c38d7 \
 CNI_NETNS=/proc/1234/ns/net \
 CNI_IFNAME=eth0 \
 CNI_PATH=/opt/cni/bin \
 someplugin < /etc/cni/net.d/someplugin.conf
```

## Kubernetes Networking
### Kubernetes Networking Overview
**Three fundamental requirements**
- Containers can communicate with all other containers without NAT.
- Nodes can communicate with all containers (and vice versa) without NAT.
- The IP a container sees itself is the same IP as others see it.

**Three network traffic types in Kubernetes**
- Intra-pod networking
- Inter-pod networking
- Ingress and egress

### Inter-pod Networking
- directly communicate
- communicate via service
  - service provides a stable virtual IP (VIP) address for a set of pods
	- act as the stable front to forward traffic to one or more pods, with IP addresses that may come and go.
  - kube-proxy: keeping the mapping between the VIP and the pods up-to-date
	- queries the API server to learn about new services in the cluster
	- updates the node’s iptables rules accordingly

#### Service Discovery in Kubernetes
- Through environment variables (limited)
  - in pod, run `env`
- Using DNS, which is available cluster-wide if a respective DNS cluster addon has been installed
  - DNS server watches on the Kubernetes API for services being created or removed
  - creates a set of DNS records for each service it observes.

#### Network Ranges
- pod network
- service network
- host network(kubelet)
**one often found strategy**
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

### Ingress and egress
#### Ingress 
- Ingress resource
  - defines the routing to the backing services
- Ingress Controller
  - listens to API `/ingresses`, learning abount services being created or removed
  - configures the routes so that external traffic landes at a specific service

### Advanced Kubernetes Networking Topics
- Network Policies
- Service Meshes

#### Service Meshes
outsource nonfunctional things to the mesh
- Istio

## references
- [Container Networking](https://www.oreilly.com/library/view/container-networking/9781492036845/) by Michael Hausenblas
- https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#cni
- https://cloud.redhat.com/blog/kubernetes-services-by-example
- https://medium.com/google-cloud/understanding-kubernetes-networking-pods-7117dd28727
- https://medium.com/google-cloud/understanding-kubernetes-networking-services-f0cb48e4cc82
- https://medium.com/google-cloud/understanding-kubernetes-networking-ingress-1bc341c84078
- https://blog.christianposta.com/microservices/deep-dive-envoy-and-istio-workshop/
