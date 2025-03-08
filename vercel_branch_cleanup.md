# Vercel Branch Management and Cleanup Process

## Overview
This document outlines the process for managing branch deployments and cleaning up old and unused deployment branches in Vercel using the Vercel CLI.

## Branch Naming Convention
To optimize Vercel deployments and prevent hitting branch limits, we've implemented a selective deployment strategy using the `ignoreCommand` in vercel.json:

```json
"ignoreCommand": "if [[ \"$VERCEL_GIT_COMMIT_REF\" =~ ^(dependabot/|temp-|cleanup-|docs-|chore-) ]]; then exit 0; else exit 1; fi"
```

### Branch Naming Guidelines:
- **Branches that WILL be deployed to Vercel:**
  - `feature-*` - New features
  - `fix-*` - Bug fixes
  - `test-*` - Test branches
  - `main` - Production branch

- **Branches that will NOT be deployed to Vercel:**
  - `dependabot/*` - Automated dependency updates
  - `temp-*` - Temporary branches
  - `cleanup-*` - Cleanup/refactoring branches
  - `docs-*` - Documentation-only changes
  - `chore-*` - Maintenance tasks

## Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- Authentication with Vercel (`vercel login`)
- Proper permissions to manage deployments

## Manual Cleanup Process
1. List all deployments:
   ```bash
   vercel list
   ```

2. Remove specific deployments:
   ```bash
   vercel remove <deployment-id> --safe
   ```

3. Remove multiple deployments:
   ```bash
   vercel remove <deployment-id-1> <deployment-id-2> --safe
   ```

## Automated Cleanup Script
Create a script named `cleanup_vercel_deployments.sh`:

```bash
#!/bin/bash

# Script to clean up old Vercel deployments
# Usage: ./cleanup_vercel_deployments.sh [age_in_days]

# Default to deployments older than 30 days if not specified
AGE_IN_DAYS=${1:-30}
CURRENT_DATE=$(date +%s)
CUTOFF_DATE=$((CURRENT_DATE - AGE_IN_DAYS * 86400))

echo "Listing deployments..."
DEPLOYMENTS=$(vercel list --json)

# Extract deployment IDs and creation dates
echo "Analyzing deployments..."
for DEPLOYMENT in $(echo "$DEPLOYMENTS" | jq -c '.[]'); do
  DEPLOYMENT_ID=$(echo "$DEPLOYMENT" | jq -r '.uid')
  CREATED_AT=$(echo "$DEPLOYMENT" | jq -r '.created')
  CREATED_TIMESTAMP=$(date -d "$CREATED_AT" +%s)
  
  if [ "$CREATED_TIMESTAMP" -lt "$CUTOFF_DATE" ]; then
    echo "Removing old deployment: $DEPLOYMENT_ID (created: $CREATED_AT)"
    vercel remove "$DEPLOYMENT_ID" --safe --yes
  fi
done

echo "Cleanup completed!"
```

Make the script executable:
```bash
chmod +x cleanup_vercel_deployments.sh
```

## GitHub Action for Automated Cleanup
Create a GitHub Action workflow file at `.github/workflows/cleanup-vercel-deployments.yml`:

```yaml
name: Cleanup Vercel Deployments

on:
  schedule:
    # Run weekly on Sunday at midnight
    - cron: '0 0 * * 0'
  workflow_dispatch:
    # Allow manual triggering

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Authenticate with Vercel
        run: vercel login --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Run cleanup script
        run: |
          curl -o cleanup_vercel_deployments.sh https://raw.githubusercontent.com/Nucleos-LMS/openconnect/main/cleanup_vercel_deployments.sh
          chmod +x cleanup_vercel_deployments.sh
          ./cleanup_vercel_deployments.sh 30
```

## Best Practices
1. Regularly clean up old deployments to avoid hitting branch limits
2. Use the `--safe` flag to prevent accidental deletion of production deployments
3. Set up automated cleanup to run on a schedule
4. Monitor deployment usage and adjust cleanup frequency as needed
5. Document the cleanup process for the team

## Troubleshooting
- If you encounter permission issues, ensure you have the correct team and project selected
- If the CLI is not authenticated, run `vercel login` to authenticate
- If you need to force remove a deployment, use the `--yes` flag

## Non-Interactive Authentication
To authenticate with Vercel CLI non-interactively (e.g., in CI/CD pipelines):

1. Generate a Vercel token from the Vercel dashboard:
   - Go to Settings > Tokens
   - Create a new token with appropriate permissions
   - Copy the token

2. Authenticate using the token:
   ```bash
   vercel login --token YOUR_VERCEL_TOKEN
   ```

3. For GitHub Actions, add the token as a secret:
   - Go to your repository settings
   - Navigate to Secrets > Actions
   - Add a new secret named VERCEL_TOKEN
   - Use the secret in your GitHub Actions workflow as shown in the example above
