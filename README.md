# docker-visitor-greeting

A minimal multi-container Docker Compose demo that greets visitors. Users submit a name and email in a React frontend; a Node.js backend stores the visit in PostgreSQL, rate-limits via Redis (5-minute cooldown per email), and sends a welcome email via Gmail SMTP.

## Architecture

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

## Tech Stack

- Frontend: React 18
- Backend: Node.js + Express, Nodemailer
- Data: PostgreSQL 16-alpine
- Cache/Rate-limit: Redis 7-alpine
- Orchestration: Docker Compose v3.8

## Requirements

- Docker and Docker Compose
- Node.js 18+ (optional for local tooling)
- Git

## Quick Start

1) Clone the repo
```bash
git clone <this-repo-url>
cd hello-visitor-docker
```
2) Configure environment
```bash
cp .env.example .env
# Set GMAIL_USER and GMAIL_APP_PASS in .env
```
3) Start the stack
```bash
docker compose up --build
```
4) Open the app
```bash
open http://localhost:3000
```

## Gmail SMTP Setup (App Password) ⚠️

- Enable 2‑Step Verification on your Google Account
- Go to Security → App passwords → Create new app password
- Select app type (e.g., Mail), copy the 16‑character password
- In `.env` set:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASS=your-16-char-app-password
```

## Usage

- In the UI, enter your name and email, then submit
- The backend will:
  - Validate inputs
  - Check Redis for a recent submission by this email (5 min cooldown)
  - Insert a visit row into PostgreSQL
  - Send a welcome email via Gmail SMTP
- Success response: `{ success: true, message: "Email sent!" }`

## Project Structure

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

## Docker Compose Features Demonstrated ✅

- Multi-container architecture (frontend, backend, postgres, redis)
- Service dependencies with healthcheck gating for PostgreSQL
- Named volumes: `postgres_data`, `redis_data`
- Single bridge network: `app-network`
- Environment injection from `.env` for sensitive values
- Init SQL mounting for database bootstrap

## Stop & Cleanup

Stop containers
```bash
docker compose down
```
Remove containers, volumes, and images (destructive)
```bash
docker compose down -v --rmi local
```

## Troubleshooting 🔧

- No email received
  - Verify `.env` `GMAIL_USER` and `GMAIL_APP_PASS`
  - Check Gmail Security → Recent activity; app passwords require 2FA
- Port already in use
  - Change host ports in `docker-compose.yml` or free the port
- Postgres not ready errors
  - Wait for healthcheck to pass; compose will retry the backend
- Redis unavailable
  - Anti-spam may be skipped; emails still send if DB insert succeeds
- CORS issues
  - Frontend calls `http://localhost:5000`; backend enables CORS

## License

MIT License
