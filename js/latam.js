// 07 Latin America. The map tilts, then lights three tiers; the side card follows the map's 'maptier' event.
// Idempotent: state comes from p alone, because static mode calls it with 1 on every scroll.
import { renderMap, setMapState, tierForProgress } from './map.js';

// tier items are 1-based; tier 0 means nothing is lit yet
export const tierState = (i, tier) => (i < tier ? 'past' : i === tier ? 'on' : 'next');
export const helpOn = (p) => p >= 0.85; // "What I bring" comes in once the last tier has had its moment

export function initLatam(root, data, tiers) {
  const html = document.documentElement;
  const svg = root.querySelector('[data-map]');
  const items = [...root.querySelectorAll('[data-tier-item]')];
  const help = root.querySelector('[data-help]');

  renderMap(svg, data, tiers);
  // within a tier, countries light one after another in the order they are listed
  tiers.forEach((t) => t.countries.forEach((iso, i) =>
    svg.querySelectorAll(`[data-iso="${iso}"]`).forEach((e) => e.style.setProperty('--i', i))));
  const [x, y] = data.CITIES.MAD;
  svg.insertAdjacentHTML('beforeend', `<text class="map-label" x="${x + 10}" y="${y - 10}">Madrid</text>`);

  svg.addEventListener('maptier', (e) => items.forEach((li, i) => { li.dataset.state = tierState(i + 1, e.detail.tier); }));

  let last = 1;
  const render = (p) => {
    last = p;
    if (html.classList.contains('print-latam')) p = 1; // the slide always shows every tier
    setMapState(svg, tierForProgress(p), p);
    help.dataset.on = helpOn(p);
  };

  root.querySelector('[data-print]').addEventListener('click', () => {
    html.classList.add('print-latam');
    render(last);
    print();
  });
  addEventListener('afterprint', () => { html.classList.remove('print-latam'); render(last); });
  return render;
}
