kubectl apply -f deployment.yml
kubectl get deployments/nginx-deployment
kubectl get deployments/nginx-deployment -o wide
kubectl get deployments -o yaml
kubectl get deployments -o json
kubectl get deployments -o name
kubectl delete deployment nginx-deployment
kubectl delete deployment nginx-deployment --grace-period=0 --force

kubectl logs deployment/nginx-deployment
kubectl describe deployment nginx-deployment
kubectl rollout status deployment/nginx-deployment
kubectl scale deployment/nginx-deployment --replicas 3

kubectl rollout history deployment/nginx-deployment
kubectl rollout undo deployment/nginx-deployment --to-revision=1

