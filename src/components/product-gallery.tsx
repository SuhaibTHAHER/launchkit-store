"use client";

import { useState } from "react";
import Image from "next/image";
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
              aria-label={pick(image.label, locale)}
              onClick={() => setActive(index)}
              className={`overflow-hidden border-2 transition-colors ${
                active === index ? "border-accent" : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={image.src}
                alt={pick(image.alt, locale)}
                width={112}
                height={70}
                className="h-[70px] w-28 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
