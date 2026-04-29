A Horizontal Pod Autoscaler (HPA) is a Kubernetes resource that scales pods up or down using cAdvisor and the Metrics Server.

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
or
Apply from here - https://github.com/100xdevs-cohort-2/week-28-manifests

cmd
kubectl top pod -n kube-system
kubectl top nodes -n kube-system
