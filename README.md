# Osita Monorepo

This repository contains all Osita projects:

| App | Description | Tech | Production URL |
|-----|-------------|------|----------------|
| `apps/landing` | Marketing website | Next.js 16 | `https://osita.eu` |
| `apps/webapp` | CBAM Filing Engine SPA | React + Vite | `https://app.osita.eu` |
| `apps/api` | Backend API | FastAPI | `https://api.osita.eu` |

## Quick Start (Local Development)

### 1. API (Backend)

```bash
cd apps/api
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

# Copy env template and add your keys
cp ../../env.template .env
# Edit .env with OPENAI_API_KEY, MISTRAL_API_KEY, etc.

python run.py
# Runs at http://localhost:8000
```

### 2. Webapp (Frontend)

```bash
cd apps/webapp
npm install

# Create .env with Supabase credentials
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

npm run dev
# Runs at http://localhost:5173 (proxies /api to localhost:8000)
```

### 3. Landing Page

```bash
cd apps/landing
npm install

# Create .env.local
# NEXT_PUBLIC_WEBAPP_URL=http://localhost:5173

npm run dev
# Runs at http://localhost:3000
```

## Production Deployment

### Landing (`osita.eu`) — Vercel

1. Create a Vercel project
2. Set **Root Directory** to `apps/landing`
3. Add environment variable:
   - `NEXT_PUBLIC_WEBAPP_URL=https://app.osita.eu`
4. Assign domain `osita.eu`

### Webapp (`app.osita.eu`) — Vercel

1. Create a Vercel project
2. Set **Root Directory** to `apps/webapp`
3. Add environment variables:
   - `VITE_API_URL=https://api.osita.eu`
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
4. Assign domain `app.osita.eu`

### API (`api.osita.eu`) — Render / Railway / Fly.io

Deploy the FastAPI backend to any Python host. Example with Render:

1. Create a new Web Service pointing to this repo
2. Set **Root Directory** to `apps/api`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `MISTRAL_API_KEY`
   - `SECRET_KEY`
   - `CORS_ORIGINS=https://osita.eu,https://app.osita.eu`
   - `DATABASE_URL` (use Postgres in production)
6. Assign custom domain `api.osita.eu`

## Project Structure

```
osita-landing-page/
├── apps/
│   ├── api/           # FastAPI backend
│   ├── landing/       # Next.js marketing site
│   └── webapp/        # React CBAM filing app
├── supabase/          # Supabase SQL setup
├── training/          # ML fine-tuning scripts
├── env.template       # Environment variables template
└── README.md          # This file
```

## Environment Variables Reference

See `env.template` for the full list. Key variables:

| Variable | Used By | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | api | OpenAI for structured extraction |
| `MISTRAL_API_KEY` | api | Mistral for OCR |
| `VITE_SUPABASE_URL` | webapp | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | webapp | Supabase anon key |
| `VITE_API_URL` | webapp | Backend API URL (production) |
| `NEXT_PUBLIC_WEBAPP_URL` | landing | Webapp URL for login redirect |
| `CORS_ORIGINS` | api | Allowed origins (comma-separated) |

---

**Built for CBAM transitional reporting** | Osita v0.1.0
