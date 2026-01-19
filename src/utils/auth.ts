const SESSION_KEY = 'work-planner-session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function isAuthenticated(): boolean {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return false;
  
  try {
    const { expires } = JSON.parse(session);
    if (Date.now() > expires) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function setSession(): void {
  const expires = Date.now() + SESSION_DURATION;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ expires }));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function checkPassword(password: string, storedPassword: string | null): boolean {
  if (!storedPassword) return true; // No password set yet
  return password === storedPassword;
}
