# WorkOS Authentication Application

A Next.js application that demonstrates comprehensive authentication with WorkOS AuthKit and multiple administrative widgets. This app provides organization admins with tools for user management, session monitoring, security settings, and profile management.

## Features

### 👥 **User Management Widget**
- Invite new users to the organization
- Remove users from the organization  
- Manage user roles and permissions
- View all organization members

### 🔐 **User Sessions**
- Monitor active user sessions
- Track login history and device usage
- Manage session security

### 🛡️ **Security Settings**
- Configure organization security policies
- Manage authentication methods
- Monitor security events

### 👤 **User Profile**
- View and edit personal profile information
- Manage account preferences
- Update security settings

## Quick Start

### Local Development
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   Create a `.env.local` file with the following variables:
   ```bash
   WORKOS_CLIENT_ID=<YOUR_CLIENT_ID>
   WORKOS_API_KEY=<YOUR_API_SECRET_KEY>
   WORKOS_COOKIE_PASSWORD=<YOUR_COOKIE_PASSWORD>
   NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
   ```
   
   - Get your Client ID and API Key from the [WorkOS dashboard](https://dashboard.workos.com)
   - Generate a secure cookie password (at least 32 characters)

3. Run the development server:
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deployment
The application is deployed on Vercel: [https://se-interview-nextjs-app-zeta.vercel.app](https://se-interview-nextjs-app-zeta.vercel.app)


## Resources

- [WorkOS Widgets Documentation](https://workos.com/docs/user-management/widgets/user-management)
- [WorkOS User Management Guide](https://workos.com/docs/user-management)
- [Next.js Documentation](https://nextjs.org/docs)
