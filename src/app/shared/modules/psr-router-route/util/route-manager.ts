// JS imports
import * as Route from 'SharedModules/psr-router-route';
import * as RouteIO from './route-io';
import { Game } from '../../psr-router-model/Game';

if (!window.app) {
  window.app = {};
}

export function GetCurrentRoute(): Route.Route {
  return window.app.route;
}

export function GetCurrentGame(): Game {
  return window.app.game;
}

export function SetCurrentRoute(route: Route.Route = null): Route.Route {
  window.app.route = route;
  window.app.game = route ? route.game : null;
  if (route.getAllMessages().length == 0) {
    route.apply();
  }
  return route;
}

//// LOAD & SAVE LOCALLY ////

const lsKeySavedRoute = "saved-route";

export function LoadSavedRoute(): Route.Route {
  let routeJSON = localStorage.getItem(lsKeySavedRoute);
  let route: Route.Route = null;
  if (routeJSON) {
    route = Route.Route.newFromJSONObject(JSON.parse(routeJSON));
    route.entryList.forEach(e => e.messages.forEach(m => console.warn(m.toString())));
  }
  return SetCurrentRoute(route);
}

export function SaveRoute(route: Route.Route = null): Route.Route {
  if (!route) {
    route = GetCurrentRoute();
  } else {
    route = SetCurrentRoute(route);
  }
  if (route) {
    localStorage.setItem(lsKeySavedRoute, JSON.stringify(route.getJSONObject()));
  }
  return route;
}

// TODO: new route

//// EXAMPLE ROUTES ////
import * as redAnyGlitchlessBasic from 'SharedData/routes/Red Any% Glitchless (Basic).json';
import * as redAnyGlitchlessClassic from 'SharedData/routes/Red Any% Glitchless Classic.json';
// import * as exampleRoute from 'SharedData/routes/example_route.json';
// import * as redGodNidoBasic from 'SharedData/routes/red_god_nido_basic.json';
// import * as blueDummy from 'SharedData/routes/blue_dummy.json';
import * as yellowDummy from 'SharedData/routes/yellow_dummy.json';
// import * as crystalDummy from 'SharedData/routes/crystal_dummy.json';

let exampleRoutes: { [key: string]: any; } = {};
exampleRoutes[redAnyGlitchlessBasic.shortname] = redAnyGlitchlessBasic;
exampleRoutes[redAnyGlitchlessClassic.shortname] = redAnyGlitchlessClassic;
// exampleRoutes[exampleRoute.shortname] = exampleRoute;
// exampleRoutes[redGodNidoBasic.shortname] = redGodNidoBasic;
// exampleRoutes[blueDummy.shortname] = blueDummy;
exampleRoutes[yellowDummy.shortname] = yellowDummy;
// exampleRoutes[crystalDummy.shortname] = crystalDummy;

export function GetExampleRoutesNames(): string[] {
  return Object.keys(exampleRoutes);
}

export function LoadExampleRoute(routeName: string): Route.Route {
  let routeJSON = exampleRoutes[routeName];
  if (routeJSON) {
    let route = Route.Route.newFromJSONObject(routeJSON);
    route.entryList.forEach(e => e.messages.forEach(m => console.warn(m.toString())));
    return SaveRoute(route);
  } else {
    return null;
  }
}

//// LOAD/EXPORT FROM/TO FILES ////

export function LoadRouteFile(file: File): Promise<Route.Route> {
  return new Promise((resolve, reject) => {
    if (file) {
      let filename = file.name;
      let fileReader = new FileReader();
      fileReader.onload = function (e) {
        try {
          console.log(e);
          let route = RouteIO.ImportFromFile(<string>((<FileReader>(e.target)).result), filename.search(/\.json$/) > 0, filename);
          route.entryList.forEach(e => e.messages.forEach(m => console.warn(m.toString())));
          resolve(SaveRoute(route));
          // reject(e);
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

export function ExportRouteFile(filename: string, printerSettings: any, route?: Route.Route): Route.Route {
  console.debug("Exporting to route file...", filename, printerSettings);
  if (!route) {
    route = GetCurrentRoute();
  }
  return RouteIO.ExportToFile(route, filename, printerSettings);
}
