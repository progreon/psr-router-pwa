export const installRouter = (locationUpdatedCallback, getScroll, setScroll) => {
  document.body.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey) return;

    const anchor = e.composedPath().filter(n => n.tagName === 'A')[0];
    if (!anchor || anchor.target ||
        anchor.hasAttribute('download') ||
        anchor.getAttribute('rel') === 'external') return;

    const href = anchor.href;
    if (!href || href.indexOf('mailto:') !== -1) return;

    const location = window.location;
    const origin = location.origin || location.protocol + '//' + location.host;
    if (href.indexOf(origin) !== 0) return;

    e.preventDefault();
    if (href !== location.href) {
      window.history.replaceState({scroll: getScroll()}, '', window.location.href);
      window.history.pushState({}, '', href);
      locationUpdatedCallback(location, e);
    }
  });
  // Handle the navigation caused by js code here.
  document.body.addEventListener('navigate', (e) => {
    if (e.detail.external) {
      window.location.href = e.detail.href;
    } else {
      window.history.replaceState({scroll: getScroll()}, '', window.location.href);
      window.history.pushState({scroll: 0}, '', e.detail.href);
      locationUpdatedCallback(location, e);
    }
  });
  window.addEventListener('popstate', e => locationUpdatedCallback(window.location, e));
  locationUpdatedCallback(window.location, null /* event */);
};
