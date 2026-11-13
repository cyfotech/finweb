// Automated responsive/theme audit for /bookkeeping-services-usa/
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const ROUTE = '/bookkeeping-services-usa/';

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 640 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-820', width: 820, height: 1180 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'laptop-1280', width: 1280, height: 720 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'ultra-2560', width: 2560, height: 1440 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const theme of ['dark', 'light']) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    try {
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((t) => {
        localStorage.setItem('preferred-tax-theme', t);
        const root = document.documentElement;
        if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
      }, theme);
      await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1200);

      // Horizontal overflow check
      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const offenders = [];
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > vw + 2 || r.left < -2)) {
            const tag = el.tagName.toLowerCase();
            const cls = (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 40);
            const style = el.getAttribute('style') || '';
            offenders.push(`${tag}.${cls} [L=${Math.round(r.left)},R=${Math.round(r.right)},W=${Math.round(r.width)}] ${style.slice(0, 90)}`);
          }
        });
        return { vw, offenders: offenders.slice(0, 12) };
      });

      // Count sections rendered
      const sectionCount = await page.evaluate(
        () => document.querySelectorAll('section').length
      );

      // Check the internal header is hidden (site owns nav)
      const internalHeaderHidden = await page.evaluate(() => {
        const hdrs = document.querySelectorAll('div.r > header');
        let allHidden = true;
        hdrs.forEach((h) => {
          const cs = getComputedStyle(h);
          if (cs.display !== 'none' && cs.visibility !== 'hidden') allHidden = false;
        });
        return allHidden;
      });

      results.push({
        theme,
        vp: vp.name,
        width: vp.width,
        overflowCount: overflow.offenders.length,
        offenders: overflow.offenders,
        sections: sectionCount,
        internalHeaderHidden,
        ok: overflow.offenders.length === 0 && internalHeaderHidden,
      });

      if (overflow.offenders.length) {
        await page.screenshot({
          path: `scripts/viewport-output/bk_${theme}_${vp.name}.png`,
          fullPage: false,
        });
      }
    } catch (e) {
      results.push({ theme, vp: vp.name, width: vp.width, error: String(e).slice(0, 300), ok: false });
    } finally {
      await page.close();
    }
  }
}

await browser.close();

let failures = 0;
console.log('\n=== FIGKEEPING PAGE VIEWPORT/THEME AUDIT ===\n');
for (const r of results) {
  const badge = r.ok ? 'PASS' : 'FAIL';
  if (!r.ok) failures++;
  console.log(`[${badge}] ${r.theme} @ ${r.vp} (${r.width}px) sections=${r.sections ?? '-'} headerHidden=${r.internalHeaderHidden ?? '-'}`);
  if (r.error) console.log(`       error: ${r.error}`);
  if (r.offenders && r.offenders.length) {
    console.log(`       overflow (${r.overflowCount}):`);
    r.offenders.forEach((o) => console.log(`         - ${o}`));
  }
}
console.log(`\n${results.length} cases, ${failures} with issues\n`);
