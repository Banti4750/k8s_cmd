# Project1 — Kubernetes Microservices App

A full-stack web application deployed on Kubernetes, featuring an Express.js REST API with PostgreSQL storage, Redis caching, an Apache HTTPD frontend, and an Nginx reverse proxy.

## Architecture

```
[External Traffic]
        ↓
  [Nginx Reverse Proxy] (LoadBalancer)
        ↓
  ┌─────┴─────┐
  ↓            ↓
Backend      Frontend
(Express)    (httpd)
  ↓
  ├── Redis (cache)
  └── PostgreSQL (storage)
```

## Components

| Component   | Image                  | Port | Replicas | Namespace      |
| ----------- | ---------------------- | ---- | -------- | -------------- |
| Backend API | `banti47/express:2`    | 3000 | 2        | backend-team   |
| Frontend    | `httpd`                | 80   | 2        | frontend-team  |
| PostgreSQL  | `postgres:latest`      | 5432 | 1        | default        |
| Redis       | `redis:latest`         | 6379 | 1        | default        |
| Nginx Proxy | `nginx`                | 80   | 1        | default        |

## API Endpoints

| Method | Path              | Description                                          |
| ------ | ----------------- | ---------------------------------------------------- |
| GET    | `/api/data`       | Fetch all users from PostgreSQL and cache in Redis   |
| GET    | `/api/data/cached`| Fetch users from Redis cache first, fallback to DB   |
| POST   | `/api/data`       | Create a new user (body: `{ "name": "..." }`)        |

## Project Structure

```
project1/
├── expres-app/             # Express.js backend
│   ├── index.js            # API server with Redis + PostgreSQL
│   ├── package.json        # Dependencies (express, pg, ioredis, cors)
│   └── Dockerfile          # Node 20 Alpine image
└── ops/                    # Kubernetes manifests
    ├── backend/manifest.yml
    ├── frontend/manifest.yml
    ├── db/manifest.yml
    ├── redis/manifest.yml
    └── nginx-proxy/manifest.yml
```

## Tech Stack

- **Runtime:** Node.js 20 (Alpine)
- **Framework:** Express.js 5
- **Database:** PostgreSQL
- **Cache:** Redis (10-minute TTL via ioredis)
- **Frontend:** Apache HTTPD
- **Reverse Proxy:** Nginx (host-based routing)
- **Orchestration:** Kubernetes

## Getting Started

### Prerequisites

- Docker
- Kubernetes cluster (minikube, kind, or cloud-managed)
- kubectl

### Build the Backend Image

```bash
cd expres-app
docker build -t banti47/express:2 .
docker push banti47/express:2
```

### Deploy to Kubernetes

```bash
# Create namespaces
kubectl create namespace backend-team
kubectl create namespace frontend-team

# Deploy all components
kubectl apply -f ops/db/manifest.yml
kubectl apply -f ops/redis/manifest.yml
kubectl apply -f ops/backend/manifest.yml
kubectl apply -f ops/frontend/manifest.yml
kubectl apply -f ops/nginx-proxy/manifest.yml
```

### DNS / Ingress

The Nginx reverse proxy routes traffic based on hostname:

- `k8s-backend.stravixglobaltech.com` → Backend API
- `k8s-frontend.stravixglobaltech.com` → Frontend

Point these domains to the Nginx LoadBalancer external IP.

## Service Communication

Services communicate via Kubernetes DNS:

- **PostgreSQL:** `db.default.svc.cluster.local:5432`
- **Redis:** `redis.default.svc.cluster.local:6379`
- **Backend:** `backend-svc.backend-team.svc.cluster.local:3000`
- **Frontend:** `frontend-svc.frontend-team.svc.cluster.local:80`
