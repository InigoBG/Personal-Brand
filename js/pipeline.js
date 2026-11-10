// How it works: four steps, one lit at a time. Idempotent: state comes from p alone.
export const activeStep = (p) => Math.min(3, Math.floor(p * 4));

export function initPipeline(root) {
  const steps = [...root.querySelectorAll('[data-step]')];
  return (p) => {
    const a = activeStep(p);
    steps.forEach((el, i) => {
      el.classList.toggle('on', i === a);
      if (i === a) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
  };
}
