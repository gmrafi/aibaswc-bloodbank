# Blood Bank Application Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Clerk account (optional, for authentication features)

## Step 1: Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install

# Using yarn
yarn install
```

## Step 2: Set Up Environment Variables

1. Copy the `env.template` file to `.env.local`:
   ```bash
   cp env.template .env.local
   ```

2. Edit `.env.local` and fill in your actual values:

   **Required (Supabase):**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   **Optional (Clerk):**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   CLERK_SECRET_KEY=your_clerk_secret_here
   ```

   **Super Admin:**
   ```env
   SUPERADMIN_EMAIL=your_email@example.com
   NEXT_PUBLIC_SUPERADMIN_EMAIL=your_email@example.com
   ```

## Step 3: Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL scripts in this order:

   ```sql
   -- First, run the initial schema
   -- Copy and paste the contents of scripts/001_init.sql
   
   -- Then run the role update
   -- Copy and paste the contents of scripts/002_add_role_to_profiles.sql
   
   -- Finally, run the schema update
   -- Copy and paste the contents of scripts/005_update_schema.sql
   ```

## Step 4: Configure Row Level Security (RLS)

In your Supabase dashboard, ensure the following RLS policies are enabled for public access:

```sql
-- Enable public read access to donors
CREATE POLICY "Public read access to donors" ON donors
FOR SELECT USING (true);

-- Enable public insert access to donors
CREATE POLICY "Public insert access to donors" ON donors
FOR INSERT WITH CHECK (true);

-- Enable public read access to requests
CREATE POLICY "Public read access to requests" ON requests
FOR SELECT USING (true);

-- Enable public insert access to requests
CREATE POLICY "Public insert access to requests" ON requests
FOR INSERT WITH CHECK (true);
```

## Step 5: Run the Application

```bash
# Development mode
npm run dev

# Or build and start
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Step 6: Test the Application

1. **Public Access Test:**
   - Visit the homepage
   - Navigate to `/donors` and `/requests`
   - Try adding a new donor or request

2. **API Health Check:**
   - Visit `/api/health` to check system status
   - Verify all environment variables are present
   - Check database connectivity

3. **Authentication Test (if Clerk is configured):**
   - Try signing up and signing in
   - Check profile management features

## Troubleshooting

### Common Issues:

1. **"Missing environment variables" error:**
   - Ensure `.env.local` file exists and has all required variables
   - Restart the development server after adding environment variables

2. **Database connection errors:**
   - Verify Supabase URL and keys are correct
   - Check if your Supabase project is active
   - Ensure RLS policies allow public access

3. **Build errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

4. **Authentication not working:**
   - Verify Clerk keys are correct
   - Check Clerk application settings
   - Ensure redirect URLs are configured properly

### Environment Variable Reference:

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Public anonymous key for client-side |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Service role key for server-side operations |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public Supabase URL (same as above) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anonymous key (same as above) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Clerk publishable key for authentication |
| `CLERK_SECRET_KEY` | No | Clerk secret key for server-side auth |
| `SUPERADMIN_EMAIL` | No | Email for super admin privileges |
| `NEXT_PUBLIC_SUPERADMIN_EMAIL` | No | Public super admin email |

## Next Steps

After successful setup:

1. **Customize the application:**
   - Update club information in `lib/club-config.ts`
   - Modify the UI components as needed
   - Add your own branding and styling

2. **Deploy to production:**
   - Use Vercel for easy deployment
   - Set environment variables in your hosting platform
   - Configure custom domains if needed

3. **Monitor and maintain:**
   - Check the health endpoint regularly
   - Monitor database performance
   - Update dependencies periodically

## Support

If you encounter issues:

1. Check the health endpoint: `/api/health`
2. Review the console logs for errors
3. Verify all environment variables are set correctly
4. Check the database schema matches the expected structure

The application is designed to work with minimal configuration and should function properly once the basic setup is complete.
