import { html, css, unsafeCSS } from 'lit-element';

const AppColors = css`
  :host {
    /* CORPORATE COLORS */
    --app-color-blue: #1865a9;
    --app-color-yellow: #ffdd22;
    --app-color-slate: #8c9192;
    --app-color-white: #fafafa;
    /* --app-color-black: #1d1d1b; */
    --app-color-black: #000000;
    /* PROFILE COLORS */
    --app-color-granite: #3a4448;
    --app-color-fog: #e3e2dd;
    --app-color-grass: #79b928;
    --app-color-grass-light: #c4d97e;
    --app-color-mud: #805d3e;
    --app-color-mud-light: #e0cea3;
    --app-color-ocean: #00a0ce;
    --app-color-sky: #cee9ef;
    --app-color-cloudberry: #f07d00;
    --app-color-cloudberry-light: #fcc970;
    /* ACCENT COLORS */
    --app-color-purple: #7d2472;
    --app-color-crimson: #e7304d;
    /* SIGNAL COLORS */
    --app-color-success-green: #009640;
    --app-color-warning-yellow: #ffdd00;
    --app-color-error-red: #e30613;
    /* CALL TO ACTION */
    --app-color-cta-blue: #0f70b8;
  }
`;

const BaseColors = css`
  :host {
    --app-profile-color: var(--app-color-grass);
    --app-profile-color-light: var(--app-color-grass-light);

    --app-primary-color: var(--app-color-white);
    --app-secondary-color: var(--app-color-black);
    /* --app-dark-text-color: var(--app-secondary-color); */
    --app-dark-text-color: rgba(0, 0, 0, .8);
    --app-light-text-color: var(--app-color-white);
  }
`;

const LightTheme = css`
  :host([theme=light]) {
    --app-header-background-color: var(--app-color-blue);
    --app-header-text-color: var(--app-light-text-color);

    --app-header-menu-text-color: var(--app-dark-text-color);
    --app-header-menu-background-color: var(--app-color-yellow);
    --app-header-menu-background-selected-color: var(--app-background-color);
    --app-header-menu-selected-color: var(--app-dark-text-color);
    --app-header-menu-active-color: var(--app-color-blue);

    --app-drawer-background-color: var(--app-color-yellow);
    --app-drawer-text-color: var(--app-dark-text-color);
    --app-drawer-selected-color: var(--app-dark-text-color);

    --app-drawer-header-background-color: var(--app-color-blue);
    --app-drawer-header-text-color: var(--app-light-text-color);

    --app-footer-text-color: var(--app-color-white);
    --app-footer-background-color: var(--app-color-blue);

    --app-background-color: var(--app-color-white);
    --app-main-background-color: var(--app-color-white);
  }
`;

const DarkTheme = css`
  :host([theme=dark]) {
    --app-header-background-color: var(--app-color-black);
    --app-header-text-color: var(--app-color-yellow);

    --app-header-menu-text-color: var(--app-color-blue);
    --app-header-menu-background-color: var(--app-color-black);
    --app-header-menu-background-selected-color: var(--app-background-color);
    --app-header-menu-selected-color: var(--app-color-black);
    --app-header-menu-active-color: var(--app-color-yellow);

    --app-drawer-background-color: var(--app-color-black);
    --app-drawer-text-color: var(--app-color-blue);
    --app-drawer-selected-color: var(--app-color-blue);

    --app-drawer-header-background-color: var(--app-color-black);
    --app-drawer-header-text-color: var(--app-color-yellow);

    --app-footer-text-color: var(--app-color-yellow);
    --app-footer-background-color: var(--app-color-black);

    --app-background-color: var(--app-color-blue);
    --app-main-background-color: var(--app-color-blue);
  }
`;

const CssProperties = css`
  :host {
    /* vaadin styles */
    --material-primary-color: var(--app-header-background-color);
    --material-primary-text-color: var(--app-header-background-color);
    --material-background-color: var(--app-background-color);

    /* mwc styles */
    --mdc-dialog-content-ink-color: var(--app-dark-text-color);
    --mdc-select-fill-color: var(--app-background-color);
    --mdc-select-error-color: var(--app-color-error-red);
    --mdc-text-field-fill-color: var(--app-background-color);
    --mdc-theme-surface: var(--app-background-color);
    --mdc-theme-primary: var(--app-header-background-color);
    --mdc-theme-error: var(--app-color-error-red);
  }
`;

export const AppStylesCss = [
  AppColors,
  BaseColors,
  LightTheme,
  DarkTheme,
  CssProperties,
  css`
  :host {
    /* VARIABLES */
    --app-grid-x: 8px;
    --app-grid-2x: 16px;
    --app-grid-2hx: 20px;
    --app-grid-3x: 24px;
    --app-grid-4x: 32px;
    --app-grid-5x: 40px;
    --app-grid-6x: 48px;
    --app-grid-7x: 56px;
    --app-grid-8x: 64px;
    --app-grid-9x: 72px;
    --app-grid-10x: 80px;

    /* GLOBALS */
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    font-size: 14px;
  }

  * {
    box-sizing: border-box;
  }

  div[hidden] {
    display: none;
  }

  pre {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    font-size: 14px;
    margin: 0;
  }

  h1 {
    font-size: 36px;
    font-weight: 400;
  }

  h2 {
    font-size: 28px;
    font-weight: 400;
  }

  h3 {
    font-size: 20px;
    font-weight: 400;
  }

  h4 {
    font-size: 18px;
    font-weight: 500;
  }

  h5 {
    font-size: 14px;
    font-weight: 500;
  }

  h6 {
    font-size: 14px;
    font-weight: 500;
  }

  p.heading {
    font-weight: bold;
  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome and Opera */
  }

  @media (min-width: ${unsafeCSS(window.MyAppGlobals.wideWidth)}) {
    :host {
      font-size: 16px;
    }

    h1 { font-size: 60px; }
    h2 { font-size: 46px; }
    h3 { font-size: 32px; }
    h4 { font-size: 22px; }
    h5 { font-size: 16px; }
    h6 { font-size: 16px; }
  }
`
];

export const AppStyles = html`
  <style>
    ${AppStylesCss}
  </style>
`;
