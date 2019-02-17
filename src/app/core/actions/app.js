export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_WIDE_STATE = 'UPDATE_WIDE_STATE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (location, isSubPage) => (dispatch) => {
  const url = new URL(location.href);

  // Extract the path and search parameters from the url.
  const path = window.decodeURIComponent(url.pathname);
  var searchParams = {};
  for (var pair of url.searchParams) {
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

const loadPage = (page, searchParams) => (dispatch) => {
  switch(page) {
    case 'home':
      import('CoreComponents/psr-router-home/psr-router-home').then((module) => {
        // Put code in here that you want to run every time when
        // navigating to home after psr-router-home.js is loaded.
      });
      break;
    case 'router':
      import('CoreComponents/psr-router-router/psr-router-router');
      break;
    case 'items':
      import('CoreComponents/psr-router-items/psr-router-items');
      break;
    case 'moves':
      import('CoreComponents/psr-router-moves/psr-router-moves');
      break;
    case 'pokemon-list':
      import('CoreComponents/psr-router-pokemon/psr-router-pokemon-list');
      break;
    case 'pokemon-info':
      import('CoreComponents/psr-router-pokemon/psr-router-pokemon-info');
      break;
    case 'trainers':
      import('CoreComponents/psr-router-trainers/psr-router-trainers');
      break;
    case 'trainer-info':
      import('CoreComponents/psr-router-trainers/psr-router-trainer-info');
      break;
    case 'trainers':
      import('CoreComponents/psr-router-trainers/psr-router-trainers');
      break;
    case 'help':
      import('CoreComponents/psr-router-manual/psr-router-manual');
      break;
    case 'about':
      import('CoreComponents/psr-router-about/psr-router-about');
      break;
    default:
      page = '404';
      import('CoreComponents/psr-router-404/psr-router-404');
  }

  dispatch(updatePage(page, searchParams));
};

const updatePage = (page, searchParams) => {
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

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wide) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WIDE_STATE,
    wide
  });
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
};

export const updateDrawerState = (opened) => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
};
