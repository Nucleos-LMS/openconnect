# Neon Database Integration with Vercel

## Overview
This project uses Neon as its database, which is automatically provisioned through Vercel. This document explains how the integration works and how to manage database branches.

## How Vercel-Neon Integration Works
1. When a project is set up in Vercel with a Postgres database, Vercel automatically provisions a Neon database
2. By default, Vercel creates a new Neon database branch for each deployment branch
3. Neon's free tier has a limit of 10 database branches, which can cause deployment failures when this limit is reached

## Current Configuration
To prevent hitting the branch limit, we've disabled automatic database branch creation with this setting in `vercel.json`:
```json
{
  "env": {
    "NEON_DATABASE_BRANCH_CREATION": "false"
  }
}
```

This setting tells Vercel not to create a new database branch for each deployment. All deployments will use the main database branch instead.

## Managing Database Branches
### Viewing Database Branches
To view existing database branches, you need to access the Neon dashboard:
1. Go to the [Vercel Dashboard](https://vercel.com)
2. Select the openconnect project
3. Go to Storage > Database
4. Click on "View in Neon Dashboard"

### Cleaning Up Database Branches
If you've reached the branch limit, you can clean up unused branches:
1. Access the Neon dashboard as described above
2. Go to the Branches tab
3. Delete any unused branches

### Upgrading to a Paid Plan
If you need more than 10 database branches, consider upgrading to a paid Neon plan:
1. Access the Neon dashboard as described above
2. Go to the Project Settings
3. Click on "Upgrade Plan"

## Troubleshooting
### Branch Limit Error
If you encounter the error "You reached to your branch limit", it means you've hit the 10-branch limit on Neon's free tier. Follow the steps in "Cleaning Up Database Branches" to resolve this issue.

### Database Connection Issues
If you encounter database connection issues after disabling automatic branch creation, ensure that your application is configured to use the main database branch:
```env
DATABASE_URL=postgres://neondb_owner:password@hostname.neon.tech/neondb?sslmode=require
```
