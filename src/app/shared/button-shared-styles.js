import { html } from 'lit-element';

export const ButtonSharedStyles = html`
<style>
  button {
    font-size: inherit;
    vertical-align: middle;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  button:hover svg {
    fill: var(--app-primary-color);
  }
</style>
`;
