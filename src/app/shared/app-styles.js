import { html } from '@polymer/lit-element';

export const AppColors = html`
<style>
  :host {
    /* CORPORATE COLORS */
    --app-color-polymer-blue: #4285f4;
    --app-color-slate: #8c9192;
    --app-color-white: #ffffff;
    --app-color-black: #1d1d1b;
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
</style>
`;

export const AppStyles = html`
${AppColors}

<style>
  :host {
    /* VARIABLES */
    --app-grid-x: 8px;
    --app-grid-2x: 16px;
    --app-grid-2hx: 20px;
    --app-grid-3x: 24px;
    --app-grid-5x: 40px;
    --app-grid-6x: 48px;
    --app-grid-7x: 56px;
    --app-grid-8x: 64px;
    --app-grid-9x: 72px;
    --app-grid-10x: 80px;

    /* GLOBALS */
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    /* line-height: 1.5; */
    font-size: 14px;
  }

  h1 {
    font-family: VolvoBroadProDigital, Arial, Helvetica, sans-serif;
    font-size: 36px;
    font-weight: 400;
  }

  h2 {
    font-size: 32px;
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

  @media (min-width: ${MyAppGlobals.wideWidth}) {
    :host {
      font-size: 16px;
    }

    h1 { font-size: 60px; }
    h2 { font-size: 48px; }
    h3 { font-size: 24px; }
    h4 { font-size: 22px; }
    h5 { font-size: 16px; }
    h6 { font-size: 16px; }
  }
</style>
`;
