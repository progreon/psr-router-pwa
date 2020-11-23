// JS imports
import * as Route from 'SharedModules/psr-router-route';
import * as RouteIO from './route-io';
import { RouteParser } from '.';
import { Game } from '../../psr-router-model/Game';

//// PARSING STUFF ////

//// CONSTANTS ////
const lsKeySavedRoute = "saved-route";
const lsSavedRoutes = "saved-routes";
const lsLastRoute = "last-route";
const ssCurrentRoute = "current-route";

//// STORAGE ////
if (!window.app) {
  window.app = {};
}

function getLsSavedRoutes(): { [key: number]: { id: number, title: string, route: string } } {
  let str = window.localStorage.getItem(lsSavedRoutes);
  if (str) {
    return JSON.parse(str);
  } else {
    return {};
  }
}

function setLsSavedRoutes(value: { [key: number]: { id: number, title: string, route: string } }) {
  window.localStorage.setItem(lsSavedRoutes, JSON.stringify(value));
}

function getLsLastRoute(): { id?: number, route?: string, ts: number } {
  let str = window.localStorage.getItem(lsLastRoute);
  if (str) {
    return JSON.parse(str);
  } else {
    return null;
  }
}

function setLsLastRoute(value: { id?: number, route?: string, ts: number }) {
  window.localStorage.setItem(lsLastRoute, JSON.stringify(value));
}

function setSsCurrentRoute(value: { id?: number, route?: string, ts: number }) {
  window.localStorage.setItem(ssCurrentRoute, JSON.stringify(value));
}

function getSsCurrentRoute(): { id?: number, route?: string, ts: number } {
  let str = window.localStorage.getItem(ssCurrentRoute);
  if (str) {
    return JSON.parse(str);
  } else {
    return null;
  }
}

function getRouteStringFromStorageObj(storageObj: { id?: number, route?: string, ts: number }): string {
  if (storageObj.id) {
    let sr = getLsSavedRoutes();
    if (sr) {
      return sr[storageObj.id]?.route;
    }
  }
  return undefined;
}

//// ROUTE MANAGING ////
export function GetSavedRoutesTitles(): { id: number, title: string }[] {
  return Object.values(getLsSavedRoutes()).map(r => { return { id: r.id, title: r.title } }).sort((a, b) => a.id - b.id);
}

export function GetCurrentRoute(): Route.Route {
  if (!Route.Route.instance) {
    let ssCR = getSsCurrentRoute();
    if (!ssCR) {
      let lsLR = getLsLastRoute();
      if (!lsLR) {
        return undefined;
      }
      ssCR = lsLR;
      setSsCurrentRoute(ssCR);
    }
    // TODO: parse route from getRouteStringFromStorageObj(ssCR)
  }
  return Route.Route.instance;
}

export function GetCurrentGame(): Game {
  return GetCurrentRoute()?.game;
}




// export function GetCurrentRoute(): Route.Route {
//   return window.app.route;
// }

// export function GetCurrentGame(): Game {
//   return window.app.game;
// }

export function SetCurrentRoute(route: Route.Route = null): Route.Route {
  window.app.route = route;
  window.app.game = route ? route.game : null;
  if (route && route.getAllMessages().length == 0) {
    try {
      route.apply();
    } catch (e) {
      console.error(e);
      window.setTimeout(() => window.alert("Something went wrong while processing the route, please load a new route. Check the console for more details."), 100);
    }
  }
  return route;
}

//// LOAD & SAVE LOCALLY ////

function entryV1(entryV0: any) {
  entryV0.properties = {};
  let keys = Object.keys(entryV0);
  keys.forEach(key => {
    if (key != "info"
      && key != "type"
      && key != "location"
      && key != "entries"
      && key != "properties") {
      let value = entryV0[key];
      entryV0.properties[key] = value;
      entryV0[key] = undefined;
    }
  });
  if (entryV0.entries) {
    for (let i = 0; i < entryV0.entries.length; i++) {
      entryV1(entryV0.entries[i]);
    }
  }
}

