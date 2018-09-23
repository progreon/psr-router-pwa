'use strict';

// Polyfill for String::startsWith
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}

// JS Imports
import { GetGame } from 'SharedModules/psr-router-data/psr-router-data';
import * as Model from 'SharedModules/psr-router-model';
import * as Util from 'SharedModules/psr-router-util';
import * as Route from 'SharedModules/psr-router-route';

/**
 * Get a dummy route.
 * @param {string} routeText
 * @returns {Route}
 */
export function ParseRouteText(routeText) {
  var str = routeText.replace(/\r\n/g, "\n");
  var lines = str.split("\n");
  var linesToParse = [];
  for (var l = 0; l < lines.length; l++) {
    var line = lines[l];
    var d = 0;
    while (d < line.length && line.charAt(d) === '\t')
      d++;

    line = line.trim();
    if (line !== "" && !line.startsWith("//")) {
      linesToParse.push({depth: d, line: line});
    }
  }
  console.log(linesToParse);

  // TODO: parse these lines!!
}
