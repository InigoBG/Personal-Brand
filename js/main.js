import { applyLang, t } from './i18n.js';
import { initFrames } from './scroll.js';
import { initHero } from './hero.js';
import { initDemo } from './demo.js';
import { initLatam } from './latam.js';
import * as MAP from './map-data.js';
import { DEMO, LATAM_TIERS } from './content.js';

let resetTimer;
export async function copyEmail(btn, email, nav = navigator, doc = document) {
  const lang = doc.documentElement?.lang === 'es' ? 'es' : 'en';
  let r = 'copied';
  try { await nav.clipboard.writeText(email); } catch {
    const range = doc.createRange();
    range.selectNodeContents(doc.getElementById('email'));
    const sel = doc.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
    r = 'selected';
  }
  btn.textContent = t(`contact.${r}`, lang);
  const status = doc.getElementById('copy-status');
  if (status) { status.textContent = ''; setTimeout(() => { status.textContent = btn.textContent; }, 50); } // clear first so a repeat click re-announces
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    const l = doc.documentElement?.lang === 'es' ? 'es' : 'en';
    btn.textContent = t('contact.copy', l);
    if (status) status.textContent = '';
  }, 4000);
  resetTimer.unref?.();
  return r;
}

function boot() {
  const root = document.documentElement;
  const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };

  let lang = get('lang') === 'es' ? 'es' : 'en';
  applyLang(document, lang);
  document.getElementById('lang').addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    applyLang(document, lang);
    dispatchEvent(new Event('resize')); // Spanish text is longer: re-run the frames' fit check
  });

  document.getElementById('theme').addEventListener('click', () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  });

  const bar = document.querySelector('.bar');
  const setBarH = () => root.style.setProperty('--bar-h', `${bar.offsetHeight}px`);
  setBarH();
  new ResizeObserver(setBarH).observe(bar);

  const frame = (n) => document.querySelector(`[data-frame="${n}"]`);
  initFrames({
    hero: initHero(frame('hero')),
    demo: initDemo(frame('demo'), DEMO),
    latam: initLatam(frame('latam'), MAP, LATAM_TIERS),
  });

  const once = (els, fn, opts) => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); }
    }, opts);
    els.forEach((el) => io.observe(el));
  };
  root.classList.add('booted'); // .reveal and the funnel bars hide only from here, so a failed or slow main.js leaves them visible
  once(document.querySelectorAll('.reveal'), (el) => el.classList.add('in'), { rootMargin: '0px 0px -8% 0px' });

  // funnel figures count up once when seen; 'About half' has no data-count and stays as written
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const figs = document.querySelectorAll('[data-count]');
    figs.forEach((el) => { el.dataset.count = el.textContent; el.textContent = el.textContent.replace(/\d+/, '0'); });
    once(figs, (el) => {
      const [, n, rest] = el.dataset.count.match(/^(\d+)(.*)$/);
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1100);
        el.textContent = Math.round(n * (1 - (1 - k) ** 3)) + rest;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
  }

  const copy = document.getElementById('copy');
  copy.addEventListener('click', () => copyEmail(copy, document.getElementById('email').textContent.trim()));

}

if (typeof document !== 'undefined') boot();
