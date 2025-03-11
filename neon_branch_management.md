# Neon Database Branch Management

## Overview
This document outlines how Neon database branches are managed in the OpenConnect project. Neon is a serverless PostgreSQL database service that allows creating isolated database branches for development and testing.

## Branch Limits
Neon has branch limits based on the plan:
- Free tier: 10 branches per project
- Paid tiers: Up to 5000 branches per project

## Vercel Integration
Vercel automatically creates a new Neon database branch for each deployment branch. This means that each time you create a new deployment in Vercel, it creates a corresponding database branch in Neon.

### Preventing Automatic Branch Creation
To prevent Vercel from automatically creating new Neon database branches, we've added the following setting to vercel.json:

```json
{
  "env": {
    "NEON_DATABASE_BRANCH_CREATION": "false"
  }
}
```

With this setting, all deployments will use the main database branch instead of creating new ones.

## Branch Cleanup
When you reach the branch limit, you need to clean up unused branches. You can do this through the Neon dashboard, which is accessible through the Vercel dashboard.

### Accessing Neon Dashboard Through Vercel
1. Log in to Vercel Dashboard
2. Navigate to the OpenConnect Project
3. Access the Database Section
4. Click on "View in Neon Dashboard"

### Cleaning Up Branches
1. In the Neon dashboard, click on the "Branches" tab
2. Look for branches that are no longer needed
3. Delete these branches using the three dots menu

## Automated Cleanup
For automated cleanup, you can use the Neon API with the provided scripts:

### Using the Cleanup Script
```bash
./scripts/neon_branch_cleanup.sh
```

This script will:
1. List all branches
2. Identify branches that are no longer needed
3. Delete these branches

## Best Practices
1. Use the `NEON_DATABASE_BRANCH_CREATION: "false"` setting in vercel.json
2. Regularly clean up unused branches
3. Consider upgrading to a paid plan if you consistently need more than 10 branches
