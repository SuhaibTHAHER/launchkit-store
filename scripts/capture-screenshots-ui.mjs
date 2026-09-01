import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("public", "products");
await mkdir(outDir, { recursive: true });

const UI = "http://localhost:3003";

const targets = [
  { url: UI, file: "launchkit-ui-light.png", scheme: "light", viewport: { width: 1280, height: 800 } },
  { url: UI, file: "launchkit-ui-dark.png", scheme: "dark", viewport: { width: 1280, height: 800 } },
  { url: UI, file: "launchkit-ui-mobile.png", scheme: "light", viewport: { width: 390, height: 844 } },
  { url: UI, file: "launchkit-ui-table.png", scheme: "light", viewport: { width: 1280, height: 800 }, scrollTo: "#table" },
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
