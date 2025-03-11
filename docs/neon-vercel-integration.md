# Neon-Vercel Integration

## Overview
This document explains how Vercel integrates with Neon database for the OpenConnect project. Understanding this integration is crucial for managing database branches and preventing deployment issues.

## How Vercel Integrates with Neon

### Automatic Branch Creation
When Vercel deploys a branch, it automatically creates a corresponding Neon database branch. This provides isolation between different deployments, but can quickly consume the branch limit on Neon's free tier (10 branches).

### Branch Naming
Neon database branches created by Vercel follow this naming pattern:
- For production: `main`
- For preview deployments: `vercel-{deployment-id}`

### Database Connection
Vercel automatically sets up environment variables for connecting to the appropriate Neon database branch:
- `POSTGRES_URL`: Connection string for the pooled connection
- `POSTGRES_URL_NON_POOLING`: Connection string for non-pooled connection

## Managing Branch Limits

### Preventing Automatic Branch Creation
To prevent Vercel from creating new Neon database branches for each deployment, add this setting to vercel.json:

```json
{
  "env": {
    "NEON_DATABASE_BRANCH_CREATION": "false"
  }
}
```

With this setting, all deployments will use the main database branch instead of creating new ones.

### Cleaning Up Branches
When you reach the branch limit, you need to clean up unused branches through the Neon dashboard:

1. **Access Neon Dashboard Through Vercel**
   - Log in to Vercel Dashboard
   - Navigate to the OpenConnect Project
   - Click on "Storage" in the left sidebar
   - Select "Database" from the dropdown
   - Click on "View in Neon Dashboard"

2. **Delete Unused Branches**
   - In the Neon dashboard, click on the "Branches" tab
   - Look for branches that are no longer needed
   - Delete these branches using the three dots menu

## Schema Management

### Schema Changes
When using a single database branch for all deployments (with `NEON_DATABASE_BRANCH_CREATION: "false"`), schema changes will affect all deployments. Consider implementing a migration strategy to manage schema updates effectively.

### Migration Strategy
For schema changes, consider:
1. Using a migration tool like Prisma Migrate
2. Implementing backward-compatible changes
3. Deploying schema changes separately from code changes

## Troubleshooting

### Branch Limit Error
If you encounter the error "You reached to your branch limit" during Vercel deployment:

1. Clean up unused branches through the Neon dashboard
2. Verify that `NEON_DATABASE_BRANCH_CREATION: "false"` is set in vercel.json
3. If you need more than 10 branches, consider upgrading to a paid Neon plan

### Connection Issues
If deployments can't connect to the database:

1. Verify that the database connection strings are correctly set in Vercel environment variables
2. Check that the main database branch exists in Neon
3. Ensure that the database user has the necessary permissions
