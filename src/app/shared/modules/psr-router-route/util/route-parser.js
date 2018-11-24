'use strict';

// Polyfill for String::startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

// JS Imports
import { GetGame } from '../../psr-router-data/psr-router-data';
import * as Model from '../../psr-router-model';
import * as Util from '../../psr-router-util';
import * as Route from '..';

export function GetEntryLines(lines, startLine=0) {
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
    var sublines = GetEntryLines(lines, startLine);
    var i = sublines[0].line.indexOf(": ");
    var type = sublines[0].line.substring(0, i).toUpperCase();
    switch (type) {
      case Route.RouteBattle.getEntryType().toUpperCase():
        if (Route.RouteBattle.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
        entries.push(Route.RouteBattle.newFromRouteFileLines(parent, sublines));
        break;
      case Route.RouteEntry.getEntryType().toUpperCase():
        if (Route.RouteEntry.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
        entries.push(Route.RouteEntry.newFromRouteFileLines(parent, sublines));
        break;
      case Route.RouteGetPokemon.getEntryType().toUpperCase():
        if (Route.RouteGetPokemon.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
        entries.push(Route.RouteGetPokemon.newFromRouteFileLines(parent, sublines));
        break;
      case Route.RouteSection.getEntryType().toUpperCase():
        if (Route.RouteSection.getEntryType() !== "")
          sublines[0].line = sublines[0].line.substring(i + 2);
        entries.push(Route.RouteSection.newFromRouteFileLines(parent, sublines));
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

function _PARSE1_getFileLines(routeText) {
  // Windows to Unix endings
  var str = routeText.replace(/\r\n/g, "\n");
  // Split into lines
  var lines = str.split("\n");
  var fileLines = [];
  var l = 0;
  while (l < lines.length && !lines[l].trim().startsWith("===")) {
    var line = lines[l];
    var d = 0; // TODO: support spaces?
    while (d < line.length && line.charAt(d) === '\t')
      d++;

    line = line.trim();
    if (line !== "" && !line.startsWith("//")) {
      fileLines.push({depth: d, ln: l, line: line});
    }
    l++;
  }
  return fileLines;
}

function _PARSE2_toScopedLinesArray(lines) {
  lines = JSON.parse(JSON.stringify(lines)); // deep clone for use
  // This can contain multiple scopes, but all starting from the same scope depth
  var arr = [];
  var currLine = 0;
  while (currLine < lines.length) {
    var currScope = _PARSE2a_getScopedLines(lines, currLine);
    var entry = currScope.shift();
    var newLine = { ln: entry.ln, line: entry.line };
    // while we're here, add some help for the next parser step
    newLine.type = entry.line.substring(0, entry.line.indexOf(": ")).toUpperCase();
    if (newLine.type !== "") {
      newLine.untypedLine = entry.line.substring(newLine.type.length + 2).trim();
    } else {
      newLine.untypedLine = entry.line;
    }
    // get the subscope
    if (currScope.length > 0) {
      newLine.scope = _PARSE2_toScopedLinesArray(currScope);
    }
    arr.push(newLine);
    currLine += currScope.length + 1;
  }
  return arr;
}

function _PARSE2a_getScopedLines(lines, startLine=0) {
  var scope = [];
  if (lines.length >= startLine) {
    scope.push(lines[startLine]);
    var currLine = startLine + 1;
    while (currLine < lines.length && lines[currLine].depth > lines[startLine].depth) {
      scope.push(lines[currLine]);
      currLine++;
    }
  }
  return scope;
}

function _PARSE3_getRouteJSON(scopedLinesArray) {
  scopedLinesArray = JSON.parse(JSON.stringify(scopedLinesArray)); // deep clone for use
  var gameKey = "";
  var routeTitle = "";
  // var routeDescription = "";
  var routeEntries = [];
  scopedLinesArray.forEach(scopedLines => {
    if (scopedLines.type === "GAME") {
      gameKey = scopedLines.untypedLine;
    } else if (scopedLines.type === "ROUTE") {
      routeTitle = scopedLines.untypedLine;
      routeEntries = _PARSE3a_getRouteJSONEntries(scopedLines.scope);
    }
  });
  return { game: gameKey, info: { title: routeTitle }, entries: routeEntries };
}

function _PARSE3a_getRouteJSONEntries(scopedLines) {
  var entries = [];
  scopedLines.forEach(scopedLine => {
    // Getting some most used stuff, we can always overwrite it
    var entry = {
      type: scopedLine.type,
      info: { title: "", summary: "", description: "" },
      location: "" // TODO: support this!
    };
    // Now entry type specific stuff
    switch (scopedLine.type) {
      case Route.RouteGetPokemon.getEntryType().toUpperCase():
        entry.choices = [];
        entry.preference = 0;
      case Route.RouteBattle.getEntryType().toUpperCase():
        entry.entryString = scopedLine.untypedLine; // TODO: this is only temporary until route entries are more complete
        if (scopedLine.scope && scopedLine.scope.length > 0) {
          var titleLine = scopedLine.scope.shift();
          var splitted = titleLine.line.split(" :: ");
          entry.info = splitted.length > 1 ? { title: splitted.shift().trim(), summary: splitted.join(" :: ").trim() } : { title: "", summary: titleLine.line };
          entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        break;
      case Route.RouteEntry.getEntryType().toUpperCase():
        entry.entryString = scopedLine.untypedLine; // TODO: this is only temporary until route entries are more complete
        var splitted = scopedLine.untypedLine.split(" :: ");
        entry.info = splitted.length > 1 ? { title: splitted.shift().trim(), summary: splitted.join(" :: ").trim() } : { title: scopedLine.untypedLine, summary: "" };
        if (scopedLine.scope && scopedLine.scope.length > 0) {
          // var titleLine = scopedLine.scope.shift();
          // var splitted = titleLine.line.split(" :: ");
          // entry.info = splitted.length > 1 ? { title: splitted.shift().trim(), summary: splitted.join(" :: ").trim() } : { title: "", summary: titleLine.line };
          entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        break;
      case Route.RouteSection.getEntryType().toUpperCase():
        var splitted = scopedLine.untypedLine.split(" :: ");
        entry.info = splitted.length > 1 ? { title: splitted.shift().trim(), summary: splitted.join(" :: ").trim() } : { title: scopedLine.untypedLine, summary: "" };
        entry.entries = scopedLine.scope ? _PARSE3a_getRouteJSONEntries(scopedLine.scope) : [];
        break;
      case Route.RouteDirections.getEntryType().toUpperCase():
      default:
        entry.info.summary = scopedLine.line;
        entry.info.description = scopedLine.scope ? scopedLine.scope.map(l => l.line).join("\n") : "";
    }
    entries.push(entry);
  });
  return entries;
}

export function ExportRouteText(routeJSON) {
  var scopedLinesArrayR = _PARSE3R_getScopedLinesArray(routeJSON);
  // console.log("scopedLinesArrayR:", scopedLinesArrayR);
  var linesToParseR = _PARSE2R_getFileLines(scopedLinesArrayR);
  // console.log("linesToParseR:", linesToParseR);
  var routeTextR = _PARSE1R_getRouteText(linesToParseR);
  // console.log("reversed route text:", routeTextR);
  return routeTextR;
}

/**
 * Get a dummy route.
 * @param {string} routeText
 * @returns {Route}
 */
export function ParseRouteText(routeText) {
  // console.log("TODO: Parse these line scopes:");
  var linesToParse = _PARSE1_getFileLines(routeText);
  var scopedLinesArray = _PARSE2_toScopedLinesArray(linesToParse);
  console.log("scopedLinesArray:", scopedLinesArray);
  var routeJSON = _PARSE3_getRouteJSON(scopedLinesArray);
  console.log("routeJSON:", routeJSON);
  return routeJSON;
  // return Route.Route.newFromJSONObject(routeJSON);

  // console.log(JSON.stringify(this.getJSONObject(), (key, val) => (val && (val === [] || val === {})) || val === false ? val : undefined, "\t"));
  // check with the reverse!
  // var scopedLinesArrayR = _PARSE3R_getScopedLinesArray(routeJSON);
  // // console.log("scopedLinesArrayR:", scopedLinesArrayR);
  // var linesToParseR = _PARSE2R_getFileLines(scopedLinesArrayR);
  // // console.log("linesToParseR:", linesToParseR);
  // var routeTextR = _PARSE1R_getRouteText(linesToParseR);
  // // console.log("reversed route text:", routeTextR);


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
        var lines = GetEntryLines(linesToParse, currLine);
        route = Route.Route.newFromRouteFileLines(game, lines);
        currLine += lines.length;
        break;
      default:
        currLine++;
    }
  }

  return route;
}

//// THE REVERSE ////

function _PARSE3R_getScopedLinesArray(routeJSON) {
  var scopedLinesArray = []; // each line containing { line, scope }, with scope: linesArray
  var gameLine = { line: "Game: " + (routeJSON.game ? routeJSON.game : "N/A") };
  scopedLinesArray.push(gameLine);
  var routeLine = {
    line: "Route: " + (routeJSON.info ? routeJSON.info.title : ""),
    scope: routeJSON.entries ? _PARSE3R_getScopedEntryLines(routeJSON.entries) : []
  }
  scopedLinesArray.push(routeLine);
  return scopedLinesArray;
}

function _PARSE3R_getScopedEntryLines(routeJSONEntries) {
  var scopedLines = [];
  routeJSONEntries.forEach(jsonEntry => {
    var scopedLine = { line: "", scope: [] };
    // Now entry type specific stuff
    switch (jsonEntry.type) {
      case Route.RouteGetPokemon.getEntryType().toUpperCase():
        // TODO: choices, preference
        scopedLine.line = Route.RouteGetPokemon.getEntryType() + ": " + jsonEntry.entryString; // TODO: this is only temporary until route entries are more complete
        if (jsonEntry.info) {
          if (jsonEntry.info.summary) {
            scopedLine.scope.push({ line: (jsonEntry.info.title ? jsonEntry.info.title + " :: " : "") + jsonEntry.info.summary });
            if (jsonEntry.info.description) {
              jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push({ line: d.trim() }));
            }
          } else {
            // TODO
          }
        }
        break;
      case Route.RouteBattle.getEntryType().toUpperCase():
        scopedLine.line = Route.RouteBattle.getEntryType() + ": " + jsonEntry.entryString; // TODO: this is only temporary until route entries are more complete
        if (jsonEntry.info) {
          if (jsonEntry.info.summary) {
            scopedLine.scope.push({ line: (jsonEntry.info.title ? jsonEntry.info.title + " :: " : "") + jsonEntry.info.summary });
            if (jsonEntry.info.description) {
              jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push({ line: d.trim() }));
            }
          } else {
            // TODO
          }
        }
        break;
      case Route.RouteEntry.getEntryType().toUpperCase():
        if (jsonEntry.info) {
          if (jsonEntry.info.title) {
            scopedLine.line = Route.RouteEntry.getEntryType() + ": " + jsonEntry.info.title + (jsonEntry.info.summary ? " :: " + jsonEntry.info.summary : "");
            if (jsonEntry.info.description)
              jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push({ line: d.trim() }));
          } else {
            // TODO
          }
        }
        break;
      case Route.RouteSection.getEntryType().toUpperCase():
        if (jsonEntry.info) {
          if (jsonEntry.info.title) {
            scopedLine.line = Route.RouteSection.getEntryType() + ": " + jsonEntry.info.title + (jsonEntry.info.summary ? " :: " + jsonEntry.info.summary : "");
            scopedLine.scope = _PARSE3R_getScopedEntryLines(jsonEntry.entries ? jsonEntry.entries : []);
          } else {
            // TODO
          }
        }
        break;
      case Route.RouteDirections.getEntryType().toUpperCase():
      default:
        if (jsonEntry.info) {
          if (jsonEntry.info.summary) {
            scopedLine.line = jsonEntry.info.summary
            if (jsonEntry.info.description)
              jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push({ line: d.trim() }));
          } else {
            // TODO
          }
        }
    }
    if (scopedLine.line)
      scopedLines.push(scopedLine);
  });
  return scopedLines;
}

function _PARSE2R_getFileLines(scopedLinesArray, depth=0) {
  var lines = [];
  scopedLinesArray.forEach(scopedLines => {
    lines.push({ line: scopedLines.line, depth: depth })
    if (scopedLines.scope && scopedLines.scope.length > 0) {
      lines = lines.concat(_PARSE2R_getFileLines(scopedLines.scope, depth + 1));
    }
  });
  return lines;
}

function _PARSE1R_getRouteText(fileLines, printerSettings) {
  const le = printerSettings && printerSettings.lineEnding ? printerSettings.lineEnding : "\r\n";
  var routeText = "";
  fileLines.forEach(fileLine => {
    var newLine = "";
    for (var d = 0; d < fileLine.depth; d++) {
      newLine += "\t";
    }
    newLine += fileLine.line;
    routeText += newLine + le;
  });
  return routeText;
}
