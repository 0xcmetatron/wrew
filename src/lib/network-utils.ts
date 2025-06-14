// Network utilities for better error handling and fallback logic

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public status?: number,
    public isTimeout?: boolean,
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

// Enhanced fetch with timeout and better error handling
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new NetworkError("Request timeout", undefined, true);
    }

    throw new NetworkError(
      error instanceof Error ? error.message : "Network request failed",
    );
  }
}

// Safe JSON parsing
export async function safeJsonParse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text || text.trim() === "") {
    throw new NetworkError("Empty response body");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    // If it's HTML (like a 404 page), extract meaningful info
    if (text.includes("<html") || text.includes("<!DOCTYPE")) {
      if (text.includes("404") || text.includes("Not Found")) {
        throw new NetworkError("API endpoint not found (404)", 404);
      }
      if (text.includes("500") || text.includes("Internal Server Error")) {
        throw new NetworkError("Server error (500)", 500);
      }
      throw new NetworkError("Server returned HTML instead of JSON");
    }

    throw new NetworkError(
      `Invalid JSON response: ${text.substring(0, 100)}...`,
    );
  }
}

// Check if we're in development environment
export function isDevelopmentEnvironment(): boolean {
  return (
    import.meta.env.DEV ||
    import.meta.env.MODE === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.port !== ""
  );
}

// Safe API call with automatic fallback to mock
export async function safeApiCall<T>(
  url: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<T>,
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      if (response.status === 404 && mockFallback) {
        console.log(`API endpoint ${url} not found, using mock fallback`);
        return await mockFallback();
      }

      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await safeJsonParse<{
          error?: string;
          message?: string;
        }>(response);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Keep the HTTP status message if JSON parsing fails
      }

      throw new NetworkError(errorMessage, response.status);
    }

    return await safeJsonParse<T>(response);
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }

    // For any other network errors, try mock fallback if available
    if (
      mockFallback &&
      (error instanceof TypeError ||
        (error instanceof Error && error.message.includes("fetch")))
    ) {
      console.log(
        `Network error for ${url}, using mock fallback:`,
        error.message,
      );
      return await mockFallback();
    }

    throw new NetworkError(
      error instanceof Error ? error.message : "Unknown network error",
    );
  }
}
