#!/bin/bash

# Script to set up environment variables in Vercel
echo "Setting up environment variables in Vercel..."

# Set database connection strings
echo "Setting database connection strings..."
vercel env add POSTGRES_URL "postgres://neondb_owner:npg_5ZfzoBJD1Pmu@ep-damp-violet-a5cdx8an-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require" --scope nucleos-edu --yes
vercel env add POSTGRES_URL_NON_POOLING "postgres://neondb_owner:npg_5ZfzoBJD1Pmu@ep-damp-violet-a5cdx8an.us-east-2.aws.neon.tech/neondb?sslmode=require" --scope nucleos-edu --yes

# Verify environment variables
echo "Verifying environment variables..."
vercel env ls --scope nucleos-edu

echo "Environment variables setup completed!"
