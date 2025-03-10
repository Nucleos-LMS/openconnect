#!/bin/bash

# Script to clean up old and merged branches
echo "Cleaning up old and merged branches..."

# Branches that have already been merged into main
echo "Deleting branches that have already been merged into main..."
git push origin --delete \
  devin/1709500662-fix-dashboard-redirect \
  devin/1709500662-fix-vercel-deployment \
  devin/1740196427-add-readme-period \
  devin/1740271416-add-provider-config \
  devin/1740271627-add-participant-management \
  devin/1740272643-implement-twilio-provider \
  devin/1740273852-add-registration-components \
  devin/1740282953-add-backend-implementation \
  devin/1740346811-add-documentation \
  devin/1740799695-fix-dashboard-redirect \
  devin/1740804837-fix-dashboard-redirect-navigation \
  devin/1740814415-fix-dashboard-redirect-cookie-config \
  devin/1740815673-fix-dashboard-redirect-middleware \
  devin/1740881399-fix-dashboard-redirect-production \
  devin/1740988798-fix-dashboard-redirect-production \
  feat/vercel-deployment \
  fix/add-auth-debug-logging \
  fix/add-server-side-logging \
  fix/auth-config \
  fix/auth-config-types \
  fix/login-redirection \
  fix/nextauth-session-provider \
  fix/simplified-auth-debugging \
  fix/typescript-errors \
  fix/url-config \
  fix/vercel-env-variables

# Older branches (created before February 23, 2025)
echo "Deleting older branches (created before February 23, 2025)..."
git push origin --delete \
  devin/1740193686-fix-storybook-deps \
  devin/1740194016-add-waiting-room \
  devin/1740197386-fix-storybook-config \
  devin/1740198208-add-waiting-room-component

echo "Branch cleanup completed!"
