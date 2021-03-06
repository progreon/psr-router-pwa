import 'es6-promise'; // IE11
// import 'babel-polyfill'; // IE11
import 'whatwg-fetch'; // IE11, iOS <10.2
// import '@webcomponents/webcomponentsjs/webcomponents-loader.js'; // IE11, Edge, Firefox, Safari<11
import 'url-polyfill'; // IE11

// Polyfill for String::startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}
