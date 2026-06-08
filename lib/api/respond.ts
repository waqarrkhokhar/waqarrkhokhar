import { NextResponse } from "next/server";

/** Standard success/list/action response helpers (API Spec conventions). */

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function action(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ success: true, message, ...extra });
}

export function paginated<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number },
) {
  return NextResponse.json({
    data,
    pagination: {
      ...pagination,
      totalPages: Math.max(1, Math.ceil(pagination.total / pagination.limit)),
    },
  });
}

/** Parse shared list query params (?page, &limit, &sort, &order). */
export function parseListParams(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10) || 20),
  );
  const sort = url.searchParams.get("sort") || "created_at";
  const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";
  return { page, limit, sort, order, offset: (page - 1) * limit };
}
