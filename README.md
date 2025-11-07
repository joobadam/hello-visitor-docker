# 🐳 Docker Visitor Greeting

> A minimal multi-container Docker Compose demo that greets visitors. Users submit a name and email in a React frontend; a Node.js backend stores the visit in PostgreSQL, rate-limits via Redis (5-minute cooldown per email), and sends a welcome email via Gmail SMTP.

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
  - [Architecture](#-architecture)
  - [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Quick Start](#-quick-start)
  - [Gmail SMTP Setup](#-gmail-smtp-setup-app-password-️)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Docker Compose Features](#-docker-compose-features-)
- [Stop & Cleanup](#-stop--cleanup)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 About The Project

A minimal multi-container Docker Compose demo that greets visitors. Users submit a name and email in a React frontend; a Node.js backend stores the visit in PostgreSQL, rate-limits via Redis (5-minute cooldown per email), and sends a welcome email via Gmail SMTP.

**Key Features:**
- ✅ Multi-container Docker Compose setup
- ✅ React frontend with form submission
- ✅ Node.js backend with Express
- ✅ PostgreSQL database for storing visits
- ✅ Redis for rate limiting (5-minute cooldown)
- ✅ Gmail SMTP email integration

### 🏗️ Architecture

```
+-------------------+        HTTP (3000 -> 5000)        +-------------------+
|    frontend       |  ------------------------------>  |     backend       |
| React (node:20)   |                                    | Node.js (Express) |
| http://localhost:3000                                  | http://localhost:5000
+---------+---------+                                    +----+--------------+
          |   app-network (bridge)                            |  
          |                                                    |  
          v                                                    v  
   +------+--------+                                  +--------+------+
   |   postgres   |  volume: postgres_data            |   redis       |
   | 16-alpine    |  init: database/init.sql          | 7-alpine      |
   +--------------+                                   +---------------+
```

### 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🎨 **Frontend** | React 18 |
| ⚡ **Backend** | Node.js + Express, Nodemailer |
| 💾 **Database** | PostgreSQL 16-alpine |
| ⚡ **Cache/Rate-limit** | Redis 7-alpine |
| 🐳 **Orchestration** | Docker Compose v3.8 |

---

## 🚀 Getting Started

### 📦 Prerequisites

Before you begin, ensure you have the following:

- 🐳 **Docker** and **Docker Compose**
- 📦 **Node.js** 18+ (optional for local tooling)
- 🔀 **Git**

### 🚀 Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone <this-repo-url>
cd hello-visitor-docker
```

#### 2️⃣ Configure Environment

```bash
cp .env.example .env
# Set GMAIL_USER and GMAIL_APP_PASS in .env
```

#### 3️⃣ Start the Stack

```bash
docker compose up --build
```

#### 4️⃣ Open the App

```bash
open http://localhost:3000
```

### 📧 Gmail SMTP Setup (App Password) ⚠️

**Important**: To send emails via Gmail, you need to set up an App Password.

1. ✅ Enable **2‑Step Verification** on your Google Account
2. 🔐 Go to **Security → App passwords → Create new app password**
3. 📝 Select app type (e.g., Mail), copy the 16‑character password
4. ⚙️ In `.env` set:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASS=your-16-char-app-password
```

---

## 💻 Usage

1. 📝 In the UI, enter your name and email, then submit
2. ⚙️ The backend will:
   - ✅ Validate inputs
   - ⏱️ Check Redis for a recent submission by this email (5 min cooldown)
   - 💾 Insert a visit row into PostgreSQL
   - 📧 Send a welcome email via Gmail SMTP
3. ✅ Success response: `{ success: true, message: "Email sent!" }`

---

## 📁 Project Structure

```
hello-visitor-docker/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── public/
│       └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       └── components/
│           └── VisitorForm.js
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── routes/
│       │   └── submit.js
│       ├── config/
│       │   ├── db.js
│       │   ├── redis.js
│       │   └── email.js
│       └── utils/
│           └── validator.js
└── database/
    └── init.sql
```

---

## 🐳 Docker Compose Features ✅

This project demonstrates several Docker Compose best practices:

- ✅ **Multi-container architecture** (frontend, backend, postgres, redis)
- ✅ **Service dependencies** with healthcheck gating for PostgreSQL
- ✅ **Named volumes**: `postgres_data`, `redis_data`
- ✅ **Single bridge network**: `app-network`
- ✅ **Environment injection** from `.env` for sensitive values
- ✅ **Init SQL mounting** for database bootstrap

---

## 🧹 Stop & Cleanup

### Stop Containers

```bash
docker compose down
```

### Remove Containers, Volumes, and Images (Destructive)

```bash
docker compose down -v --rmi local
```

> ⚠️ **Warning**: This will remove all containers, volumes, and locally built images.

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| 📧 **No email received** | Verify `.env` `GMAIL_USER` and `GMAIL_APP_PASS`<br>Check Gmail Security → Recent activity; app passwords require 2FA |
| 🚫 **Port already in use** | Change host ports in `docker-compose.yml` or free the port |
| 💾 **Postgres not ready errors** | Wait for healthcheck to pass; compose will retry the backend |
| ⚡ **Redis unavailable** | Anti-spam may be skipped; emails still send if DB insert succeeds |
| 🌐 **CORS issues** | Frontend calls `http://localhost:5000`; backend enables CORS |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

<p align="right">(<a href="#-docker-visitor-greeting">back to top</a>)</p>
