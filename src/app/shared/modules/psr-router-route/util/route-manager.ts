// JS imports
import * as Route from 'SharedModules/psr-router-route';
import * as RouteIO from './route-io';
import { GetGame } from '../../psr-router-game-factory';
import { RouteParser } from '.';
import { Game } from '../../psr-router-model/Game';
import { RouteEntryInfo } from './RouteEntryInfo';

//// EXAMPLE ROUTES ////
import redRaceNoItTxt from 'SharedData/routes/Red Any% Glitchless (no IT).txt';
import * as redAnyGlitchlessBasic from 'SharedData/routes/Red Any% Glitchless (Basic).json';
import * as redAnyGlitchlessClassic from 'SharedData/routes/Red Any% Glitchless Classic.json';
// import * as exampleRoute from 'SharedData/routes/example_route.json';
import * as redGodNidoBasic from 'SharedData/routes/red_god_nido_basic.json';
import * as blueDummy from 'SharedData/routes/blue_dummy.json';
import * as yellowDummy from 'SharedData/routes/yellow_dummy.json';
// import * as crystalDummy from 'SharedData/routes/crystal_dummy.json';

let exampleRoutes: { [key: string]: { json?: any, txt?: string, title: string }; } = {};
exampleRoutes["red.no.it.txt"] = { txt: redRaceNoItTxt, title: "Red Any% Glitchless (no IT) [txt]" };
exampleRoutes["red.any.glitchless.basic"] = { json: redAnyGlitchlessBasic, title: redAnyGlitchlessBasic.info.title };
exampleRoutes["red.any.glitchless.classic"] = { json: redAnyGlitchlessClassic, title: redAnyGlitchlessClassic.info.title };
// exampleRoutes["red.example"] = { json: exampleRoute, title: exampleRoute.info.title };
exampleRoutes["red.god.nido.basic"] = { json: redGodNidoBasic, title: redGodNidoBasic.info.title };
exampleRoutes["blue.dummy"] = { json: blueDummy, title: blueDummy.info.title };
exampleRoutes["yellow.dummy.test"] = { json: yellowDummy, title: yellowDummy.info.title };
// exampleRoutes["crystal.dummy"] = { json: crystalDummy, title: crystalDummy.info.title };

//// INIT ////
if (!window.app) {
  window.app = {};
}

//// CONSTANTS ////
const lsSavedRoutes = "rm-saved-routes";
const lsLastRoute = "rm-last-route";
const ssCurrentRoute = "rm-current-route";

//// STORAGE ////
function clearRmStorage() {
  Object.keys(window.localStorage).forEach(key => {
    if (key.startsWith("rm-")) {
      window.localStorage.removeItem(key);
    }
  });
  Object.keys(window.sessionStorage).forEach(key => {
    if (key.startsWith("rm-")) {
      window.sessionStorage.removeItem(key);
    }
  });
}

function getLsSavedRoutes(): { [key: number]: { id: number, title: string, route: any } } {
  let str = window.localStorage.getItem(lsSavedRoutes);
  if (str) {
    return JSON.parse(str);
  } else {
    return {};
  }
}

function setLsSavedRoutes(value: { [key: number]: { id: number, title: string, route: any } }) {
  window.localStorage.setItem(lsSavedRoutes, JSON.stringify(value));
}

function saveToLocalStorage(id: number, route: any) {
  let savedRoutes = getLsSavedRoutes();
  savedRoutes[id] = { id, title: route.info.title, route };
  setLsSavedRoutes(savedRoutes);
}

function getLsLastRoute(): { id?: number, route?: any, ts: number } {
  let str = window.localStorage.getItem(lsLastRoute);
  if (str) {
    return JSON.parse(str);
  } else {
    return null;
  }
}

