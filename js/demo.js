// Contract-review grid simulation. p<.25 empty; <.6 columns fill left to right; <.8 riskiest cell + its quote; >=.8 memo.
// Idempotent: everything derives from p (plus the user's own click), since static mode calls it with 1 repeatedly.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const markup = (s) => esc(s).replace(/\{\{(.+?)\}\}/g, '<mark>$1</mark>');
export const filledCols = (p, n) => (p < 0.25 ? 0 : p >= 0.6 ? n : Math.floor(((p - 0.25) / 0.35) * n));

const RISK = { hi: 'High risk', mid: 'Medium risk', lo: 'Low risk' };
const dot = (r) => `<i class="dot ${r}"></i><span class="sr">${RISK[r]}, </span>`; // the comma keeps the risk and the clause ref apart when read aloud

// English glosses of the high-risk change-of-control findings, keyed by contract id (synthetic data)
const GLOSS = {
  loan: 'acceleration without lender consent',
  lease: 'a >50% share transfer counts as assignment',
  supply: 'customer may terminate on 30 days\' notice',
  jv: 'counterparty gets a call option',
};
export function redFlags({ contracts }) {
  const hi = contracts.filter((c) => c.cells.coc[0] === 'hi');
  return [
    `${hi.length} of ${contracts.length} contracts have a change-of-control trigger: acceleration, termination, deemed assignment or a call option.`,
    ...hi.slice(0, 3).map((c) => `${c.short} \u2014 ${c.cells.coc[2]}: ${GLOSS[c.id] ?? 'high-risk trigger'}`),
  ];
}

export function initDemo(root, DEMO) {
  const { questions: qs, contracts: cs } = DEMO;
  const grid = root.querySelector('[data-grid]');
  const detail = root.querySelector('[data-detail]');
  const memo = root.querySelector('[data-memo]');

  grid.innerHTML = `<table><thead><tr><th scope="col">Contract</th>${qs.map((q) => `<th scope="col">${esc(q.label)}</th>`).join('')}</tr></thead><tbody>${
    cs.map((c, r) => `<tr><th scope="row">${esc(c.short)}<span>${c.pages} pp</span></th>${qs.map((q, k) => {
      const [risk, ans, ref] = c.cells[q.id];
      return `<td><button type="button" class="cell" data-r="${r}" data-c="${k}" aria-label="${esc(c.short)}, ${esc(q.label)}" aria-describedby="cell-${r}-${k}"><span class="cell-in" id="cell-${r}-${k}"><span class="ans">${esc(ans)}</span><span class="meta">${dot(risk)}${esc(ref)}</span></span></button></td>`;
    }).join('')}</tr>`).join('')}</tbody></table>`;
  memo.innerHTML = `<p class="kicker">Red-flag memo · change of control</p><ul>${redFlags(DEMO).map((l, i) => i ? `<li>${esc(l)}</li>` : `<li class="lead">${esc(l)}</li>`).join('')}</ul>`;

  // first high-risk cell, scanning question by question
  let auto = null;
  outer: for (const [k, q] of qs.entries()) for (const [r, c] of cs.entries()) if (c.cells[q.id][0] === 'hi') { auto = [r, k]; break outer; }

  const btns = [...grid.querySelectorAll('.cell')];
  let sel = null;
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.cell');
    if (!b || b.disabled) return;
    sel = [+b.dataset.r, +b.dataset.c];
    show(sel);
  });

  const hint = '<p class="muted">Click a filled cell to see the clause behind the answer.</p>';
  let shown; // undefined, so the first show(null) still renders the hint
  function show(rc) {
    const key = rc && rc.join();
    if (key === shown) return;
    shown = key;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(!!rc && +b.dataset.r === rc[0] && +b.dataset.c === rc[1])));
    if (!rc) { detail.innerHTML = hint; return; }
    const c = cs[rc[0]], q = qs[rc[1]], [risk, ans, ref, quote] = c.cells[q.id];
    detail.innerHTML = `<p class="kicker">${esc(c.name)}</p><h3>${esc(q.label)}</h3>
      <p class="d-risk"><i class="dot ${risk}"></i>${RISK[risk]}</p><p class="d-ans">${esc(ans)}</p>
      ${quote ? `<blockquote class="excerpt"><span class="src">${esc(ref)}</span>${markup(quote)}</blockquote>`
              : '<p class="excerpt"><span class="src">Search</span>No relevant clause found in the document.</p>'}`;
  }

  return (p) => {
    const n = filledCols(p, qs.length);
    btns.forEach((b) => { const on = +b.dataset.c < n; b.disabled = !on; b.dataset.filled = on; });
    if (sel && sel[1] >= n) sel = null;
    show(sel || (p >= 0.6 ? auto : null));
    memo.hidden = p < 0.8;
  };
}
