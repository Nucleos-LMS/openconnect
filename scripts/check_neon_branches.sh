#!/bin/bash

# Script to check Neon database branch status
# Note: This script requires the Neon CLI to be installed and authenticated
# Install with: npm install -g neonctl
# Authenticate with: neonctl auth

echo "Checking Neon database branch status..."

# Check if neonctl is installed
if ! command -v neonctl &> /dev/null; then
    echo "Error: neonctl is not installed. Install with: npm install -g neonctl"
    exit 1
fi

# Check if authenticated
if ! neonctl projects list &> /dev/null; then
    echo "Error: Not authenticated with Neon. Authenticate with: neonctl auth"
    exit 1
fi

# Get project ID
PROJECT_ID=$(neonctl projects list --output=json | jq -r '.[0].id')
if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not find Neon project"
    exit 1
fi

# List branches
echo "Listing branches for project $PROJECT_ID..."
neonctl branches list --project-id $PROJECT_ID

echo "Branch limit status:"
BRANCH_COUNT=$(neonctl branches list --project-id $PROJECT_ID --output=json | jq length)
echo "Current branch count: $BRANCH_COUNT"
echo "Free tier limit: 10"

if [ $BRANCH_COUNT -ge 10 ]; then
    echo "Warning: You have reached the branch limit. Consider cleaning up unused branches or upgrading to a paid plan."
else
    echo "You have $(expr 10 - $BRANCH_COUNT) branches available."
fi
