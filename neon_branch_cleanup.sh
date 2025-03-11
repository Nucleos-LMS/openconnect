#!/bin/bash

# Script to clean up old Neon database branches
# Usage: ./neon_branch_cleanup.sh <project-id> [age_in_days]

PROJECT_ID=$1
AGE_IN_DAYS=${2:-30}
CURRENT_DATE=$(date +%s)
CUTOFF_DATE=$((CURRENT_DATE - AGE_IN_DAYS * 86400))

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Project ID is required"
  echo "Usage: ./neon_branch_cleanup.sh <project-id> [age_in_days]"
  exit 1
fi

echo "Listing branches for project $PROJECT_ID..."
BRANCHES=$(neon branches list --project-id $PROJECT_ID --output json)

if [ $? -ne 0 ]; then
  echo "Error: Failed to list branches. Make sure you are authenticated with Neon."
  echo "Run 'neon auth' to authenticate."
  exit 1
fi

# Extract branch IDs and creation dates
echo "Analyzing branches..."
for BRANCH in $(echo "$BRANCHES" | jq -c '.[]'); do
  BRANCH_ID=$(echo "$BRANCH" | jq -r '.id')
  BRANCH_NAME=$(echo "$BRANCH" | jq -r '.name')
  CREATED_AT=$(echo "$BRANCH" | jq -r '.created_at')
  CREATED_TIMESTAMP=$(date -d "$CREATED_AT" +%s)
  
  # Skip the main branch
  if [ "$BRANCH_NAME" == "main" ]; then
    echo "Skipping main branch: $BRANCH_ID"
    continue
  fi
  
  if [ "$CREATED_TIMESTAMP" -lt "$CUTOFF_DATE" ]; then
    echo "Removing old branch: $BRANCH_ID (name: $BRANCH_NAME, created: $CREATED_AT)"
    neon branches delete $BRANCH_ID --project-id $PROJECT_ID --confirm
    
    # Add to the list of deleted branches
    echo "$BRANCH_ID,$BRANCH_NAME,$CREATED_AT" >> ~/repos/openconnect/branches_to_delete.txt
  fi
done

echo "Cleanup completed!"
echo "Deleted branches have been recorded in ~/repos/openconnect/branches_to_delete.txt"
