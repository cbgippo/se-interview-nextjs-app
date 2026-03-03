# WorkOS Authentication Application

A Next.js application that demonstrates comprehensive authentication with WorkOS AuthKit and multiple administrative widgets. This app provides organization admins with tools for user management, session monitoring, security settings, and profile management.

## Features

### **User Management Widget**
- Invite new users to the organization
- Remove users from the organization  
- Manage user roles and permissions
- View all organization members

### **User Sessions**
- Monitor active user sessions
- Track login history and device usage
- Manage session security

### **Security Settings**
- Configure organization security policies
- Manage authentication methods
- Monitor security events

### **User Profile**
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

## Architecture Notes

### Authentication
This application uses **WorkOS AuthKit** for authentication.

- Client components use `useAuth()` for session state (signed-in vs signed-out).
- Server/API routes use `withAuth()` / `authkit(request)` to authorize requests.

### Organization
Widgets require an `organizationId` context.

- `GET /api/organizations` returns only the organizations the current user belongs to (derived from WorkOS organization memberships).
- The widget pages use this list to select an organization context before requesting a widget token.

### Widget token generation
All widget tokens are generated server-side to avoid exposing the WorkOS API key in the browser.

- `POST /api/widget-token` requires:
  - `organizationId`
  - `widgetType` (`users_management`, `user_profile`, `user_sessions`, `user_security`)

Token scopes are applied minimally:
- The **Users Management** widget requires the `widgets:users-table:manage` permission.
- The **Profile / Sessions / Security** widgets do not require additional widget permissions.

### Home greeting `firstName` refresh
The greeting on the home page is intentionally sourced from a **fresh user lookup** instead of only using the client session snapshot.

- `GET /api/me` queries WorkOS User Management for the latest user record and returns minimal profile data (`firstName`).
- `src/app/page.tsx` uses React Query (`useMe`) to fetch `/api/me` when signed in.
- React Query is configured to refetch on window focus, so the greeting updates after profile edits without adding any new UI.

### Current session ID
The Sessions widget accepts the current session id so it can properly identify the active session.

- `GET /api/session` returns the current `sessionId` from AuthKit.

### Error handling
API routes return JSON errors in the shape:

```json
{ "error": "..." }
```

Client components parse error payloads and display them in a Radix `Callout`.

### Deployment
The application is deployed on Vercel: [https://se-interview-nextjs-app-zeta.vercel.app](https://se-interview-nextjs-app-zeta.vercel.app)


## Resources

- [WorkOS Widgets Documentation](https://workos.com/docs/user-management/widgets/user-management)
- [WorkOS User Management Guide](https://workos.com/docs/user-management)
- [Next.js Documentation](https://nextjs.org/docs)
