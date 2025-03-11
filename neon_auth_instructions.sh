#!/bin/bash

# Script to authenticate with Neon and list projects
# Note: This script is for demonstration purposes only
# You will need to run these commands manually with your Neon API key

# Authenticate with Neon
# This will open a browser window for authentication
echo "To authenticate with Neon, run:"
echo "neon auth"

# Alternatively, you can use an API key
echo "Or authenticate with an API key:"
echo "neon auth --api-key <your-neon-api-key>"

# List projects
echo "To list projects, run:"
echo "neon projects list"

# Get the project ID for the openconnect project
echo "Look for 'neon-openconnect-demo-v0' in the output"

# Example output format:
echo "Example output:"
echo "ID                                   | Name                    | Region    | Plan"
echo "-------------------------------------|-------------------------|-----------|------"
echo "abcdef12-3456-7890-abcd-ef1234567890 | neon-openconnect-demo-v0 | aws-us-east-2 | free"

echo "Once you have the project ID, you can list branches:"
echo "neon branches list --project-id <project-id>"
