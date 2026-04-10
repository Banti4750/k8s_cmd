Assignment
Try to figure out how can you rewrite the path to / if you’re using traefik as the ingress clas

helm repo add traefik https://traefik.github.io/charts
helm repo update

helm install traefik traefik/traefik -n traefik --create-namespace --skip-crds
