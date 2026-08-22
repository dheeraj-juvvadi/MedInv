import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, getCurrentDeploymentMode } from '@/lib/mysql'; // Using path alias for Next.js context
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ message: 'Authentication is not configured' }, { status: 503 });
    }

    // Find the staff account by username
    // Select only existing columns
    const query = 'SELECT username, password, employee_id FROM StaffAccount WHERE username = ? LIMIT 1';
    
    const users = await executeQuery<any[]>(query, [username]);
    if (users.length === 0) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 }); // User not found
    }

    const user = users[0];

    // --- Password Verification ---
    // Check the deployment mode
    const deploymentMode = getCurrentDeploymentMode();
    
    let passwordMatch = false;
    
    // Check if the password is hashed (bcrypt passwords start with $2a$ or $2b$)
    const isPasswordHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
    
    if (deploymentMode === 'demo' || !isPasswordHashed) {
      // In demo mode or if password is plaintext, compare directly
      passwordMatch = password === user.password;
    } else {
      // If password is hashed, use bcrypt
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatch) {
      // Passwords don't match
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
    // --- End Password Verification ---

    // --- Session/Token Generation ---
    const expiresIn = '1h'; // Token expiration time

    const payload = {
      username: user.username,
      // role: user.role, // Column does not exist
      employeeId: user.employee_id,
    };

    // Sign the token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: 60 * 60 });

    // Prepare response
    const { password: _, ...userInfo } = user; // Exclude password from response data
    const response = NextResponse.json({ message: 'Login successful', user: userInfo }, { status: 200 });

    // Set the JWT as an HTTP-only cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF
      path: '/', // Cookie available across the site
      maxAge: 60 * 60, // 1 hour in seconds (matches token expiry)
    });
    // --- End Session/Token Generation ---

    return response;

  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
