# NoteLink - Docker Deployment Guide

A cloud-based note-taking application with AI-powered chatbot support, deployed using Docker containers on AWS EC2.

## Project Overview

NoteLink is a full-stack application with the following architecture:
- **Frontend**: React application with Vite build tool, served by Nginx
- **Backend**: Node.js Express API with Firebase integration
- **Deployment**: Docker containers running on a single AWS EC2 instance
- **AI Integration**: Google Cloud Dialogflow chatbot support

## Architecture

```
┌──────────────────────────────────────────┐
│        AWS EC2 Instance                  │
├──────────────────────────────────────────┤
│  Docker Network (app-network)            │
│                                          │
│  ┌──────────────────┐  ┌──────────────┐ │
│  │  Frontend        │  │   Backend    │ │
│  │  Container       │  │  Container   │ │
│  │  (Nginx)         │  │  (Node.js)   │ │
│  │  Port: 3000      │  │  Port: 5000  │ │
│  │  (Port 80)       │  │              │ │
│  └──────────────────┘  └──────────────┘ │
│         ↓                      ↓         │
│      HTTP/HTTPS         Firebase & Google
│                          Cloud APIs
└──────────────────────────────────────────┘
```

## Prerequisites

### Local Development
- Docker Desktop (version 20.10+)
- Docker Compose (version 1.29+)
- Node.js 18+ (for local development without Docker)
- Git

### AWS EC2 Deployment
- AWS EC2 instance (t2.micro or larger recommended)
- Ubuntu 20.04 LTS or Amazon Linux 2
- Docker and Docker Compose installed
- Security groups configured for HTTP (80) and HTTPS (443)
- Firebase service account key file
- Google Cloud Dialogflow credentials

## Project Structure

```
NoteLink/
├── docker-compose.yml           # Docker Compose configuration
├── backend/
│   ├── Dockerfile               # Backend container configuration
│   ├── package.json             # Node.js dependencies
│   ├── server.js                # Express server entry point
│   ├── .env                      # Environment variables (not in repo)
│   ├── serviceAccountKey.json   # Firebase credentials (not in repo)
│   ├── config/
│   │   └── firebase.js           # Firebase configuration
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   └── routes/
│       ├── auth.js               # Authentication routes
│       ├── chatbot.js            # Chatbot routes
│       └── notes.js              # Notes CRUD routes
│
└── frontend/
    ├── Dockerfile               # Frontend container configuration
    ├── nginx.conf              # Nginx server configuration
    ├── package.json            # React dependencies
    ├── vite.config.js          # Vite build configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── postcss.config.js       # PostCSS configuration
    ├── index.html              # HTML entry point
    ├── .env                    # Environment variables (not in repo)
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Root component
        ├── index.css           # Global styles
        ├── components/
        ├── config/
        │   └── firebase.js     # Firebase configuration
        ├── context/
        │   └── AuthContext.jsx # Authentication context
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── NotFound.jsx
        └── services/
            ├── api.js          # API client
            └── noteService.js  # Note service
```

## Docker Configuration

### Docker Compose Setup

The `docker-compose.yml` file defines two services:

#### Backend Service
- **Image**: Built from `./backend/Dockerfile`
- **Container Name**: `notelink-backend`
- **Port Mapping**: `5000:5000`
- **Environment**: Loads from `./backend/.env`
- **Network**: Connected to `app-network` bridge
- **Health Check**: HTTP endpoint `/api/health` checked every 10 seconds

#### Frontend Service
- **Image**: Built from `./frontend/Dockerfile`
- **Container Name**: `notelink-frontend`
- **Port Mapping**: `3000:80` (external port 3000 → internal Nginx port 80)
- **Network**: Connected to `app-network` bridge
- **Dependencies**: Waits for backend service to be healthy

### Backend Dockerfile

Multi-stage build using Node.js 18 Alpine:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

**Key Features:**
- Lightweight Alpine Linux base
- Production dependencies only
- Exposes port 5000 for API access

### Frontend Dockerfile

Two-stage build (Node.js + Nginx):
```dockerfile
# Stage 1: Build React application
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY .env ./
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key Features:**
- Multi-stage build reduces final image size
- React app built with Vite
- Nginx serves static files
- Environment variables included during build

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NoteLink
```

### 2. Create Environment Files

**Backend `.env` file** (`backend/.env`):
```
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
DIALOGFLOW_SESSION_ID=your_session_id
CORS_ORIGIN=http://localhost:3000
```

