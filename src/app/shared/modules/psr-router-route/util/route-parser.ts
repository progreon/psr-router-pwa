'use strict';

// Polyfill for String::startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

// JS Imports
import * as Util from '../../psr-router-util';
import * as Route from '..';

/**
 * // TODO: docu
 */
export function ParseRouteText(routeText, filename) {
  const linesToParse = _PARSE1_getFileLines(routeText);
  const scopedLinesArray = _PARSE2_toScopedLinesArray(linesToParse);
  const routeJSON = _PARSE3_getRouteJSON(scopedLinesArray, filename);
  return routeJSON;
}

/**
 * // TODO: docu
 */
export function ExportRouteText(routeJSON) {
  let scopedLinesArrayR = _PARSE3R_getScopedLinesArray(routeJSON);
  let linesToParseR = _PARSE2R_getFileLines(scopedLinesArrayR);
  let routeTextR = _PARSE1R_getRouteText(linesToParseR);
  return routeTextR;
}

function _PARSE1_getFileLines(routeText) {
  // Windows to Unix endings
  const str = routeText.replace(/\r\n/g, "\n");
  // Split into lines
  const lines = str.split("\n");
  let fileLines = [];
  let l = 0;
  while (l < lines.length && !lines[l].trim().startsWith("===")) {
    let line = lines[l];
    let d = 0; // TODO: support spaces?
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
  let arr = [];
  let currLine = 0;
  while (currLine < lines.length) {
    const currScope = _PARSE2a_getScopedLines(lines, currLine);
    const entry = currScope.shift();
    let newLine: any = { ln: entry.ln, line: entry.line };
    // while we're here, add some help for the next parser step
    newLine.type = entry.line.substring(0, entry.line.indexOf(":")).toUpperCase();
    if (newLine.type !== "") {
      newLine.untypedLine = entry.line.substring(newLine.type.length + 1).trim();
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
  let scope = [];
  if (lines.length >= startLine) {
    scope.push(lines[startLine]);
    let currLine = startLine + 1;
    while (currLine < lines.length && lines[currLine].depth > lines[startLine].depth) {
      scope.push(lines[currLine]);
      currLine++;
    }
  }
  return scope;
}

function _PARSE3_getRouteJSON(scopedLinesArray, filename) {
  scopedLinesArray = JSON.parse(JSON.stringify(scopedLinesArray)); // deep clone for use
  let gameKey = "";
  let routeTitle = "";
  let routeEntries = [];
  scopedLinesArray.forEach(scopedLines => {
    if (scopedLines.type === "GAME") {
      gameKey = scopedLines.untypedLine;
      if (!gameKey) {
        throw new Util.RouterError(`${filename}:${scopedLines.ln+1} No game definition found`, "Parser Error");
      }
    } else if (scopedLines.type === "ROUTE") {
      routeTitle = scopedLines.untypedLine;
      if (!routeTitle) {
        throw new Util.RouterError(`${filename}:${scopedLines.ln+1} Please provide a title for the route`, "Parser Error");
      }
      routeEntries = _PARSE3a_getRouteJSONEntries(scopedLines.scope, filename);
    }
  });
  if (!gameKey) {
    throw new Util.RouterError("No game definition found!", "Parser Error");
  }
  const regex = /(.*[\\\/])?(.*)(\..*)$/.exec(filename);
  const shortname = regex && regex.length > 0 ? regex[2] : routeTitle;
  return { game: gameKey, info: { title: routeTitle }, shortname: shortname, entries: routeEntries };
}

function _PARSE3a_getRouteJSONEntries(scopedLines, filename) {
  let entries = [];
  let title;
  let summary;
  let tOrS;
  let s;
  let description;
  scopedLines.forEach(scopedLine => {
    // Getting some most used stuff, we can always overwrite it
    let entry: any = {
      type: scopedLine.type,
      info: { title: "", summary: "", description: "" },
      location: "" // TODO: support this!
    };
    // Now entry type specific stuff
    switch (scopedLine.type) {
      case Route.RouteGetPokemon.ENTRY_TYPE.toUpperCase():
        // GetP: [#]<option> [[#]<option> [..]]
        //     [<title> ::] <summary>
        //     <description lines>
        // with <option> = <pokemon>:<level>
        // only one preferred option (with '#') allowed
        entry.choices = [];
        // e.g. "pikachu:5  #bulbasaur:5"
        let choices = scopedLine.untypedLine.split(" ").filter(spl => !!spl); // filter out the empty strings (in case of multiple spaces)
        let preference = 0;
        for (let i = 0; i < choices.length; i++) {
          if (choices[i]) { // in case of choices separated by multiple spaces
            let [pokemon, level] = choices[i].split(":");
            level = parseInt(level);
            if (pokemon && !isNaN(level)) {
              if (pokemon.startsWith("#")) {
                if (entry.preference == undefined) {
                  entry.preference = preference;
                } else {
                  throw new Util.RouterError(`${filename}:${scopedLine.ln+1} Only one preffered option allowed`, "Parser Error");
                }
                pokemon = pokemon.substring(1);
              }
            } else {
              throw new Util.RouterError(`${filename}:${scopedLine.ln+1} Invalid pokemon-level pair "${choices[i]}"`, "Parser Error");
            }
            entry.choices.push({pokemon, level});
            preference++;
          }
        }
        if (scopedLine.scope && scopedLine.scope.length > 0) {
          let titleLine = scopedLine.scope.shift();
          [tOrS, ...s] = titleLine.line.split("::");
          s = s && s.length > 0 ? s.join("::").trim() : "";
          entry.info = { title: s ? tOrS.trim() : "", summary: s || tOrS };
          entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        break;
      case Route.RouteBattle.ENTRY_TYPE.toUpperCase():
        // B: <trainer> [:: <shared> [<shared> [..]]]
        //     [<title> ::] <summary>
        //     <description lines>
        // with <shared> = <trainerPartyId>:<playerPartyId>[,<playerPartyId>[..]]
        let [trainer, shared] = scopedLine.untypedLine.split("::").map(s => s.trim());
        if (!trainer) {
          throw new Util.RouterError(`${filename}:${scopedLine.ln+1} Please provide a trainer id`, "Parser Error");
        }
        entry.trainer = trainer;
        if (shared) {
          // eg: "0:0,1  2:1"
          let bs = shared.split(" ").filter(spl => !!spl); // filter out the empty strings (in case of multiple spaces)
          let se: { [key: number]: number[]; } = {};
          let seMax = 0;
          bs.forEach(ops => {
            let [o, ps] = ops.split(":");
            if (o && ps) {
              o = parseInt(o);
              if (isNaN(o)) {
                throw new Util.RouterError(`${filename}:${scopedLine.ln+1} Invalid share-parameter ${ops} (o${o})`, "Parser Error");
              }
              se[o] = ps.split(",").map(function(p) {
                p = parseInt(p);
                if (isNaN(p)) {
                  throw new Util.RouterError(`${filename}:${scopedLine.ln+1} Invalid share-parameter ${ops}`, "Parser Error");
                }
                return p;
              });
              seMax = Math.max(o, seMax);
            }
            else {
              throw new Util.RouterError(`${filename}:${scopedLine.ln+1} Invalid share-parameter ${ops}`, "Parser Error");
            }
          });
          entry.shareExp = [];
          for (let i = 0; i <= seMax; i++) {
            entry.shareExp.push(se[i] ? se[i] : [0]);
          }
        }
        if (scopedLine.scope && scopedLine.scope.length > 0) {
          let titleLine = scopedLine.scope.shift();
          [tOrS, ...s] = titleLine.line.split("::");
          s = s && s.length > 0 ? s.join("::").trim() : "";
          entry.info = { title: s ? tOrS.trim() : "", summary: s || tOrS };
          entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        break;
      case Route.RouteEntry.ENTRY_TYPE.toUpperCase():
        // ENTRY: <title> [:: <summary>]
        //     <description lines>
        entry.entryString = scopedLine.untypedLine; // TODO: this is only temporary until route entries are more complete
        [title, ...summary] = scopedLine.untypedLine.split("::");
        entry.info = { title: title.trim(), summary: summary.join("::").trim() };
        entry.info.description = scopedLine.scope ? scopedLine.scope.map(l => l.line).join("\n") : "";
        break;
      case Route.RouteSection.ENTRY_TYPE.toUpperCase():
        // S: <title> [:: <summary>]
        //     <child entries>
        [title, ...summary] = scopedLine.untypedLine.split("::");
        entry.info = { title: title.trim(), summary: summary.join("::").trim() };
        entry.entries = scopedLine.scope ? _PARSE3a_getRouteJSONEntries(scopedLine.scope, filename) : [];
        // TODO: Message if empty section? If so, when?
        break;
      case Route.RouteDirections.ENTRY_TYPE.toUpperCase():
      default:
        // <summary>
        //     <description lines>
        entry.info.summary = scopedLine.line;
        entry.info.description = scopedLine.scope ? scopedLine.scope.map(l => l.line).join("\n") : "";
    }
    entries.push(entry);
  });
  return entries;
}

//// THE REVERSE ////

function _PARSE3R_getScopedLinesArray(routeJSON) {
  let scopedLinesArray = []; // each line containing { line, scope }, with scope: linesArray
  let gameLine = { line: "Game: " + (routeJSON.game ? routeJSON.game : "N/A") };
  scopedLinesArray.push(gameLine);
  let routeLine = {
    line: "Route: " + (routeJSON.info ? routeJSON.info.title : ""),
    scope: routeJSON.entries ? _PARSE3R_getScopedEntryLines(routeJSON.entries) : []
  }
  scopedLinesArray.push(routeLine);
  return scopedLinesArray;
}

function _PARSE3R_getScopedEntryLines(routeJSONEntries) {
  let scopedLines = [];
  routeJSONEntries.forEach(jsonEntry => {
    let scopedLine = { line: "", scope: [] };
    // Now entry type specific stuff
    let type = jsonEntry.type && jsonEntry.type.toUpperCase();
    switch (type) {
      case Route.RouteGetPokemon.ENTRY_TYPE.toUpperCase():
        scopedLine.line = Route.RouteGetPokemon.ENTRY_TYPE + ":";
        for (let i = 0; i < jsonEntry.choices.length; i++) {
          scopedLine.line += ` ${jsonEntry.preference == i ? "#" : ""}${jsonEntry.choices[i].pokemon}:${jsonEntry.choices[i].level}`;
        }
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
      case Route.RouteBattle.ENTRY_TYPE.toUpperCase():
        // eg: "0:0,1 1:0 2:1"
        scopedLine.line = Route.RouteBattle.ENTRY_TYPE + ": " + jsonEntry.trainer;
        if (jsonEntry.shareExp) {
          scopedLine.line += " ::";
          for (let i = 0; i < jsonEntry.shareExp.length; i++) {
            scopedLine.line += ` ${i}:${jsonEntry.shareExp[i].join(",")}`;
          }
        }
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
      case Route.RouteEntry.ENTRY_TYPE.toUpperCase():
        if (jsonEntry.info) {
          if (jsonEntry.info.title) {
            scopedLine.line = Route.RouteEntry.ENTRY_TYPE + ": " + jsonEntry.info.title + (jsonEntry.info.summary ? " :: " + jsonEntry.info.summary : "");
            if (jsonEntry.info.description)
              jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push({ line: d.trim() }));
          } else {
            // TODO
          }
        }
        break;
      case Route.RouteSection.ENTRY_TYPE.toUpperCase():
        if (jsonEntry.info) {
          if (jsonEntry.info.title) {
            scopedLine.line = Route.RouteSection.ENTRY_TYPE + ": " + jsonEntry.info.title + (jsonEntry.info.summary ? " :: " + jsonEntry.info.summary : "");
            scopedLine.scope = _PARSE3R_getScopedEntryLines(jsonEntry.entries ? jsonEntry.entries : []);
          } else {
            // TODO
          }
        }
        break;
      case Route.RouteDirections.ENTRY_TYPE.toUpperCase():
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
  let lines = [];
  scopedLinesArray.forEach(scopedLines => {
    lines.push({ line: scopedLines.line, depth: depth })
    if (scopedLines.scope && scopedLines.scope.length > 0) {
      lines = lines.concat(_PARSE2R_getFileLines(scopedLines.scope, depth + 1));
    }
  });
  return lines;
}

function _PARSE1R_getRouteText(fileLines, printerSettings?) {
  const le = printerSettings && printerSettings.lineEnding ? printerSettings.lineEnding : "\r\n";
  let routeText = "";
  fileLines.forEach(fileLine => {
    let newLine = "";
    for (let d = 0; d < fileLine.depth; d++) {
      newLine += "\t";
    }
    newLine += fileLine.line;
    routeText += newLine + le;
  });
  return routeText;
}
