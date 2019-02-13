// JS imports
import * as Route from 'SharedModules/psr-router-route';
import * as RouteIO from './route-io';

if (!window.app) {
  window.app = {};
}

export function GetCurrentRoute() {
  return window.app.route;
}

export function GetCurrentGame() {
  return window.app.game;
}

export function SetCurrentRoute(route=null) {
  window.app.route = route;
  window.app.game = route ? route.game : null;
  return route;
}

//// LOAD & SAVE LOCALLY ////

const lsKeySavedRoute = "saved-route";

export function LoadSavedRoute() {
  var routeJSON = localStorage.getItem(lsKeySavedRoute);
  var route = null;
  if (routeJSON) {
    route = Route.Route.newFromJSONObject(JSON.parse(routeJSON));
    route.getEntryList().forEach(e => e.messages.forEach(m => console.warn(m.toString())));
  }
  return SetCurrentRoute(route);
}

export function SaveRoute(route=null) {
  if (!route) {
    route = GetCurrentRoute();
  } else {
    SetCurrentRoute(route);
  }
  if (route) {
    localStorage.setItem(lsKeySavedRoute, JSON.stringify(route.getJSONObject()));
  }
  return route;
}

// TODO: new route

//// EXAMPLE ROUTES ////
import exampleRoute from 'SharedData/routes/example_route.json';
import blueDummy from 'SharedData/routes/blue_dummy.json';
import yellowDummy from 'SharedData/routes/yellow_dummy.json';
import crystalDummy from 'SharedData/routes/crystal_dummy.json';
import redGodNidoBasic from 'SharedData/routes/red_god_nido_basic.json';

var exampleRoutes = {};
exampleRoutes[exampleRoute.shortname] = exampleRoute;
exampleRoutes[redGodNidoBasic.shortname] = redGodNidoBasic;
exampleRoutes[blueDummy.shortname] = blueDummy;
exampleRoutes[yellowDummy.shortname] = yellowDummy;
exampleRoutes[crystalDummy.shortname] = crystalDummy;

export function GetExampleRoutesNames() {
  return Object.keys(exampleRoutes);
}

export function LoadExampleRoute(routeName) {
  var routeJSON = exampleRoutes[routeName];
  if (!routeJSON) {
    routeJSON = exampleRoute;
    routeName = exampleRoute.shortname;
  }
  var route = Route.Route.newFromJSONObject(routeJSON);
  route.getEntryList().forEach(e => e.messages.forEach(m => console.warn(m.toString())));
  return SaveRoute(route);
}

//// LOAD/EXPORT FROM/TO FILES ////

export function LoadRouteFile(file) {
  return new Promise((resolve, reject) => {
    if (file) {
      var filename = file.name;
      var fileReader = new FileReader();
      fileReader.onload = function(e) {
        try {
          var route = RouteIO.ImportFromFile(e.target.result, filename.search(/\.json$/) > 0, filename);
          route.getEntryList().forEach(e => e.messages.forEach(m => console.warn(m.toString())));
          resolve(SaveRoute(route));
        } catch (e) {
          reject(e);
        }
      }
      fileReader.readAsText(file);
    } else {
      reject();
    }
  });
}

export function ExportRouteFile(filename, printerSettings, route) {
  console.debug("Exporting to route file...", filename, printerSettings);
  if (!route) {
    route = GetCurrentRoute();
  }
  return RouteIO.ExportToFile(route, filename, printerSettings);
}
