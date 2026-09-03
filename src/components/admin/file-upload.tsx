"use client";

import { useActionState } from "react";
import { Loader2, Check, UploadCloud } from "lucide-react";
import { uploadProductFileAction, type UploadFileState } from "@/lib/actions/admin-downloads";

export function FileUpload({ slug, hasFile }: { slug: string; hasFile: boolean }) {
  const [state, formAction, pending] = useActionState<UploadFileState, FormData>(
    uploadProductFileAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="slug" value={slug} />
      <input
        type="file"
        name="file"
        accept=".zip"
        required
        className="text-sm text-foreground file:mr-3 file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
        Upload
      </button>
      {state && "error" in state && <span className="text-xs text-negative">{state.error}</span>}
      {!pending && state && "success" in state && (
        <span className="inline-flex items-center gap-1 text-xs text-positive">
          <Check className="size-3.5" />
          Uploaded
        </span>
      )}
      {!state && hasFile && (
        <span className="text-xs text-muted-foreground">A file is already uploaded — choosing a new one replaces it.</span>
      )}
    </form>
  );
}
