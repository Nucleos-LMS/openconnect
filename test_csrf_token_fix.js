// CSRF Token Fix Test Script
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
const LOG_FILE = path.join(LOG_DIR, `csrf-fix-${timestamp}.log`);

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

// Test the CSRF token endpoint with different SameSite settings
async function testCSRFWithSameSiteSettings() {
  log('Testing CSRF token with different SameSite settings...');
  
  // Test with SameSite=None
  log('\n=== Testing with SameSite=None ===');
  const noneResponse = await fetch(`${BASE_URL}/api/auth/csrf`, {
    method: 'GET',
    headers: {
      'Cookie': 'next-auth.csrf-token-sameSite=none'
    }
  });
  
  const noneStatus = noneResponse.status;
  log(`SameSite=None status: ${noneStatus}`);
  
  const noneCookies = extractCookies(noneResponse);
  log('SameSite=None cookies:', noneCookies);
  
  // Test with SameSite=Lax
  log('\n=== Testing with SameSite=Lax ===');
  const laxResponse = await fetch(`${BASE_URL}/api/auth/csrf`, {
    method: 'GET',
    headers: {
      'Cookie': 'next-auth.csrf-token-sameSite=lax'
    }
  });
  
  const laxStatus = laxResponse.status;
  log(`SameSite=Lax status: ${laxStatus}`);
  
  const laxCookies = extractCookies(laxResponse);
  log('SameSite=Lax cookies:', laxCookies);
  
  // Test with SameSite=Strict
  log('\n=== Testing with SameSite=Strict ===');
  const strictResponse = await fetch(`${BASE_URL}/api/auth/csrf`, {
    method: 'GET',
    headers: {
      'Cookie': 'next-auth.csrf-token-sameSite=strict'
    }
  });
  
  const strictStatus = strictResponse.status;
  log(`SameSite=Strict status: ${strictStatus}`);
  
  const strictCookies = extractCookies(strictResponse);
  log('SameSite=Strict cookies:', strictCookies);
  
  // Test login with each setting
  log('\n=== Testing login with different SameSite settings ===');
  
  // Get CSRF token
  const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
  const csrfData = await csrfResponse.json();
  const csrfToken = csrfData.csrfToken;
  
  // Test with SameSite=None
  log('\n=== Testing login with SameSite=None ===');
  const noneLoginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.csrf-token=${csrfToken}; SameSite=None; Secure`
    },
    body: JSON.stringify({
      csrfToken,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      callbackUrl: `${BASE_URL}/`
    }),
    redirect: 'manual'
  });
  
  log('SameSite=None login status:', noneLoginResponse.status);
  log('SameSite=None login headers:', Object.fromEntries(noneLoginResponse.headers.entries()));
  
  // Test with SameSite=Lax
  log('\n=== Testing login with SameSite=Lax ===');
  const laxLoginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.csrf-token=${csrfToken}; SameSite=Lax`
    },
    body: JSON.stringify({
      csrfToken,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      callbackUrl: `${BASE_URL}/`
    }),
    redirect: 'manual'
  });
  
  log('SameSite=Lax login status:', laxLoginResponse.status);
  log('SameSite=Lax login headers:', Object.fromEntries(laxLoginResponse.headers.entries()));
  
  log('\nCSRF token SameSite test completed');
}

// Run the test
testCSRFWithSameSiteSettings()
  .then(() => {
    log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    log('Test error:', error);
    process.exit(1);
  });
