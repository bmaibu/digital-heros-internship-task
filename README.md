# LeadDesk Mini — Full-Stack Lead Management Application

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.0.0-blue.svg)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-mongoose%208.9-green.svg)](https://mongoosejs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**LeadDesk Mini** is a production-grade, full-stack lead management platform built for the **Digital Heroes Full Stack Development Internship**. It seamlessly bridges a high-converting, modern public landing page with a secure, feature-rich admin dashboard for pipeline management and analytics.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [Local Setup & Installation](#-local-setup--installation)
- [Default Admin Credentials](#-default-admin-credentials)
- [API Reference](#-api-reference)
- [Architecture & Design Decisions](#-architecture--design-decisions)
- [Security Features](#-security-features)
- [Deployment Guide](#-deployment-guide)
- [Attribution](#-attribution)

---

## 🚀 Project Overview

LeadDesk Mini serves two primary user personas:
1. **Prospective Clients (Public Visitors)**: Arrive at a responsive landing page, explore services, and submit project inquiry leads via a validated form.
2. **Team Members & Administrators**: Log in to a protected workspace to review metrics, monitor lead velocity, filter entries, update lead statuses (`New`, `Contacted`, `Closed`), and delete obsolete records.

The application is architected with a decoupled REST API backend and a Vite-powered React single-page application (SPA). For friction-free local evaluation, the backend features automatic zero-config fallback to an in-memory database (`mongodb-memory-server`) if a remote MongoDB instance is not configured.

---

## ✨ Key Features

### 🌐 Public Landing Page
- **Editorial Hero Section**: Modern visual aesthetics, call-to-action buttons, and clear value proposition.
- **Lead Capture Form**: Client-side validation using **React Hook Form** and **Zod** schema parser.
- **Form Fields**: Full Name, Work Email, Phone Number, Company Name, Service Interest, Budget Range, and Inquiry Message.
- **Real-Time User Feedback**: Interactive submission state with instant success toast notifications (**React Hot Toast**).
- **Required Attribution Footer**: Includes mandatory backlink to [Digital Heroes Training Task](https://digitalheroesco.com).

### 🔒 Admin Security & Auth
- **JWT Authentication**: JSON Web Tokens issued upon login and stored securely in browser state (`localStorage`).
- **Protected Routing**: React Router v7 guard (`ProtectedRoute`) redirecting unauthenticated users to `/login`.
- **Axios Request Interceptor**: Automatically attaches `Authorization: Bearer <token>` to protected API requests.
- **Automatic Session Expiry**: Rejects invalid/expired tokens with automated redirection.

### 📊 Interactive Analytics Dashboard
- **Pipeline Metric Cards**: Real-time stats for Total Leads, New Leads, Contacted Leads, and Closed Deals.
- **Conversion Analytics**: Percentage calculation for lead conversion rates.
- **Visual Data Distribution**: Recharts pie chart showing status breakdown across the pipeline.
- **Recent Lead Activity Stream**: Quick overview of newly received leads.

### 📋 Full Lead Management Workspace
- **Search & Filtering**: Search by name, email, or company; filter by lead status (`All`, `New`, `Contacted`, `Closed`).
- **Inline Status Mutations**: Instant status toggle buttons (`New` -> `Contacted` -> `Closed`) with UI updates.
- **Lead Deletion**: Modal prompt for permanent lead record deletion.
- **Server-Side Pagination**: Efficient pagination handling large lead volumes.
- **Responsive Layout**: Sidebar toggle for mobile and tablet screens.

---

## 🛠 Tech Stack & Dependencies

### Frontend (`/client`)
- **Core Framework**: React 19, React DOM 19
- **Build Tooling**: Vite 6, Tailwind CSS v4, `@tailwindcss/vite`
- **Routing**: React Router v7 (`react-router-dom`)
- **State & Data Fetching**: React Context API (`AuthContext`), Axios
- **Form Management**: React Hook Form, `@hookform/resolvers`, Zod
- **UI Components & Icons**: Lucide React, Recharts, React Hot Toast

### Backend (`/server`)
- **Runtime & Server Framework**: Node.js (v20+), Express 4
- **Database & ODM**: MongoDB Atlas / Local MongoDB, Mongoose 8
- **In-Memory Local DB Fallback**: `mongodb-memory-server`
- **Authentication**: `jsonwebtoken` (JWT), `bcrypt` (12 salt rounds)
- **Security & Validation**: Helmet, CORS, `express-validator`, `express-mongo-sanitize`, `express-rate-limit`
- **Logging & Utilities**: Morgan, `dotenv`, Nodemon

---

## 📂 Project Directory Structure

```text
digital-heros-internship-task/
├── client/                     # Frontend React SPA Application
│   ├── dist/                   # Production build bundle
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI & guard components
│   │   │   ├── ErrorBoundary.jsx  # React error boundary fallback UI
│   │   │   ├── LeadForm.jsx       # Public lead capture form with Zod
│   │   │   ├── ProtectedRoute.jsx # Route guard for admin routes
│   │   │   ├── Spinner.jsx        # Loading spinner component
│   │   │   └── StatusBadge.jsx    # Color-coded lead status indicator
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication provider & state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx# Admin workspace header & sidebar shell
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx  # Metrics cards & chart overview
│   │   │   ├── LandingPage.jsx    # Public hero site & lead form
│   │   │   ├── LeadsPage.jsx      # Lead list, search, status & delete
│   │   │   ├── LoginPage.jsx      # Admin login interface
│   │   │   └── NotFoundPage.jsx   # Custom 404 error page
│   │   ├── services/
│   │   │   └── api.js             # Axios client with request interceptors
│   │   ├── App.jsx                # Router configuration & routes
│   │   ├── main.jsx               # React entry point
│   │   └── styles.css             # Custom utility classes & styling
│   ├── .env.example            # Environment template for frontend
│   ├── index.html              # HTML entry template
│   ├── package.json            # Client dependencies & scripts
│   ├── vercel.json             # Vercel deployment SPA rewrites
│   └── vite.config.js          # Vite server configuration
├── server/                     # Backend Express REST API Server
│   ├── config/
│   │   └── db.js               # Database connection & memory fallback
│   ├── controllers/
│   │   ├── authController.js   # Login & token verification handlers
│   │   ├── dashboardController.js # Analytics & pipeline statistics
│   │   └── leadController.js   # Lead CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js  # Bearer token verification middleware
│   │   ├── errorHandler.js    # Global error & 404 response handlers
│   │   └── validationMiddleware.js # Express-validator request rules
│   ├── models/
│   │   ├── Admin.js           # Admin user schema with bcrypt hook
│   │   └── Lead.js            # Lead record schema & indexes
│   ├── routes/
│   │   ├── authRoutes.js      # Auth API endpoints (/api/auth)
│   │   ├── dashboardRoutes.js # Dashboard API endpoints (/api/dashboard)
│   │   └── leadRoutes.js      # Lead API endpoints (/api/leads)
│   ├── scripts/
│   │   └── seedAdmin.js       # Manual admin seeding script
│   ├── .env.example            # Environment template for backend
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Express application bootstrap
├── render.yaml                 # Render Blueprint deployment config
├── package.json                # Root workspace scripts (concurrently)
├── README.md                   # Complete documentation
└── .gitignore                  # Git ignore rules
```

---

## 🔑 Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```env
NODE_ENV=development
PORT=5005
MONGODB_URI=memory
JWT_SECRET=super_secret_jwt_key_leaddesk_2026_dev_mode
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_USERNAME=maibu
ADMIN_EMAIL=maibu@gmail.com
ADMIN_PASSWORD=Maibu123
```

| Key | Description | Default / Example |
| --- | --- | --- |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | API Server listening port | `5005` *(avoids macOS AirPlay port 5000 conflict)* |
| `MONGODB_URI` | Mongo connection string | `memory` *(uses MongoMemoryServer if remote DB unavailable)* |
| `JWT_SECRET` | Secret key for signing JWT tokens | `32+ character random string` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `CLIENT_URL` | Allowed CORS origin(s) | `http://localhost:5173` |
| `ADMIN_USERNAME` | Admin account username | `maibu` |
| `ADMIN_EMAIL` | Admin account login email | `maibu@gmail.com` |
| `ADMIN_PASSWORD` | Admin account password | `Maibu123` |

### Client (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5005/api
```

---

## ⚡ Local Setup & Installation

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

### Step 1: Clone Repository
```bash
git clone https://github.com/bmaibu/digital-heros-internship-task.git
cd digital-heros-internship-task
```

### Step 2: Install Dependencies
Install dependencies for both root, client, and server packages:
```bash
npm install
npm run install:all
```

### Step 3: Configure Environment Files
Create configuration files for server and client:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Step 4: Run Development Server
Start both Express API backend and Vite client concurrently:
```bash
npm run dev
```

Once running:
- **Frontend SPA**: Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Backend API**: Running on [http://localhost:5005/api](http://localhost:5005/api).

---

## 🔐 Default Admin Credentials

The backend automatically seeds an administrator account on startup using environment configuration:

- **Email**: `maibu@gmail.com`
- **Password**: `Maibu123`
- **Username**: `maibu`

To manually run the seed script at any time:
```bash
npm run seed
```

---

## 📡 API Reference

### Health Check
- `GET /api/health` — **Public** | Returns `{ "status": "ok" }`

### Authentication Endpoints
- `POST /api/auth/login` — **Public** | Authenticates credentials and returns a JWT token.
  - **Body**: `{ "email": "maibu@gmail.com", "password": "Maibu123" }`
- `GET /api/auth/me` — **Admin** | Validates existing JWT token and returns current admin details.

### Lead Management Endpoints
- `POST /api/leads` — **Public** | Submits a new lead entry.
  - **Body**: `{ "name": "John Doe", "email": "john@example.com", "phone": "1234567890", "company": "Acme Inc", "service": "Web Development", "budget": "$5,000 - $10,000", "message": "Project inquiry..." }`
- `GET /api/leads` — **Admin** | Retrieves paginated leads list with optional filters.
  - **Query Params**: `?page=1&limit=10&search=john&status=New`
- `PATCH /api/leads/:id` — **Admin** | Updates lead status (`New`, `Contacted`, `Closed`).
  - **Body**: `{ "status": "Contacted" }`
- `DELETE /api/leads/:id` — **Admin** | Permanently deletes a lead record by ID.

### Dashboard & Analytics Endpoints
- `GET /api/dashboard/stats` — **Admin** | Returns aggregated lead counts, status distributions, conversion rate, and recent lead stream.

---

## 🛡 Security Features

1. **HTTP Security Headers**: Enabled via **Helmet** middleware.
2. **CORS Policy**: Configured to restrict requests strictly to trusted origins (`CLIENT_URL`).
3. **NoSQL Injection Defense**: `express-mongo-sanitize` strips prohibited operator characters (`$` and `.`) from request parameters and body.
4. **Password Hashing**: Admin passwords hashed using `bcrypt` with salt rounds set to 12.
5. **Rate Limiting**: Rate limiter limits IP requests to 200 requests per 15-minute window (`express-rate-limit`).
6. **Input Validation**: Dual validation strategy — client-side schema parsing with **Zod** and server-side assertion using **express-validator**.

---

## 🚢 Deployment Guide

### Deploying API Backend to Render

1. Connect the GitHub repository to **Render**.
2. Select **Web Service** or use the included `render.yaml` Blueprint.
3. Set **Root Directory** to `server`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your_mongodb_atlas_connection_string>`
   - `JWT_SECRET=<strong_random_secret>`
   - `CLIENT_URL=https://<your-vercel-app-domain>.vercel.app`
   - `ADMIN_USERNAME=maibu`
   - `ADMIN_EMAIL=maibu@gmail.com`
   - `ADMIN_PASSWORD=Maibu123`

### Deploying Frontend Client to Vercel

1. Import repository into **Vercel**.
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL=https://<your-render-api-domain>.onrender.com/api`
5. Deploy. The included `client/vercel.json` ensures client-side routes (like `/admin/dashboard` or `/login`) resolve correctly on page refresh.

---

## 🔗 Attribution

This application was created as an internship assessment submission.

Required Attribution Link:
- Built for the [Digital Heroes Training Task](https://digitalheroesco.com).

---

## 📄 License

This project is licensed under the MIT License.
