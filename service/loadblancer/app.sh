kubectl apply -f loadbalancer.yml
kubectl get svc/service
kubectl get svc/service -o wide
kubectl describe svc/service

kubectl get endpoints my-service
kubectl port-forward svc/my-service 8080:80

