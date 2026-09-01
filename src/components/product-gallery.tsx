"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ProductScreenshot } from "@/components/product-screenshot";
import { pick } from "@/lib/localized";
import type { Locale } from "@/i18n/routing";
import type { GalleryImage } from "@/lib/products";

export function ProductGallery({ gallery }: { gallery: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const locale = useLocale() as Locale;
  const current = gallery[active];

  return (
    <div>
      <ProductScreenshot
        src={current.src}
        alt={pick(current.alt, locale)}
        width={current.width}
        height={current.height}
        priority
      />
      {gallery.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Product preview">
          {gallery.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                active === index
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {pick(image.label, locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
