# Vercel Branch Limit Fix Plan

## Issue Summary
The Nucleos-LMS/openconnect repository is experiencing deployment failures on Vercel with the error message:
> You reached to your branch limit. Please upgrade your plan to create more branches or delete unused branches.

This is occurring despite:
1. Having only 4 active Git branches
2. Being on a Vercel Pro plan (which should support 60 Git repositories)
3. Having only 3 serverless functions (well below any function limits)

## Root Cause Analysis
Based on our investigation, the issue appears to be related to how Vercel internally tracks deployments:

1. **Internal Deployment Tracking**: Vercel maintains internal deployment branches that don't get automatically cleaned up when Git branches are deleted
2. **Deployment History**: Each deployment creates a unique deployment ID in Vercel's system
3. **Hidden Branches**: These internal branches are not directly visible or manageable through Git

## Action Plan

### 1. Immediate Actions (1-2 days)

#### 1.1 Update Vercel Configuration
- Add `ignoreCommand` to vercel.json to prevent unnecessary deployments:
```json
{
  "github": {
    "silent": true,
    "autoJobCancelation": true
  },
  "ignoreCommand": "if [[ \"$VERCEL_GIT_COMMIT_REF\" == \"dependabot/*\" ]]; then exit 0; else exit 1; fi"
}
```
- Add environment variable to disable Neon database branch creation:
```json
{
  "env": {
    "NEON_DATABASE_BRANCH_CREATION": "false"
  }
}
```

#### 1.2 Clean Up Git Branches
- Execute the cleanup_branches.sh script to delete unnecessary Git branches
- Focus on removing old feature branches that have already been merged

#### 1.3 Wait for Vercel's Internal Cleanup
- Vercel may have an internal garbage collection process that runs periodically
- Reduce deployment frequency for 24-48 hours to allow this process to catch up

### 2. Medium-Term Solutions (3-7 days)

#### 2.1 Contact Vercel Support
- If the issue persists after 48 hours, contact Vercel support
- Provide details about the Pro plan subscription and the branch limit error
- Request assistance with cleaning up internal deployment branches

#### 2.2 Optimize Build Process
- Reduce node_modules size (currently 1.8GB) by removing unnecessary dependencies
- Implement better caching strategies for the build process
- Consider using Vercel's build cache optimization features

#### 2.3 Implement Branch Management Strategy
- Create a branch naming convention that helps identify temporary branches
- Establish a policy for regular cleanup of merged branches
- Document the process for the team to follow

### 3. Long-Term Solutions (8+ days)

#### 3.1 Automate Branch Cleanup
- Create a GitHub Action to automatically delete branches after they've been merged
- Implement a scheduled job to clean up stale branches

#### 3.2 Monitor Vercel Deployments
- Set up monitoring for deployment failures
- Create alerts for approaching limits

#### 3.3 Document Lessons Learned
- Create documentation about Vercel's branch limits and how to avoid them
- Share best practices with the team

## Success Criteria
- Successful deployment of the fix-next-auth-types branch
- Successful deployment of the main branch
- No more branch limit errors in Vercel deployments

## Risks and Mitigations
- **Risk**: Deleting branches might affect ongoing work
  - **Mitigation**: Coordinate with the team before deleting any branches
- **Risk**: Vercel's internal tracking might not be immediately updated
  - **Mitigation**: Be patient and allow time for Vercel's systems to update
- **Risk**: Configuration changes might affect deployment behavior
  - **Mitigation**: Test changes in a controlled manner and monitor closely

## Next Steps
1. Update vercel.json with the recommended changes
2. Execute the cleanup_branches.sh script
3. Wait 24-48 hours for Vercel's internal systems to update
4. If the issue persists, contact Vercel support
