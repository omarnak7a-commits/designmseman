import { getTeacher, saveTeacher } from "./store";
import type { Teacher } from "./types";

const SESSION_KEY = "ty_session";

export function login(email: string, password: string): boolean {
  const teacher = getTeacher();
  if (
    email.trim().toLowerCase() === teacher.email.toLowerCase() &&
    password === teacher.passwordHash
  ) {
    localStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(SESSION_KEY) === "1";
}

export function updateTeacher(updates: Partial<Teacher>) {
  const teacher = getTeacher();
  saveTeacher({ ...teacher, ...updates });
}

export function changePassword(current: string, newPass: string): boolean {
  const teacher = getTeacher();
  if (teacher.passwordHash !== current) return false;
  saveTeacher({ ...teacher, passwordHash: newPass });
  return true;
}
