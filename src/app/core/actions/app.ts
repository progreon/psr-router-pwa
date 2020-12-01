export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_WIDE_STATE = 'UPDATE_WIDE_STATE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (location: Location, isSubPage: boolean) => (dispatch) => {
  const url = new URL(location.href);

  // Extract the path and search parameters from the url.
  const path = decodeURIComponent(url.pathname);
  let searchParams = {};
  for (let pair of url.searchParams) {
    searchParams[pair[0]] = pair[1];
  }

  // Redirect to last page you were on
  if (path === "/" && localStorage.getItem('app-last-page')) {
    if (localStorage.getItem('app-last-page').startsWith('/')) {
      localStorage.setItem('app-last-page', localStorage.getItem('app-last-page').substring(1));
    }
    document.body.dispatchEvent(new CustomEvent('navigate', { detail: { href: "/" + localStorage.getItem('app-last-page'), external: false } }));
    return;
  }

  // Extract the page name from path.
  const page = path === '/' ? 'home' : path.slice(1);

  if (window.appConfig.pageList[page] && window.appConfig.pageList[page].showInMenu)
    localStorage.setItem('app-last-page', page);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page, searchParams));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

// The site map
// NOTE: don't build the import string, otherwise webpack won't build the modules
import { PwaPage } from 'CoreComponents/pwa/PwaPage';
window.appConfig.siteMap = [];
window.appConfig.siteMap.push(new PwaPage('home', 'Home', 'psr-router-home', () => import('CoreComponents/psr-router-home/psr-router-home')));
window.appConfig.siteMap.push(new PwaPage('router', 'Route', 'psr-router-router', () => import('CoreComponents/psr-router-router/psr-router-router'), true).setSubPages([
  new PwaPage('router-text', 'Edit Route Text', 'psr-router-router-text', () => import('CoreComponents/psr-router-router/psr-router-router-text'), true, true, false)
]));
window.appConfig.siteMap.push(new PwaPage('data', 'Data').setSubPages([
  new PwaPage('pokemon-list', 'Pokémon', 'psr-router-pokemon-list', () => import('CoreComponents/psr-router-pokemon/psr-router-pokemon-list'), true),
  new PwaPage('pokemon-info', 'Pokémon Info', 'psr-router-pokemon-info', () => import('CoreComponents/psr-router-pokemon/psr-router-pokemon-info'), true, false, false),
  new PwaPage('trainers', 'Trainers', 'psr-router-trainers', () => import('CoreComponents/psr-router-trainers/psr-router-trainers'), true),
  new PwaPage('trainer-info', 'trainer Info', 'psr-router-trainer-info', () => import('CoreComponents/psr-router-trainers/psr-router-trainer-info'), true, false, false),
  new PwaPage('moves', 'Moves', 'psr-router-moves', () => import('CoreComponents/psr-router-moves/psr-router-moves'), true),
  new PwaPage('items', 'Items', 'psr-router-items', () => import('CoreComponents/psr-router-items/psr-router-items'), true)
]));
window.appConfig.siteMap.push(new PwaPage('help', 'Help', 'psr-router-manual', () => import('CoreComponents/psr-router-manual/psr-router-manual')));
window.appConfig.siteMap.push(new PwaPage('about', 'About', 'psr-router-about', () => import('CoreComponents/psr-router-about/psr-router-about')));
window.appConfig.siteMap.push(new PwaPage('404', '404', 'psr-router-404', () => import('CoreComponents/psr-router-404/psr-router-404'), false, false, false, true));

window.appConfig.pageList = {};
window.appConfig.siteMap.forEach(p => p.getAllSubPagesIncludingThis().forEach(sp => {if (sp.element) window.appConfig.pageList[sp.key] = sp; }));

const loadPage = (page: string, searchParams: { [key: string]: string; }) => (dispatch) => {
  if (window.appConfig.pageList[page]) {
    window.appConfig.pageList[page].doLazyLoad();
  } else {
    window.appConfig.pageList['404'].doLazyLoad();
    page = '404';
  }

  dispatch(updatePage(page, searchParams));
};

const updatePage = (page: string, searchParams: { [key: string]: string; }) => {
  return {
    type: UPDATE_PAGE,
    page,
    searchParams
  };
};

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline: boolean) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wide: boolean) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WIDE_STATE,
    wide
  });
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
};

export const updateDrawerState = (opened: boolean) => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
};
