# 🗓️ Event Management API

A RESTful API built using **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM** for managing events.

## 🚀 Features

- You can create, list, and fetch event details
- And also register and cancel users for events
- Give capacity limits and prevent duplicate registrations
- View event stats (registrations, capacity left, percentage filled)
- Custom and dynamic filed validation using Joi
- Clean error handling and api reponse with custom class

## 📁 Folder and File Structure

├── controllers/
├── database/
├── middlewares/
├── prisma/
├── routes/
├── utils/
├── .env
├── .env.sample
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md

## 🧪 Technologies Used

- Node.js
- Express
- PostgreSQL (with Prisma)
- Joi for validation
- Custom middleware for error handling
- Dotenv for env config
- Security middleware also used
- like hpp helmet express-rate-limit


## ⚙️ Installation

```bash
git clone https://github.com/as3305100/Event-Management.git
cd Event-Management
npm install


🔑 Environment Variables
Create a .env file in the root:

DATABASE_URL=your_postgresql_database_url
PORT=8000
CLIENT_URL=http://localhost:5173
NODE_ENV=development


🧪 Running the App

npx prisma generate
npx prisma migrate dev --name init
npm run dev

Server runs at: http://localhost:8000/api/v1/events

📬 API Endpoints

1️⃣ Create Event
POST /api/v1/events

{
  "title": "Tech Meetup",
  "datetime": "2025-07-26T10:00:00+05:30",
  "location": "New Delhi",
  "capacity": 100
}

2️⃣ Get Event Details
GET /api/v1/events/:id

3️⃣ Register for Event
POST /api/v1/events/:id/register

{
  "name": "Anurag",
  "email": "anurag@example.com"
}

Creates user if they don't exist
Prevents duplicate registration
Rejects if event is full or past

4️⃣ Cancel Registration
POST /api/v1/events/:id/cancel

{
  "email": "anurag@example.com"
}

5️⃣ Upcoming Events
GET /api/v1/events/upcoming
Returns future events sorted by datetime and location.

6️⃣ Event Stats
GET /api/v1/events/:id/event-stats

{
  "totalRegistrations": 75,
  "remainingCapacity": 25,
  "percentageUsed": 75.0
}

🛡️ Security Middleware

| Middleware           | Description                            |
| -------------------- | -------------------------------------- |
| `helmet`             | Adds secure HTTP headers               |
| `hpp`                | Prevents HTTP Parameter Pollution      |
| `express-rate-limit` | Limits repeated requests per IP        |
| `cors`               | Enables frontend-backend communication |
| `morgan`             | Dev logging of requests                |

❌ 404 Handler
If a route doesn't exist, returns:

{
  "status": "error",
  "statusCode": 404,
  "message": "Route not found",
  "success": false
}

📦 Response Format
All successful responses follow:

{
  "statusCode": 200,
  "message": "Success message here",
  "data": any
}

👨‍💻 Author
Anurag Sahu
GitHub: @as3305100