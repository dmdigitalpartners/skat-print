import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const screenshotsDir = path.join(process.cwd(), "temporary screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Auto-increment screenshot number
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
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
// Extra wait for images and animations to settle
await new Promise((r) => setTimeout(r, 2500));

// Short pause for animations to settle
await new Promise((r) => setTimeout(r, 500));

await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
