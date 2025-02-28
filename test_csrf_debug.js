// CSRF Token Debug Script
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
const LOG_FILE = path.join(LOG_DIR, `csrf-debug-${timestamp}.log`);

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

// Test the CSRF token endpoint
async function testCSRFToken() {
  log('Testing CSRF token endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/csrf`, {
      method: 'GET',
    });
    
    const status = response.status;
    log(`CSRF token status: ${status}`);
    
    if (status === 200) {
      const data = await response.json();
      log('CSRF token response:', data);
      
      const cookies = extractCookies(response);
      log('Cookies set by CSRF endpoint:', cookies);
      
      // Check if CSRF token cookie is set
      const csrfCookie = Object.keys(cookies).find(key => key.includes('csrf'));
      if (csrfCookie) {
        log(`CSRF cookie found: ${csrfCookie}`);
      } else {
        log('WARNING: No CSRF cookie found in response');
      }
      
      return { success: true, csrfToken: data.csrfToken, cookies };
    } else {
      log('Failed to get CSRF token');
      return { success: false };
    }
  } catch (error) {
    log('Error getting CSRF token:', error);
    return { success: false, error };
  }
}

// Test the login endpoint with CSRF token
async function testLoginWithCSRF(csrfToken, cookies) {
  log('Testing login endpoint with CSRF token...');
  
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
  
  log('Using cookie string:', cookieString);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieString
      },
      body: JSON.stringify({
        csrfToken,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        callbackUrl: `${BASE_URL}/`
      }),
      redirect: 'manual'
    });
    
    const status = response.status;
    log(`Login status: ${status}`);
    
    // Check for redirect
    const location = response.headers.get('location');
    log(`Redirect location: ${location}`);
    
    const newCookies = extractCookies(response);
    log('Cookies set by login endpoint:', newCookies);
    
    // Check for session cookie
    const sessionCookie = Object.keys(newCookies).find(key => key.includes('session'));
    if (sessionCookie) {
      log(`Session cookie found: ${sessionCookie}`);
    } else {
      log('WARNING: No session cookie found in response');
    }
    
    return { 
      success: status === 302, 
      redirectUrl: location,
      cookies: { ...cookies, ...newCookies }
    };
  } catch (error) {
    log('Error during login:', error);
    return { success: false, error };
  }
}

// Test login without CSRF token to see what happens
async function testLoginWithoutCSRF() {
  log('Testing login endpoint WITHOUT CSRF token...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        callbackUrl: `${BASE_URL}/`
      }),
      redirect: 'manual'
    });
    
    const status = response.status;
    log(`Login without CSRF status: ${status}`);
    
    try {
      const data = await response.json();
      log('Response data:', data);
    } catch (e) {
      log('Response is not JSON');
    }
    
    const location = response.headers.get('location');
    log(`Redirect location: ${location}`);
    
    const cookies = extractCookies(response);
    log('Cookies set:', cookies);
    
    return { success: false, status };
  } catch (error) {
    log('Error during login without CSRF:', error);
    return { success: false, error };
  }
}

// Run the CSRF token test
async function runCSRFTest() {
  log('Starting CSRF token test...');
  log(`Base URL: ${BASE_URL}`);
  
  // Test with CSRF token
  log('\n=== Testing with CSRF token ===');
  const csrfResult = await testCSRFToken();
  if (csrfResult.success) {
    const loginResult = await testLoginWithCSRF(csrfResult.csrfToken, csrfResult.cookies);
    log('Login with CSRF result:', loginResult);
  }
  
  // Test without CSRF token
  log('\n=== Testing without CSRF token ===');
  const noCSRFResult = await testLoginWithoutCSRF();
  log('Login without CSRF result:', noCSRFResult);
  
  log('\nCSRF token test completed');
}

// Run the test
runCSRFTest()
  .then(() => {
    log('Test completed');
    process.exit(0);
  })
  .catch(error => {
    log('Unexpected error:', error);
    process.exit(1);
  });
