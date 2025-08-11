# Blood Bank Management System

A comprehensive blood bank management system built for university welfare clubs and community organizations. This system helps coordinate blood donations and requests within a community, making it easier to save lives during emergencies.

## 🩸 Features

### Public Access
- **Browse Donors**: View available blood donors with their blood groups, eligibility status, and contact preferences
- **View Requests**: See active blood requests with urgency levels and patient information
- **Search & Filter**: Find donors by blood group, department, eligibility, or search by name/contact
- **Mobile Responsive**: Works seamlessly on all devices

### Authenticated Users
- **Add Donors**: Register new blood donors with comprehensive information
- **Create Requests**: Submit blood requests with patient details and urgency levels
- **Donor Matching**: Automatic matching system finds compatible donors for requests
- **Contact Management**: Copy donor phone numbers for quick contact
- **Profile Management**: Manage your account and role information

### Admin Features
- **Full CRUD Operations**: Create, read, update donors and requests
- **Request Management**: Mark requests as fulfilled or cancelled
- **Donor Selection**: Select and track which donors responded to requests
- **Export Capabilities**: Download donor and request data

### Super Admin Features
- **Delete Operations**: Only super admins can delete donors and requests
- **System Health**: Monitor database connectivity and system status
- **User Role Management**: Automatic role assignment and management

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Clerk for secure user management
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase account and project
- A Clerk account and application
- Vercel account (for deployment)

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd blood-bank-management
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file with the following variables:
   \`\`\`env
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Super Admin Configuration
   SUPERADMIN_EMAIL=your_superadmin_email@example.com
   NEXT_PUBLIC_SUPERADMIN_EMAIL=your_superadmin_email@example.com
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   \`\`\`sql
   -- Run scripts/001_init.sql first
   -- Then run scripts/002_add_role_to_profiles.sql
   \`\`\`

5. **Configure Clerk**
   - Set up your Clerk application
   - Configure sign-in/sign-up pages
   - Add your domain to allowed origins

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Super Admin Setup
The super admin is configured via environment variables. The user with the email specified in `SUPERADMIN_EMAIL` will automatically receive super admin privileges.

### Club Information
Update club details in `lib/club-config.ts`:
\`\`\`typescript
export const CLUB = {
  name: "Your Club Name",
  shortName: "YCN",
  // ... other details
}
\`\`\`

### Blood Group Compatibility
The system uses a comprehensive blood compatibility matrix defined in `lib/compatibility.ts`. It automatically matches compatible donors for blood requests.

## 📱 Usage

### For Community Members
1. Visit the website to browse available donors and active requests
2. Sign up/sign in to add yourself as a donor or create blood requests
3. Use filters to find specific blood groups or check donor eligibility

### For Admins
1. Sign in with your admin account
2. Add new donors and create blood requests
3. Use the matching system to find compatible donors
4. Mark requests as fulfilled when completed

### For Super Admins
1. Access the admin portal for system overview
2. Monitor system health and database status
3. Delete inappropriate or outdated records
4. Manage user roles and permissions

## 🔒 Security & Privacy

- **Authentication**: Secure authentication via Clerk
- **Role-based Access**: Different permission levels for users, admins, and super admins
- **Data Protection**: Personal information is protected and only accessible to authorized users
- **API Security**: All API endpoints are protected with proper authentication checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or need help:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Built with love for community welfare
- Thanks to all contributors and beta testers
- Special thanks to university welfare clubs for feedback and requirements

---

**Made with ❤️ for saving lives through community blood donation**
