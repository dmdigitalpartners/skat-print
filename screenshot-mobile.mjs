import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3001";
const label = process.argv[3] || "";

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
// iPhone 14 Pro dimensions, 3x scale
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));
await new Promise((r) => setTimeout(r, 600));

await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Mobile screenshot saved: ${outputPath}`);
