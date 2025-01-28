import { NextResponse } from "next/server";
import { decodeToken } from "@/lib/auth";

export function middleware(req) {
  if (token) {
    const role = decodeToken(token);

    // Restrict access to /admin for non-admin users
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url)); // Redirect non-admins to the unauthorized page
    }

    return NextResponse.next(); // Allow access for admin users
  } else {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if no token is found
  }
}

// Apply the middleware only to the /admin path
export const config = {
  matcher: ["/admin/:path*"],
};
