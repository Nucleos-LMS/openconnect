# Neon Database Branch Management

## Overview
The Nucleos-LMS/openconnect repository uses Neon database for storing data. Neon has branch limits based on the plan:
- Free Plan: 10 branches per project
- Paid Plans: 5000 branches per project

When Vercel deploys a branch, it automatically creates a corresponding Neon database branch for each deployment. This can quickly lead to hitting the branch limit on the Free Plan.

## Current Configuration
We've added `NEON_DATABASE_BRANCH_CREATION: "false"` to vercel.json, which prevents Vercel from creating new Neon database branches for each deployment. This is a good short-term solution but may limit functionality if database branches are needed.

## Managing Neon Database Branches
You can use the Neon CLI to manage branches:

### Installation and Authentication
```bash
# Install Neon CLI
npm install -g neonctl

# Authenticate with Neon
neon auth
```

### Listing Branches
```bash
# List projects
neon projects list

# List branches in a project
neon branches list --project-id <project-id>
```

### Deleting Branches
```bash
# Delete a branch
neon branches delete <branch-id|branch-name> --project-id <project-id>
```

### Automated Cleanup
You can use the `neon_branch_cleanup.sh` script to automatically clean up old branches:
```bash
# Clean up branches older than 30 days
./neon_branch_cleanup.sh <project-id> 30
```

## Long-term Solutions
1. **Keep `NEON_DATABASE_BRANCH_CREATION: "false"` in vercel.json**
   - This prevents Vercel from creating new Neon database branches for each deployment
   - This is a good solution if you don't need separate database branches for each deployment

2. **Regularly Clean Up Unused Branches**
   - Use the Neon CLI to list and delete unused branches
   - Use the `neon_branch_cleanup.sh` script to automate branch cleanup

3. **Upgrade Neon Plan (If Needed)**
   - If more branches are required, consider upgrading from Free Plan (10 branches) to a paid plan (5000 branches)
   - This would be necessary if the application requires more than 10 database branches

## Troubleshooting
If you encounter the error message "You reached to your branch limit. Please upgrade your plan to create more branches or delete unused branches" during Vercel deployment, it means you've hit the branch limit for the Neon database. Follow these steps to resolve the issue:

1. Verify that `NEON_DATABASE_BRANCH_CREATION: "false"` is set in vercel.json
2. Use the Neon CLI to list and delete unused branches
3. Consider upgrading your Neon plan if you need more than 10 branches

## Automated Branch Cleanup with GitHub Actions
You can set up a GitHub Action to automatically clean up old Neon database branches on a schedule. Here's an example workflow:

```yaml
name: Cleanup Neon Database Branches

on:
  schedule:
    - cron: '0 0 * * 0'  # Run weekly at midnight on Sunday
  workflow_dispatch:  # Allow manual triggering

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Neon CLI
        run: npm install -g neonctl

      - name: Authenticate with Neon
        run: echo "${{ secrets.NEON_API_KEY }}" | neon auth --api-key

      - name: Run cleanup script
        run: ./neon_branch_cleanup.sh ${{ secrets.NEON_PROJECT_ID }} 30
```

To use this workflow, you'll need to add the following secrets to your GitHub repository:
- `NEON_API_KEY`: Your Neon API key
- `NEON_PROJECT_ID`: Your Neon project ID
