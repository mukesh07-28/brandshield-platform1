# BrandShield AI — Digital Risk Protection Platform

This package is prepared for a **single Vercel deployment** containing:
- React + Vite frontend
- FastAPI Python backend under `/api`
- PostgreSQL database hosted separately (recommended: Neon)

The application functionality is preserved. Vercel-specific routing, API configuration, CORS handling, and production environment examples have been added.

## Vercel architecture

```text
Browser
   |
   v
Vercel
├── /              -> React/Vite frontend
└── /api/*         -> FastAPI backend
                         |
                         v
                    PostgreSQL
                    (Neon recommended)
```

Vercel supports FastAPI through its Python runtime, and Vercel also provides a Neon Postgres integration. 

## 1. Deploy the database first

Vercel does not replace your PostgreSQL database. Create a PostgreSQL database with Neon, either directly or through the Vercel Marketplace.

Copy the PostgreSQL connection string. It should look similar to:

```text
postgresql+psycopg://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Do **not** put this value in GitHub or inside the ZIP.

## 2. Put this project on GitHub

The ZIP contains the project root:

```text
brandshield-platform-main/
```

Upload/push the contents of `brandshield-platform-main` to a GitHub repository.

Important: the GitHub repository root should contain:

```text
api/
backend/
frontend/
package.json
requirements.txt
vercel.json
```

Do not upload:
- `.env`
- `node_modules`
- `backend/venv`
- `frontend/dist`

## 3. Import the repository into Vercel

1. Open Vercel.
2. Click **Add New → Project**.
3. Import your GitHub repository.
4. Keep the **Root Directory** as the repository root.
5. Deploy.

The included `vercel.json` tells Vercel to:
- build the frontend with `npm --prefix frontend run build`
- use `frontend/dist` as the output
- run `api/index.py` with Python 3.12

## 4. Add Vercel environment variables

In:

**Vercel → Project → Settings → Environment Variables**

Add:

### DATABASE_URL

Use the PostgreSQL connection string from Neon:

```text
postgresql+psycopg://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Add it to:
- Production
- Preview
- Development (optional)

### FRONTEND_ORIGINS

For production, use your Vercel URL:

```text
https://YOUR-PROJECT.vercel.app
```

The backend also automatically recognizes Vercel's deployment URL variables.

### VITE_API_BASE_URL

Use:

```text
/api
```

Because frontend and backend are deployed under the same Vercel domain.

## 5. Redeploy

After adding the environment variables:

**Vercel → Deployments → Redeploy**

or push a new commit to GitHub.

## 6. Test the deployment

Suppose Vercel gives you:

```text
https://brandshield-platform.vercel.app
```

Open:

```text
https://brandshield-platform.vercel.app/
```

Then test the backend:

```text
https://brandshield-platform.vercel.app/api/
```

Health check:

```text
https://brandshield-platform.vercel.app/api/health
```

Swagger API docs:

```text
https://brandshield-platform.vercel.app/api/docs
```

The health endpoint should return:

```json
{
  "status": "healthy"
}
```

## 7. Database tables

The existing backend calls:

```python
Base.metadata.create_all(bind=engine)
```

when the FastAPI application starts, so the application's SQLAlchemy tables can be created in the configured PostgreSQL database.

For a larger production system, use database migrations (for example, Alembic) rather than relying on `create_all()`.

## 8. Optional Vercel CLI deployment

Install the Vercel CLI:

```powershell
npm install -g vercel
```

From the project root:

```powershell
vercel login
vercel
```

For production:

```powershell
vercel --prod
```

Vercel's current FastAPI guidance supports deploying FastAPI applications with its Python runtime.

## 9. Local development

### Backend

From `backend`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
copy .env.example .env
```

Set your local PostgreSQL connection in `.env`, then:

```powershell
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Frontend

From `frontend`:

```powershell
npm install
copy .env.example .env
npm run dev
```

For local development, `.env.example` uses:

```text
VITE_API_BASE_URL=/api
```

If you run the frontend directly with Vite rather than through `vercel dev`, use:

```text
VITE_API_BASE_URL=http://localhost:8000
```

## 10. Important note

Do not deploy the backend by putting the PostgreSQL password into frontend code.

The browser only receives:

```text
VITE_API_BASE_URL=/api
```

The database connection stays on the server as:

```text
DATABASE_URL
```

That keeps the database password out of the React bundle.
