# ✨ AuraPages — Digital Diary (Full-Stack Architecture)

A personal, aesthetic digital journaling web application built with a separate **Frontend (React 19 + Vite)** and **Backend (Express + TypeScript + Gemini AI)**.

---

## 📁 Project Structure

```text
Digital_Diary/
├── client/                     # Frontend Application (React 19 + TypeScript + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/         # Modular UI components (Dashboard, Editor, Canvas, Auth, etc.)
│   │   ├── services/           # Backend API integration (api, authService, diaryService, aiService)
│   │   ├── hooks/              # Custom hooks
│   │   ├── data/               # Default preset journals & stickers
│   │   ├── types/              # Type definitions
│   │   ├── utils/              # Canvas math & color utilities
│   │   ├── App.tsx             # Main screen navigation
│   │   ├── index.css           # Styling
│   │   └── main.tsx            # App bootstrap
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                     # Backend Application (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # Environment & DB configurations
│   │   ├── controllers/        # Request handlers (auth, categories, pages, AI)
│   │   ├── middlewares/        # JWT auth guard, error handling
│   │   ├── models/             # Data models & storage layer (store.ts)
│   │   ├── routes/             # REST API routes (/api/v1/...)
│   │   ├── services/           # Business logic & Google Gemini AI integration
│   │   ├── types/              # Backend request/response definitions
│   │   ├── utils/              # Auth hashing & JWT utilities
│   │   ├── app.ts              # Express setup & CORS
│   │   └── server.ts           # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── package.json                # Workspace orchestrator (runs both services together)
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

You can install all dependencies across the workspace in one command:
```bash
npm run install:all
```
*Or manually in each directory:*
```bash
# In root:
npm install

# In client:
cd client && npm install

# In server:
cd server && npm install
```

---

### 2. Environment Setup

#### Client Configuration:
Copy `.env.example` to `.env` inside `client/`:
```bash
cp client/.env.example client/.env
```
Default:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

#### Server Configuration:
Copy `.env.example` to `.env` inside `server/`:
```bash
cp server/.env.example server/.env
```
Add your optional Google Gemini API key:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### 3. Running the App

#### Option A: Run Both Client & Server Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

#### Option B: Run Individually
- **Client only**: `npm run dev:client` (or `cd client && npm run dev`)
- **Server only**: `npm run dev:server` (or `cd server && npm run dev`)

---

## 🛡️ Security & API Highlights

- **Secure AI Key Handling**: Gemini API requests go through the Express backend (`/api/v1/ai`), protecting API credentials from browser inspection.
- **Pluggable Data Layer**: The backend storage layer (`server/src/models/store.ts`) uses standard repository interfaces ready to connect directly to MongoDB (Mongoose) or PostgreSQL (Prisma).
- **Graceful Fallbacks**: The frontend includes dedicated service layers (`client/src/services/`) designed to connect with the backend or fall back to local offline storage seamlessly.
