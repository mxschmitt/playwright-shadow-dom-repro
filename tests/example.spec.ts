import { test, expect } from '@playwright/test';

test("shadow DOM doesn't work", async ({ page, context }) => {
  await page.goto('https://developer.salesforce.com/docs/component-library/overview/components');

  // query selector deep code
  await page.addScriptTag({ path: "./tests/script.js"})

  const selector = `body > div:nth-child(13) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > componentreference-components:nth-child(1) > componentreference-bundles:nth-child(1) > componentreference-tile-viewer:nth-child(1) > div:nth-child(1) > componentreference-tile:nth-child(82) > a:nth-child(1) > div:nth-child(1)`
  const elementFromQuerySelector = await page.evaluate((selector: string) => {
    return (window as any).querySelectorShadowDom.querySelectorDeep(selector)
  }, selector)
  expect(elementFromQuerySelector).toBeDefined()

  await expect(page.locator(selector)).toBeAttached();
});
