"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { Container } from "@/components/container";
import { generalFaq, type FaqItem } from "@/lib/faq";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";

export function FAQ({
  items = generalFaq,
  title,
  id = "faq",
}: {
  items?: FaqItem[];
  title: string;
  id?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const locale = useLocale() as Locale;

  return (
    <section id={id} className="border-t border-border py-20 sm:py-28">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h2 className="balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>

        <dl className="mt-12 divide-y divide-border border-t border-border">
          {items.map((item, index) => {
            const open = openIndex === index;
            const question = pick(item.question, locale);
            return (
              <div key={question}>
                <dt>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-expanded={open}
                  >
                    <span className="font-medium text-foreground">{question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </dt>
                {open && (
                  <dd className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {pick(item.answer, locale)}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
