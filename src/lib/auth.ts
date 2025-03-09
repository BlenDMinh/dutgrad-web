import Cookies from "js-cookie";
import { LoginCredentials } from "@/schemas/auth";

// Token expiration time (15 minutes in seconds)
const ACCESS_TOKEN_EXPIRY = 15 * 60;
// Refresh token expiration (7 days)
const REFRESH_TOKEN_EXPIRY = 7;

// User can be authenticated with either accessToken or token
interface AuthTokensProps {
  accessToken: string;
}

// Set tokens in localStorage
export function setAuthTokens({ accessToken }: AuthTokensProps): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);

    // Set a cookie that middleware can access to know the user is authenticated
    Cookies.set("has-session", "true", { path: "/", sameSite: "strict" });
    // Optionally store the token in a cookie as well (for server-side access)
    Cookies.set("auth-token", accessToken, { path: "/", sameSite: "strict" });
  }
}

// Get access token
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

// Set access token only (used during refresh)
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);

    // Set a cookie that middleware can access to know the user is authenticated
    Cookies.set("has-session", "true", { path: "/", sameSite: "strict" });
    // Optionally store the token in a cookie as well (for server-side access)
    Cookies.set("auth-token", token, { path: "/", sameSite: "strict" });
  }
}

// Clear auth tokens on logout
export function clearAuthTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");

    // Clear the auth cookies
    Cookies.remove("has-session", { path: "/" });
    Cookies.remove("auth-token", { path: "/" });
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const hasToken = !!getAccessToken();

  if (hasToken && typeof window !== "undefined") {
    // Ensure the cookie is set whenever we check auth and find a token
    Cookies.set("has-session", "true", { path: "/", sameSite: "strict" });
  }

  return hasToken;
}
