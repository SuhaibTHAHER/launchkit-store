import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("public", "products");
await mkdir(outDir, { recursive: true });

const AI = "http://localhost:49770";
const DASH = "http://localhost:3001";

const targets = [
  // Launchkit AI — marketing site
  { url: AI, file: "launchkit-ai-light.png", scheme: "light", viewport: { width: 1280, height: 800 } },
  { url: AI, file: "launchkit-ai-dark.png", scheme: "dark", viewport: { width: 1280, height: 800 } },
  { url: AI, file: "launchkit-ai-mobile.png", scheme: "light", viewport: { width: 390, height: 844 } },
  { url: AI, file: "launchkit-ai-features.png", scheme: "light", viewport: { width: 1280, height: 800 }, scrollTo: "#features" },

  // Launchkit Dashboard
  { url: DASH, file: "launchkit-dashboard-light.png", scheme: "light", viewport: { width: 1280, height: 800 } },
  { url: DASH, file: "launchkit-dashboard-dark.png", scheme: "dark", viewport: { width: 1280, height: 800 } },
  { url: DASH, file: "launchkit-dashboard-mobile.png", scheme: "light", viewport: { width: 390, height: 844 } },
  { url: `${DASH}/contacts`, file: "launchkit-dashboard-contacts.png", scheme: "light", viewport: { width: 1280, height: 800 } },
  { url: `${DASH}/settings`, file: "launchkit-dashboard-settings.png", scheme: "light", viewport: { width: 1280, height: 800 } },
];

const browser = await chromium.launch();

for (const t of targets) {
  const page = await browser.newPage({ viewport: t.viewport, colorScheme: t.scheme });
  await page.goto(t.url, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(400);
  if (t.scrollTo) {
    await page.locator(t.scrollTo).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  }
  await page.screenshot({ path: path.join(outDir, t.file) });
  await page.close();
  console.log("captured", t.file);
}

await browser.close();
