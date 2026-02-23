# ClientFlow

> A client portal for software agencies — clients submit requests, admins approve and assign them as projects to employees, with built-in messaging and a Kanban board across all three roles.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Backend | Node.js, Express (ESM), Bun |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (role-based: Admin, Employee, Client) |
| Email | Nodemailer + Gmail SMTP App Password |
| Styling | Inline styles, dark theme |

---

## Setup Instructions

### Prerequisites
- [Bun](https://bun.sh) installed
- [Node.js](https://nodejs.org) v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

### 1. Clone the repo
```bash
git clone https://github.com/karthikeyan18v/ClientFlow.git
cd ClientFlow
```

### 2. Backend setup
```bash
cd backend
bun install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SMTP_EMAIL=your_gmail@gmail.com
SMTP_APP_PASSWORD=your_gmail_app_password
```

Seed the admin account:
```bash
bun run src/seedAdmin.js
```

Start the backend:
```bash
bun run src/server.js
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`  
Backend runs at `http://localhost:5000`

---

## Database Setup

Uses **MongoDB Atlas** (cloud) or local MongoDB.

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist your IP and create a database user
3. Copy the connection string into `MONGO_URI` in your `.env`
4. Collections are auto-created by Mongoose on first run:
   - `users` — Admin, Employee, Client accounts
   - `projects` — project records with status and assignments
   - `servicerequests` — client requests (title + description)
   - `messages` — chat messages between users

---

## Screenshots

> Add screenshots to a `/screenshots` folder and update the paths below.

### Login Page
![Login](screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

### Kanban Board
![Kanban](screenshots/kanban.png)

### Client Requests
![Requests](screenshots/requests.png)

### Messaging
![Messages](screenshots/messages.png)

---

## Test Login Credentials

> These are seeded via `src/seedAdmin.js`. Create Employee and Client accounts from the Admin panel.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kss.com | Admin@123 |
| Employee | employee@kss.com | Employee@123 |
| Client | client@kss.com | Client@123 |

> **Note:** Employee and Client accounts must be created by the Admin from the dashboard before logging in.

---

## Features

- **Admin** — manage employees, clients, projects, approve/reject requests, messaging
- **Employee** — view assigned projects, update status, messaging
- **Client** — submit requests, track projects on Kanban board, messaging
- Role-based JWT authentication
- Drag-and-drop Kanban board (4 columns)
- Real-time-style messaging with contact search
- Auto project creation on request approval
