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
