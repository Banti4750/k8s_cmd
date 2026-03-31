kubectl run nginx --image=nginx:latest --port=80
kubectl get pods -o wide
kubectl describe pod nginx
kubectl logs nginx
kubectl delete pod nginx
kubectl get pods -w


