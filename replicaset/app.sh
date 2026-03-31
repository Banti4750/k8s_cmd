kubectl apply -f rs.yml

kubectl get replicasets/rs
kubectl get replicasets/rs -o wide
kubectl get replicasets -o yaml
kubectl get replicasets -o json
kubectl get replicasets -o name
kubectl delete replicaset nginx-replicaset
kubectl delete replicaset nginx-replicaset --grace-period=0 --force

kubectl logs replicaset/nginx-replicaset
kubectl describe replicaset nginx-replicaset

kubectl rollout status rs/nginx-replicaset
kubectl scale rs/nginx-replicaset --replicas=3