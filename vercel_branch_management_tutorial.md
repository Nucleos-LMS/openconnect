# Comprehensive Vercel Branch Management Tutorial

## Table of Contents
1. [Introduction](#introduction)
2. [Branch Naming Strategy](#branch-naming-strategy)
3. [Vercel Configuration](#vercel-configuration)
4. [Manual Branch Cleanup](#manual-branch-cleanup)
5. [Automated Branch Cleanup](#automated-branch-cleanup)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Introduction <a name="introduction"></a>

This comprehensive tutorial explains how to effectively manage Vercel deployments and prevent hitting branch limits in the Nucleos-LMS/openconnect repository. Vercel has internal limits on the number of deployment branches, which can cause deployment failures even when you have a Pro plan.

### The Branch Limit Issue

When you see this error message in Vercel:
```
You reached to your branch limit. Please upgrade your plan to create more branches or delete unused branches.
```

This occurs because:
1. Vercel maintains internal deployment branches that don't get automatically cleaned up when Git branches are deleted
2. Each deployment creates a unique deployment ID in Vercel's system
3. These internal branches are not directly visible or manageable through Git

This tutorial provides a complete solution to manage and prevent this issue.

## Branch Naming Strategy <a name="branch-naming-strategy"></a>

We've implemented a selective deployment strategy using the `ignoreCommand` in vercel.json to control which branches get deployed to Vercel.

### Branch Naming Convention

#### Branches that WILL be deployed to Vercel:
- `feature-*` - New features (e.g., `feature-user-authentication`)
- `fix-*` - Bug fixes (e.g., `fix-login-redirect`)
- `test-*` - Test branches (e.g., `test-new-ui-components`)
- `main` - Production branch

#### Branches that will NOT be deployed to Vercel:
- `dependabot/*` - Automated dependency updates (e.g., `dependabot/npm_and_yarn/next-13.5.4`)
- `temp-*` - Temporary branches (e.g., `temp-experiment-with-api`)
- `cleanup-*` - Cleanup/refactoring branches (e.g., `cleanup-unused-components`)
- `docs-*` - Documentation-only changes (e.g., `docs-update-readme`)
- `chore-*` - Maintenance tasks (e.g., `chore-update-dependencies`)

### How to Use This Convention

When creating a new branch, choose the appropriate prefix based on whether you want it to be deployed to Vercel:

```bash
# For branches that SHOULD be deployed to Vercel
git checkout -b feature-new-login-page

# For branches that should NOT be deployed to Vercel
git checkout -b docs-update-api-documentation
```

## Vercel Configuration <a name="vercel-configuration"></a>

### Understanding the ignoreCommand

The `ignoreCommand` in vercel.json determines which branches will be deployed:

```json
"ignoreCommand": "if [[ \"$VERCEL_GIT_COMMIT_REF\" =~ ^(dependabot/|temp-|cleanup-|docs-|chore-) ]]; then exit 0; else exit 1; fi"
```

This command:
1. Checks the current branch name (`$VERCEL_GIT_COMMIT_REF`)
2. Uses a regex pattern to match branches starting with specific prefixes
3. Returns exit code 0 (success) for branches that should be ignored
4. Returns exit code 1 (failure) for branches that should be deployed

### How to Update vercel.json

1. Open vercel.json in your editor:
   ```bash
   nano vercel.json
   ```

2. Add or update the ignoreCommand:
   ```json
   {
     "github": {
       "silent": true,
       "autoJobCancelation": true
     },
     "ignoreCommand": "if [[ \"$VERCEL_GIT_COMMIT_REF\" =~ ^(dependabot/|temp-|cleanup-|docs-|chore-) ]]; then exit 0; else exit 1; fi",
     // other configuration...
   }
   ```

3. Add other optimizations to reduce deployment issues:
   ```json
   {
     "env": {
       // other env variables...
       "NEON_DATABASE_BRANCH_CREATION": "false"
     }
   }
   ```

4. Save and commit the changes:
   ```bash
   git add vercel.json
   git commit -m "Update Vercel configuration with selective branch deployment"
   git push origin your-branch-name
   ```

## Manual Branch Cleanup <a name="manual-branch-cleanup"></a>

### Prerequisites

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Authenticate with Vercel:
   ```bash
   # First, log out if you're already logged in
   vercel logout

   # Then log in with your Vercel account
   vercel login
   ```

   This will open a browser window for authentication. Follow the prompts to complete the login process.

3. Verify your login:
   ```bash
   vercel whoami
   ```

   You should see your Vercel username and the teams you belong to.

### Listing Deployments

To see all deployments for your project:

```bash
vercel list
```

This will show a table with:
- Deployment ID
- URL
- State (ready, error, etc.)
- Created date
- Branch name

For more detailed information in JSON format:

```bash
vercel list --json
```

### Removing Specific Deployments

To remove a specific deployment:

```bash
vercel remove <deployment-id> --safe
```

Example:
```bash
vercel remove dep_1a2b3c4d5e6f7g8h9i0j --safe
```

The `--safe` flag prevents accidental deletion of production deployments.

To remove multiple deployments at once:

```bash
vercel remove <deployment-id-1> <deployment-id-2> <deployment-id-3> --safe
```

### Removing Deployments by Age

To remove all deployments older than a specific date:

```bash
# List deployments in JSON format
vercel list --json > deployments.json

# Use jq to filter and remove old deployments
cat deployments.json | jq -c '.[]' | while read deployment; do
  DEPLOYMENT_ID=$(echo "$deployment" | jq -r '.uid')
  CREATED_AT=$(echo "$deployment" | jq -r '.created')
  CREATED_DATE=$(date -d "$CREATED_AT" +%s)
  CUTOFF_DATE=$(date -d "30 days ago" +%s)
  
  if [ "$CREATED_DATE" -lt "$CUTOFF_DATE" ]; then
    echo "Removing old deployment: $DEPLOYMENT_ID (created: $CREATED_AT)"
    vercel remove "$DEPLOYMENT_ID" --safe --yes
  fi
done
```

## Automated Branch Cleanup <a name="automated-branch-cleanup"></a>

### Using the Cleanup Script

We've created a script to automate the cleanup process. Here's how to use it:

1. Download the cleanup script:
   ```bash
   curl -o cleanup_vercel_deployments.sh https://raw.githubusercontent.com/Nucleos-LMS/openconnect/main/cleanup_vercel_deployments.sh
   chmod +x cleanup_vercel_deployments.sh
   ```

2. Run the script to remove deployments older than 30 days:
   ```bash
   ./cleanup_vercel_deployments.sh 30
   ```

   You can specify a different number of days:
   ```bash
   ./cleanup_vercel_deployments.sh 14  # Remove deployments older than 14 days
   ```

### Script Breakdown

The cleanup script does the following:

1. Takes an optional parameter for the age in days (defaults to 30)
2. Calculates the cutoff date based on the current date and the specified age
3. Lists all deployments in JSON format
4. Iterates through each deployment and checks its creation date
5. Removes deployments that are older than the cutoff date

### Setting Up GitHub Actions for Automated Cleanup

To automate the cleanup process on a schedule:

1. Create a GitHub Actions workflow file at `.github/workflows/cleanup-vercel-deployments.yml`:

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

2. Add the VERCEL_TOKEN secret to your GitHub repository:
   - Generate a token from the Vercel dashboard (Settings > Tokens)
   - Go to your GitHub repository settings
   - Navigate to Secrets > Actions
   - Add a new secret named VERCEL_TOKEN with your Vercel token as the value

### Non-Interactive Authentication

For CI/CD pipelines or automated scripts, you'll need to authenticate non-interactively:

1. Generate a Vercel token from the Vercel dashboard:
   - Go to Settings > Tokens
   - Create a new token with appropriate permissions
   - Copy the token

2. Authenticate using the token:
   ```bash
   vercel login --token YOUR_VERCEL_TOKEN
   ```

3. For GitHub Actions, store the token as a secret:
   ```yaml
   - name: Authenticate with Vercel
     run: vercel login --token ${{ secrets.VERCEL_TOKEN }}
   ```

## Troubleshooting <a name="troubleshooting"></a>

### Common Issues and Solutions

#### 1. Authentication Issues

**Issue**: "Error: Not authorized" when running Vercel CLI commands

**Solution**:
```bash
# Log out and log in again
vercel logout
vercel login

# Check if you're logged in
vercel whoami

# If using a token, verify the token has the correct permissions
vercel login --token YOUR_VERCEL_TOKEN
```

#### 2. Permission Issues

**Issue**: "Error: You don't have access to this project"

**Solution**:
```bash
# List teams you have access to
vercel teams ls

# Switch to the correct team
vercel switch <team-name>

# List projects to verify access
vercel projects ls
```

#### 3. Branch Limit Still Reached

**Issue**: Still seeing "You reached to your branch limit" after cleanup

**Solution**:
1. Wait 24-48 hours for Vercel's internal systems to update
2. Contact Vercel support with details about your Pro plan subscription
3. Run the cleanup script with a shorter timeframe:
   ```bash
   ./cleanup_vercel_deployments.sh 7  # Remove deployments older than 7 days
   ```

#### 4. Deployment Failures

**Issue**: Deployments failing with other errors

**Solution**:
1. Check the Vercel deployment logs:
   ```bash
   vercel logs <deployment-id>
   ```

2. Verify environment variables are set correctly:
   ```bash
   vercel env ls
   ```

3. Check for build errors in the local environment:
   ```bash
   npm run build
   ```

## Managing Neon Database Branches <a name="neon-database-branches"></a>

The branch limit error you're encountering is related to Neon database branches, not Vercel deployment branches. Vercel automatically creates a new Neon database branch for each deployment branch, which is causing the branch limit to be reached on the free tier of Neon.

### Current Solution
We've disabled automatic database branch creation with this setting in `vercel.json`:
```json
{
  "env": {
    "NEON_DATABASE_BRANCH_CREATION": "false"
  }
}
```

This setting tells Vercel not to create a new database branch for each deployment. All deployments will use the main database branch instead.

### Accessing the Neon Dashboard
To manage database branches directly:
1. Go to the [Vercel Dashboard](https://vercel.com)
2. Select the openconnect project
3. Go to Storage > Database
4. Click on "View in Neon Dashboard"

### Upgrading to a Paid Plan
If you need more than 10 database branches, consider upgrading to a paid Neon plan through the Neon dashboard.

## Best Practices <a name="best-practices"></a>

### Branch Management

1. **Follow the Branch Naming Convention**
   - Use appropriate prefixes based on the purpose of the branch
   - Be consistent with naming across the team

2. **Regular Cleanup**
   - Delete merged branches promptly
   - Run the cleanup script monthly
   - Set up automated cleanup with GitHub Actions

3. **Monitor Deployment Usage**
   - Regularly check the number of deployments
   - Watch for approaching limits
   - Adjust cleanup frequency as needed

### Vercel Configuration

1. **Environment Variables**
   - Store sensitive information in Vercel's environment variables
   - Use placeholders in vercel.json for sensitive values
   - Set environment-specific variables for different deployment environments

2. **Build Optimization**
   - Reduce node_modules size by removing unnecessary dependencies
   - Implement better caching strategies
   - Use Vercel's build cache optimization features

3. **Deployment Settings**
   - Enable auto-job cancellation to reduce concurrent builds
   - Use silent mode for GitHub integration to reduce noise
   - Configure appropriate regions for deployment

### Team Workflow

1. **Documentation**
   - Keep this tutorial up-to-date
   - Document branch naming conventions for the team
   - Share best practices with new team members

2. **Monitoring**
   - Set up alerts for deployment failures
   - Create a dashboard for deployment status
   - Regularly review deployment metrics

3. **Continuous Improvement**
   - Regularly review and update the branch management strategy
   - Collect feedback from the team
   - Implement improvements based on lessons learned

---

By following this comprehensive tutorial, you should be able to effectively manage Vercel deployments, prevent branch limit issues, and maintain a clean and efficient deployment workflow for the Nucleos-LMS/openconnect repository.
