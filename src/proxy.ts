import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 renomeou "middleware" pra "proxy" (mesmo mecanismo, nome novo).
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/companies/:path*",
    "/contacts/:path*",
    "/opportunities/:path*",
    "/pipelines/:path*",
    "/settings/:path*",
  ],
};
