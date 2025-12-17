import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/.well-known/farcaster.json") {
    const url = req.nextUrl.clone();
    url.pathname = "/api/farcaster";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/.well-known/farcaster.json"],
};
