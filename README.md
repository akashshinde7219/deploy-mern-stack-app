## A simple MERN stack application 

# 📁 Project Structure

```
project-root/
├── backend/           # Node.js + Express API
│   └── Dockerfile
├── frontend/          # React frontend
│   └── Dockerfile
├── terraform
├── docker-compose.yml
├── docker-stack.yaml
├── mern-app.yaml
└── README.md
```

---

### Create a network for the docker containers

`docker network create demo`

### Build the client 

```sh
cd mern/frontend
docker build -t mern-frontend .
```

### Run the client

`docker run --name=frontend --network=demo -d -p 5173:5173 mern-frontend`

### Verify the client is running

Open your browser and type `http://localhost:5173`

### Run the mongodb container

`docker run --network=demo --name mongodb -d -p 27017:27017 -v ~/opt/data:/data/db mongodb:latest`

### Build the server

```sh
cd mern/backend
docker build -t mern-backend .
```

### Run the server

`docker run --name=backend --network=demo -d -p 5050:5050 mern-backend`

## Using Docker Compose

`docker compose up -d`

### ☁️ Production Deployment to AWS EKS (Automated via Jenkins)
After validating the local Docker setup, the application was deployed to Amazon EKS using the following steps:

# ⚙️Infrastructure Setup
EKS cluster created using Terraform
VPC, subnets, node groups provisioned as modules

# 🐳 Docker Images
Docker images for mern-backend and mern-frontend were built

Images pushed to AWS Elastic Container Registry (ECR)

# 🤖 Jenkins CI/CD Pipeline
    Jenkins pipeline was created to automate:

    Terraform EKS provisioning

    Docker image build and push to ECR

    Kubernetes manifest deployment (mern-app.yaml)

# 📦 Kubernetes Deployment
Kubernetes manifests (mern-app.yaml) used to deploy the app on EKS

Services exposed using LoadBalancer for frontend and backend

# 🔧 Technologies Used
        Docker, Docker Compose

        Node.js, Express, React, MongoDB

        Jenkins (CI/CD)

        AWS ECR, EKS

        Terraform (Infra as Code)

        Kubernetes


![https://github.com/akashshinde7219/deploy-mern-stack-app/blob/terraform/image.png](image-2.png)