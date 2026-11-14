/* Progressive enhancements only. The pages and itineraries work without JS. */
'use strict';
document.documentElement.classList.add('js');

const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('#primary-nav');
if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    navigation.classList.toggle('is-open', opening);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
}

const filterBar = document.querySelector('[data-trip-filters]');
if (filterBar) {
  const buttons = [...filterBar.querySelectorAll('[data-filter]')];
  const routes = [...document.querySelectorAll('[data-terrain]')];
  const result = filterBar.querySelector('[data-result-count]');
  const allowed = new Set(buttons.map(button => button.dataset.filter));
  const applyFilter = (filter, updateURL = false) => {
    const choice = allowed.has(filter) ? filter : 'all';
    let visible = 0;
    for (const route of routes) {
      route.hidden = choice !== 'all' && route.dataset.terrain !== choice;
      if (!route.hidden) visible += 1;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === choice));
    }
    result.textContent = `${visible} ${visible === 1 ? 'route' : 'routes'} to take slowly`;
    if (updateURL) {
      const url = new URL(window.location.href);
      if (choice === 'all') url.searchParams.delete('terrain');
      else url.searchParams.set('terrain', choice);
      url.hash = '';
      history.replaceState(null, '', url);
    }
  };
  const readLocation = () => {
    let choice = new URLSearchParams(window.location.search).get('terrain') || 'all';
    const target = routes.find(route => `#${route.id}` === window.location.hash);
    if (target && choice !== 'all' && target.dataset.terrain !== choice) choice = 'all';
    applyFilter(choice);
  };
  filterBar.hidden = false;
  readLocation();
  for (const button of buttons) {
    button.addEventListener('click', () => applyFilter(button.dataset.filter, true));
  }
  window.addEventListener('popstate', readLocation);
  window.addEventListener('hashchange', readLocation);
}

const packingList = document.querySelector('[data-packing-list]');
if (packingList) {
  const storageKey = 'salt-switchback-packing-v1';
  const boxes = [...packingList.querySelectorAll('input[type="checkbox"]')];
  const tools = document.querySelector('[data-packing-tools]');
  const count = document.querySelector('[data-packing-count]');
  const progress = document.querySelector('[data-packing-progress]');
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) {
      for (const box of boxes) box.checked = saved.includes(box.id);
    }
  } catch (_) { /* Private browsing / blocked or corrupt storage: keep normal checkboxes. */ }
  const updatePacking = (save = true) => {
    const checked = boxes.filter(box => box.checked);
    count.textContent = `${checked.length} of ${boxes.length} packed`;
    progress.max = boxes.length;
    progress.value = checked.length;
    if (save) {
      try { localStorage.setItem(storageKey, JSON.stringify(checked.map(box => box.id))); }
      catch (_) { /* The checklist remains usable without persistence. */ }
    }
  };
  tools.hidden = false;
  updatePacking(false);
  packingList.addEventListener('change', () => updatePacking());
  document.querySelector('[data-clear-packing]').addEventListener('click', () => {
    for (const box of boxes) box.checked = false;
    updatePacking();
  });
}

const enquiryLink = document.querySelector('[data-enquiry-link]');
if (enquiryLink) {
  const trips = {
    'salt-path': 'The Salt Path',
    'high-lanes': 'The High Lanes',
    'slow-train': 'The Long Way to Lowmere'
  };
  const choice = new URLSearchParams(window.location.search).get('trip');
  if (Object.hasOwn(trips, choice)) {
    const subject = `A question about ${trips[choice]}`;
    enquiryLink.href = `mailto:hello@saltandswitchback.example?subject=${encodeURIComponent(subject)}`;
    document.querySelector('[data-enquiry-intent]').textContent =
      `Thinking about ${trips[choice]}? Tell us your preferred month, party size, and what a good walking day looks like to you.`;
  }
}
