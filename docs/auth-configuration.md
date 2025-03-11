# Authentication Configuration

## Overview
This document explains how authentication is configured in the OpenConnect application, particularly for preview deployments.

## Environment Variables
The following environment variables are used for authentication:

- `NEXTAUTH_URL`: The base URL of the application, used by NextAuth.js for redirects and callbacks.
- `NEXT_PUBLIC_APP_URL`: The public URL of the application, used for client-side redirects.
- `NEXTAUTH_SECRET`: The secret used to encrypt cookies and tokens.

## Dynamic URLs for Preview Deployments
For preview deployments, the URLs are dynamically set based on the deployment URL:

```json
"env": {
  "NEXT_PUBLIC_API_URL": "${VERCEL_ENV === 'production' ? 'https://openconnect-api.vercel.app' : 'https://' + process.env.VERCEL_URL}",
  "NEXTAUTH_URL": "${VERCEL_ENV === 'production' ? 'https://openconnect-one.vercel.app' : 'https://' + process.env.VERCEL_URL}",
  "NEXT_PUBLIC_APP_URL": "${VERCEL_ENV === 'production' ? 'https://openconnect-one.vercel.app' : 'https://' + process.env.VERCEL_URL}",
  "NEXTAUTH_SECRET": "dKPntuOaj26qQ0unshxDJCyOo+YxS0Aa0PuorhWYFz4=",
  "NEON_DATABASE_BRANCH_CREATION": "false",
  "POSTGRES_URL": "${POSTGRES_URL}",
  "POSTGRES_URL_NON_POOLING": "${POSTGRES_URL_NON_POOLING}"
}
```

This ensures that preview deployments use their own URLs for authentication, while production deployments use the hardcoded production URLs.

## Authentication Flow
1. User visits the login page
2. User enters credentials and clicks "Sign In"
3. NextAuth.js authenticates the user and redirects to the callback URL
4. The callback URL redirects to the dashboard
5. The dashboard checks the session and displays the appropriate content

## Troubleshooting
If you see a "Session Unauthenticated" message on the login page, this is expected behavior before authentication. After successful authentication, you should be redirected to the dashboard.

If you're redirected to the production URL after clicking "Sign In", check the NEXTAUTH_URL environment variable in vercel.json to ensure it's using the dynamic URL configuration for preview deployments.
