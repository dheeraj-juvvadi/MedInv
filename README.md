# MedInv - Medical Inventory Management System

MedInv is a comprehensive web application for managing medical inventory, patients, orders, and more. Built with Next.js, React, TypeScript, and MySQL.

**100% FREE TO DEPLOY** - This application can be fully deployed for free using Vercel's Hobby plan and PlanetScale's free tier without requiring any credit card or paid subscriptions.

## Table of Contents

- [Features](#features)
- [Deployment Options](#deployment-options)
- [Local Setup](#local-setup)
- [Vercel Deployment](#vercel-deployment)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Features

- Dashboard with key metrics and inventory summary
- Patient management system
- Medicine and inventory tracking
- Order management
- Medical logs and patient history
- Expiry alerts and notifications
- Analytics and reporting
- Role-based access control
- **Fully Responsive Design** - Optimized for mobile, tablet, and desktop devices with touch-friendly controls

## Responsive Mobile-First Design

MedInv features a comprehensive responsive web interface that provides an optimal viewing experience across all devices:

### Mobile Optimization

- **Touch-Friendly Controls**: All interactive elements meet WCAG 2.1 guidelines with minimum 44x44px tap targets
- **Mobile Navigation**: Searchable command menu with every workspace page
- **Responsive Tables**: Horizontal scroll with touch-optimized scrolling for data tables
- **Adaptive Typography**: Readable font sizes (16px minimum) without requiring zoom
- **Optimized Layouts**: Content reflows naturally on smaller screens

### Tablet & Desktop Features

- **Floating Navigation**: Compact top navigation with a keyboard-accessible command menu (⌘K / Ctrl+K)
- **Flexible Grid Layouts**: Automatically adjusts columns based on screen size
- **Enhanced Interactions**: Hover states and mouse-based interactions preserved
- **Maximum Content Width**: Centered workspace content (1120px max)

### Progressive Enhancement

- Core functionality works universally across all devices
- Enhanced features activate based on device capabilities
- CSS-based responsive design (no JavaScript required for layout)
- Hardware-accelerated animations for smooth performance

### Breakpoint System

- **Mobile**: < 768px (stacked layouts and a command menu)
- **Tablet**: 768px–850px (compact navigation and adaptive content)
- **Desktop**: > 850px (floating top navigation)

## Deployment Options

MedInv can be deployed in three main configurations:

1. **Local Development Mode**: Uses a local MySQL database
2. **Vercel Deployment with PlanetScale**: Uses PlanetScale or other cloud MySQL providers
3. **Demo Mode**: Uses process-local in-memory data, requiring no database setup. Changes survive page refreshes and reset when the server restarts.

The application automatically detects the environment and connects to the appropriate database based on environment variables.

### Demo Mode

Demo mode is ideal for:

- Testing the application without setting up a database
- Free-tier deployments
- Showcasing the application to clients or users

In demo mode:

- Data is shared across routes in the server process and survives page refreshes. Restarting the server resets sample data; this is not durable production storage.
- The application uses a predefined set of sample data
- No database connection is required
- Authentication is simplified for demonstration purposes

To enable demo mode, set the following environment variables:

```
DEPLOYMENT_MODE=demo
NEXT_PUBLIC_DEPLOYMENT_MODE=demo
```

### Live UI preview

Run `npm run preview` to launch the database-free, hot-reloading preview at `http://localhost:3000`. On macOS, open it with `open -a Safari http://localhost:3000`. Use **Explore the demo** on the sign-in page, or sign in with `admin` / `admin123`. `PORT=3001 npm run preview` selects a different port.

The interface uses Geist and Instrument Serif. The scrollable login page contains project details and a real demo workspace image, with Fetch's grass/cloud scenery and scroll-driven dripping shader confined to the hero. The authenticated workspace uses compact floating navigation. Attribution and licenses are in `public/third-party-notices.txt`.

## Local Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MedInv
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up a local MySQL database**
   - Install MySQL locally
   - Create a new database named `test2` (or your preferred name)
   - Use the SQL schema in `db-schema.md` to create the required tables

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Update the database credentials to match your local MySQL setup

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=test2
   DEPLOYMENT_MODE=local
   ```

5. **Run migrations and seed data**
   - Use the SQL commands in `db-schema.md` to populate initial test data

6. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Configuration

The application is designed to work with local MySQL, cloud database providers like PlanetScale, or in a database-free demo mode. The database connection is managed through the `lib/mysql.ts` file, which determines the connection method based on environment variables.

### Switching Between Deployment Modes

1. To use a local MySQL database:
   - Set `DEPLOYMENT_MODE=local` in your .env file
   - Configure the DB_* variables for your local MySQL instance

2. To use PlanetScale or other cloud MySQL providers:
   - Set `DEPLOYMENT_MODE=planetscale` in your .env file
   - Set `DATABASE_URL` to your cloud MySQL connection string

3. To use the demo mode (no database required):
   - Set `DEPLOYMENT_MODE=demo` in your .env file
   - No database configuration needed
   - Perfect for quick demonstrations or testing
   - Data persists within one server process; restarting the server resets it. Separate serverless instances do not share this data.

## Environment Variables

| Variable        | Description                                                               | Default     |
| --------------- | ------------------------------------------------------------------------- | ----------- |
| DEPLOYMENT_MODE | `local` for local DB, `planetscale` for cloud DB, `demo` for in-memory DB | `local`     |
| DB_HOST         | MySQL host for local deployment                                           | `localhost` |
| DB_USER         | MySQL username for local deployment                                       | `root`      |
| DB_PASSWORD     | MySQL password for local deployment                                       | ``          |
| DB_NAME         | MySQL database name for local deployment                                  | `test2`     |
| DB_PORT         | MySQL port for local deployment                                           | `3306`      |
| DATABASE_URL    | Full connection URL for PlanetScale/cloud DB                              | -           |

## Project Structure

```
MedInv/
├── app/               # Next.js app directory
│   ├── api/           # API routes
│   ├── (dashboard)/   # Dashboard routes
├── components/        # React components
│   ├── ui/            # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── mysql.ts       # Database connection logic
├── public/            # Static assets
├── styles/            # Global styles
├── types/             # TypeScript types
```

## API Endpoints

The application includes RESTful API endpoints for all major resources:

- `/api/patients` - Patient management
- `/api/medicines` - Medicine management
- `/api/inventory` - Inventory tracking
- `/api/orders` - Order processing
- `/api/medical-logs` - Medical logs and history
- `/api/dashboard` - Dashboard statistics and metrics

## Technologies Used

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MySQL (local) / PlanetScale (cloud)
- **Deployment**: Vercel

## Switching Between Deployment Modes

To switch the application between local and cloud database modes:

1. Update the `DEPLOYMENT_MODE` environment variable:
   - `local` for local MySQL database
   - `planetscale` for cloud MySQL database

2. When switching to `planetscale` mode, ensure the `DATABASE_URL` environment variable is correctly set.

3. When switching to `local` mode, ensure the `DB_*` environment variables are configured for your local MySQL instance.

The application reads these environment variables at runtime to determine how to connect to the database. This allows you to easily switch between development and production environments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
