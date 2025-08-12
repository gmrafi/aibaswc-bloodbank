# Blood Bank Management System

A comprehensive blood bank management system built for university welfare clubs and community organizations. This system helps coordinate blood donations and requests within a community, making it easier to save lives during emergencies.

## 🩸 Features

### Public Access (No Login Required)
- **Browse All Data**: View all donors and blood requests without any authentication
- **Add Donors**: Anyone can register as a blood donor with comprehensive information
- **Create Requests**: Submit blood requests for patients without needing to sign up
- **Search & Filter**: Find donors by blood group, department, eligibility, or search by name/contact
- **Donor Matching**: Automatic matching system finds compatible donors for requests
- **Mobile Responsive**: Works seamlessly on all devices
- **Contact Information**: Copy donor phone numbers for quick contact during emergencies

### Optional Authentication Features
- **Profile Management**: Sign up to manage your personal information and track your contributions
- **Enhanced Experience**: Logged-in users get personalized dashboard and history
- **Role Recognition**: System recognizes super admin for advanced management features

### Super Admin Features (mubasshirrafi20@gmail.com)
- **Delete Operations**: Only the super admin can delete donors and requests from the system
- **System Health**: Monitor database connectivity and system status
- **Advanced Management**: Access to system-wide controls and maintenance features

## 🌟 Community-First Design

This system is designed with community welfare in mind:
- **No Barriers**: Anyone can view and contribute data without creating accounts
- **Emergency Ready**: Quick access to donor information during medical emergencies  
- **Transparent**: All blood donation data is publicly visible to build trust
- **Inclusive**: Works for everyone regardless of technical expertise
- **Privacy Conscious**: Only essential information is collected and displayed

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Clerk for optional user management
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase account and project
- A Clerk account and application (for optional features)
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
   # Supabase (Required)
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Clerk (Optional - for enhanced features)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Super Admin Configuration
   SUPERADMIN_EMAIL=mubasshirrafi20@gmail.com
   NEXT_PUBLIC_SUPERADMIN_EMAIL=mubasshirrafi20@gmail.com
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   \`\`\`sql
   -- Run scripts/001_init.sql first
   -- Then run scripts/002_add_role_to_profiles.sql
   \`\`\`

5. **Configure Supabase Row Level Security (RLS)**
   The system uses public access, so ensure your Supabase tables have appropriate RLS policies for public read/write access.

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Super Admin Setup
The super admin (mubasshirrafi20@gmail.com) has exclusive delete permissions. This user can:
- Delete inappropriate or outdated donor records
- Remove fulfilled or cancelled blood requests
- Access system health monitoring
- Manage overall system maintenance

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
The system uses a comprehensive blood compatibility matrix defined in `lib/compatibility.ts`. It automatically matches compatible donors for blood requests based on medical compatibility rules.

## 📱 Usage

### For Anyone (No Account Needed)
1. **Browse Donors**: Visit `/donors` to see all available blood donors
2. **View Requests**: Check `/requests` for active blood donation needs
3. **Add Yourself**: Click "Add Donor" to register as a blood donor
4. **Create Request**: Use "Add Request" to submit blood needs for patients
5. **Search & Filter**: Use filters to find specific blood groups or locations
6. **Contact Donors**: Copy phone numbers to contact donors directly

### For Registered Users (Optional)
1. **Sign Up**: Create an account for personalized experience
2. **Profile Management**: Update your information and preferences
3. **Track Contributions**: See your donation history and requests

### For Super Admin
1. **System Management**: Access admin portal for system overview
2. **Data Cleanup**: Delete outdated or inappropriate records
3. **Monitor Health**: Check database connectivity and system status
4. **Emergency Management**: Handle system-wide issues during emergencies

## 🔒 Security & Privacy

- **Public by Design**: System is built for transparency and community access
- **Minimal Data Collection**: Only essential information for blood donation coordination
- **Super Admin Controls**: Only one designated user can delete data
- **Secure Infrastructure**: Built on trusted platforms (Vercel, Supabase, Clerk)
- **No Sensitive Data**: No medical records or sensitive personal information stored

## 🚨 Emergency Usage

During medical emergencies:
1. **Quick Access**: No login required to find donors
2. **Filter by Blood Group**: Instantly find compatible donors
3. **Contact Information**: Phone numbers readily available
4. **Location Data**: Find donors by department or location
5. **Urgency Levels**: Requests marked with appropriate urgency

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

- Built with love for community welfare and saving lives
- Thanks to all contributors and beta testers
- Special thanks to university welfare clubs for feedback and requirements
- Inspired by the need for accessible emergency blood donation coordination

---

**Made with ❤️ for saving lives through community blood donation**

*"No barriers, just care - because every second counts in emergencies"*
