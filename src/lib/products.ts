import type { Localized } from "./localized";

export type ProductFaqItem = {
  question: Localized<string>;
  answer: Localized<string>;
};

export type GalleryImage = {
  src: string;
  alt: Localized<string>;
  label: Localized<string>;
  width: number;
  height: number;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  notes: Localized<string[]>;
};

export type HowItWorksStep = {
  title: Localized<string>;
  description: Localized<string>;
};

export type Product = {
  id: string;
  slug: string;
  name: Localized<string>;
  tagline: Localized<string>;
  description: Localized<string>;
  whoItsFor: Localized<string>;
  whoItsNotFor: Localized<string>;
  categorySlug: "marketing-sites" | "dashboard-ui-kits" | "ui-kits" | "bundles";
  price: number;
  originalPrice?: number;
  /** Live URL of the running demo. Points at local dev ports for now —
   *  swap for real deployed URLs before launch (see README). */
  demoUrl: string;
  gallery: GalleryImage[];
  tags: string[];
  featured: boolean;
  createdAt: string;
  version: string;
  lastUpdated: string;
  /** Paddle Price ID for checkout — replace with real IDs from your Paddle
   *  dashboard (Catalog → Products → Prices) before going live. */
  paddlePriceId: string;
  features: Localized<{ title: string; description: string }[]>;
  includes: Localized<string[]>;
  notIncluded: Localized<string[]>;
  pagesIncluded?: string[];
  componentsIncluded?: string[];
  fileTree: string;
  techStack: string[];
  requirements: Localized<string[]>;
  howItWorks: HowItWorksStep[];
  changelog: ChangelogEntry[];
  faq: ProductFaqItem[];
};

