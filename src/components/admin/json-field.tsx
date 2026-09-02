export function JsonField({
  name,
  label,
  defaultValue,
  error,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: unknown;
  error?: string;
  rows?: number;
}) {
  const text = defaultValue !== undefined ? JSON.stringify(defaultValue, null, 2) : "";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <textarea
        name={name}
        defaultValue={text}
        rows={rows}
        spellCheck={false}
        dir="ltr"
        className={`w-full rounded-lg border bg-surface px-3 py-2 font-mono text-xs leading-relaxed ${
          error ? "border-negative" : "border-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-negative">{error}</p>}
    </label>
  );
}
