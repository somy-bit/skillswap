// app/api/zoom/callback/route.ts

import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/error?message=Missing code", req.url));
  }

  // Exchange code for access & refresh tokens
  const response = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.ZOOM_REDIRECT_URL!, // Must match the one registered
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Zoom token exchange failed:", error);
    return NextResponse.redirect(new URL("/error?message=Zoom auth failed", req.url));
  }

  const tokenData = await response.json();

  await adminDb
    .collection("users")
    .doc(userId)
    .set(
      {
        zoomAccessToken: tokenData.access_token,
        zoomRefreshToken: tokenData.refresh_token,
        zoomTokenExpiry: Date.now() + tokenData.expires_in * 1000,
      },
      { merge: true }
    );

  // Redirect user back to the session page or dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
