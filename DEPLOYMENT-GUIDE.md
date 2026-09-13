# MedInv (Medical Inventory Management) Deployment Guide

This guide provides instructions for deploying the MedInv application to Vercel in two modes:

1. **Demo Mode** - A free tier deployment where data is stored in one server process, survives page refreshes, and resets on server restart. Separate serverless instances do not share state.
2. **Database Mode** - A persistent mode that uses MySQL/PlanetScale for data storage.

## Prerequisites

- A Vercel account
- For Database Mode: A MySQL or PlanetScale database
- Node.js and npm installed locally

## Environment Variables

The application requires the following environment variables for deployment:

### Demo Mode (In-Memory Database)

```
DEPLOYMENT_MODE=demo
NEXT_PUBLIC_DEPLOYMENT_MODE=demo
```

### Database Mode (Persistent MySQL)

```
DEPLOYMENT_MODE=local
NEXT_PUBLIC_DEPLOYMENT_MODE=local
DATABASE_HOST=your-mysql-host
DATABASE_PORT=3306
DATABASE_USER=your-mysql-username
DATABASE_PASSWORD=your-mysql-password
DATABASE_NAME=your-database-name
```

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MedInv.git
cd MedInv
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file for local testing:

```
DEPLOYMENT_MODE=demo  # or 'local' for database mode
NEXT_PUBLIC_DEPLOYMENT_MODE=demo  # or 'local' for database mode
# Add database credentials if using database mode
```

### 4. Test Locally

```bash
npm run dev
```

### 5. Deploy to Vercel

#### Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in the Vercel dashboard
3. Configure environment variables in the Vercel project settings
4. Deploy the project

## Switching Between Modes

You can switch between demo and database modes by changing the `DEPLOYMENT_MODE` and `NEXT_PUBLIC_DEPLOYMENT_MODE` environment variables in your Vercel project settings.

## Database Setup

If you're using the database mode, you'll need to set up your database with the required schema. The application needs the following tables:

- ActivityLog
- AnalyticsData
- Billing
- BillingItem
- Discount
- DrugCategory
- Employee
- EmployeeAccounts
- ExpiryAlert
- Feedback
- Inventory
- InventoryLog
- MedicalLog
- MedicalLogs
- Medicine
- medicineCategories
- Order
- OrderItem
- OrderItems
- Orders
- Patient
- PatientAppointment
- PatientMedication
- Prescription
- PrescriptionItem
- Settings
- StaffAccount
- Supplier

You can use the SQL scripts in the `scripts` directory to set up your database:

```bash
# For a basic setup with test data
mysql -u your-username -p your-database-name < scripts/setup-indian-data.sql

# To add all required tables
mysql -u your-username -p your-database-name < scripts/add-missing-tables.sql
```

## Authentication

The default admin credentials are:

- Username: `admin`
- Password: `admin123`

For security reasons, change these credentials after deployment by updating the `StaffAccount` table in your database.

## Troubleshooting

- If you encounter database connectivity issues, verify your database credentials and ensure your database is accessible from Vercel's deployment environment.
- For issues with the demo mode, check that `DEPLOYMENT_MODE` is set to `demo`.
- If certain features don't work, ensure all required tables exist in your database.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PlanetScale Documentation](https://planetscale.com/docs) (if using PlanetScale)
- [MySQL Documentation](https://dev.mysql.com/doc/) (if using MySQL)
