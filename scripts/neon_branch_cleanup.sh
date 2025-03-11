#!/bin/bash

# Script to clean up unused Neon database branches
# This script requires the Neon CLI to be installed and authenticated

# Set variables
PROJECT_ID="ep-damp-violet-a5cdx8an"
MAIN_BRANCH="main"
DAYS_OLD=7

# Check if neonctl is installed
if ! command -v neonctl &> /dev/null; then
    echo "Error: neonctl is not installed. Please install it with 'npm install -g neonctl'"
    exit 1
fi

# Check if authenticated
if ! neonctl projects list &> /dev/null; then
    echo "Error: Not authenticated with Neon. Please run 'neonctl auth' first."
    exit 1
fi

# List all branches
echo "Listing all branches..."
BRANCHES=$(neonctl branches list --project-id $PROJECT_ID)

# Parse branches and find old ones
echo "Finding branches older than $DAYS_OLD days..."
CURRENT_DATE=$(date +%s)
OLD_BRANCHES=()

while IFS= read -r line; do
    # Skip header and empty lines
    if [[ $line == "ID"* ]] || [[ -z $line ]]; then
        continue
    fi
    
    # Extract branch ID and creation date
    BRANCH_ID=$(echo $line | awk '{print $1}')
    BRANCH_NAME=$(echo $line | awk '{print $2}')
    CREATION_DATE=$(echo $line | awk '{print $3}')
    
    # Skip main branch
    if [[ $BRANCH_NAME == $MAIN_BRANCH ]]; then
        continue
    fi
    
    # Convert creation date to timestamp
    CREATION_TIMESTAMP=$(date -d "$CREATION_DATE" +%s)
    
    # Calculate age in days
    AGE_SECONDS=$((CURRENT_DATE - CREATION_TIMESTAMP))
    AGE_DAYS=$((AGE_SECONDS / 86400))
    
    # Check if branch is old enough to delete
    if [[ $AGE_DAYS -gt $DAYS_OLD ]]; then
        OLD_BRANCHES+=("$BRANCH_ID")
        echo "Branch $BRANCH_NAME (ID: $BRANCH_ID) is $AGE_DAYS days old and will be deleted."
    fi
done <<< "$BRANCHES"

# Delete old branches
if [[ ${#OLD_BRANCHES[@]} -eq 0 ]]; then
    echo "No branches to delete."
    exit 0
fi

echo "Deleting ${#OLD_BRANCHES[@]} branches..."
for BRANCH_ID in "${OLD_BRANCHES[@]}"; do
    echo "Deleting branch $BRANCH_ID..."
    neonctl branches delete $BRANCH_ID --project-id $PROJECT_ID --confirm
done

echo "Branch cleanup completed."
