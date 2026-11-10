const NS = 'http://www.w3.org/2000/svg';
const DEPTH = 3; // stacked clones per lit country
const STEP = 2.5; // viewBox units between clones
const MAX_TILT = 38;
const TILT_END = 0.15; // tilt finishes before tier 1 lights

export function tierForProgress(p) {
  return p < 0.15 ? 0 : p < 0.4 ? 1 : p < 0.65 ? 2 : 3;
}

function el(name, attrs) {
  const e = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

// Quadratic curve bowed to the north, like a great circle seen on a Mercator map.
function arcPath([x1, y1], [x2, y2]) {
  const dx = x2 - x1, dy = y2 - y1, bend = 0.22;
  const s = dx < 0 ? -1 : 1; // pick the perpendicular that points up (negative y)
  const cx = (x1 + x2) / 2 + s * dy * bend, cy = (y1 + y2) / 2 - s * dx * bend;
  return `M${x1},${y1}Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2}`;
}

export function renderMap(svg, data, tiers) {
  const { VIEWBOX, COUNTRIES, CITIES, TIER_CITY } = data;
  const tierOf = {};
  tiers.forEach((t, i) => t.countries.forEach((iso) => { tierOf[iso] = i + 1; }));

  svg.setAttribute('viewBox', VIEWBOX);
  const base = el('g', { class: 'map-base' });
  const lit = el('g', { class: 'map-extrude' });
  const arcs = el('g', { class: 'map-arcs' });
  const cities = el('g', { class: 'map-cities' });
  const layers = Array.from({ length: DEPTH }, () => []); // painted lowest first, so a neighbour's wall never covers a top face

  for (const [iso, d] of Object.entries(COUNTRIES)) {
    const tier = tierOf[iso];
    base.append(el('path', { d, class: 'map-country', 'data-iso': iso, ...(tier && { 'data-tier': tier }) }));
    if (!tier) continue;
    for (let k = 1; k <= DEPTH; k++) {
      layers[k - 1].push(el('path', {
        d, class: 'map-clone', 'data-iso': iso, 'data-tier': tier, 'data-depth': k,
        transform: `translate(0 ${-k * STEP})`,
      }));
    }
    const city = TIER_CITY[iso];
    arcs.append(el('path', {
      d: arcPath(CITIES.MAD, CITIES[city]), class: 'map-arc', 'data-iso': iso, 'data-tier': tier, pathLength: 1,
    }));
    const [cx, cy] = CITIES[city];
    cities.append(el('circle', { cx, cy, r: 4, class: 'map-city', 'data-iso': iso, 'data-tier': tier }));
  }
  lit.append(...layers.flat());
  const [mx, my] = CITIES.MAD;
  cities.append(el('circle', { cx: mx, cy: my, r: 5, class: 'map-city map-city--home', 'data-iso': 'ESP' }));

  svg.replaceChildren(base, lit, arcs, cities);
}

export function setMapState(svg, tier, p) {
  const t = Math.min(1, Math.max(0, p / TILT_END));
  const eased = 1 - (1 - t) ** 3;
  svg.parentElement.style.setProperty('--tilt', `${(eased * MAX_TILT).toFixed(2)}deg`);
  for (const e of svg.querySelectorAll('[data-tier]')) e.classList.toggle('lit', Number(e.dataset.tier) <= tier);
  if (svg.dataset.mapTier === String(tier)) return;
  svg.dataset.mapTier = tier;
  svg.dispatchEvent(new CustomEvent('maptier', { detail: { tier } }));
}
