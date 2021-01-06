// JS imports
import { customElement, html, css, property } from 'lit-element';
import { Select } from '@material/mwc-select';
import { Menu } from '@material/mwc-menu';

@customElement('psr-router-select')
class PsrRouterSelect extends Select {

    @property({ type: Boolean, reflect: true })
    private withDialogFix: boolean;
    @property({ type: Boolean, reflect: true })
    private dense: boolean;

    render() {
        let r = super.render();
        let width = this.offsetWidth;
        let widthDOM = html`
            <style>
                :host {
                    --mdc-menu-min-width: ${width}px;
                    --mdc-menu-max-width: ${width}px;
                }
            </style>
        `;
        let denseDOM = html`
            <style>
                .mdc-select--filled > .mdc-select__anchor {
                    height: 38px !important;
                }
                :host {
                    --mdc-menu-item-height: 38px;
                }
            </style>
        `;
        return html`
            ${this.withDialogFix ? widthDOM : null}
            ${this.dense ? denseDOM : null}
            ${r}
        `;
    }

    protected firstUpdated(): Promise<void> {
        let p = super.firstUpdated();
        let menu: Menu = <Menu>this.shadowRoot.querySelector(".mdc-menu");
        if (this.withDialogFix) {
            menu.fixed = true;
            this.naturalMenuWidth = true;
        }
        return p;
    }

}
