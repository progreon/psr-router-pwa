'use strict';

// JS Imports
import * as Route from '..';
import * as RouteUtil from '.';
import { saveAs } from 'file-saver';
import { RouteJSON } from '../parse/RouteJSON';
// TODO: Checkout https://www.npmjs.com/package/bson

export function ExportToFile(route: Route.Route, filename: string, printerSettings: any): Route.Route {
  let ext = printerSettings && printerSettings.toJSON ? ".json" : ".txt";
  filename = (filename ? filename : route.shortname) + ext;
  if (!route.shortname) {
    route.shortname = filename;
  }
  console.debug("Exporting...", filename, printerSettings);
  // https://www.npmjs.com/package/file-saver
  try {
    let isFileSaverSupported = !!new Blob;
    if (isFileSaverSupported) {
      let routeJSON = <RouteJSON>route.getJSONObject();
      let text: string;
      if (printerSettings && printerSettings.toJSON) {
        if (printerSettings.printEmptyProperties) {
          text = JSON.stringify(routeJSON, null, "  ");
        } else {
          text = JSON.stringify(routeJSON, (key, val) => (val && JSON.stringify(val) !== "[]" && JSON.stringify(val) !== "{}") || val === 0 || val === false ? val : undefined, "  ");
        }
      } else{
        // parse to txt
        text = RouteUtil.RouteParser.ExportRouteText(routeJSON);
      }
      let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
    } else {
      window.alert("Exporting to a file is not supported for this browser");
    }
  } catch (e) {
    window.alert("Something went wrong while exporting, check the console for more information");
    console.error(e);
  }

  return route;
}

export function ImportFromFile(routeText: string, isJSON: boolean, filename: string): Route.Route {
  let routeJSON = isJSON ? JSON.parse(routeText) : RouteUtil.RouteParser.ParseRouteText(routeText, filename);
  return Route.Route.newFromJSONObject(routeJSON);
}
