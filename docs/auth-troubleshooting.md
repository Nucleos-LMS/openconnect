# Authentication Troubleshooting

## Overview
This document provides guidance for troubleshooting authentication issues in the OpenConnect application.

## Common Issues

### 500 Errors on Authentication Endpoints
If you encounter 500 errors when accessing `/api/auth/csrf` or `/api/auth/providers` endpoints, check the following:

1. **Environment Variables**: Ensure that the following environment variables are correctly set in Vercel:
   - `NEXTAUTH_URL`: Should be set to the base URL of the application
   - `NEXTAUTH_SECRET`: Should be set to a secure random string
   - `POSTGRES_URL`: Should be set to the database connection string
   - `POSTGRES_URL_NON_POOLING`: Should be set to the non-pooling database connection string

2. **Database Connection**: Verify that the database connection is working correctly:
   - Check that the database is accessible from the Vercel deployment
   - Verify that the database credentials are correct
   - Ensure that the database schema includes the necessary tables for authentication

3. **NextAuth.js Configuration**: Check the NextAuth.js configuration in `src/lib/auth.config.ts`:
   - Ensure that the JWT module import is correct (`import { JWT } from 'next-auth/jwt';`)
   - Verify that the session strategy is set to "jwt"
   - Check that the cookies configuration is correct

### Failed to Execute 'json' on 'Response'
If you encounter the error "Failed to execute 'json' on 'Response': Unexpected end of JSON input", it indicates that the authentication endpoints are returning invalid JSON responses. This could be due to:

1. **Server-Side Errors**: Check the server logs for errors in the authentication flow
2. **Database Connection Issues**: Verify that the database connection is working correctly
3. **Environment Variable Issues**: Ensure that all required environment variables are correctly set

## Debugging
To enable additional debugging information, set the `debug` option to `true` in the NextAuth.js configuration:

```typescript
export const authConfig: NextAuthConfig = {
  debug: true,
  // ...
};
```

This will output detailed debugging information to the console, which can help identify the source of authentication issues.

## Environment Variable Configuration
For production deployments, ensure that the environment variables in `vercel.json` are set correctly:

```json
"env": {
  "NEXT_PUBLIC_API_URL": "https://openconnect-api.vercel.app",
  "NEXTAUTH_URL": "https://openconnect-one.vercel.app",
  "NEXT_PUBLIC_APP_URL": "https://openconnect-one.vercel.app",
  "NEXTAUTH_SECRET": "your-secret-key",
  "NEON_DATABASE_BRANCH_CREATION": "false",
  "POSTGRES_URL": "your-postgres-url",
  "POSTGRES_URL_NON_POOLING": "your-postgres-url-non-pooling"
}
```

## Fallback Authentication
In production, the application is configured to fall back to a test user if the database connection fails. This ensures that users can still log in even if there are temporary database connection issues. The fallback user has limited permissions and is intended as a temporary solution while the underlying issues are being resolved.