function setLsLastRoute(value: { id?: number, route?: any, ts: number }) {
  if (value) {
    window.localStorage.setItem(lsLastRoute, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(lsLastRoute);
  }
}

function setSsCurrentRoute(value: { id?: number, route?: any, ts: number }) {
  if (value) {
    window.sessionStorage.setItem(ssCurrentRoute, JSON.stringify(value));
  } else {
    window.sessionStorage.removeItem(ssCurrentRoute);
  }
}

function getSsCurrentRoute(): { id?: number, route?: any, ts: number } {
  let str = window.sessionStorage.getItem(ssCurrentRoute);
  if (str) {
    return JSON.parse(str);
  } else {
    return null;
  }
}

function getRouteJsonFromStorageObj(storageObj: { id?: number, route?: any, ts: number }): any {
  if (storageObj.id) {
    let sr = getLsSavedRoutes();
    if (sr) {
      return sr[storageObj.id]?.route;
    }
  }
  return storageObj.route;
}

export function SetCurrentRouteAsLastRoute() {
  let currRoute = getSsCurrentRoute();
  if (currRoute) {
    setLsLastRoute(currRoute);
  }
}

//// GETTERS ////
export function GetSavedRoutesTitles(): { id: number, title: string }[] {
  return Object.values(getLsSavedRoutes()).map(r => { return { id: r.id, title: r.title } }).sort((a, b) => a.id - b.id);
}

export function GetExampleRoutesInfo(includeTxts: boolean = false): { key: string, title: string }[] {
  return Object.keys(exampleRoutes)
    .filter(er => exampleRoutes[er].json || includeTxts)
    .map(er => { return { key: er, title: exampleRoutes[er].title }; });
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
    try {
      let routeObj = getRouteJsonFromStorageObj(ssCR);
      if (routeObj) {
        Route.Route.instance = Route.Route.newFromJSONObject(routeObj);
      }
    } catch (e) {
      // TODO: best way to handle this?
      CloseCurrentRoute();
      throw e;
    }
  }
  window.app.route = Route.Route.instance;
  return Route.Route.instance;
}

export function IsCurrentRouteLocallySaved(): boolean {
  let ssCR = getSsCurrentRoute();
  return ssCR && ssCR.id != null;
}

export function GetCurrentGame(): Game {
  return GetCurrentRoute()?.game;
}

/// OPEN ROUTES ///
function setCurrentRoute(route: Route.Route, storageObj: { id?: number, route?: any, ts: number }) {
  route.getAllMessages().forEach(m => console.warn(m.toString()));
  Route.Route.instance = route;
  setSsCurrentRoute(storageObj);
  setLsLastRoute(storageObj);
}

export function OpenSavedRoute(routeId: number): Route.Route {
  let strRoute: any;
  if (routeId) {
    let sr = getLsSavedRoutes();
    if (sr) {
      strRoute = sr[routeId]?.route;
    }
  }
  if (strRoute) {
    let routeObj = strRoute;
    // TODO: check routeObj for version etc?
    let route = Route.Route.newFromJSONObject(routeObj);
    let storageObj = { id: routeId, ts: new Date().getTime() };
    setCurrentRoute(route, storageObj);
    return GetCurrentRoute();
  } else {
    throw new Error(`Could not find route for routeId '${routeId}'`);
  }
}

export function OpenExampleRoute(exampleKey: string): Route.Route {
  let exampleRoute = exampleRoutes[exampleKey];
  let routeJSON = exampleRoute.json;
  if (!exampleRoute.json && !!exampleRoute.txt) {
    routeJSON = RouteParser.ParseRouteText(exampleRoute.txt, exampleKey);
  }
  if (routeJSON) {
    // TODO: check routeObj for version etc?
    let route = Route.Route.newFromJSONObject(routeJSON);
    let storageObj = { route: routeJSON, ts: new Date().getTime() };
    setCurrentRoute(route, storageObj);
    return GetCurrentRoute();
  } else {
    throw new Error(`Could not find example route for key '${exampleKey}'`);
  }
}

export function CreateAndOpenNewRoute(gameKey: string, title: string, template?: string): Route.Route {
  // TODO: support creating a new route from a template (e.g. basic red run)
  let game = GetGame(gameKey);
  let rootSection = new Route.RouteSection(game, new RouteEntryInfo(title));
  let routeSection = rootSection.addNewSection("First Section");
  routeSection.addNewDirections("This is an example of what to do");
  let route = new Route.Route(game, rootSection);
  let routeId = new Date().getTime();
  saveToLocalStorage(routeId, route.getJSONObject());
  let storageObj = { id: routeId, ts: new Date().getTime() };
  setCurrentRoute(route, storageObj);
  return GetCurrentRoute();
}

//// SAVE ROUTES ////
// TODO
// function saveRoute(route: Route.Route, storageObj: { id?: number, route?: any, ts: number }) {

//   let routeJSON = route.getJSONObject();
//   storageObj = { route: routeJSON, ts: new Date().getTime() };
//   setCurrentRoute(route, storageObj);
// }

// export function SaveRoute(route: Route.Route) {
//   let storageObj = getSsCurrentRoute();
//   let routeId = storageObj?.id || new Date().getTime();


//   route.getAllMessages().forEach(m => console.warn(m.toString()));
//   Route.Route.instance = route;
//   setSsCurrentRoute(storageObj);
//   setLsLastRoute(storageObj);
// }

//// CLOSE ROUTES ////
export function CloseCurrentRoute() {
  Route.Route.instance = null;
  let currRoute = getSsCurrentRoute();
  let lastRoute = getLsLastRoute();
  if (currRoute?.ts == lastRoute?.ts) {
    setLsLastRoute(null);
  }
  setSsCurrentRoute(null);
}

