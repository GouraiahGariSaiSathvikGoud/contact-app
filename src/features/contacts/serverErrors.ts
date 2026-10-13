export function rejectedFields(body: unknown): string[] {
  const detail = (body as { detail?: unknown } | undefined)?.detail;
  if (!Array.isArray(detail)) return [];
  const fields = detail.flatMap((item) => {
    const loc: unknown = item?.loc;
    return Array.isArray(loc) && loc[0] === "body" && typeof loc[1] === "string"
      ? [loc[1]]
      : [];
  });
  return [...new Set(fields)];
}