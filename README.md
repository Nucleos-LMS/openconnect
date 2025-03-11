# OpenConnect

A Next.js application for connecting incarcerated individuals with their families, legal representatives, and educators.

## Database
This project uses Neon as its database, which is automatically provisioned through Vercel. For more information on how to manage database branches, see [Neon-Vercel Integration](./docs/neon-vercel-integration.md).

## Neon Database Branch Management
This project uses Neon database for storing data. Neon has branch limits based on the plan:
- Free Plan: 10 branches per project
- Paid Plans: 5000 branches per project

When Vercel deploys a branch, it automatically creates a corresponding Neon database branch for each deployment. This can quickly lead to hitting the branch limit on the Free Plan.

We've added `NEON_DATABASE_BRANCH_CREATION: "false"` to vercel.json, which prevents Vercel from creating new Neon database branches for each deployment.

For more information, see [Neon Branch Management](./neon_branch_management.md) or the more detailed [Neon-Vercel Integration](./docs/neon-vercel-integration.md) documentation.
