# Deployment Configuration

## Environment Variables

### Required Variables
1. Database Configuration:
   ```
   POSTGRES_URL=
   ```

2. Authentication:
   ```
   NEXTAUTH_URL=https://{your-domain}
   NEXTAUTH_SECRET={generated-with-openssl}
   ```
   Generate NEXTAUTH_SECRET with:
   ```bash
   openssl rand -base64 32
   ```

3. Test Users:
   - Incarcerated: inmate@test.facility.com
   - Family: family@test.facility.com
   - Staff: staff@test.facility.com

### Vercel Setup
1. Create a new project in Vercel
2. Link your repository
3. Configure environment variables in Vercel dashboard
4. Deploy the application
5. Run database migrations and seed data:
   ```bash
   pnpm run seed
   ```
