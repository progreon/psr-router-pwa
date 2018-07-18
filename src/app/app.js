import _ from 'lodash';
import printMe from './print/print.js';

import '../style.css';

export default function app() {
  var element = document.createElement('div');
  var btn = document.createElement('button');
  var br = document.createElement('br');

  element.innerHTML = _.join(['Hello', 'World!'], ' ');
  element.classList.add('hello');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe.bind(element, 'Hello webpack!');

  element.appendChild(btn);
  element.appendChild(br);

  return element;
}
