const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isAuthOrPublicEndpoint =
    endpoint.includes("/auth/register") ||
    endpoint.includes("/auth/login") ||
    endpoint.includes("/auth/refresh") ||
    endpoint.includes("/auth/verify-email") ||
    endpoint.includes("/auth/password-reset") ||
    endpoint.includes("/public/");

  // Only attach Bearer token if NOT an unauthenticated/auth endpoint
  const token =
    !isAuthOrPublicEndpoint && typeof window !== "undefined"
      ? localStorage.getItem("kinkeep_access_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // Include cookies for HTTP-only JWTs
    });

    const data = await res.json();

    // Auto-clean stale or expired tokens from local storage
    if (
      !res.ok &&
      typeof window !== "undefined" &&
      (data.error?.message?.toLowerCase().includes("token has expired") ||
        data.error?.code === "AUTHENTICATION_FAILED")
    ) {
      localStorage.removeItem("kinkeep_access_token");
      localStorage.removeItem("kinkeep_refresh_token");
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error.message || "Failed to connect to the server.",
      },
    };
  }
}
