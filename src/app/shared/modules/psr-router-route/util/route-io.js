'use strict';

// JS Imports
import * as Route from '..';
import * as RouteUtil from '.';
import { saveAs } from 'file-saver/FileSaver';

export function ExportToFile(route, filename, printerSettings) {
  var ext = printerSettings && printerSettings.toJSON ? ".json" : ".txt";
  filename = (filename ? filename : route.shortname) + ext;
  if (filename) {
    route.shortname = filename;
  }
  console.log("Exporting...", filename, printerSettings);
  // https://www.npmjs.com/package/file-saver
  try {
    var isFileSaverSupported = !!new Blob;
    if (isFileSaverSupported) {
      var routeJSON = route.getJSONObject();
      var text;
      if (printerSettings && printerSettings.toJSON) {
        if (printerSettings.printEmptyProperties) {
          text = JSON.stringify(routeJSON, null, "\t");;
        } else {
          text = JSON.stringify(routeJSON, (key, val) => (val && (val !== [] || val !== {})) || val === false ? val : undefined, "\t");
        }
      } else{
        // parse to txt
        text = RouteUtil.RouteParser.ExportRouteText(routeJSON);
      }
      console.debug(text);
      var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
    } else {
      window.alert("Exporting to a file is not supported for this browser...");
    }
  } catch (e) {
    window.alert("Exporting to a file is not supported for this browser...");
  }

  return route;
}

export function ImportFromFile(routeText, isJSON, filename) {
  var routeJSON = isJSON ? JSON.parse(routeText) : RouteUtil.RouteParser.ParseRouteText(routeText, filename);
  console.log("routeJSON:", routeJSON);
  return Route.Route.newFromJSONObject(routeJSON);
}
