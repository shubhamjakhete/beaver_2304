/**
 * Typed fetch helpers for the PHP/MySQL API.
 *
 * NEXT_PUBLIC_API_URL is baked into the static bundle at build time.
 * Locally, set it in .env.local (see .env.local.example).
 * In CI, it is injected via GitHub Secrets.
 *
 * Example: NEXT_PUBLIC_API_URL=https://bew-p2304.com/projects/2304/api
 */

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // non-JSON error body — keep the default message
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

// ─── Core fetch wrappers ────────────────────────────────────────────────────

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<T>(res);
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPut<T>(
  endpoint: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<T>(res);
}
