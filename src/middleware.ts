export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/host/:path*",
    "/member/:path*",
    "/superadmin/:path*",
    "/profile/:path*",
    "/coach/:path*",
    "/social-admin/:path*"
  ]
};
