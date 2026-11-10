export function sectionProgress(top, height, viewportH) {
  if (height <= viewportH) return top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -top / (height - viewportH)));
}

export function staticMode(win = window) {
  return win.matchMedia('(prefers-reduced-motion: reduce)').matches || win.innerWidth < 768;
}

export const fitsPanel = (contentH, panelH) => contentH <= panelH + 1; // +1: sub-pixel rounding

// A centred grid item taller than its cell overflows upward, which scrollHeight never reports: compare the content blocks' rects.
const overflowsPanel = (panel) => {
  const p = panel.getBoundingClientRect();
  return [...(panel.firstElementChild?.children ?? [])].some((c) => {
    const r = c.getBoundingClientRect();
    return r.height && (r.top < p.top - 1 || r.bottom > p.bottom + 1);
  });
};

export function initFrames(renderers) {
  const root = document.documentElement;
  const frames = Object.entries(renderers)
    .map(([name, render]) => ({ el: document.querySelector(`[data-frame="${name}"]`), render }))
    .filter((f) => f.el);

  // A frame whose content is taller than its sticky panel would be clipped: unpin it (data-fit="no") and show it final.
  const fit = () => {
    for (const { el } of frames) {
      const panel = el.querySelector('.frame-panel');
      delete el.dataset.fit; // measure in the pinned layout
      if (panel && (!fitsPanel(panel.scrollHeight, panel.clientHeight) || overflowsPanel(panel))) el.dataset.fit = 'no';
    }
  };

  let refit = true;
  const update = () => {
    const isStatic = staticMode();
    root.dataset.motion = isStatic ? 'static' : 'full';
    if (refit) { refit = false; fit(); }
    const barH = parseFloat(getComputedStyle(root).getPropertyValue('--bar-h')) || 0;
    const vh = window.innerHeight - barH; // panel is sticky below the bar
    for (const { el, render } of frames) {
      const r = el.getBoundingClientRect();
      render(isStatic || el.dataset.fit === 'no' ? 1 : sectionProgress(r.top - barH, r.height, vh));
    }
  };

  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  };

  update();
  addEventListener('scroll', schedule, { passive: true });
  const reschedule = () => { refit = true; schedule(); };
  addEventListener('resize', reschedule);
  document.fonts?.ready.then(reschedule); // web fonts change content height
}
