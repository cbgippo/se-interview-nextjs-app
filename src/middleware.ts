import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

// Match against the pages and API routes
export const config = { 
  matcher: [
    "/", 
    "/account/:path*", 
    "/api/:path*",
    "/user-management",
    "/profile", 
    "/sessions",
    "/security"
  ] 
};
