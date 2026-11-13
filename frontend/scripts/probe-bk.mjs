// Probe: how many headers/navs/footers render on /bookkeeping-services-usa/ ?
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const ROUTE = '/bookkeeping-services-usa/';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const q = (s) => document.querySelectorAll(s).length;
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden';
  };
  const headers = [...document.querySelectorAll('header')].map((h) => ({
    tag: 'header', visible: vis(h), rect: { t: Math.round(h.getBoundingClientRect().top), h: Math.round(h.getBoundingClientRect().height) }, text: (h.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80),
  }));
  const navs = [...document.querySelectorAll('nav')].map((n) => ({ visible: vis(n), text: (n.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60) }));
  const footers = [...document.querySelectorAll('footer')].map((f) => ({ visible: vis(f), text: (f.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60) }));
  // site navbar detection
  const siteNav = document.querySelector('header nav, nav') ? true : false;
  return { headerCount: headers.length, navCount: q('nav'), footerCount: footers.length, headers, navs, footers: footers.slice(0, 3) };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
