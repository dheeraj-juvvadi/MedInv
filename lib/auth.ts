import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'authToken';
export const SESSION_MAX_AGE_SECONDS = 60 * 60;

export interface SessionUser {
  username: string;
  employeeId: number;
}

const DEMO_JWT_SECRET = 'medinv-demo-session-secret';

function getSessionSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || DEMO_JWT_SECRET;
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser> {
  const { payload } = await jwtVerify(token, getSessionSecret());
  return payload as unknown as SessionUser;
}
