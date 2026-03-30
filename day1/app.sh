# docs for install kind for local testing 
kind - https://kind.sigs.k8s.io/docs/user/quick-start/

kind create cluster --name kind-cluster 
kind get clusters
kind delete cluster --name kind-cluster


#if we wandt to start a cluster with a specific node number
kind create cluster --name kind-cluster --config=kind-config.yaml

        kind: Cluster
        apiVersion: kind.x-k8s.io/v1alpha4
        nodes:
        - role: control-plane
        - role: worker
        - role: worker

        