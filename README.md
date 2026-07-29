# CYBERTYPE

A cyberpunk-themed multiplayer typing game featuring authentication, social networking, Docker containerization, and a DevSecOps CI pipeline.

---

# Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Frontend

* React
* React Router

### DevOps & Security

* Docker
* Docker Compose
* GitHub Actions (CI)
* Docker Hub
* Trivy Security Scanning
* npm Audit
* GitHub CodeQL
* Dependabot

---

# Project Structure

```text
CyberType/
│
├── backend/
├── frontend/
│
├── docker-compose.yml
├── README.md
│
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   ├── security.yml
    │   └── codeql.yml
    │
    └── dependabot.yml
```

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

## User Profile

* View Profile
* Update Statistics
* Track Typing Performance

## Social System

* Search Users
* Send Friend Requests
* Accept Friend Requests
* Friends List

## Typing Game

* Real-time Typing Interface
* Words Per Minute (WPM) Tracking
* Accuracy Tracking
* Performance Statistics

## Dynamic Themes

| Time      | Theme         | Color      |
| --------- | ------------- | ---------- |
| 5–8 AM    | Dawn Protocol | Amber      |
| 9 AM–4 PM | Day Cycle     | Cyan       |
| 5–7 PM    | Dusk Shift    | Purple     |
| 8 PM–4 AM | Night Mode    | Neon Green |

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

# Docker Setup

Build and start all services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

---

# Environment Variables

Create a `.env` file inside the **backend** directory.

```env
MONGO_URI=mongodb://mongodb:27017/cybertype
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:3000
```

---

# API Routes

| Method | Route                | Authentication | Description              |
| ------ | -------------------- | -------------- | ------------------------ |
| POST   | /auth/signup         | ❌              | Register a new user      |
| POST   | /auth/login          | ❌              | Login                    |
| GET    | /user/me             | ✅              | Get profile              |
| GET    | /user/search?q=      | ✅              | Search users             |
| POST   | /user/friend-request | ✅              | Send friend request      |
| POST   | /user/friend-accept  | ✅              | Accept friend request    |
| POST   | /user/stats          | ✅              | Update typing statistics |

---

# CI Pipeline

The project uses **GitHub Actions** for Continuous Integration.

### Workflow

* Checkout Repository
* Install Dependencies
* Build React Frontend
* Build Docker Images
* Login to Docker Hub
* Push Backend Docker Image
* Push Frontend Docker Image

---

# Security Pipeline

Automated security checks include:

* npm Audit
* Trivy Filesystem Scan
* Trivy Docker Image Scan

---

# Static Code Analysis

GitHub CodeQL automatically scans the codebase for:

* Security Vulnerabilities
* Code Quality Issues
* Common Programming Mistakes

---

# Dependency Management

Dependabot automatically:

* Monitors dependencies
* Detects outdated packages
* Creates Pull Requests for updates

---

# Current Project Status

## Application

* [x] User Authentication
* [x] JWT Authorization
* [x] User Profiles
* [x] Friend System
* [x] Typing Statistics
* [x] Responsive React Frontend
* [x] MongoDB Integration

## Containerization

* [x] Dockerfile (Backend)
* [x] Dockerfile (Frontend)
* [x] Docker Compose
* [x] Docker Hub Image Publishing

## DevSecOps

* [x] GitHub Actions CI
* [x] Docker Image Build
* [x] Docker Image Push
* [x] npm Audit
* [x] Trivy Filesystem Scan
* [x] Trivy Image Scan
* [x] CodeQL Analysis
* [x] Dependabot Automation

## Upcoming Features

* [ ] Kubernetes Deployment
* [ ] Helm Charts
* [ ] Terraform Infrastructure
* [ ] Ansible Automation
* [ ] Prometheus Monitoring
* [ ] Grafana Dashboards
* [ ] Loki Log Aggregation
* [ ] Argo CD (GitOps)
* [ ] Cloud Deployment (AWS / Azure / GCP)
* [ ] Continuous Deployment (CD)

---

# Future DevOps Roadmap

```text
GitHub
    │
    ▼
GitHub Actions (CI)
    │
    ├── Build
    ├── Security Scan
    ├── CodeQL
    ├── Docker Build
    ├── Docker Push
    ▼
Docker Hub
    │
    ▼
Kubernetes
    │
    ▼
Helm
    │
    ▼
Terraform
    │
    ▼
Ansible
    │
    ▼
Prometheus
    │
    ▼
Grafana
    │
    ▼
Loki
    │
    ▼
Argo CD
    │
    ▼
Cloud Deployment
```

---

# License

This project is developed for educational purposes to demonstrate full-stack development, containerization, and modern DevSecOps practices.
