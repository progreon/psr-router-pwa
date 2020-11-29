'use strict';

// JS Imports
import * as Route from '..';
import * as RouteUtil from '.';
import { saveAs } from 'file-saver';
import { RouteJSON } from '../parse/RouteJSON';
// TODO: Checkout https://www.npmjs.com/package/bson

export function ExportTextToFile(text: string, filename: string) {
  let isFileSaverSupported = !!new Blob;
  if (isFileSaverSupported) {
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  } else {
    throw new Error("Exporting to a file is not supported for this browser");
  }
}

export function ExportRouteToFile(route: Route.Route, filename: string, printerSettings?: any): Route.Route {
  let ext = printerSettings && printerSettings.toJSON ? ".json" : ".txt";
  filename = (filename ? filename : route.shortname) + ext;
  if (!route.shortname) {
    route.shortname = filename;
  }
  console.debug("Exporting...", filename, printerSettings);
  // https://www.npmjs.com/package/file-saver
  let routeJSON = route.getJSONObject();
  let text: string;
  if (printerSettings && printerSettings.toJSON) {
    if (printerSettings.printEmptyProperties) {
      text = JSON.stringify(routeJSON, null, "  ");
    } else {
      text = JSON.stringify(routeJSON, (key, val) => (val && JSON.stringify(val) !== "[]" && JSON.stringify(val) !== "{}") || val === 0 || val === false ? val : undefined, "  ");
    }
  } else {
    // parse to txt
    text = RouteUtil.RouteParser.ExportRouteText(routeJSON);
  }
  ExportTextToFile(text, filename);
  return route;
}

export function ImportFromFile(routeText: string, isJSON: boolean, filename: string): Route.Route {
  let routeJSON = isJSON ? JSON.parse(routeText) : RouteUtil.RouteParser.ParseRouteText(routeText, filename);
  return Route.Route.newFromJSONObject(routeJSON);
}
