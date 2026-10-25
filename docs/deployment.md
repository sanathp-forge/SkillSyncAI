# SkillSync AI — Deployment & Infrastructure Guide

## 1. Frontend Vercel Deployment (Immediate Priority)

The frontend is a Vite + React + TypeScript single-page application built for high performance and fluid aesthetics.

### Deployment Options on Vercel:

#### Option A: Root Directory set to `frontend` (Recommended)
1. In the Vercel Dashboard, import your GitHub repository.
2. Under **Root Directory**, click "Edit" and choose `frontend`.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install --legacy-peer-deps`
7. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend.com/api/v1` (or leave empty for standalone/demo mode)
   - `VITE_DEMO_MODE`: `true` (set to `false` when connected to live backend)

#### Option B: Deploy from Repository Root
- A root `vercel.json` is included that will automatically navigate to `frontend`, install dependencies, build the project, and serve the `frontend/dist` directory with SPA rewrites.

### SPA Routing & Rewrites:
Both `frontend/vercel.json` and root `vercel.json` are configured with:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This ensures direct URL navigation and page refreshes on sub-routes (`/app/resume`, `/app/matching`, `/app/roadmap`, etc.) never produce 404 errors.

---

## 2. Backend FastAPI Deployment

The backend is built with Python 3.11, FastAPI, Pydantic, and PyMuPDF.

### Option A: Railway / Render (Easiest)
1. Connect your repository to Railway or Render.
2. Set Root Directory to `backend/`.
3. Choose Docker as the builder (uses `backend/Dockerfile`).
4. Set Environment Variables:
   - `DATABASE_URL`: Your managed PostgreSQL URL (with `postgresql+asyncpg://` prefix).
   - `SECRET_KEY`: A cryptographically secure random string.
   - `OPENAI_API_KEY`: (Optional) Your OpenAI key for live LLM evaluations.
   - `DEMO_MODE`: `false` in production.
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
5. Expose port `8000`.

### Option B: AWS ECS Fargate or AWS App Runner
1. **Container Registry**: Push `backend/Dockerfile` to Amazon ECR:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t skillsync-backend ./backend
   docker tag skillsync-backend:latest <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/skillsync-backend:latest
   docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/skillsync-backend:latest
   ```
2. **Database**: Provision Amazon Aurora PostgreSQL or Amazon RDS PostgreSQL 16 with the `pgvector` extension enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. **App Runner Service**:
   - Create an App Runner service pointing to your ECR image.
   - Set Port to `8000`.
   - Add environment variables (`DATABASE_URL`, `SECRET_KEY`, `OPENAI_API_KEY`).
   - Associate with VPC Connector to securely access RDS.

---

## 3. Local Full-Stack Development

Run the entire stack locally with Docker Compose:

```bash
# Clone and launch PostgreSQL (with pgvector), FastAPI, and Vite:
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/v1`
- Swagger Docs: `http://localhost:8000/api/v1/docs`
- Database: `localhost:5432` (`skillsync_db`)

### Manual Local Dev:
```bash
# 1. Frontend
cd frontend
npm install --legacy-peer-deps
npm run dev

# 2. Backend (in separate terminal)
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
