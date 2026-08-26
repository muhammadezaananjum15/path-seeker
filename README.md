# PathSeeker — Career Passport Platform

> A full-stack MERN application for career discovery, assessment, and professional development. Built with React 19 + Vite (frontend) and Node.js + Express + MongoDB (backend).

---

## 🏗️ Project Structure

```
pathseeker/
├── _archived/            ← Archived legacy code (do not use)
│   └── angular/          ← Old Angular experiment (archived)
├── public/               ← Static public assets
├── src/                  ← React frontend source
│   ├── assets/           ← Images, fonts, icons
│   ├── components/       ← Reusable UI components
│   │   ├── auth/         ← ProtectedRoute, guards
│   │   ├── career/       ← CareerCard, CompareDrawer
│   │   ├── layout/       ← Navbar, Footer, AdminLayout, MobileDrawer
│   │   ├── media/        ← MediaCard, VideoPlayer
│   │   ├── passport/     ← Passport-related components
│   │   ├── quiz/         ← Quiz components
│   │   ├── stories/      ← Story components
│   │   └── ui/           ← Toast, Modal, SearchPalette, ThemeToggle
│   ├── hooks/            ← Custom React hooks (useApi, etc.)
│   ├── pages/            ← Page components
│   │   ├── public/       ← Landing, Login, Register, About, Contact
│   │   ├── user/         ← Dashboard, Profile, Careers, Quiz, etc.
│   │   └── admin/        ← Admin dashboard and management pages
│   ├── services/         ← API call functions (*Api.ts files)
│   ├── stores/           ← Zustand global state stores
│   ├── types/            ← TypeScript type definitions
│   └── utils/            ← Helper utilities
├── server/               ← Node.js + Express backend
│   ├── .env              ← ⭐ Edit THIS file for API keys (canonical)
│   ├── .env.example      ← Template — copy to .env and fill in keys
│   ├── package.json
│   └── src/
│       ├── config/       ← MongoDB connection (db.js)
│       ├── controllers/  ← Route handler logic
│       ├── middleware/    ← Auth, error handling, file upload
│       ├── models/       ← Mongoose schemas
│       ├── routes/       ← Express route definitions
│       └── utils/        ← Cache, email, PDF generator, seed data
├── index.html            ← Vite HTML entry
├── vite.config.ts        ← Vite configuration with /api proxy
└── package.json          ← Frontend dependencies (React + Vite)
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- **MongoDB** (Atlas cloud OR local)

---

### 1. Clone & Install

```bash
# Install frontend dependencies (from project root)
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy the example env file
cp server/.env.example server/.env

# Edit server/.env with your actual API keys
# (see API Keys section below)
```

### 3. Run Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (runs on http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (runs on http://localhost:5173)
npm run dev
```

The frontend automatically proxies all `/api` requests to `http://localhost:5000`.

---

## 🔑 API Keys Setup

Edit `server/.env` (NOT `server/src/.env`):

| Variable | Required | Where to Get |
|---|---|---|
| `MONGO_URI` | ✅ Yes | [MongoDB Atlas](https://cloud.mongodb.com) |
| `JWT_ACCESS_SECRET` | ✅ Yes | Any random string |
| `JWT_REFRESH_SECRET` | ✅ Yes | Any random string |
| `GEMINI_API_KEY` | ✅ Yes | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `YOUTUBE_API_KEY` | 🟡 Optional | [Google Cloud Console](https://console.cloud.google.com) → YouTube Data API v3 |
| `GOOGLE_SEARCH_API_KEY` | 🟡 Optional | [Programmable Search](https://programmablesearchengine.google.com) |
| `GOOGLE_SEARCH_CX` | 🟡 Optional | Same as above (Search Engine ID) |
| `TAVILY_API_KEY` | 🟡 Optional | [Tavily](https://tavily.com) |
| `ANTHROPIC_API_KEY` | 🟡 Optional | [Anthropic Console](https://console.anthropic.com) |
| `EMAIL_USER` / `EMAIL_PASS` | 🟡 Optional | Gmail + [App Password](https://myaccount.google.com/apppasswords) |

> **Note:** All APIs (YouTube, Gemini, Search, Tavily) have **built-in fallback data** — the app works even without API keys, but live AI responses and video search require valid keys.

---

## 🌐 API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | Server health + API key status |
| `POST /api/auth/register` | User registration with OTP |
| `POST /api/auth/login` | Login → returns JWT tokens |
| `GET /api/careers` | List careers (filterable) |
| `GET /api/gemini/career-tip` | Daily AI career tip |
| `GET /api/gemini/career-roadmap` | AI-generated 6-month roadmap |
| `GET /api/youtube/career-videos` | Career learning videos |
| `GET /api/search/google` | Google Custom Search |
| `POST /api/search/tavily` | Tavily web search |
| `POST /api/claude/career-guidance` | Claude AI career advice |
| `GET /api/quiz` | Quiz questions |
| `GET /api/resources` | Downloadable resources |
| `GET /api/stories` | Success stories |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite** — UI framework and build tool
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first styling
- **Zustand** — Global state management
- **Framer Motion** + **GSAP** — Animations
- **Axios** — HTTP client with JWT interceptors
- **React Router v7** — Client-side routing
- **Recharts** — Data visualization
- **Lucide React** — Icon library

### Backend
- **Node.js** + **Express** — API server
- **MongoDB** + **Mongoose** — Database
- **JWT** — Authentication (access + refresh tokens)
- **Google Gemini AI** — Career tips, roadmaps, article generation
- **Anthropic Claude** — Advanced career guidance (optional)
- **YouTube Data API** — Career learning videos
- **Tavily** + **Google Custom Search** — Live web search
- **Nodemailer** — OTP email delivery
- **PDFKit** — Resume/report generation
- **Multer** — File uploads

---

## 📦 Seeding the Database

```bash
cd server
npm run seed
```

This populates MongoDB with sample careers, quiz questions, success stories, and multimedia content.

---

## 🔐 Default Admin Account

After seeding:
- **Email:** `admin@pathseeker.com`
- **Password:** `Admin@123`

---

## 📝 Notes

- The `_archived/` folder contains old Angular code from an earlier experiment — it is **not used** and can be safely ignored.
- The `server/src/.env` file is kept as a legacy mirror but the **canonical env file is `server/.env`**.
- All API integrations have graceful fallbacks — the app remains functional even if external APIs are unavailable.
