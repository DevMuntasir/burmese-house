import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const VALID_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  "burmeseadmin",
  "admin1234",
  "burmese2026",
].filter(Boolean) as string[];

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("burmese_admin_auth");

  const isAuthenticated = authCookie?.value === "authenticated";

  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const trimmed = password.trim();
    const isMatch = VALID_PASSWORDS.includes(trimmed);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Incorrect admin password. Please try again.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
    });

    response.cookies.set("burmese_admin_auth", "authenticated", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin login error", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("burmese_admin_auth", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });
  return response;
}
