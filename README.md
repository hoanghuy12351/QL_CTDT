# Base Project

Full-stack student training management project with an Express/Prisma backend and a Vite/React frontend.

## Project Structure

- `backend`: Express API, Prisma, MySQL
- `frontend`: Vite React admin UI

## Local Setup

Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

Create environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Update `backend/.env` with your database credentials and JWT secret.

Generate Prisma client:

```bash
npm run prisma:generate --prefix backend
```

Run both apps:

```bash
npm run dev
```

Default local URLs:

- Backend: `http://localhost:3008/api/v1`
- Frontend: `http://localhost:5173`

## Checks Before Pushing

```bash
npm run build --prefix backend
npm run lint --prefix frontend
npm run build --prefix frontend
```

## Git Notes

Do not commit real `.env` files, `node_modules`, `dist`, logs, zip archives, or local deployment folders. They are ignored by the root `.gitignore`.
