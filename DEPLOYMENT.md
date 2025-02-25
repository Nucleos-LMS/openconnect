# Deployment Configuration

## Package Management
This project uses pnpm for package management. Do not use npm or yarn.

### Installation
```bash
# Install pnpm if not installed
npm install -g pnpm

# Install dependencies
pnpm install
```

### Available Scripts
- Development: `pnpm dev` - Start the development server
- Build: `pnpm build` - Build the production application
- Test: `pnpm test` - Run tests
- Test Watch: `pnpm test:watch` - Run tests in watch mode
- Test Coverage: `pnpm test:coverage` - Run tests with coverage report
- Storybook: `pnpm storybook` - Start Storybook development server
- Build Storybook: `pnpm build-storybook` - Build Storybook for production
- Lint: `pnpm lint` - Run ESLint

## Environment Variables

### Required Variables
1. Database Configuration:
   ```
   POSTGRES_URL=your_postgres_connection_string
   ```

2. Twilio Configuration:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_API_KEY=your_api_key
   TWILIO_API_SECRET=your_api_secret
   ```
   Get these values from your Twilio Console: https://www.twilio.com/console
   
   ⚠️ IMPORTANT: Never commit these values to version control!

3. Authentication:
   ```
   NEXTAUTH_URL=https://{your-domain}
   NEXTAUTH_SECRET={generated-with-openssl}
   ```
   Generate NEXTAUTH_SECRET with:
   ```bash
   openssl rand -base64 32
   ```

4. Test Users:
   - Incarcerated: inmate@test.facility.com
   - Family: family@test.facility.com
   - Staff: staff@test.facility.com

### Vercel Setup
1. Create a new project in Vercel
2. Link your repository
3. Configure environment variables in Vercel dashboard:
   - Copy values from `.env.example`
   - Add your Twilio credentials from Twilio Console
   - Set NEXTAUTH_URL to your Vercel deployment URL
   - Generate and set NEXTAUTH_SECRET
4. Deploy the application
5. Run database migrations and seed data:
   ```bash
   pnpm run seed
   ```

### Security Notes
- Never commit sensitive credentials to version control
- Store all sensitive values in Vercel Environment Variables
- Rotate credentials if they are ever exposed
- Use separate API keys for development and production