**Frontend `.env` file** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Place Firebase Credentials
Place your Firebase `serviceAccountKey.json` in the `backend/` directory (add to `.gitignore`).

### 4. Build and Run with Docker Compose
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

## AWS EC2 Deployment

### 1. Launch EC2 Instance

**Recommended Configuration:**
- **Instance Type**: t2.micro (free tier) 
- **OS**: Ubuntu 20.04 LTS 
- **Storage**: 20GB gp2
- **Security Group**: Allow inbound traffic on ports 80, 443, and 22 (SSH)

### 2. Connect to EC2 Instance
```bash
# Using SSH key
ssh -i /path/to/key.pem ec2-user@your-instance-public-ip
# or
ssh -i /path/to/key.pem ubuntu@your-instance-public-ip
```

### 3. Install Docker and Docker Compose

**For Ubuntu:**
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y docker.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, allows docker without sudo)
sudo usermod -aG docker $USER
newgrp docker
```



### 4. Clone Repository and Configure

```bash
# Clone the repository
git clone <repository-url>
cd NoteLink

# Create backend .env file
nano backend/.env
# Add your Firebase and Dialogflow credentials

# Create frontend .env file
nano frontend/.env
# Add API URL pointing to your EC2 public IP or domain:
# VITE_API_URL=http://your-instance-ip:5000/api
# or if using domain:
# VITE_API_URL=https://yourdomain.com/api

# Upload Firebase service account key
# Copy the file to backend/serviceAccountKey.json
```

### 5. Build and Deploy Containers

```bash
# Build images (this may take a few minutes)
docker-compose build

# Start services in detached mode
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f

# Check specific service logs
docker-compose logs backend
docker-compose logs frontend
```

### 6. Configure DNS and SSL (Optional but Recommended)

**Using Route 53 (if domain is registered with AWS):**
1. Create an A record pointing to your EC2 instance's public IP
2. Wait for DNS propagation (5-30 minutes)

**Setting Up HTTPS with Let's Encrypt:**
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate (requires domain)
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx.conf to use SSL certificates
```

Update `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Rebuild containers:
```bash
docker-compose build
docker-compose up -d
```

## Managing Containers

### Common Docker Compose Commands

```bash
# View running containers
docker-compose ps

# View all containers (including stopped)
docker-compose ps -a

# View logs
docker-compose logs              # All services
docker-compose logs -f           # Follow logs in real-time
docker-compose logs backend      # Specific service
docker-compose logs -f --tail=50 # Last 50 lines

# Stop containers
docker-compose stop

# Start containers
docker-compose start

# Restart containers
docker-compose restart
docker-compose restart backend   # Specific service

# Remove containers
docker-compose down              # Stops and removes containers
docker-compose down -v           # Also removes volumes

# Rebuild images
docker-compose build

# Build and start (recommended for deployments)
docker-compose up -d --build
```

### Monitoring Container Health

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check on EC2
curl http://your-instance-ip:5000/api/health

# View container resource usage
docker stats

# Inspect container details
docker inspect notelink-backend
docker inspect notelink-frontend
```

## Environment Variables

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` or `development` |
| `PORT` | Express server port | `5000` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Multiline JSON key |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | `firebase@yourproject.iam.gserviceaccount.com` |
| `DIALOGFLOW_PROJECT_ID` | Dialogflow project ID | `your-dialogflow-project` |
| `DIALOGFLOW_SESSION_ID` | Dialogflow session ID | `unique-session-id` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123456:web:abc...` |

## Troubleshooting

### Container fails to start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

**Common issues:**
- Missing environment variables: Ensure `.env` files exist with required variables
- Port already in use: Change port mappings in `docker-compose.yml`
- Insufficient permissions: Run with `sudo` or add user to docker group

### Backend health check failing

```bash
# Check if backend is running
docker-compose ps

# Test health endpoint
curl http://localhost:5000/api/health

# Check backend logs
docker-compose logs backend

# Rebuild backend
docker-compose up -d --build backend
```

### Frontend not connecting to backend

**Check if VITE_API_URL is correct:**
- Local: `http://localhost:5000/api`
- EC2: `http://your-instance-ip:5000/api` or `https://yourdomain.com/api`

**Verify network connectivity:**
```bash
# From frontend container, test backend
docker-compose exec frontend sh
wget -O- http://backend:5000/api/health
exit
```

### Containers using too much memory/CPU

```bash
# Check resource usage
docker stats

# Limit container resources in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Logs growing too large

```bash
# Set log rotation
docker-compose logs --tail=1000 > /tmp/notelink-logs.txt

# Or configure Docker daemon daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```
