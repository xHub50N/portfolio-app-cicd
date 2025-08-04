# Konfiguracja klastra Kubernetes

![alt text](image.png)

![alt text](image-2.png)

```
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
 name: first-pool
 namespace: metallb-system
spec:
 addresses:
 - 192.168.1.230-192.168.1.250
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
 name: example
 namespace: metallb-system
```

![alt text](image-1.png)

![alt text](image-3.png)

![alt text](image-4.png)

![alt text](image-6.png)

![alt text](image-5.png)

![alt text](image-7.png)

![alt text](image-8.png)

![alt text](image-9.png)

![alt text](image-10.png)

```
kubectl -n argocd edit configmap argocd-cm

`data:
  accounts.image-updater: apiKey, login
`
kubectl -n argocd rollout restart deployment argocd-server


kubectl exec -it -n argocd argocd-server-795cf9c4b4-bshmx   -c argocd-server -- sh

argocd login argocd-server.argocd.svc.cluster.local --username admin --password H749Z3oGy5mTtg87 --insecure

argocd account generate-token --account image-updater


kubectl -n argocd create secret generic argocd-image-updater-secret \
  --from-literal=argocd.token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcmdvY2QiLCJzdWIiOiJpbWFnZS11cGRhdGVyOmFwaUtleSIsIm5iZiI6MTc1NDMzMDIyNSwiaWF0IjoxNzU0MzMwMjI1LCJqdGkiOiIxZWNlNzIyYy1hOTlmLTQxNDItYTU3Ny02NTEzYjNkMzQxYzIifQ.M6xiJG5MfnsybVz1L5fiTCERrEeNJfqTiCKZcb1UoFo
```
![alt text](image-11.png)

![alt text](image-12.png)

```
kubectl create secret generic vault-token \
  --namespace argocd \
  --from-literal=token=HCP_TOKEN
```

![alt text](image-13.png)

![alt text](image-14.png)

![alt text](image-15.png)

![alt text](image-16.png)

![alt text](image-17.png)