export const products: Product[] = [
  {
    id: "launchkit-ai",
    slug: "launchkit-ai",
    name: { en: "Launchkit AI", ar: "Launchkit AI" },
    tagline: {
      en: "A Next.js marketing site template for AI and SaaS products.",
      ar: "قالب موقع تسويقي بتقنية Next.js لمنتجات AI وSaaS.",
    },
    description: {
      en: "A full marketing page — hero, features, workflow, pricing, testimonials, FAQ — built on Next.js 16, TypeScript, and Tailwind CSS 4. Ships with light/dark mode and a mobile nav out of the box, so you can swap in your own copy and screenshots and launch the same day.",
      ar: "صفحة تسويقية كاملة — Hero، مزايا، آلية عمل، تسعير، آراء عملاء، أسئلة شائعة — مبنية بـ Next.js 16 وTypeScript وTailwind CSS 4. تأتي بوضع فاتح/داكن وقائمة موبايل جاهزة، فقط بدّل النصوص والصور وأطلق موقعك بنفس اليوم.",
    },
    whoItsFor: {
      en: "Solo founders and small teams who have a working product (or an API worth showing off) and need a credible marketing site before their first launch post.",
      ar: "المؤسسون المستقلون والفرق الصغيرة اللي عندهم منتج شغّال (أو API يستاهل يتعرض) ومحتاجين موقع تسويقي موثوق قبل أول منشور إطلاق.",
    },
    whoItsNotFor: {
      en: "Teams that need e-commerce, a blog with dozens of authors, or heavy CMS-driven content — this is a focused, code-first marketing page, not a general-purpose website builder.",
      ar: "الفرق اللي محتاجة متجر إلكتروني، أو مدونة بعشرات الكتّاب، أو محتوى معتمد بشكل كبير على CMS — هذا موقع تسويقي مركّز يعتمد على الكود، مش أداة بناء مواقع عامة.",
    },
    categorySlug: "marketing-sites",
    price: 29,
    demoUrl: "http://localhost:49770",
    gallery: [
      {
        src: "/products/launchkit-ai-light.png",
        alt: { en: "Launchkit AI homepage, light mode", ar: "الصفحة الرئيسية لـ Launchkit AI، الوضع الفاتح" },
        label: { en: "Homepage — Light", ar: "الرئيسية — فاتح" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ai-dark.png",
        alt: { en: "Launchkit AI homepage, dark mode", ar: "الصفحة الرئيسية لـ Launchkit AI، الوضع الداكن" },
        label: { en: "Homepage — Dark", ar: "الرئيسية — داكن" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ai-features.png",
        alt: { en: "Launchkit AI features section", ar: "قسم المزايا في Launchkit AI" },
        label: { en: "Features section", ar: "قسم المزايا" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ai-mobile.png",
        alt: { en: "Launchkit AI on a mobile screen", ar: "Launchkit AI على شاشة موبايل" },
        label: { en: "Mobile", ar: "موبايل" },
        width: 390,
        height: 844,
      },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Dark mode", "Marketing site"],
    featured: true,
    createdAt: "2026-09-01",
    version: "1.0.0",
    lastUpdated: "2026-09-01",
    paddlePriceId: "pri_replace_with_launchkit_ai_price_id",
    features: {
      en: [
        { title: "Full marketing page", description: "Hero, features, workflow, pricing, testimonials, FAQ, and CTA — every section a real buyer expects, already written and laid out." },
        { title: "Light and dark mode", description: "Follows the visitor's system preference automatically, with a manual toggle. Every color is a token, not a hardcoded hex." },
        { title: "Responsive mobile navigation", description: "A real slide-down menu with focus handling, not a hidden desktop nav squeezed onto a phone." },
        { title: "Accessible by default", description: "Visible focus states, aria labels on every interactive element, and reduced-motion support — checked with a keyboard, not just a mouse." },
        { title: "Zero UI dependencies", description: "Tailwind and lucide-react icons only. No component library to learn, no bundle bloat to explain to your ops team." },
      ],
      ar: [
        { title: "صفحة تسويقية كاملة", description: "Hero، مزايا، آلية عمل، تسعير، آراء عملاء، أسئلة شائعة، ودعوة إجراء — كل قسم يتوقعه مشتري حقيقي، مكتوب ومصمم مسبقًا." },
        { title: "وضع فاتح وداكن", description: "يتبع تفضيل نظام الزائر تلقائيًا، مع زر تبديل يدوي. كل لون عبارة عن Token، مش قيمة hex ثابتة." },
        { title: "قائمة تنقّل متجاوبة للموبايل", description: "قائمة منسدلة حقيقية بإدارة تركيز صحيحة، مش قائمة سطح مكتب مخفية مضغوطة على شاشة موبايل." },
        { title: "وصولية افتراضية", description: "حالات تركيز واضحة، aria labels على كل عنصر تفاعلي، ودعم تقليل الحركة — تم فحصها بلوحة المفاتيح، مش بس بالماوس." },
        { title: "بدون اعتماديات واجهة إضافية", description: "Tailwind وأيقونات lucide-react بس. ما في مكتبة مكوّنات تتعلمها، وما في حجم زائد تفسّره لفريق العمليات." },
      ],
    },
    includes: {
      en: [
        "Full Next.js 16 + TypeScript source code",
        "Documented, editable design tokens for colors and fonts",
        "README with setup and customization guide",
        "12 months of updates",
      ],
      ar: [
        "الكود المصدري الكامل بـ Next.js 16 وTypeScript",
        "نظام Design Tokens موثّق وقابل للتعديل للألوان والخطوط",
        "ملف README بدليل تثبيت وتخصيص كامل",
        "12 شهرًا من التحديثات",
      ],
    },
    notIncluded: {
      en: ["Hosting or a domain", "A backend or database", "Stock photos or custom illustrations", "Ongoing design or development work"],
      ar: ["استضافة أو نطاق", "Backend أو قاعدة بيانات", "صور جاهزة أو رسومات مخصصة", "عمل تصميم أو تطوير مستمر"],
    },
    pagesIncluded: ["Home", "Pricing (section)", "FAQ (section)", "404"],
    componentsIncluded: [
      "Navbar (desktop + mobile)",
      "Hero",
      "Logo cloud",
      "Feature grid",
      "Workflow steps",
      "Pricing cards",
      "Testimonials",
      "FAQ accordion",
      "CTA banner",
      "Footer",
      "Theme toggle",
    ],
    fileTree: `launchkit-ai/
├── src/
│   ├── app/            (layout, page, globals.css)
│   └── components/     (11 components, one per section)
├── public/
├── README.md
├── LICENSE.md
└── CHANGELOG.md`,
    techStack: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS 4", "next-themes", "lucide-react"],
    requirements: {
      en: ["Node.js 20.9 or later", "Basic familiarity with React and Tailwind CSS"],
      ar: ["Node.js إصدار 20.9 أو أحدث", "إلمام أساسي بـ React وTailwind CSS"],
    },
    howItWorks: [
      {
        title: { en: "Download", ar: "التحميل" },
        description: { en: "Get the .zip from your receipt email or account page.", ar: "حمّل ملف .zip من رسالة الإيصال أو صفحة حسابك." },
      },
      {
        title: { en: "Install dependencies", ar: "تثبيت الاعتماديات" },
        description: { en: "Unzip, then run npm install in the project folder.", ar: "فك الضغط، وشغّل npm install بمجلد المشروع." },
      },
      {
        title: { en: "Customize", ar: "التخصيص" },
        description: { en: "Edit the color tokens in globals.css and the copy in each component.", ar: "عدّل ألوان الـ Tokens بملف globals.css والنصوص بكل مكوّن." },
      },
      {
        title: { en: "Deploy", ar: "النشر" },
        description: { en: "npm run build, then deploy to Vercel or any Next.js host.", ar: "شغّل npm run build، وانشر على Vercel أو أي مزوّد يدعم Next.js." },
      },
    ],
    changelog: [
      {
        version: "1.0.0",
        date: "2026-09-01",
        notes: {
          en: ["Initial release: full marketing page, light/dark mode, mobile nav, accessibility pass."],
          ar: ["الإصدار الأول: صفحة تسويقية كاملة، وضع فاتح/داكن، قائمة موبايل، مراجعة وصولية."],
        },
      },
    ],
    faq: [
      {
        question: { en: "Can I remove sections I don't need?", ar: "هل أقدر أحذف أقسام ما بحتاجها؟" },
        answer: {
          en: "Yes — every section is a separate component imported into one page file. Delete the import and the line that renders it.",
          ar: "أكيد — كل قسم مكوّن منفصل يُستدعى داخل ملف صفحة واحد. احذف سطر الاستيراد والسطر اللي بيعرضه بس.",
        },
      },
      {
        question: { en: "Does it come with real images?", ar: "هل يأتي بصور حقيقية؟" },
        answer: {
          en: "The hero visual is built from CSS/HTML, not a screenshot, so it never looks stale. Swap in your own product screenshot or video whenever you have one.",
          ar: "رسمة الـ Hero مبنية بـ CSS/HTML مش لقطة شاشة، فما بتصير قديمة الشكل أبدًا. بدّلها بلقطة شاشة أو فيديو حقيقي لمنتجك أي وقت يصير جاهز.",
        },
      },
      {
        question: { en: "Is the screenshot above the actual template, or a mockup?", ar: "هل الصورة فوق هي القالب الفعلي، ولا مجرد Mockup؟" },
        answer: {
          en: "It's a real screenshot of the template running — what you see in the gallery is exactly what you get.",
          ar: "هي لقطة شاشة حقيقية للقالب وهو شغّال — اللي بتشوفه بالمعرض هو بالضبط اللي رح تستلمه.",
        },
      },
    ],
  },
  {
    id: "launchkit-dashboard",
    slug: "launchkit-dashboard",
    name: { en: "Launchkit Dashboard", ar: "Launchkit Dashboard" },
    tagline: {
      en: "A Next.js admin dashboard template with real, working UI.",
      ar: "قالب لوحة تحكم إدارية بتقنية Next.js بواجهة شغالة فعليًا.",
    },
    description: {
      en: "The console your product needs after someone signs up: sidebar navigation, stat cards, a dependency-free bar chart, a searchable data table, and a tabbed settings page with working toggles — not static mockup images. Built on the same design system as Launchkit AI.",
      ar: "اللوحة اللي منتجك بيحتاجها بعد ما حدا يسجّل حساب: قائمة تنقّل جانبية، بطاقات إحصائيات، رسم بياني بدون مكتبات خارجية، جدول بيانات قابل للبحث، وصفحة إعدادات بتبويبات ومفاتيح تبديل شغالة فعليًا — مش صور Mockup ثابتة. مبنية على نفس نظام تصميم Launchkit AI.",
    },
    whoItsFor: {
      en: "Founders who already have paying users typing into an unstyled admin panel, and need a credible app shell without hiring a designer first.",
      ar: "المؤسسين اللي أصلًا عندهم مستخدمين دافعين عم يستخدموا لوحة إدارة بدون تنسيق، ومحتاجين هيكل تطبيق موثوق بدون ما يوظفوا مصمم الأول.",
    },
    whoItsNotFor: {
      en: "Products that need a highly specialized dashboard (e.g. a trading terminal or a CAD tool) — this covers the common 80%: overview, a data table, and settings.",
      ar: "المنتجات اللي محتاجة لوحة متخصصة جدًا (متل منصة تداول أو أداة CAD) — هاد بيغطي الـ80% الشائعة: نظرة عامة، جدول بيانات، وإعدادات.",
    },
    categorySlug: "dashboard-ui-kits",
    price: 39,
    demoUrl: "http://localhost:3001",
    gallery: [
      {
        src: "/products/launchkit-dashboard-light.png",
        alt: { en: "Launchkit Dashboard overview page, light mode", ar: "صفحة النظرة العامة في Launchkit Dashboard، الوضع الفاتح" },
        label: { en: "Overview — Light", ar: "نظرة عامة — فاتح" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-dashboard-dark.png",
        alt: { en: "Launchkit Dashboard overview page, dark mode", ar: "صفحة النظرة العامة في Launchkit Dashboard، الوضع الداكن" },
        label: { en: "Overview — Dark", ar: "نظرة عامة — داكن" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-dashboard-contacts.png",
        alt: { en: "Launchkit Dashboard contacts table", ar: "جدول جهات الاتصال في Launchkit Dashboard" },
        label: { en: "Contacts table", ar: "جدول جهات الاتصال" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-dashboard-settings.png",
        alt: { en: "Launchkit Dashboard settings page", ar: "صفحة الإعدادات في Launchkit Dashboard" },
        label: { en: "Settings", ar: "الإعدادات" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-dashboard-mobile.png",
        alt: { en: "Launchkit Dashboard on a mobile screen", ar: "Launchkit Dashboard على شاشة موبايل" },
        label: { en: "Mobile", ar: "موبايل" },
        width: 390,
        height: 844,
      },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Dark mode", "Dashboard"],
    featured: true,
    createdAt: "2026-09-01",
    version: "1.0.0",
    lastUpdated: "2026-09-01",
    paddlePriceId: "pri_replace_with_launchkit_dashboard_price_id",
    features: {
      en: [
        { title: "Overview with a real chart", description: "Stat cards and a bar chart rendered from plain data — resize the window and watch it actually respond." },
        { title: "Searchable contacts table", description: "Type in the search box and the table filters live — this is working React state, not a screenshot." },
        { title: "Tabbed settings with real toggles", description: "Profile, Notifications, and Billing tabs, with switches that actually flip and forms that actually submit." },
        { title: "Responsive sidebar", description: "Collapses into a slide-over drawer on mobile, with correct focus handling and an overlay backdrop." },
        { title: "Light and dark mode", description: "Same token system as Launchkit AI — buy both and re-theming one re-themes both." },
      ],
      ar: [
        { title: "نظرة عامة برسم بياني حقيقي", description: "بطاقات إحصائيات ورسم بياني معروض من بيانات عادية — غيّر حجم النافذة وشوفه يستجيب فعليًا." },
        { title: "جدول جهات اتصال قابل للبحث", description: "اكتب بمربع البحث والجدول بيفلتر مباشرة — هاي حالة React شغالة فعليًا، مش لقطة شاشة." },
        { title: "إعدادات بتبويبات ومفاتيح حقيقية", description: "تبويبات الملف الشخصي، الإشعارات، والفوترة، بمفاتيح تبديل بتشتغل فعليًا ونماذج بترسل فعليًا." },
        { title: "قائمة جانبية متجاوبة", description: "تتحول لدرج منزلق بالموبايل، بإدارة تركيز صحيحة وخلفية Overlay." },
        { title: "وضع فاتح وداكن", description: "نفس نظام Tokens متل Launchkit AI — اشترِ الاثنين وإعادة تلوين واحد بتلوّن التاني." },
      ],
    },
    includes: {
      en: [
        "Full Next.js 16 + TypeScript source code",
        "Editable navigation config — add pages by editing one array",
        "README with setup and customization guide",
        "12 months of updates",
      ],
      ar: [
        "الكود المصدري الكامل بـ Next.js 16 وTypeScript",
        "إعدادات تنقّل قابلة للتعديل — أضف صفحات بتعديل مصفوفة واحدة",
        "ملف README بدليل تثبيت وتخصيص كامل",
        "12 شهرًا من التحديثات",
      ],
    },
    notIncluded: {
      en: ["A backend, database, or authentication logic", "Real business data — every table and chart uses sample data you replace", "Hosting or a domain"],
      ar: ["Backend أو قاعدة بيانات أو منطق مصادقة", "بيانات أعمال حقيقية — كل جدول ورسم بياني يستخدم بيانات تجريبية تستبدلها", "استضافة أو نطاق"],
    },
    pagesIncluded: ["Overview", "Contacts", "Settings"],
    componentsIncluded: [
      "Sidebar (desktop + mobile drawer)",
      "Topbar with search",
      "Stat card",
      "Weekly bar chart",
      "Activity list",
      "Contacts data table",
      "Settings tabs",
      "Toggle switch",
      "Theme toggle",
    ],
    fileTree: `launchkit-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx          (Overview)
│   │   ├── contacts/page.tsx
│   │   └── settings/page.tsx
│   └── components/           (12 components)
├── public/
├── README.md
├── LICENSE.md
└── CHANGELOG.md`,
    techStack: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS 4", "next-themes", "lucide-react"],
    requirements: {
      en: ["Node.js 20.9 or later", "Basic familiarity with React and Tailwind CSS"],
      ar: ["Node.js إصدار 20.9 أو أحدث", "إلمام أساسي بـ React وTailwind CSS"],
    },
    howItWorks: [
      {
        title: { en: "Download", ar: "التحميل" },
        description: { en: "Get the .zip from your receipt email or account page.", ar: "حمّل ملف .zip من رسالة الإيصال أو صفحة حسابك." },
      },
      {
        title: { en: "Install dependencies", ar: "تثبيت الاعتماديات" },
        description: { en: "Unzip, then run npm install in the project folder.", ar: "فك الضغط، وشغّل npm install بمجلد المشروع." },
      },
      {
        title: { en: "Wire up your data", ar: "ربط بياناتك" },
        description: { en: "Replace the sample arrays at the top of each component with a real fetch or database call.", ar: "استبدل المصفوفات التجريبية بأعلى كل مكوّن باستدعاء حقيقي لقاعدة بيانات أو API." },
      },
      {
        title: { en: "Deploy", ar: "النشر" },
        description: { en: "npm run build, then deploy to Vercel or any Next.js host.", ar: "شغّل npm run build، وانشر على Vercel أو أي مزوّد يدعم Next.js." },
      },
    ],
    changelog: [
      {
        version: "1.0.0",
        date: "2026-09-01",
        notes: {
          en: ["Initial release: overview, contacts, and settings pages, responsive sidebar, light/dark mode."],
          ar: ["الإصدار الأول: صفحات النظرة العامة، جهات الاتصال، والإعدادات، قائمة جانبية متجاوبة، وضع فاتح/داكن."],
        },
      },
    ],
    faq: [
      {
        question: { en: "Is there a real charting library included?", ar: "هل يتضمن مكتبة رسوم بيانية حقيقية؟" },
        answer: {
          en: "No — the bar chart is plain divs sized by percentage, so there's zero chart-library weight. Swap in Recharts or Visx if you need more chart types.",
          ar: "لا — الرسم البياني عبارة عن عناصر div بسيطة بحجم نسبي، فما في أي وزن إضافي من مكتبات. بدّله بـ Recharts أو Visx إذا احتجت أنواع رسوم بيانية أكثر.",
        },
      },
      {
        question: { en: "How do I add a new page to the sidebar?", ar: "كيف أضيف صفحة جديدة للقائمة الجانبية؟" },
        answer: {
          en: "Add a route under src/app and one entry to src/components/nav-items.ts — the sidebar picks it up automatically.",
          ar: "أضف مسارًا جديدًا تحت src/app وسطرًا واحدًا بملف src/components/nav-items.ts — القائمة الجانبية بتلتقطه تلقائيًا.",
        },
      },
    ],
  },
  {
    id: "launchkit-complete",
    slug: "launchkit-complete",
    name: { en: "Launchkit Complete", ar: "Launchkit Complete" },
    tagline: {
      en: "Launchkit AI + Launchkit Dashboard, bundled and discounted.",
      ar: "Launchkit AI و Launchkit Dashboard معًا بسعر مخفّض.",
    },
    description: {
      en: "Everything you need to ship a SaaS product's site and app shell from one consistent design system: the marketing site that sells it and the dashboard that runs it. Buying both individually costs $68 — this bundle saves you $9 and includes every future template we ship this year.",
      ar: "كل شي بتحتاجه لإطلاق موقع منتج SaaS وهيكل التطبيق تبعه من نظام تصميم واحد متسق: الموقع التسويقي اللي بيبيعه، واللوحة اللي بتشغّله. شراؤهم منفصلين يكلّف $68 — هاي الباقة بتوفّر عليك $9 وبتشمل كل قالب جديد نطلقه هالسنة.",
    },
    whoItsFor: {
      en: "Anyone starting completely from scratch with a hard launch date, who wants the site and the app to share one design system from day one.",
      ar: "أي حدا عم يبلش من الصفر تمامًا وعنده موعد إطلاق صارم، وبده الموقع والتطبيق يشتركوا بنظام تصميم واحد من أول يوم.",
    },
    whoItsNotFor: {
      en: "If you only need one of the two right now, buy that one template individually and add the other later.",
      ar: "إذا بس محتاج وحدة من الاثنين هلأ، اشترِ هاي القالب لحاله وضيف التاني لاحقًا.",
    },
    categorySlug: "bundles",
    price: 59,
    originalPrice: 68,
    demoUrl: "http://localhost:49770",
    gallery: [
      {
        src: "/products/launchkit-ai-light.png",
        alt: { en: "Launchkit AI homepage", ar: "الصفحة الرئيسية لـ Launchkit AI" },
        label: { en: "Marketing site", ar: "الموقع التسويقي" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-dashboard-light.png",
        alt: { en: "Launchkit Dashboard overview", ar: "نظرة عامة على Launchkit Dashboard" },
        label: { en: "Dashboard", ar: "لوحة التحكم" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ai-dark.png",
        alt: { en: "Launchkit AI homepage, dark mode", ar: "الصفحة الرئيسية لـ Launchkit AI، الوضع الداكن" },
        label: { en: "Marketing site — Dark", ar: "الموقع التسويقي — داكن" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-dashboard-dark.png",
        alt: { en: "Launchkit Dashboard overview, dark mode", ar: "نظرة عامة على Launchkit Dashboard، الوضع الداكن" },
        label: { en: "Dashboard — Dark", ar: "لوحة التحكم — داكن" },
        width: 1280,
        height: 800,
      },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Bundle"],
    featured: true,
    createdAt: "2026-09-01",
    version: "1.0.0",
    lastUpdated: "2026-09-01",
    paddlePriceId: "pri_replace_with_launchkit_complete_price_id",
    features: {
      en: [
        { title: "Everything in Launchkit AI", description: "The full marketing site — see its own product page for the details." },
        { title: "Everything in Launchkit Dashboard", description: "The full app shell — see its own product page for the details." },
        { title: "One shared design system", description: "Both share one set of color and font tokens, so re-theming both takes one edit." },
        { title: "Priority email support", description: "Bundle buyers go to the front of the support queue." },
      ],
      ar: [
        { title: "كل شي بـ Launchkit AI", description: "الموقع التسويقي الكامل — راجع صفحة منتجه الخاصة للتفاصيل." },
        { title: "كل شي بـ Launchkit Dashboard", description: "هيكل التطبيق الكامل — راجع صفحة منتجه الخاصة للتفاصيل." },
        { title: "نظام تصميم مشترك واحد", description: "الاثنان يشتركان بمجموعة واحدة من ألوان وخطوط الـ Tokens، فإعادة تلوين الاثنين تحتاج تعديل واحد بس." },
        { title: "دعم بريد إلكتروني بأولوية", description: "مشتري الباقة بيروحوا لأول طابور الدعم الفني." },
      ],
    },
    includes: {
      en: [
        "Full source for both templates",
        "All future Launchkit templates released in 2026 at no extra cost",
        "README + customization guide for each template",
        "12 months of updates",
      ],
      ar: [
        "الكود المصدري الكامل للقالبين",
        "كل قالب Launchkit جديد يصدر خلال 2026 بدون أي تكلفة إضافية",
        "ملف README ودليل تخصيص لكل قالب",
        "12 شهرًا من التحديثات",
      ],
    },
    notIncluded: {
      en: ["Hosting, a domain, or a backend for either template", "Design or development work beyond the two templates"],
      ar: ["استضافة أو نطاق أو Backend لأي من القالبين", "عمل تصميم أو تطوير أبعد من القالبين"],
    },
    fileTree: `launchkit-complete/
├── launchkit-ai/         (full Launchkit AI project)
└── launchkit-dashboard/  (full Launchkit Dashboard project)`,
    techStack: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS 4", "next-themes", "lucide-react"],
    requirements: {
      en: ["Node.js 20.9 or later", "Basic familiarity with React and Tailwind CSS"],
      ar: ["Node.js إصدار 20.9 أو أحدث", "إلمام أساسي بـ React وTailwind CSS"],
    },
    howItWorks: [
      {
        title: { en: "Download", ar: "التحميل" },
        description: { en: "One .zip containing both projects, from your receipt email or account page.", ar: "ملف .zip واحد فيه المشروعين، من رسالة الإيصال أو صفحة حسابك." },
      },
      {
        title: { en: "Install each project", ar: "ثبّت كل مشروع" },
        description: { en: "npm install inside launchkit-ai/ and again inside launchkit-dashboard/ — they're independent projects.", ar: "شغّل npm install جوا launchkit-ai/ ومرة تانية جوا launchkit-dashboard/ — هم مشروعين مستقلين." },
      },
      {
        title: { en: "Match the branding", ar: "طابق الهوية البصرية" },
        description: { en: "Update the same color tokens in both globals.css files to keep them in sync.", ar: "حدّث نفس ألوان الـ Tokens بملفَي globals.css بالمشروعين عشان يبقوا متسقين." },
      },
      {
        title: { en: "Deploy both", ar: "انشر الاثنين" },
        description: { en: "Deploy the marketing site to your main domain and the dashboard to app.yourdomain.com (or similar).", ar: "انشر الموقع التسويقي عالنطاق الرئيسي واللوحة على app.yourdomain.com (أو مشابه)." },
      },
    ],
    changelog: [
      {
        version: "1.0.0",
        date: "2026-09-01",
        notes: {
          en: ["Initial bundle release, tracking Launchkit AI 1.0.0 and Launchkit Dashboard 1.0.0."],
          ar: ["إصدار الباقة الأول، متبوع بـ Launchkit AI 1.0.0 و Launchkit Dashboard 1.0.0."],
        },
      },
    ],
    faq: [
      {
        question: { en: "Do both templates share the same brand colors?", ar: "هل يشترك القالبان بنفس ألوان البراند؟" },
        answer: {
          en: "Yes — they're built on one design-token system, so changing the accent color in one place restyles both consistently.",
          ar: "أكيد — مبنيان على نظام Design Tokens واحد، فتغيير لون الـ accent بمكان واحد بيعيد تلوين الاثنين بشكل متسق.",
        },
      },
      {
        question: { en: "Will I get new templates automatically?", ar: "هل رح أستلم قوالب جديدة تلقائيًا؟" },
        answer: {
          en: "Yes, any Launchkit template released in 2026 is included in this bundle at no extra cost — you'll get an email when a new one ships.",
          ar: "نعم، أي قالب Launchkit يصدر خلال 2026 مشمول بهاي الباقة بدون أي تكلفة إضافية — رح توصلك رسالة إيميل عند صدور قالب جديد.",
        },
      },
    ],
  },
  {
    id: "launchkit-ui",
    slug: "launchkit-ui",
    name: { en: "Launchkit UI", ar: "Launchkit UI" },
    tagline: {
      en: "A Next.js component kit — 20+ real, working UI components.",
      ar: "طقم مكوّنات واجهة بتقنية Next.js — أكثر من 20 مكوّن شغّال فعليًا.",
    },
    description: {
      en: "Buttons, badges, cards, alerts, tabs, form inputs, a data table, a modal, and a tooltip — every component is the real, interactive thing, not a picture of it. Copy one file into your own project and it just works, styled from the same design tokens as Launchkit AI and Launchkit Dashboard.",
      ar: "أزرار، شارات، بطاقات، تنبيهات، تبويبات، حقول نماذج، جدول بيانات، نافذة منبثقة، وتلميح — كل مكوّن هو الشي الحقيقي التفاعلي، مش صورة له. انسخ ملف واحد لمشروعك وبيشتغل فورًا، بنفس ألوان Launchkit AI و Launchkit Dashboard.",
    },
    whoItsFor: {
      en: "Developers who want a real starting point for their own component library instead of building buttons and modals from a blank file.",
      ar: "المطورين اللي بدهم نقطة بداية حقيقية لمكتبة مكوّناتهم الخاصة بدل ما يبنوا الأزرار والنوافذ المنبثقة من ملف فاضي.",
    },
    whoItsNotFor: {
      en: "Teams that need a huge, exhaustive component system (data pickers, rich text editors, drag-and-drop) — this covers the 20 components almost every product actually uses.",
      ar: "الفرق اللي محتاجة نظام مكوّنات ضخم وشامل (منتقي بيانات، محرر نص غني، سحب وإفلات) — هاد بيغطي الـ20 مكوّن اللي تقريبًا كل منتج فعليًا بيستخدمهم.",
    },
    categorySlug: "ui-kits",
    price: 24,
    demoUrl: "http://localhost:3003",
    gallery: [
      {
        src: "/products/launchkit-ui-light.png",
        alt: { en: "Launchkit UI component kit, light mode", ar: "طقم مكوّنات Launchkit UI، الوضع الفاتح" },
        label: { en: "Overview — Light", ar: "نظرة عامة — فاتح" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ui-dark.png",
        alt: { en: "Launchkit UI component kit, dark mode", ar: "طقم مكوّنات Launchkit UI، الوضع الداكن" },
        label: { en: "Overview — Dark", ar: "نظرة عامة — داكن" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ui-table.png",
        alt: { en: "Launchkit UI data table component", ar: "مكوّن جدول البيانات في Launchkit UI" },
        label: { en: "Data table", ar: "جدول البيانات" },
        width: 1280,
        height: 800,
      },
      {
        src: "/products/launchkit-ui-mobile.png",
        alt: { en: "Launchkit UI on a mobile screen", ar: "Launchkit UI على شاشة موبايل" },
        label: { en: "Mobile", ar: "موبايل" },
        width: 390,
        height: 844,
      },
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Dark mode", "Components"],
    featured: true,
    createdAt: "2026-09-01",
    version: "1.0.0",
    lastUpdated: "2026-09-01",
    paddlePriceId: "pri_replace_with_launchkit_ui_price_id",
    features: {
      en: [
        { title: "20+ real components", description: "Buttons, badges, cards, alerts, tabs, inputs, table, modal, tooltip — every one interactive on the page, not a static picture." },
        { title: "Copy-paste, not install", description: "Each component is one self-contained file. Copy it into your project — no package to add, no version to manage." },
        { title: "Accessible interactions", description: "The modal traps and restores focus and closes on Escape; the tooltip works on keyboard focus, not just hover." },
        { title: "One shared token system", description: "Same colors and fonts as Launchkit AI and Launchkit Dashboard — mix and match without a re-theme." },
      ],
      ar: [
        { title: "أكثر من 20 مكوّن حقيقي", description: "أزرار، شارات، بطاقات، تنبيهات، تبويبات، حقول، جدول، نافذة منبثقة، تلميح — كل وحدة تفاعلية بالصفحة، مش صورة ثابتة." },
        { title: "نسخ ولصق، مش تثبيت", description: "كل مكوّن ملف واحد قائم بذاته. انسخه لمشروعك — بدون حزمة تضيفها، وبدون إصدار تديره." },
        { title: "تفاعلات بوصولية حقيقية", description: "النافذة المنبثقة بتحبس وترجّع التركيز وبتسكّر بـ Escape؛ التلميح بيشتغل بتركيز لوحة المفاتيح، مش بس بالتحويم." },
        { title: "نظام Tokens مشترك واحد", description: "نفس ألوان وخطوط Launchkit AI و Launchkit Dashboard — امزج بينهم بدون إعادة تلوين." },
      ],
    },
    includes: {
      en: [
        "Full Next.js 16 + TypeScript source code",
        "9 component demo files, each self-contained and copy-paste ready",
        "README with setup and customization guide",
        "12 months of updates",
      ],
      ar: [
        "الكود المصدري الكامل بـ Next.js 16 وTypeScript",
        "9 ملفات عرض مكوّنات، كل وحدة قائمة بذاتها وجاهزة للنسخ",
        "ملف README بدليل تثبيت وتخصيص كامل",
        "12 شهرًا من التحديثات",
      ],
    },
    notIncluded: {
      en: ["A full design file (Figma) — this is code-first", "Data pickers, rich text editors, or drag-and-drop components", "Hosting or a domain"],
      ar: ["ملف تصميم كامل (Figma) — هذا منتج يعتمد على الكود بالدرجة الأولى", "منتقيات بيانات، محررات نص غني، أو مكوّنات سحب وإفلات", "استضافة أو نطاق"],
    },
    componentsIncluded: [
      "Buttons (6 states)",
      "Badges (5 tones)",
      "Stat, content, and featured cards",
      "Alerts (4 tones)",
      "Tabs",
      "Text field, search field, select, textarea, checkbox, toggle",
      "Data table with status pills",
      "Modal / dialog",
      "Tooltip",
    ],
    fileTree: `launchkit-ui/
├── src/
│   ├── app/            (layout, page, globals.css)
│   └── components/     (9 demo-*.tsx files + shared section.tsx)
├── public/
├── README.md
├── LICENSE.md
└── CHANGELOG.md`,
    techStack: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS 4", "next-themes", "lucide-react"],
    requirements: {
      en: ["Node.js 20.9 or later", "Basic familiarity with React and Tailwind CSS"],
      ar: ["Node.js إصدار 20.9 أو أحدث", "إلمام أساسي بـ React وTailwind CSS"],
    },
    howItWorks: [
      {
        title: { en: "Download", ar: "التحميل" },
        description: { en: "Get the .zip from your receipt email or account page.", ar: "حمّل ملف .zip من رسالة الإيصال أو صفحة حسابك." },
      },
      {
        title: { en: "Browse the kit", ar: "تصفّح الطقم" },
        description: { en: "npm install && npm run dev to see every component live and interactive.", ar: "شغّل npm install ثم npm run dev عشان تشوف كل مكوّن شغّال وتفاعلي." },
      },
      {
        title: { en: "Copy what you need", ar: "انسخ اللي بتحتاجه" },
        description: { en: "Copy individual demo-*.tsx files into your own project's components folder.", ar: "انسخ ملفات demo-*.tsx اللي بتحتاجها لمجلد المكوّنات بمشروعك الخاص." },
      },
      {
        title: { en: "Restyle if needed", ar: "أعد التلوين إذا احتجت" },
        description: { en: "Point its color tokens at your own globals.css, or keep the Launchkit palette.", ar: "اربط ألوان الـ Tokens تبعه بملف globals.css الخاص فيك، أو خلّيه على ألوان Launchkit." },
      },
    ],
    changelog: [
      {
        version: "1.0.0",
        date: "2026-09-01",
        notes: {
          en: ["Initial release: 20+ components across 9 sections, full keyboard accessibility pass."],
          ar: ["الإصدار الأول: أكثر من 20 مكوّن عبر 9 أقسام، مراجعة وصولية كاملة للوحة المفاتيح."],
        },
      },
    ],
    faq: [
      {
        question: { en: "Do I need to install this as an npm package?", ar: "هل لازم أثبّته كحزمة npm؟" },
        answer: {
          en: "No — every component is a plain .tsx file you copy into your project. There's nothing to add to package.json.",
          ar: "لا — كل مكوّن ملف .tsx عادي تنسخه لمشروعك. ما في أي شي تضيفه لـ package.json.",
        },
      },
      {
        question: { en: "Can I use this with a component library like shadcn/ui?", ar: "هل أقدر أستخدمه مع مكتبة مكوّنات متل shadcn/ui؟" },
        answer: {
          en: "Yes — these components don't depend on any specific library, so they sit alongside anything else in your project without conflicts.",
          ar: "أكيد — هاي المكوّنات ما بتعتمد على أي مكتبة معينة، فبتنسجم مع أي شي تاني بمشروعك بدون تعارض.",
        },
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 2): Product[] {
  return products.filter((p) => p.slug !== product.slug).slice(0, limit);
}
