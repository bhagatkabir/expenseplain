// Thin fetch wrapper around the FastAPI backend (see backend/app/api/routes).
// Query hooks (src/hooks/queries) are the only callers of this module.

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// FastAPI's default error body is `{ detail: string }`, but pydantic
// validation failures (422) shape `detail` as a list of `{ msg, loc, ... }`
// objects instead — normalize both into one human-readable string.
function extractErrorMessage(data: unknown): string {
  if (data && typeof data === "object" && "detail" in data) {
    const detail = (data as { detail: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((entry) =>
          entry && typeof entry === "object" && "msg" in entry
            ? String((entry as { msg: unknown }).msg)
            : String(entry)
        )
        .join(" ");
    }
  }
  return "Something went wrong. Please try again.";
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string | null;
};

async function request<TResponse>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<TResponse> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      0
    );
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data), response.status);
  }

  return data as TResponse;
}

export const apiClient = {
  get: <TResponse>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<TResponse>(path, { ...options, method: "GET" }),
  post: <TResponse>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<TResponse>(path, { ...options, method: "POST", body }),
};
