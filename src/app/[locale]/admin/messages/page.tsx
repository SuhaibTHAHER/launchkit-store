import type { Metadata } from "next";
import { getContactMessages } from "@/lib/admin-data";
import { MessageReadToggle } from "@/components/admin/message-read-toggle";
import { noIndex } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Messages — Admin", robots: noIndex };
}

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form submissions from the storefront.
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    {msg.name} <span className="text-sm text-muted-foreground">— {msg.email}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="label text-[10px] text-muted-foreground">{msg.reason}</span>
                    <span className="text-xs text-muted-foreground">
                      {dateFormatter.format(new Date(msg.created_at))}
                    </span>
                  </div>
                </div>
                <MessageReadToggle id={msg.id} read={msg.read} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
