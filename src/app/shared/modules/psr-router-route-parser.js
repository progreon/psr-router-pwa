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

function getEntryLines(lines, startLine=0) {
  if (lines.length >= startLine) {
    var depth = lines[startLine].depth;
    var endLine = startLine;
    while (endLine + 1 < lines.length && lines[endLine + 1].depth > depth) {
      endLine++;
    }
    var entryLines = [];
    while (startLine <= endLine) {
      entryLines.push(lines[startLine]);
      startLine++;
    }
  } else {
    return [];
  }
}

/**
 * Get a dummy route.
 * @param {string} routeText
 * @returns {Route}
 */
export function ParseRouteText(routeText) {
  var str = routeText.replace(/\r\n/g, "\n");
  var lines = str.split("\n");
  var linesToParse = [];
  // TODO: immediately check for "Game: <valid game key>" on the first counting line (for efficiency reasons). If not: exception!
  var l = 0;
  while (l < lines.length && !lines[l].trim().startsWith("===")) {
    var line = lines[l];
    var d = 0;
    while (d < line.length && line.charAt(d) === '\t')
      d++;

    line = line.trim();
    if (line !== "" && !line.startsWith("//")) {
      linesToParse.push({depth: d, line: line});
    }
    l++;
  }
  console.log(linesToParse);
  // TODO: parse these lines!!

  // TODO: for the next line, get the "key" for lines that match "^([^\\s]*?): (.*)$", else the key is an empty string (will result to RouteDirections).
  // TODO: get its 'node' lines (= line + child lines).
  // TODO: parse handler for each type I guess...
}
