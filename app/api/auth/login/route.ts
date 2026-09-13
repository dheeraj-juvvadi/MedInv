import { NextRequest, NextResponse } from "next/server";
import { executeQuery, getCurrentDeploymentMode } from "@/lib/mysql"; // Using path alias for Next.js context
import bcrypt from "bcryptjs";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }

    // Find the staff account by username
    // Select only existing columns
    const query =
      "SELECT username, password, employee_id FROM StaffAccount WHERE username = ?";
    console.log(
      `[Login] Attempting login for user: ${username} in mode: ${getCurrentDeploymentMode()}`,
    );

    const users = await executeQuery<any[]>(query, [username]);

    if (users.length === 0) {
      console.log(`[Login] User not found: ${username}`);
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 },
      ); // User not found
    }

    const user = users[0];

    // --- Password Verification ---

    let passwordMatch = false;

    // Check if the password is hashed (bcrypt passwords start with $2a$ or $2b$)
    const isPasswordHashed =
      user.password.startsWith("$2a$") || user.password.startsWith("$2b$");

    if (!isPasswordHashed) {
      // Sample demo accounts retain plaintext passwords; seeded accounts use bcrypt.
      passwordMatch = password === user.password;
    } else {
      // If password is hashed, use bcrypt
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatch) {
      // Passwords don't match
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 },
      );
    }
    // --- End Password Verification ---

    const payload = {
      username: user.username,
      // role: user.role, // Column does not exist
      employeeId: user.employee_id,
    };

    const token = await createSessionToken(payload);

    // Prepare response
    const { password: _, ...userInfo } = user; // Exclude password from response data
    const response = NextResponse.json(
      { message: "Login successful", user: userInfo },
      { status: 200 },
    );

    // Set the JWT as an HTTP-only cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF
      path: "/", // Cookie available across the site
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    // --- End Session/Token Generation ---

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
