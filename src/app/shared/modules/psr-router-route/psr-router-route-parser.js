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
    return entryLines;
  } else {
    return [];
  }
}

export function GetEntryListFromLines(parent, lines, startLine=0) {
  var entries = [];
  while (startLine < lines.length) {
    var sublines = getEntryLines(lines, startLine);
    var i = sublines[0].line.indexOf(": ");
    var type = sublines[0].line.substring(0, i).toUpperCase();
    switch (type) {
      case Route.RouteSection.getEntryType().toUpperCase():
        if (Route.RouteSection.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
        entries.push(Route.RouteSection.newFromRouteFileLines(parent, sublines));
        break;
      case Route.RouteEntry.getEntryType().toUpperCase():
        if (Route.RouteEntry.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
        entries.push(Route.RouteEntry.newFromRouteFileLines(parent, sublines));
        break;
      case Route.RouteDirections.getEntryType().toUpperCase():
        if (Route.RouteDirections.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
      default:
        entries.push(Route.RouteDirections.newFromRouteFileLines(parent, sublines));
    }

    startLine += sublines.length;
  }
  return entries;
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
  console.log("TODO: parse these lines!", linesToParse);

  // TODO: for the next line, get the "key" for lines that match "^(.*?): (.*)$", else the key is an empty string (will result to RouteDirections).
  // TODO: get its 'node' lines (= line + child lines).
  // TODO: parse handler for each type I guess...

  var route;
  var game;
  var currLine = 0;
  while (currLine < linesToParse.length) {
    var i = linesToParse[currLine].line.indexOf(": ");
    var prefix = linesToParse[currLine].line.substring(0, i).toUpperCase();
    switch (prefix) {
      // TODO: other settings?
      case "Game".toUpperCase():
        game = GetGame(linesToParse[currLine].line.substring(i + 2));
        currLine++;
        break;
      case Route.Route.getEntryType().toUpperCase():
        if (!game) {
          // TODO: throw exception!
          throw new Util.RouterError("A game must be defined before the route definition!", "Parser Error");
        }
        linesToParse[currLine].line = linesToParse[currLine].line.substring(i + 2);
        var lines = getEntryLines(linesToParse, currLine);
        route = Route.Route.newFromRouteFileLines(game, lines);
        currLine += lines.length;
        break;
      default:
        currLine++;
    }
  }

  return route;
}
