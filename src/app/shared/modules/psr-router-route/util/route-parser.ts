'use strict';

// JS Imports
import * as Util from '../../psr-router-util';
import { EntryJSON } from '../parse/EntryJSON';
import { RouteSectionParser } from '../parse/RouteSectionParser';
import { ScopedLine } from '../parse/ScopedLine';
import { RouteJSON } from '../parse/RouteJSON';
import { ParserLine } from '../parse/ParserLine';

/**
 * // TODO: docu
 */
export function ParseRouteText(routeText: string, filename: string): RouteJSON {
  const linesToParse = _PARSE1_getFileLines(routeText);
  const scopedLinesArray = _PARSE2_toScopedLinesArray(linesToParse);
  console.log(scopedLinesArray);
  const routeJSON = _PARSE3_getRouteJSON(scopedLinesArray, filename);
  return routeJSON;
}

/**
 * // TODO: docu
 */
export function ExportRouteText(routeJSON: RouteJSON): string {
  let scopedLinesArrayR = _PARSE3R_getScopedLinesArray(routeJSON);
  let linesToParseR = _PARSE2R_getFileLines(scopedLinesArrayR);
  let routeTextR = _PARSE1R_getRouteText(linesToParseR);
  return routeTextR;
}

function _PARSE1_getFileLines(routeText: string): ParserLine[] {
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

    let ss = line.indexOf('//');
    line = ss < 0 ? line.trim() : line.substr(0, ss).trim(); // comments like these work now!
    if (line !== "") {
      fileLines.push(new ParserLine(d, line, l));
    }
    l++;
  }
  return fileLines;
}

function _PARSE2_toScopedLinesArray(lines: ParserLine[]): ScopedLine[] {
  lines = JSON.parse(JSON.stringify(lines)); // deep clone for use
  // This can contain multiple scopes, but all starting from the same scope depth
  let arr: ScopedLine[] = [];
  let currLine = 0;
  while (currLine < lines.length) {
    const currScope = _PARSE2a_getScopedLines(lines, currLine);
    const entry = currScope.shift();
    let newLine: ScopedLine = new ScopedLine(entry.line, entry.ln);
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

function _PARSE2a_getScopedLines(lines: ParserLine[], startLine=0): ParserLine[] {
  let scope: ParserLine[] = [];
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

function _PARSE3_getRouteJSON(scopedLinesArray: ScopedLine[], filename: string): RouteJSON {
  scopedLinesArray = JSON.parse(JSON.stringify(scopedLinesArray)); // deep clone for use
  let gameKey = "";
  let routeTitle = "";
  let routeEntries: EntryJSON[] = [];
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
      routeEntries = new RouteSectionParser().parseLinesScopeToJSON(scopedLines.scope, filename);
    }
  });
  if (!gameKey) {
    throw new Util.RouterError("No game definition found!", "Parser Error");
  }
  const regex = /(.*[\\\/])?(.*)(\..*)$/.exec(filename);
  const shortname = regex && regex.length > 0 ? regex[2] : routeTitle;
  return new RouteJSON(gameKey, shortname, { title: routeTitle }, routeEntries);
}

//// THE REVERSE ////

function _PARSE3R_getScopedLinesArray(routeJSON: RouteJSON): ScopedLine[] {
  let scopedLinesArray: ScopedLine[] = []; // each line containing { line, scope }, with scope: linesArray
  let gameLine = new ScopedLine("Game: " + (routeJSON.game ? routeJSON.game : "N/A"));
  scopedLinesArray.push(gameLine);
  let routeLine = new ScopedLine("Route: " + (routeJSON.info ? routeJSON.info.title : ""));
  routeLine.scope = new RouteSectionParser().parseJSONScopeToLines(routeJSON.entries);
  scopedLinesArray.push(routeLine);
  return scopedLinesArray;
}

function _PARSE2R_getFileLines(scopedLinesArray: ScopedLine[], depth=0): ParserLine[] {
  let lines: ParserLine[] = [];
  scopedLinesArray.forEach(scopedLines => {
    lines.push(new ParserLine(depth, scopedLines.line));
    if (scopedLines.scope && scopedLines.scope.length > 0) {
      lines = lines.concat(_PARSE2R_getFileLines(scopedLines.scope, depth + 1));
    }
  });
  return lines;
}

function _PARSE1R_getRouteText(fileLines: ParserLine[], printerSettings?: any): string {
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
