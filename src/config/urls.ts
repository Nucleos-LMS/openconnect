// Define URL configuration types
export interface UrlConfig {
  api: string;
  auth: string;
  app: string;
}

// Default URL configuration for development
const devUrls: UrlConfig = {
  api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  auth: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  app: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

// URL configuration for production
const prodUrls: UrlConfig = {
  api: process.env.NEXT_PUBLIC_API_URL || 'https://openconnect-api.vercel.app',
  auth: process.env.NEXTAUTH_URL || 'https://openconnect.vercel.app',
  app: process.env.NEXT_PUBLIC_APP_URL || 'https://openconnect.vercel.app',
};

// Export the appropriate URL configuration based on environment
export const urls: UrlConfig = process.env.NODE_ENV === 'production' ? prodUrls : devUrls;
