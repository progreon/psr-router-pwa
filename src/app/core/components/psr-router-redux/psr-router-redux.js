import { html } from '@polymer/lit-element';
import { PsrRouterPage } from 'CoreComponents/psr-router-page/psr-router-page';
import { connect } from 'pwa-helpers/connect-mixin';

// This element is connected to the Redux store.
import { store } from 'Core/store';

// These are the actions needed by this element.
import { increment, decrement } from 'CoreActions/counter';

// We are lazy loading its reducer.
import counter from 'CoreReducers/counter';
store.addReducers({
  counter
});

// These are the elements needed by this element.
import 'SharedComponents/counter-element/counter-element';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterRedux extends connect(store)(PsrRouterPage) {
  _render() {
    return html`
      ${AppStyles}
      <section>
        <h2>Redux example: simple counter</h2>
        <div class="circle">${this._value}</div>
        <p>This page contains a reusable <code>&lt;counter-element&gt;</code>. The
        element is not built in a Redux-y way (you can think of it as being a
        third-party element you got from someone else), but this page is connected to the
        Redux store. When the element updates its counter, this page updates the values
        in the Redux store, and you can see the current value of the counter reflected in
        the bubble above.</p>
        <br><br>
      </section>
      <section>
        <p>
          <counter-element .value="${this._value}" .clicks="${this._clicks}"
              @counter-incremented="${store.dispatch(increment())}"
              @counter-decremented="${store.dispatch(decrement())}">
          </counter-element>
        </p>
      </section>
    `;
  }

  static get properties() {
    return {
      // This is the data from the store.
      _clicks: Number,
      _value: Number
    };
  }

  // This is called every time something is updated in the store.
  _stateChanged(state) {
    this._clicks = state.counter.clicks;
    this._value = state.counter.value;
  }
}

window.customElements.define('psr-router-redux', PsrRouterRedux);
