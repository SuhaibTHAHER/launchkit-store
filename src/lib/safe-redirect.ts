/**
 * Only ever allow redirecting to a same-site relative path (e.g. "/products/x").
 * Rejects absolute URLs and protocol-relative ones ("//evil.com") to avoid
 * turning ?next= into an open redirect.
 */
export function safeNextPath(next: string | undefined | null): string | undefined {
  if (!next) return undefined;
  if (!next.startsWith("/") || next.startsWith("//")) return undefined;
  return next;
}
