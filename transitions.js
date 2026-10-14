// Fade the centered logo into the destination page heading.
// Navigation is intercepted only for local pages; Music remains an external link.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && sessionStorage.getItem('century-transition') === '1') {
    sessionStorage.removeItem('century-transition');
    document.body.classList.add('page-entering');
    window.setTimeout(() => document.body.classList.remove('page-entering'), 650);
  }
  if (reducedMotion) return;
  document.querySelectorAll('a[href]').forEach(link => {
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || !/\/(index|blog|software)\.html$/.test(target.pathname)) return;
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (target.href === window.location.href) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      sessionStorage.setItem('century-transition', '1');
      window.setTimeout(() => { window.location.href = target.href; }, 320);
    });
  });
})();
