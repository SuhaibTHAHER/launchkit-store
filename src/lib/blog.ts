import type { Localized } from "./localized";

export type BlogPost = {
  slug: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  content: Localized<string[]>;
  publishedAt: string;
  readingTime: Localized<string>;
  tags: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "ship-a-saas-site-in-a-weekend",
    title: {
      en: "How to ship a SaaS marketing site in a weekend",
      ar: "كيف تطلق موقع تسويقي لمنتج SaaS بعطلة أسبوع واحدة",
    },
    excerpt: {
      en: "The realistic checklist for going from zero to a live, indexable marketing site — without spending two weeks on a hero section.",
      ar: "قائمة تحقق واقعية للوصول من الصفر لموقع تسويقي منشور ومفهرس — بدون ما تصرف أسبوعين بس على قسم الـ Hero.",
    },
    publishedAt: "2026-08-18",
    readingTime: { en: "6 min read", ar: "6 دقائق قراءة" },
    tags: ["Launch", "Marketing"],
    content: {
      en: [
        "Most solo founders lose their first weekend to the marketing site, not the product. The fix isn't working faster — it's cutting scope before you start.",
        "Start with one page. A homepage with a hero, three to five features, one pricing block, and a FAQ answers 90% of what a first-time visitor needs. Resist adding a blog, a changelog, or a case-studies page before you have a single customer to write about.",
        "Write the headline last. It's tempting to open with the hero, but the headline only gets good once you've written the features section and know exactly what you're claiming. Draft the features first, then compress the strongest one into a headline.",
        "Ship with placeholder-free copy. Real numbers, real feature names, real FAQ answers — even rough ones — read as more credible than polished Lorem Ipsum. A template like Launchkit AI gets you the structure; the honest copy is still on you, and it's the highest-leverage hour you'll spend.",
        "Deploy before it feels done. A live site at 80% is worth more than a perfect one still on localhost. Ship it, get three people to read it cold, and fix what actually confused them.",
      ],
      ar: [
        "معظم المؤسسين المستقلين بيضيّعوا أول عطلة أسبوع لهم عالموقع التسويقي، مش عالمنتج. الحل مش إنك تشتغل أسرع — الحل إنك تقلّص النطاق قبل ما تبلش.",
        "ابلش بصفحة وحدة. صفحة رئيسية فيها Hero، وثلاث لخمس مزايا، وقسم تسعير واحد، وأسئلة شائعة، بتجاوب على 90% من احتياج أول زائر. قاوم إغراء إضافة مدونة أو سجل تغييرات أو صفحة دراسات حالة قبل ما يصير عندك زبون واحد تكتب عنه.",
        "اكتب العنوان الرئيسي بالآخر. مغري إنك تبلش بالـ Hero، بس العنوان بيصير منيح بس لما تخلّص قسم المزايا وتعرف بالضبط شو بتدّعي. سوّد المزايا الأول، وبعدين اختصر أقواها بعنوان واحد.",
        "أطلق بمحتوى حقيقي بدون Placeholder. أرقام حقيقية، أسماء مزايا حقيقية، إجابات أسئلة شائعة حقيقية — حتى لو خشنة — بتبان أوثق من Lorem Ipsum مصقول. قالب متل Launchkit AI بيديك البنية؛ المحتوى الصادق لسه عليك، وهو أكثر ساعة قيمة رح تصرفها.",
        "انشر الموقع قبل ما تحس إنه خلص. موقع منشور بنسبة 80% بيسوى أكتر من موقع مثالي لسه عالـ localhost. انشره، خلّي ثلاث ناس يقروه بعين جديدة، وصلّح اللي فعلًا لخبطهم.",
      ],
    },
  },
  {
    slug: "nextjs-16-app-router-what-changed",
    title: {
      en: "Next.js 16's App Router: what actually changed for template builders",
      ar: "App Router بـ Next.js 16: شو تغيّر فعليًا لبنّائي القوالب",
    },
    excerpt: {
      en: "Typed route props, the layout caveats, and the handful of breaking changes worth knowing before you customize a Next.js 16 template.",
      ar: "خصائص المسارات المُنمّطة، ملاحظات الـ Layout، وحفنة تغييرات جوهرية يستاهل تعرفها قبل ما تخصّص قالب Next.js 16.",
    },
    publishedAt: "2026-08-04",
    readingTime: { en: "5 min read", ar: "5 دقائق قراءة" },
    tags: ["Next.js", "Engineering"],
    content: {
      en: [
        "If you're customizing a Next.js 16 template for the first time, three changes are worth knowing up front — they're not big, but they'll trip you up if you're used to older App Router code.",
        "Params are always a Promise. Every dynamic route's params (and searchParams) prop is async now — await it inside the page or layout instead of destructuring it directly. Every page in Launchkit's templates already follows this pattern, so you can copy it directly when adding your own dynamic routes.",
        "PageProps and LayoutProps are globally available. You no longer need to hand-write the params type for a route — `PageProps<'/products/[slug]'>` infers it from your file structure automatically, generated on `next dev` or `next build`.",
        "Layouts don't rerender on navigation. If you need something to update when the URL changes — an active nav link, a breadcrumb — read it in a Client Component with `usePathname`, not by passing state down from a layout.",
        "None of this requires a rewrite. The templates in this store were built against these changes from day one, so customizing them means writing ordinary Next.js code — these are just the defaults to know before you go looking for the 'old' way to do it.",
      ],
      ar: [
        "إذا عم تخصّص قالب Next.js 16 لأول مرة، في ثلاث تغييرات يستاهل تعرفها بداية — مش كبيرة، بس رح تعثّرك إذا متعوّد على كود App Router أقدم.",
        "الـ params دايمًا Promise. خاصية params (وsearchParams) لأي مسار ديناميكي صارت async — استنّها (await) جوا الصفحة أو الـ Layout بدل ما تفكّكها مباشرة. كل صفحة بقوالب Launchkit أصلًا متبعة هالنمط، فتقدر تنسخه مباشرة لما تضيف مسارات ديناميكية خاصة فيك.",
        "PageProps وLayoutProps متوفرين عالميًا. ما عاد لازم تكتب نوع params يدويًا لأي مسار — `PageProps<'/products/[slug]'>` بيستنتجه تلقائيًا من هيكل ملفاتك، وبيتولّد وقت `next dev` أو `next build`.",
        "الـ Layouts ما بتعيد الرندر عند التنقّل. إذا محتاج شي يتحدّث لما يتغير الرابط — رابط تنقّل نشط، أو Breadcrumb — اقرأه جوا Client Component باستخدام `usePathname`، مش بتمرير حالة من الـ Layout.",
        "ولا شي من هاد بيحتاج إعادة كتابة. القوالب بهالمتجر مبنية على هالتغييرات من أول يوم، فتخصيصها معناه كتابة كود Next.js عادي — هاي بس الإعدادات الافتراضية يستاهل تعرفها قبل ما تدوّر عالطريقة 'القديمة'.",
      ],
    },
  },
  {
    slug: "choosing-launchkit-ai-vs-dashboard",
    title: {
      en: "Launchkit AI or Launchkit Dashboard — which one do you need first?",
      ar: "Launchkit AI ولا Launchkit Dashboard — أيهم بتحتاج الأول؟",
    },
    excerpt: {
      en: "A short guide to which template to buy first depending on where your product actually is right now.",
      ar: "دليل قصير لأي قالب تشتري الأول حسب وين فعليًا واصل منتجك هلأ.",
    },
    publishedAt: "2026-07-22",
    readingTime: { en: "4 min read", ar: "4 دقائق قراءة" },
    tags: ["Product"],
    content: {
      en: [
        "The honest answer depends on what's blocking you, not what's more exciting to build.",
        "If nobody outside your team has seen your product yet, start with Launchkit AI. A marketing site is what turns \"I'm building something\" into a URL you can put in a tweet, a cold email, or a Show HN post. You can validate demand before the dashboard exists at all.",
        "If you already have paying users typing into a bare, unstyled admin panel, Launchkit Dashboard is the higher-leverage buy. A credible-looking app shell reduces churn and support tickets far more than a nicer landing page does at that stage.",
        "If you're starting completely from scratch with a hard launch date, Launchkit Complete is cheaper than buying both later, and means your site and app share one design system from day one instead of getting restyled to match each other after the fact.",
      ],
      ar: [
        "الجواب الصادق بيعتمد على شو عم يعطّلك، مش شو أحمس تبنيه.",
        "إذا لسه ولا حدا برّا فريقك شاف منتجك، ابلش بـ Launchkit AI. الموقع التسويقي هو اللي بيحوّل \"عم أبني شي\" لرابط تقدر تحطه بتغريدة أو إيميل بارد أو منشور Show HN. تقدر تتحقق من الطلب قبل ما تصير اللوحة موجودة أصلًا.",
        "إذا أصلًا عندك مستخدمين دافعين عم يستخدموا لوحة إدارة عارية بدون تنسيق، Launchkit Dashboard هو الشراء الأعلى قيمة. هيكل تطبيق يبان موثوق بيقلّل معدل ترك المستخدمين وتذاكر الدعم أكتر بكثير من صفحة هبوط أحلى بهالمرحلة.",
        "إذا عم تبلش من الصفر تمامًا وعندك موعد إطلاق صارم، Launchkit Complete أرخص من شراء الاثنين لاحقًا، ومعناته موقعك وتطبيقك بيشتركوا بنظام تصميم واحد من أول يوم بدل ما تعيد تنسيقهم ليتناسقوا مع بعض بعدين.",
      ],
    },
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
