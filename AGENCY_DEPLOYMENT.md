# OpenConnect Agency Deployment Guide

## Prerequisites
1. GitHub account
2. Vercel account
3. Twilio account with:
   - Account SID
   - Auth Token
   - API Key SID
   - API Key Secret

## One-Click Deployment Steps

1. Fork the Repository
   - Visit https://github.com/Nucleos-LMS/openconnect
   - Click "Fork" button
   - Select your organization

2. Deploy to Vercel
   - Visit https://vercel.com/new
   - Import your forked repository
   - Click "Deploy"

3. Configure Environment Variables
   In Vercel project settings, add:
   - `POSTGRES_URL`: (Automatically added by Vercel Postgres)
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_API_KEY`: Your Twilio API Key SID
   - `TWILIO_API_SECRET`: Your Twilio API Key Secret
   - `NEXTAUTH_URL`: Your deployment URL (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

4. Set Up Database
   - Go to Storage tab in Vercel dashboard
   - Click "Create Database"
   - Select "Postgres"
   - Click "Create"
   - Database URL will be automatically added to your environment variables

5. Test Deployment
   - Visit your deployment URL
   - Test with three user types:
     * Incarcerated individual
     * Family member
     * Facility staff
   - Verify video calls work
   - Check recording functionality

## Support
For issues or questions, contact support@nucleos.com
