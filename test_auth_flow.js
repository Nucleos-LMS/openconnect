// Authentication Flow Test Script
const { fetch } = require('undici');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const TEST_EMAIL = 'inmate@test.facility.com';
const TEST_PASSWORD = 'password123';

// Create a log directory if it doesn't exist
const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// Create a log file with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-');
const LOG_FILE = path.join(LOG_DIR, `auth-flow-${timestamp}.log`);

// Helper function to log to console and file
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  if (data) {
    console.log(data);
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
  if (data) {
    fs.appendFileSync(LOG_FILE, JSON.stringify(data, null, 2) + '\n');
  }
}

// Helper function to extract cookies from response
function extractCookies(response) {
  const cookies = {};
  const cookieHeader = response.headers.get('set-cookie');
  
  if (cookieHeader) {
    cookieHeader.split(',').forEach(cookie => {
      const parts = cookie.split(';')[0].trim().split('=');
      if (parts.length === 2) {
        cookies[parts[0]] = parts[1];
      }
    });
  }
  
  return cookies;
}

// Test the complete authentication flow
async function testAuthFlow() {
  log('Starting authentication flow test...');
  log(`Base URL: ${BASE_URL}`);
  
  // Step 1: Get CSRF token
  log('\n=== Step 1: Get CSRF token ===');
  const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfData = await csrfResponse.json();
  log('CSRF token response:', csrfData);
  
  const csrfCookies = extractCookies(csrfResponse);
  log('CSRF cookies:', csrfCookies);
  
  // Step 2: Login with credentials
  log('\n=== Step 2: Login with credentials ===');
  const cookieString = Object.entries(csrfCookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
  
  const loginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieString
    },
    body: JSON.stringify({
      csrfToken: csrfData.csrfToken,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      callbackUrl: `${BASE_URL}/`
    }),
    redirect: 'manual'
  });
  
  log('Login response status:', loginResponse.status);
  log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
  
  const loginCookies = extractCookies(loginResponse);
  log('Login cookies:', loginCookies);
  
  // Step 3: Check session
  log('\n=== Step 3: Check session ===');
  const allCookies = { ...csrfCookies, ...loginCookies };
  const sessionCookieString = Object.entries(allCookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
  
  const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
    headers: {
      'Cookie': sessionCookieString
    }
  });
  
  const sessionData = await sessionResponse.json();
  log('Session response:', sessionData);
  
  // Step 4: Test protected route
  log('\n=== Step 4: Test protected route ===');
  const protectedResponse = await fetch(`${BASE_URL}/dashboard`, {
    headers: {
      'Cookie': sessionCookieString
    },
    redirect: 'manual'
  });
  
  log('Protected route status:', protectedResponse.status);
  log('Protected route headers:', Object.fromEntries(protectedResponse.headers.entries()));
  
  // Step 5: Test sign out
  log('\n=== Step 5: Test sign out ===');
  const signOutResponse = await fetch(`${BASE_URL}/api/auth/signout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookieString
    },
    body: JSON.stringify({
      csrfToken: csrfData.csrfToken,
      callbackUrl: `${BASE_URL}/login`
    }),
    redirect: 'manual'
  });
  
  log('Sign out status:', signOutResponse.status);
  log('Sign out headers:', Object.fromEntries(signOutResponse.headers.entries()));
  
  const signOutCookies = extractCookies(signOutResponse);
  log('Sign out cookies:', signOutCookies);
  
  log('\nAuthentication flow test completed');
}

// Run the test
testAuthFlow()
  .then(() => {
    log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    log('Test error:', error);
    process.exit(1);
  });
