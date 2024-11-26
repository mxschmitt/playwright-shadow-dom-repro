import { existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { chromium } from "playwright";
import { cwd } from "process";

const browserCacheDir = join(homedir(), "playwright", "chromium", `session-${Date.now()}`);
const sharedBrowserOptions = {
  headless: true,
  handleSIGTERM: false,
}
const sharedContextOptions = {
  deviceScaleFactor: 1,
  viewport: { width: 1920, height: 1080 },
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.26 Safari/537.36",
  timeZoneId: "America/Los_Angeles",
  locale: "en-US",
}

const extPath = `${join(cwd(), "darkreader")}`

const chromeArgs = [
  `--disable-extensions-except=${extPath}`,
  "--headless=new",
  // "--no-first-run",
  // "--renderer-process-limit=4",
  // "--disable-site-isolation-for-policy",
  // "--disable-site-isolation-trials",
  // "--autoplay-policy=user-gesture-required",
  // "--disable-add-to-shelf",
  // "--disable-desktop-notifications",
  // "--use-fake-device-for-media-stream",
  // "--use-fake-ui-for-media-stream",
  // "--ignore-gpu-blocklist",
  // "--use-gl=angle",
  // "--use-angle=gl-egl",
  // "--force-device-scale-factor=1",
  // "--device-scale-factor=1",
  // "--window-size=1920,1080",
  ]

async function main() {
  if (!existsSync(join(extPath, "manifest.json"))) {
    throw new Error("darkreader extension not found")
  }
  console.log("loading extension from", extPath)

  if (!existsSync(browserCacheDir)) {
    mkdirSync(browserCacheDir, { recursive: true });
  }

  const context = await chromium.launchPersistentContext(
    browserCacheDir,
    {
      ...sharedBrowserOptions,
      ...sharedContextOptions,
      ignoreDefaultArgs: [
        "--disable-extensions",
        "--disable-component-extensions-with-background-pages",
      ],
      args: chromeArgs,
      baseURL: "https://google.com",
    },
  );
  const page = context.pages()[0]!;
  await page.goto(
    "https://google.com",
    {
      waitUntil: "domcontentloaded"
    }
  );
  await page.waitForEvent("load")
  await page.waitForTimeout(10_000)

  await page.screenshot({ type: "jpeg", "scale": "css", timeout: 3_000,  })
  console.log("done 1st screenshot", Date.now());
  await page.waitForTimeout(5_000)
  const buff = await page.screenshot({ type: "jpeg", "scale": "css", timeout: 3_000 })
  console.log("screenshot buff")
  console.log(buff.toString('base64'))
  console.log("done 2nd screenshot", Date.now());
  process.exit(0);
}

void main();
