import { join } from "path";
import { chromium } from "playwright";
import { cwd } from "process";

; (async function main() {
  const extPath = `${join(cwd(), "darkreader")}`
  const context = await chromium.launchPersistentContext(
    '',
    {
      headless: true,
      channel: 'chromium',
      ignoreDefaultArgs: [
        "--disable-extensions",
        "--disable-component-extensions-with-background-pages",
      ],
      args: [
        `--disable-extensions-except=${extPath}`,
        `--load-extension=${extPath}`,
      ],
    },
  );
  const page = context.pages()[0];
  await page.goto("https://example.com", { waitUntil: "domcontentloaded" });
  await page.waitForEvent("load")
  await page.waitForTimeout(10_000)

  await page.screenshot()
  console.log("done 1st screenshot", Date.now());
  await page.waitForTimeout(5_000)
  await page.screenshot()
  console.log("done 2nd screenshot", Date.now());
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
})

