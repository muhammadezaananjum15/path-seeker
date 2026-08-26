# 🧭 PathSeeker

**PathSeeker** is an AI-powered career guidance platform built to help students, fresh graduates, and career switchers figure out where they're actually headed — and how to get there.

It's not just another job board. It's a full career operating system: personality-based quiz, curated career roadmaps, downloadable resources, video learning, and a live AI assistant — all in one place.

**Live App** → [https://pathh-seeker.vercel.app](https://pathh-seeker.vercel.app)  
**Backend API** → [https://path-seeker-production-ecd0.up.railway.app](https://path-seeker-production-ecd0.up.railway.app)

---

## What It Does

- 🎯 **Career Quiz** — Answer 5 sections of questions and get matched against 1,000+ real career paths based on your skills, interests, and values
- 💼 **Career Explorer** — Browse high-growth tech careers with salary ranges, demand levels, required skills, and growth rates
- 📚 **Resource Hub** — Download ATS-optimized resume templates, cloud roadmaps, interview handbooks, and more as PDFs
- 🎬 **Multimedia Center** — 100+ curated YouTube videos organized by topic (AI, Cybersecurity, Design, etc.)
- 🤖 **AI Assistant** — Powered by Google Gemini, it gives real-time career advice right inside the app
- 📖 **Blog & Stories** — Real career pivot stories and industry articles pulled from live APIs
- 🔖 **Bookmarks** — Save careers and resources to revisit later
- 🔐 **Auth with OTP** — Email-based registration with OTP verification, JWT access/refresh tokens

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (utility-first styling)
- Framer Motion (animations)
- Zustand (global state)
- Axios (API calls)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (access + refresh tokens)
- Nodemailer (OTP emails via Gmail SMTP)
- Google Gemini API (AI assistant)

**Deployment**
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

## Project Structure

```
pathseeker/
├── src/                        # React frontend
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # Chatbot, modals, toasts
│   ├── pages/
│   │   ├── public/             # Landing, Login, Register, About, Contact
│   │   ├── user/               # Dashboard, Quiz, Careers, Resources, etc.
│   │   └── admin/              # Admin panel
│   ├── services/               # API service functions
│   ├── stores/                 # Zustand state (auth, etc.)
│   └── utils/                  # Helpers, PDF generator
│
├── server/                     # Express backend
│   └── src/
│       ├── config/             # MongoDB connection
│       ├── controllers/        # Route logic (auth, careers, etc.)
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API route definitions
│       └── utils/              # Email sender, OTP generator
│
├── public/                     # Static assets (favicon, icons)
├── index.html                  # Vite HTML entry
└── vite.config.ts              # Vite + API proxy config
```

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- npm v9+
- A MongoDB Atlas cluster (or local MongoDB)
- A Gmail account with an App Password for email OTPs

### 1. Clone the repo

```bash
git clone https://github.com/your-username/path-seeker.git
cd path-seeker
```

### 2. Install all dependencies

```bash
npm install          # installs frontend deps
cd server && npm install   # installs backend deps
cd ..
```

### 3. Configure environment variables

Copy the example file and fill it in:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set at minimum:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/pathseeker

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

GEMINI_API_KEY=your_google_gemini_api_key
```

> **Gmail App Password**: Go to your Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail". Use that as `EMAIL_PASS`.

### 4. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
npm run dev
```

Frontend runs at `http://localhost:5173`  
Backend runs at `http://localhost:5000`

The Vite dev server proxies `/api/*` requests to the backend automatically.

---

## Deploying

### Backend → Railway

1. Push your code to GitHub
2. Create a new Railway project → connect your GitHub repo
3. In Railway → your service → **Variables**, add all the env vars from `server/.env`
4. Make sure `NODE_ENV=production` and your `MONGO_URI` points to Atlas
5. Railway auto-deploys on every push

### Frontend → Vercel

1. Import your GitHub repo on [vercel.com](https://vercel.com)
2. In Vercel → Project Settings → **Environment Variables**, add:
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app/api
   ```
3. Vercel auto-deploys on every push to `main`

### MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Go to **Network Access** → Add IP → Allow from Anywhere (`0.0.0.0/0`) so Railway can connect
3. Copy your connection string into `MONGO_URI`

---

## Environment Variables Reference

| Variable | Where to set | What it does |
|---|---|---|
| `MONGO_URI` | Railway + local `.env` | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | Railway + local `.env` | Signs access tokens (keep secret) |
| `JWT_REFRESH_SECRET` | Railway + local `.env` | Signs refresh tokens (keep secret) |
| `NODE_ENV` | Railway | Set to `production` on Railway |
| `CLIENT_URL` | Railway | Your Vercel frontend URL |
| `EMAIL_USER` | Railway + local `.env` | Gmail address for sending OTPs |
| `EMAIL_PASS` | Railway + local `.env` | Gmail App Password |
| `GEMINI_API_KEY` | Railway + local `.env` | Google Gemini AI key |
| `VITE_API_BASE_URL` | Vercel | Railway backend URL (frontend only) |

---

## Common Issues

**Users not appearing in MongoDB Atlas**  
Make sure `MONGO_URI` is set in Railway's Variables dashboard (not just in your local `.env` — that file doesn't upload to Railway). Also whitelist `0.0.0.0/0` in Atlas Network Access.

**405 Method Not Allowed on Railway**  
This happens when Railway defaults to a static file server instead of Node.js. The `Procfile` and `nixpacks.toml` in this repo already fix that — just make sure they're committed.

**OTP emails not sending**  
Set `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password, not your regular Gmail password) in Railway Variables. If SMTP isn't configured, the OTP code is returned in the API response as a fallback for testing.

**CORS errors from Vercel**  
Make sure `CLIENT_URL` on Railway matches your exact Vercel URL (`https://pathh-seeker.vercel.app`) and that `VITE_API_BASE_URL` on Vercel points to your Railway backend.

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT
