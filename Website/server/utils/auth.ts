// Simple session-based authentication
// In production, use proper session management or JWT

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export interface AuthSession {
  username: string;
  authenticated: boolean;
  expiresAt: number;
}

// In-memory session store (in production, use Redis or database)
const sessions = new Map<string, AuthSession>();

// Generate session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Verify credentials
export const verifyCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
};

// Create session
export const createSession = (username: string): string => {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(sessionId, {
    username,
    authenticated: true,
    expiresAt,
  });
  return sessionId;
};

// Verify session
export const verifySession = (sessionId: string): boolean => {
  const session = sessions.get(sessionId);
  if (!session) return false;
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return false;
  }
  
  return session.authenticated;
};

// Destroy session
export const destroySession = (sessionId: string): void => {
  sessions.delete(sessionId);
};

// Clean expired sessions (run periodically)
export const cleanExpiredSessions = (): void => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
};

// Run cleanup every hour
setInterval(cleanExpiredSessions, 60 * 60 * 1000);

