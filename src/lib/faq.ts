import type { Localized } from "./localized";

export type FaqItem = {
  question: Localized<string>;
  answer: Localized<string>;
};

export const generalFaq: FaqItem[] = [
  {
    question: {
      en: "How do I receive my product?",
      ar: "كيف بستلم منتجي؟",
    },
    answer: {
      en: "Immediately after checkout, Paddle emails you a receipt with a download link for the template's source code as a .zip file. You can also re-download it any time from the link in that email.",
      ar: "مباشرة بعد الدفع، Paddle بيرسلك إيصال عبر الإيميل فيه رابط تحميل للكود المصدري للقالب كملف .zip. تقدر تعيد تحميله بأي وقت من نفس الرابط بالإيميل.",
    },
  },
  {
    question: {
      en: "Is this a one-time payment?",
      ar: "هل هذا دفع لمرة واحدة؟",
    },
    answer: {
      en: "Yes. Every Launchkit template is a single, one-time purchase — there's no subscription. Your license includes 12 months of updates from the date of purchase.",
      ar: "أكيد. كل قالب من Launchkit هو شراء لمرة واحدة — ما في أي اشتراك دوري. رخصتك تشمل 12 شهرًا من التحديثات من تاريخ الشراء.",
    },
  },
  {
    question: {
      en: "Can I use it for commercial projects?",
      ar: "هل أقدر أستخدمه بمشاريع تجارية؟",
    },
    answer: {
      en: "Yes. The Single Project license covers one end product, for yourself or for a single client, including commercial use. See the License page for the full terms and when you'd need an Extended license instead.",
      ar: "أكيد. رخصة المشروع الواحد بتغطّي منتج نهائي واحد، لنفسك أو لعميل واحد، بما فيها الاستخدام التجاري. راجع صفحة الرخصة للشروط الكاملة ومتى بتحتاج رخصة موسّعة بدلًا منها.",
    },
  },
  {
    question: {
      en: "Do I get updates?",
      ar: "هل بحصل على تحديثات؟",
    },
    answer: {
      en: "Yes — every purchase includes 12 months of updates. When we ship a new version, you'll get an email with the changelog and an updated download link.",
      ar: "أكيد — كل عملية شراء تشمل 12 شهرًا من التحديثات. لما نطلق نسخة جديدة، رح توصلك رسالة إيميل فيها سجل التغييرات ورابط تحميل محدّث.",
    },
  },
  {
    question: {
      en: "Can I get a refund?",
      ar: "هل أقدر أسترجع فلوسي؟",
    },
    answer: {
      en: "Yes — if a template doesn't work for your project, contact us within 14 days of purchase for a full refund, no questions asked.",
      ar: "أكيد — إذا القالب ما ناسب مشروعك، تواصل معنا خلال 14 يوم من الشراء وبنرجّعلك كامل المبلغ بدون أي أسئلة.",
    },
  },
  {
    question: {
      en: "Do you offer support?",
      ar: "هل تقدّمون دعم فني؟",
    },
    answer: {
      en: "Every template ships with a README covering setup and customization — check there first. For anything else, email the address on your receipt and we'll get back to you within two business days.",
      ar: "كل قالب فيه ملف README بيغطّي التثبيت والتخصيص — راجعه أول شي. لأي شي تاني، راسلنا عالإيميل الموجود بإيصالك وبنرد عليك خلال يومي عمل.",
    },
  },
  {
    question: {
      en: "What payment methods do you accept?",
      ar: "شو وسائل الدفع اللي بتقبلوها؟",
    },
    answer: {
      en: "Checkout is handled by Paddle, our merchant of record, which supports major cards, Apple Pay, Google Pay, and PayPal depending on your region. Paddle also handles sales tax/VAT automatically.",
      ar: "عملية الدفع بتتم عبر Paddle، مزوّد الدفع الرسمي عنّا، وهو بيدعم البطاقات الرئيسية وApple Pay وGoogle Pay وPayPal حسب منطقتك. Paddle كمان بيتكفّل بضريبة المبيعات/القيمة المضافة تلقائيًا.",
    },
  },
];
