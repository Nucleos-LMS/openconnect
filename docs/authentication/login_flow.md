# Authentication and Login Flow

## Overview
The authentication flow in OpenConnect uses NextAuth.js for handling user sessions and authentication. After successful login, users are redirected to the dashboard page.

## Login Process
1. User enters credentials on the login page
2. Credentials are validated against the database
3. On successful authentication, a session is established
4. User is redirected to the dashboard page

## Dashboard Access
The dashboard page implements client-side navigation for redirects, which ensures that:
- Users are properly redirected after successful login
- Unauthenticated users are redirected to the login page
- Loading states are properly handled with visual feedback

## Session Management
- Sessions are managed by NextAuth.js
- Session tokens are stored in cookies
- Session status is checked on each page load
- A session refresh mechanism handles stalled loading states
