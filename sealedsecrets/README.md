🔐 1. Install SealedSecrets Controller

SealedSecrets is maintained by Bitnami and runs as a controller inside Kubernetes.

✅ Install via kubectl (recommended)
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/latest/download/controller.yaml
✅ Verify installation
kubectl get pods -n kube-system

You should see something like:

sealed-secrets-controller-xxxx Running
🔑 2. Install kubeseal CLI

This CLI encrypts your secrets using the cluster’s public key.

Linux (example)
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.25.0/kubeseal-linux-amd64 -O kubeseal
chmod +x kubeseal
sudo mv kubeseal /usr/local/bin/
Verify
kubeseal --version
🔐 3. Fetch Public Key (Important)

The CLI needs the controller’s public key.

kubeseal --fetch-cert > pub-cert.pem

👉 This file is safe to share.

🔏 4. Create a Secret (locally)
kubectl create secret generic my-secret \
 --from-literal=username=admin \
 --from-literal=password=12345 \
 --dry-run=client -o yaml > secret.yaml
🔒 5. Convert Secret → SealedSecret
kubeseal --cert pub-cert.pem -o yaml < secret.yaml > sealed-secret.yaml

Now sealed-secret.yaml looks like:

apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
name: my-secret
spec:
encryptedData:
username: AgB...
password: AgC...
🚀 6. Apply SealedSecret to Cluster
kubectl apply -f sealed-secret.yaml

👉 Controller will automatically:

Decrypt it
Create a normal Kubernetes Secret
🔍 7. Verify Secret Creation
kubectl get secrets
kubectl describe secret my-secret
📦 8. Use Secret in Pod
apiVersion: v1
kind: Pod
metadata:
name: test-pod
spec:
containers:

- name: app
  image: nginx
  env: - name: USERNAME
  valueFrom:
  secretKeyRef:
  name: my-secret
  key: username
  🔄 9. GitOps Workflow (Important)

With tools like:

Argo CD
Flux
Flow:
Developer creates Secret locally
Encrypts → SealedSecret
Pushes to GitHub
GitOps tool applies YAML
Controller decrypts inside cluster

👉 No plaintext secrets in Git. Ever.

🔁 10. Updating a Secret

Just repeat:

kubectl create secret ... --dry-run=client -o yaml | \
kubeseal --cert pub-cert.pem -o yaml > sealed-secret.yaml

Then:

kubectl apply -f sealed-secret.yaml