//// DELETE ROUTES ////
export function DeleteRoute(id: number) {
  let currRoute = getSsCurrentRoute();
  let lastRoute = getLsLastRoute();
  if (currRoute?.id == id) {
    CloseCurrentRoute();
  }
  if (lastRoute?.id == id) {
    setLsLastRoute(null);
  }
  let savedRoutes = getLsSavedRoutes();
  if (savedRoutes[id]) {
    delete savedRoutes[id];
  }
  setLsSavedRoutes(savedRoutes);
}

//// IMPORT/EXPORT ROUTES ////

export function OpenRouteFile(file: File): Promise<Route.Route> {
  return new Promise((resolve, reject) => {
    if (file) {
      let filename = file.name;
      let fileReader = new FileReader();
      fileReader.onload = function (e) {
        try {
          // TODO: check routeObj for version etc?
          let route = RouteIO.ImportFromFile(<string>((<FileReader>(e.target)).result), filename.search(/\.json$/) > 0, filename);
          let routeJSON = route.getJSONObject();
          let storageObj = { route: routeJSON, ts: new Date().getTime() };
          setCurrentRoute(route, storageObj);
          resolve(route);
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
  return RouteIO.ExportRouteToFile(route, filename, printerSettings);
}

//// BACKUP STUFF ////

export function ExportBackup() {
  let backup = getLsSavedRoutes();
  let backupText = JSON.stringify(backup);
  let d = new Date();
  let filename = `psr-router-${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.psrrdata`;
  RouteIO.ExportTextToFile(backupText, filename);
}

export function OpenBackupFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    if (file) {
      let fileReader = new FileReader();
      fileReader.onload = function (e) {
        try {
          // TODO: safety checks?
          setLsSavedRoutes(JSON.parse(<string>((<FileReader>(e.target)).result)));
          CloseCurrentRoute();
          resolve(null);
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

//// CLEANUP STUFF ////

export function ClearAllData() {
  clearRmStorage();
}





//// LOAD & SAVE LOCALLY ////

// function entryV1(entryV0: any) {
//   entryV0.properties = {};
//   let keys = Object.keys(entryV0);
//   keys.forEach(key => {
//     if (key != "info"
//       && key != "type"
//       && key != "location"
//       && key != "entries"
//       && key != "properties") {
//       let value = entryV0[key];
//       entryV0.properties[key] = value;
//       entryV0[key] = undefined;
//     }
//   });
//   if (entryV0.entries) {
//     for (let i = 0; i < entryV0.entries.length; i++) {
//       entryV1(entryV0.entries[i]);
//     }
//   }
// }

// function v1(routeV0: any): Boolean {
//   if (!routeV0.v && !routeV0.properties) {
//     console.log("Before: ", JSON.parse(JSON.stringify(routeV0)));
//     for (let i = 0; i < routeV0.entries.length; i++) {
//       entryV1(routeV0.entries[i]);
//     }
//     routeV0.type = "Route";
//     routeV0.v = 1;
//     console.log("After: ", JSON.parse(JSON.stringify(routeV0)));
//     return true;
//   } else {
//     routeV0.v = 1;
//     return false;
//   }
// }

// export function SetCurrentRoute(route: Route.Route = null): Route.Route {
//   window.app.route = route;
//   window.app.game = route ? route.game : null;
//   if (route && route.getAllMessages().length == 0) {
//     try {
//       route.apply();
//     } catch (e) {
//       console.error(e);
//       window.setTimeout(() => window.alert("Something went wrong while processing the route, please load a new route. Check the console for more details."), 100);
//     }
//   }
//   return route;
// }

// export function LoadSavedRoute(): Route.Route {
//   let routeJSON = localStorage.getItem(lsKeySavedRoute);
//   let route: Route.Route = null;
//   if (routeJSON) {
//     let routeObj = JSON.parse(routeJSON);
//     if (v1(routeObj)) {
//       localStorage.setItem(lsKeySavedRoute, JSON.stringify(routeObj));
//     }
//     try {
//       route = Route.Route.newFromJSONObject(routeObj);
//       route.getAllMessages().forEach(m => console.warn(m.toString()));
//     } catch (e) {
//       console.error(e);
//       window.setTimeout(() => window.alert("Something went wrong while loading the last opened route, please load a new route. Check the console for more details."), 100);
//     }
//   }
//   return SetCurrentRoute(route);
// }

// export function SaveRoute(route: Route.Route = null): Route.Route {
//   if (!route) {
//     route = GetCurrentRoute();
//   } else {
//     route = SetCurrentRoute(route);
//   }
//   if (route) {
//     localStorage.setItem(lsKeySavedRoute, JSON.stringify(route.getJSONObject()));
//   }
//   return route;
// }
