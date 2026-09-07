import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3001";
const label = process.argv[3] || "";
// Optional 4th arg: viewport width. Defaults to 390 (iPhone 14 Pro) so every
// existing invocation is unchanged; pass e.g. 360 to check the narrower
// Android class that a lot of BG traffic still uses.
const width = Number(process.argv[4]) || 390;

const screenshotsDir = path.join(process.cwd(), "temporary screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const existing = fs.readdirSync(screenshotsDir).filter((f) => f.endsWith(".png"));
const numbers = existing.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? "0")).filter(Boolean);
const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;
const outputPath = path.join(screenshotsDir, filename);

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
// iPhone 14 Pro height, 3x scale; width overridable via argv[4]
await page.setViewport({ width, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

// Scroll the whole page before capturing. next/image lazy-loads anything below
// the fold, and a fullPage screenshot does NOT trigger those loads on its own —
// without this pass the gallery tiles photograph as empty boxes.
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
// Long enough for the last ScrollReveal to finish: its stagger delay can reach
// ~0.36s on top of a 0.7s animation, and capturing earlier photographs sections
// mid-fade as blank bands.
await new Promise((r) => setTimeout(r, 1600));

await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Mobile screenshot saved (${width}px): ${outputPath}`);
