# MedInv

MedInv is a medical inventory management application for medicines, stock, patients, suppliers, orders, billing, expiry monitoring, and clinical reporting. It runs on Next.js App Router, React 18, TypeScript, Tailwind CSS, and a deployment-aware MySQL or in-memory demo database.

## Features

- Dashboard with live key indicators, refresh, CSV export, order overview, activity, and inventory distribution.
- Medicine, inventory, patient, supplier, drug category, and staff account CRUD workflows.
- Order creation and inventory adjustment dialogs with server-side validation and conflict handling.
- Expiry alerts, analytics, billing, feedback, employee, discount, prescription, and medical-log views.
- Search, filtering, loading, empty, retry, and API-error states.
- CSV export for dashboard indicators, employees, billing, discounts, feedback, and prescriptions.
- JWT session cookies, middleware route protection, and explicit authentication configuration failures.
- Responsive navigation with mobile overlay, 44-pixel touch targets, keyboard focus states, and reduced-motion support.
- Distinct clinical design language using Sora, Archivo Black, IBM Plex Mono, layered gradients, and a fixed grid.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Set `JWT_SECRET` in `.env.local`. Without it, protected routes return a configuration error instead of falling back to an insecure secret.

Copy [.env.example](.env.example) as the starting point. It documents demo, local MySQL, Supabase notification, and public deployment-mode variables.

### Database Modes

- `DEPLOYMENT_MODE=demo` uses an in-memory database and resets on server restart.
- `DEPLOYMENT_MODE=local` uses `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and optional `DB_PORT`.
- Cloud MySQL providers use the same variables through the deployment configuration.

The demo login is `admin` / `admin123`. Replace demo credentials and configure a production staff account before public deployment.

## Commands

```bash
npm run test
npm run build
npm run lint
npm run setup-db
```

Tests use Vitest and jsdom. The production build uses the in-memory database automatically when no database credentials are present.

## API Surface

Core routes include:

- `POST /api/auth/login`
- `GET /api/dashboard/key-stats`
- `GET|POST|PUT|DELETE /api/medicines`
- `GET|POST|PUT|DELETE /api/inventory`
- `GET|POST|PUT|DELETE /api/patients`
- `GET|POST|PUT|DELETE /api/suppliers`
- `GET|POST|PUT|DELETE /api/drug-categories`
- `GET|POST|PUT|DELETE /api/staff-accounts`
- `GET|POST /api/orders`
- `GET /api/expiry-alerts`
- `GET /api/billing`
- `GET /api/analytics/top-medicines`
- `GET /api/analytics/inventory-turnover`

Read-only operational views are available for employees, discounts, feedback, prescriptions, medical logs, activity, deployment mode, and database exploration.

## Deployment

```bash
npm run build
npm start
```

For Vercel, set `DEPLOYMENT_MODE`, `JWT_SECRET`, `NEXT_PUBLIC_DEPLOYMENT_MODE`, and database credentials as encrypted project environment variables. Use a reachable MySQL provider for persistent deployments; Vercel serverless functions do not provide persistent local disk state.
