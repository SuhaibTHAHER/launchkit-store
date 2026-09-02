const STYLES: Record<string, string> = {
  completed: "border-positive/40 bg-positive/10 text-positive",
  pending: "border-border text-muted-foreground",
  refunded: "border-negative/40 bg-negative/10 text-negative",
};

export function StatusStamp({
  status,
  children,
}: {
  status: "completed" | "pending" | "refunded" | string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`label inline-flex items-center border px-2 py-0.5 text-[10px] ${
        STYLES[status] ?? STYLES.pending
      }`}
    >
      {children}
    </span>
  );
}
