# Neon Database Branch Cleanup Guide

## Overview
This guide provides step-by-step instructions for cleaning up Neon database branches through the Vercel dashboard. The Nucleos-LMS/openconnect repository uses Neon database for storing data, and Neon's free tier has a limit of 10 branches per project.

## Accessing Neon Dashboard Through Vercel

1. **Log in to Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Log in with your account credentials

2. **Navigate to the OpenConnect Project**
   - Select the "openconnect" project from your dashboard

3. **Access the Database Section**
   - In the project dashboard, click on "Storage" in the left sidebar
   - Select "Database" from the dropdown menu

4. **View Neon Dashboard**
   - Click on "View in Neon Dashboard" button
   - This will open the Neon dashboard in a new tab

## Cleaning Up Neon Database Branches

1. **View Branches**
   - In the Neon dashboard, click on the "Branches" tab
   - You'll see a list of all database branches with their creation dates and statuses

2. **Identify Branches to Delete**
   - Look for branches that are no longer needed:
     - Branches associated with closed PRs
     - Branches associated with deleted Git branches
     - Old branches that haven't been used recently
     - Test branches that are no longer needed

3. **Delete Branches**
   - For each branch you want to delete:
     - Click on the three dots (⋮) menu next to the branch
     - Select "Delete branch"
     - Confirm the deletion when prompted

4. **Verify Branch Count**
   - After cleaning up, check that your branch count is below the limit (10 for free tier)
   - The branch count is displayed at the top of the Branches tab

## Important Notes

1. **Do Not Delete the Main Branch**
   - The main branch is used by the production deployment
   - Deleting it will cause the application to lose database access

2. **Branch Creation Setting**
   - We've added `NEON_DATABASE_BRANCH_CREATION: "false"` to vercel.json
   - This prevents Vercel from creating new Neon database branches for each deployment
   - All deployments will use the main database branch instead

3. **Branch Naming**
   - Neon database branches are named after the Git branches they were created for
   - This makes it easy to identify which branches can be safely deleted

## Troubleshooting

If you encounter the error "You reached to your branch limit" during Vercel deployment:

1. Follow this guide to clean up unused branches
2. Verify that `NEON_DATABASE_BRANCH_CREATION: "false"` is set in vercel.json
3. If you need more than 10 branches, consider upgrading to a paid Neon plan

## Long-term Management

For long-term management of Neon database branches:

1. **Regular Cleanup**
   - Schedule regular cleanup sessions (e.g., monthly)
   - Use the `scripts/check_neon_branches.sh` script to check branch status

2. **Automated Cleanup**
   - Consider setting up automated cleanup using the Neon API
   - See the GitHub Action in `.github/workflows/cleanup-neon-branches.yml`

3. **Upgrade Plan (If Needed)**
   - If you consistently need more than 10 branches, consider upgrading to a paid plan
   - Paid plans offer up to 5000 branches per project
