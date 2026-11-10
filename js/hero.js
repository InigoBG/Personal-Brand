// Hero table. p 0–0.5: row 1 is typed by hand, cell by cell. p ≥ 0.5: the AI fills the rest (CSS does the reveal).
// Idempotent: everything comes from p, because static mode calls it with 1 on every scroll.
export function initHero(root) {
  const cells = [...root.querySelectorAll('[data-type]')].map((el) => ({ el, text: el.textContent }));
  const slot = 0.5 / cells.length;
  return (p) => {
    const ai = p >= 0.5;
    root.dataset.phase = ai ? 'ai' : 'hand';
    let caret = !ai;
    for (const [i, { el, text }] of cells.entries()) {
      const k = ai ? 1 : Math.min(1, Math.max(0, (p - i * slot) / (slot * 0.75))); // last quarter of a slot: the pause before the next cell
      el.textContent = text.slice(0, Math.round(text.length * k));
      el.classList.toggle('caret', caret && k < 1);
      if (k < 1) caret = false;
    }
    if (caret) cells.at(-1)?.el.classList.add('caret'); // row typed, caret rests at the end until the AI takes over
  };
}
