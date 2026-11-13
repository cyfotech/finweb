// Precise check: does the page ACTUALLY scroll horizontally? + real clipping of visible content
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const ROUTE = '/bookkeeping-services-usa/';

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 640 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'laptop-1280', width: 1280, height: 720 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const browser = await chromium.launch({ headless: true });
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

      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const scrollW = doc.scrollWidth;
        const clientW = doc.clientWidth;
        const hasRealScroll = scrollW > clientW + 2;

        // find overflowing elements that are NOT inside an overflow:hidden/auto ancestor (i.e. could cause scroll)
        const visibleOverflow = [];
        document.querySelectorAll('body *').forEach((el) => {
          // skip decorative absolutely positioned ribbons (aria-hidden or inside overflow hidden)
          const r = el.getBoundingClientRect();
          if (r.width <= 0 || r.height <= 0) return;
          if (r.right > clientW + 1 || r.left < -1) {
            // walk ancestors; if any has overflow hidden/clip, it's clipped, not scroll-causing
            let clipped = false;
            let p = el.parentElement;
            while (p && p !== document.body) {
              const o = getComputedStyle(p).overflowX;
              if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; }
              p = p.parentElement;
            }
            // also skip elements that are fully within their own overflow-hidden parent -> already counted
            if (!clipped) {
              const cls = (el.className && typeof el.className === 'string' ? el.className : '').slice(0, 30);
              const tag = el.tagName.toLowerCase();
              visibleOverflow.push(`${tag}.${cls} L=${Math.round(r.left)} R=${Math.round(r.right)} W=${Math.round(r.width)}`);
            }
          }
        });
        return { scrollW, clientW, hasRealScroll, visibleOverflow: visibleOverflow.slice(0, 8) };
      });

      const status = m.hasRealScroll
        ? `REAL-SCROLL scrollW=${m.scrollW} clientW=${m.clientW}`
        : (m.visibleOverflow.length ? `no-scroll but ${m.visibleOverflow.length} unclipped-overflow` : 'ok');
      console.log(`[${theme}] ${vp.name} (${vp.width}px) -> ${status}`);
      if (m.visibleOverflow.length) m.visibleOverflow.forEach((o) => console.log(`     - ${o}`));
    } catch (e) {
      console.log(`[${theme}] ${vp.name} ERROR ${String(e).slice(0, 120)}`);
    } finally {
      await page.close();
    }
  }
}
await browser.close();
console.log('done');
