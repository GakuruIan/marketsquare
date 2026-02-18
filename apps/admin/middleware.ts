import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // const isLoginRoute = req.nextUrl.pathname.startsWith("/login");
  // if (!isLoginRoute) return NextResponse.next();

  // try {

  //   const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/me`, {
  //     headers: {
  //       cookie: req.headers.get("cookie") || "",
  //     },
  //     cache: "no-store", 
  //   });

  
  //   if (res.ok) {
  //     return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }

  //   return NextResponse.next();
  // } catch (err) {
  //   return NextResponse.next();
  // }
}

export const config = {
  matcher: ["/login"],
};