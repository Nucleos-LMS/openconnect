# Vercel Deployment Fix

## Issues Identified

1. **Branch Limit Reached**: Vercel has a limit on the number of deployment branches, and we currently have 41 branches in the repository. This is likely causing the deployment failures.

2. **Environment Variables**: The NEXTAUTH_SECRET environment variable is properly set in both vercel.json and .env.production, but it might not be properly loaded during the build process.

3. **Database Configuration**: The database connection strings in .env.production might need to be added to the Vercel environment variables.

## Recommended Solutions

### 1. Clean Up Branches

Execute the cleanup_branches.sh script to delete unnecessary branches:
```bash
cd ~/repos/openconnect
./cleanup_branches.sh
```

### 2. Verify Environment Variables in Vercel

Ensure that all necessary environment variables are properly set in the Vercel project settings:
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_API_URL
- Database connection strings (POSTGRES_URL, etc.)

### 3. Set Environment Variables in Vercel Dashboard

For security reasons, it's better to set sensitive environment variables like database connection strings directly in the Vercel dashboard rather than in the vercel.json file:

1. Go to the Vercel dashboard for the openconnect project
2. Navigate to Settings > Environment Variables
3. Add the following environment variables:
   - POSTGRES_URL: postgres://neondb_owner:npg_5ZfzoBJD1Pmu@ep-damp-violet-a5cdx8an-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   - POSTGRES_URL_NON_POOLING: postgres://neondb_owner:npg_5ZfzoBJD1Pmu@ep-damp-violet-a5cdx8an.us-east-2.aws.neon.tech/neondb?sslmode=require

This approach is more secure than storing database credentials in the vercel.json file, which would expose them in the git history.

### 4. Trigger a New Deployment

After cleaning up branches and verifying environment variables, trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger new Vercel deployment after branch cleanup"
git push origin fix-next-auth-types
```
