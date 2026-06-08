"use client";

/** Minimal typed fetch helpers for dashboard client components. */

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function apiGet<T>(url: string): Promise<Result<T>> {
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error ?? "Request failed" };
    return { ok: true, data: json as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<Result<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: json.error ?? "Request failed" };
    return { ok: true, data: json as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