function v1(routeV0: any): Boolean {
  if (!routeV0.v && !routeV0.properties) {
    console.log("Before: ", JSON.parse(JSON.stringify(routeV0)));
    for (let i = 0; i < routeV0.entries.length; i++) {
      entryV1(routeV0.entries[i]);
    }
    routeV0.type = "Route";
    routeV0.v = 1;
    console.log("After: ", JSON.parse(JSON.stringify(routeV0)));
    return true;
  } else {
    routeV0.v = 1;
    return false;
  }
}

export function LoadSavedRoute(): Route.Route {
  let routeJSON = localStorage.getItem(lsKeySavedRoute);
  let route: Route.Route = null;
  if (routeJSON) {
    let routeObj = JSON.parse(routeJSON);
    if (v1(routeObj)) {
      localStorage.setItem(lsKeySavedRoute, JSON.stringify(routeObj));
    }
    try {
      route = Route.Route.newFromJSONObject(routeObj);
      route.getAllMessages().forEach(m => console.warn(m.toString()));
    } catch (e) {
      console.error(e);
      window.setTimeout(() => window.alert("Something went wrong while loading the last opened route, please load a new route. Check the console for more details."), 100);
    }
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
import redRaceNoItTxt from 'SharedData/routes/Red Any% Glitchless (no IT).txt';
import * as redAnyGlitchlessBasic from 'SharedData/routes/Red Any% Glitchless (Basic).json';
import * as redAnyGlitchlessClassic from 'SharedData/routes/Red Any% Glitchless Classic.json';
// import * as exampleRoute from 'SharedData/routes/example_route.json';
import * as redGodNidoBasic from 'SharedData/routes/red_god_nido_basic.json';
import * as blueDummy from 'SharedData/routes/blue_dummy.json';
import * as yellowDummy from 'SharedData/routes/yellow_dummy.json';
// import * as crystalDummy from 'SharedData/routes/crystal_dummy.json';

let exampleRoutes: { [key: string]: { json?: any, txt?: string }; } = {};
exampleRoutes["Red Any% Glitchless (no IT) [txt]"] = { txt: redRaceNoItTxt };
exampleRoutes[redAnyGlitchlessBasic.shortname] = { json: redAnyGlitchlessBasic };
exampleRoutes[redAnyGlitchlessClassic.shortname] = { json: redAnyGlitchlessClassic };
// exampleRoutes[exampleRoute.shortname] = { json: exampleRoute };
exampleRoutes[redGodNidoBasic.shortname] = { json: redGodNidoBasic };
exampleRoutes[blueDummy.shortname] = { json: blueDummy };
exampleRoutes[yellowDummy.shortname] = { json: yellowDummy };
// exampleRoutes[crystalDummy.shortname] = { json: crystalDummy };

export function GetExampleRoutesNames(includeTxts: boolean = false): string[] {
  return Object.keys(exampleRoutes).filter(er => exampleRoutes[er].json || includeTxts);
}

export function LoadExampleRoute(routeName: string): Route.Route {
  let exampleRoute = exampleRoutes[routeName];
  let [routeJSON, routeTxt] = [exampleRoute.json, exampleRoute.txt];
  if (!routeJSON) {
    routeJSON = RouteParser.ParseRouteText(routeTxt, routeName);
  }
  if (routeJSON) {
    if (v1(routeJSON)) {
      localStorage.setItem(lsKeySavedRoute, JSON.stringify(routeJSON));
    }
    let route = Route.Route.newFromJSONObject(routeJSON);
    route.getAllMessages().forEach(m => console.warn(m.toString()));
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
          let route = RouteIO.ImportFromFile(<string>((<FileReader>(e.target)).result), filename.search(/\.json$/) > 0, filename);
          route.getAllMessages().forEach(m => console.warn(m.toString()));
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

export function ExportRouteFile(filename: string, printerSettings: any, route?: Route.Route): Route.Route {
  console.debug("Exporting to route file...", filename, printerSettings);
  if (!route) {
    route = GetCurrentRoute();
  }
  return RouteIO.ExportToFile(route, filename, printerSettings);
}
