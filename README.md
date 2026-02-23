# ClientFlow

A client portal for software agencies — clients submit requests, admins approve and assign them as projects to employees, with built-in messaging and a Kanban board across all three roles.

## Stack
- **Frontend**: Next.js 14 (App Router), TypeScript
- **Backend**: Node.js, Express (ESM), Bun
- **Database**: MongoDB / Mongoose
- **Auth**: JWT (role-based: Admin, Employee, Client)
- **Email**: Nodemailer + Gmail SMTP

## Setup

### Backend
```bash
cd backend
cp .env.example .env   # fill in your values
bun install
bun run src/server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## .env variables (backend)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
SMTP_EMAIL=your_gmail
SMTP_APP_PASSWORD=your_app_password
```
