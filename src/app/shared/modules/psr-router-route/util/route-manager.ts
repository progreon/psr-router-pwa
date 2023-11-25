// JS imports
import * as Route from 'SharedModules/psr-router-route';
import * as RouteIO from './route-io';
import { GetGame } from '../../psr-router-game-factory';
import { RouteParser } from '.';
import { Game } from '../../psr-router-model/Game';
import { RouteEntryInfo } from './RouteEntryInfo';
import { RouteJSON } from 'SharedModules/psr-router-route/parse/RouteJSON';

//// EXAMPLE ROUTES ////
import redClassicBeginner from 'SharedData/routes/Red Any Glitchless (Classic) [Beginner Route].txt';
import redBeginnerNoLass from 'SharedData/routes/Red Any Glitchless [No-Lass Version].txt';
// import redBeginnerSquareTxt from 'SharedData/routes/Red Any Glitchless [Square\'s Beginner Guide].txt';
// import redBeginnerTxt from 'SharedData/routes/Red Any Glitchless [Beginner Guide].txt';
// import redRaceNoItTxt from 'SharedData/routes/Red Any Glitchless (no IT).txt';
import yellowTxt from 'SharedData/routes/Yellow Any Glitchless.txt';
// import * as redAnyGlitchlessBasic from 'SharedData/routes/Red Any% Glitchless (Basic).json';
// import * as redAnyGlitchlessClassic from 'SharedData/routes/Red Any% Glitchless Classic.json';
// // import * as exampleRoute from 'SharedData/routes/example_route.json';
// import * as redGodNidoBasic from 'SharedData/routes/red_god_nido_basic.json';
// import * as blueDummy from 'SharedData/routes/blue_dummy.json';
// import * as yellowDummy from 'SharedData/routes/yellow_dummy.json';
// // import * as crystalDummy from 'SharedData/routes/crystal_dummy.json';

//// STORAGE TYPES ////
interface StorageSavedRoute {
  id: number;
  title: string;
  route: RouteJSON;
  lastUsed: number;
  fav: boolean;
}

interface StorageTempRoute {
  id?: number;
  route?: RouteJSON;
  ts: number;
}

let exampleRoutes: { [key: string]: { json?: any, txt?: string, title: string }; } = {};
exampleRoutes["red.classic.beginner.txt"] = { txt: redClassicBeginner, title: "Red Any Glitchless (Classic) [Beginner Route]" };
exampleRoutes["red.beginner.nolass.txt"] = { txt: redBeginnerNoLass, title: "Red Any% Glitchless [No-Lass Version]" };
// exampleRoutes["red.beginner.square.txt"] = { txt: redBeginnerSquareTxt, title: "Red Any% Glitchless [Square's Beginner Guide]" };
// exampleRoutes["red.beginner.txt"] = { txt: redBeginnerTxt, title: "Red Any% Glitchless [Beginner Guide]" };
// exampleRoutes["red.no.it.txt"] = { txt: redRaceNoItTxt, title: "Red Any% Glitchless [race, no IT]" };
exampleRoutes["yellow.txt"] = { txt: yellowTxt, title: "Yellow Any% Glitchless [WIP]" };
// exampleRoutes["red.any.glitchless.basic"] = { json: redAnyGlitchlessBasic, title: redAnyGlitchlessBasic.info.title };
// exampleRoutes["red.any.glitchless.classic"] = { json: redAnyGlitchlessClassic, title: redAnyGlitchlessClassic.info.title };
// // exampleRoutes["red.example"] = { json: exampleRoute, title: exampleRoute.info.title };
// exampleRoutes["red.god.nido.basic"] = { json: redGodNidoBasic, title: redGodNidoBasic.info.title };
// exampleRoutes["blue.dummy"] = { json: blueDummy, title: blueDummy.info.title };
// exampleRoutes["yellow.dummy.test"] = { json: yellowDummy, title: yellowDummy.info.title };
// // exampleRoutes["crystal.dummy"] = { json: crystalDummy, title: crystalDummy.info.title };

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

function getLsSavedRoutes(): { [key: number]: StorageSavedRoute } {
  let str = window.localStorage.getItem(lsSavedRoutes);
  if (str) {
    return JSON.parse(str);
  } else {
    return {};
  }
}

function getLsSavedRoute(id: number): StorageSavedRoute {
  let savedRoutes = getLsSavedRoutes();
  return savedRoutes[id];
}

function setLsSavedRoutes(value: { [key: number]: StorageSavedRoute }) {
  window.localStorage.setItem(lsSavedRoutes, JSON.stringify(value));
}

function lsUpdateLastUsed(id: number) {
  let savedRoutes = getLsSavedRoutes();
  if (savedRoutes[id]) {
    savedRoutes[id].lastUsed = new Date().getTime();
  }
  setLsSavedRoutes(savedRoutes);
}

function lsSetFavoriteRoute(id: number, isFavorite: boolean) {
  let savedRoutes = getLsSavedRoutes();
  if (savedRoutes[id]) {
    savedRoutes[id].fav = isFavorite;
  }
  setLsSavedRoutes(savedRoutes);
}

function saveToLocalStorage(route: RouteJSON, id?: number): StorageSavedRoute {
  let savedRoutes = getLsSavedRoutes();
  if (id == null) {
    id = new Date().getTime();
  }
  let old = savedRoutes[id];
  savedRoutes[id] = { id, title: route.info.title, route, lastUsed: new Date().getTime(), fav: !!old?.fav };
  setLsSavedRoutes(savedRoutes);
  return savedRoutes[id];
}

function getLsLastRoute(): StorageTempRoute {
  let str = window.localStorage.getItem(lsLastRoute);
  if (str) {
    return JSON.parse(str);
  } else {
    return null;
  }
}

function setLsLastRoute(value: StorageTempRoute) {
  if (value) {
    window.localStorage.setItem(lsLastRoute, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(lsLastRoute);
  }
}

function setSsCurrentRoute(value: StorageTempRoute) {
  if (value) {
    window.sessionStorage.setItem(ssCurrentRoute, JSON.stringify(value));
    lsUpdateLastUsed(value.id);
  } else {
    window.sessionStorage.removeItem(ssCurrentRoute);
  }
}

function getSsCurrentRoute(): StorageTempRoute {
  let str = window.sessionStorage.getItem(ssCurrentRoute);
  if (str) {
    return JSON.parse(str);
  } else {
    return null;
  }
}

function getRouteJsonFromStorageObj(storageObj: StorageTempRoute): RouteJSON {
  if (storageObj.id) {
    let sr = getLsSavedRoute(storageObj.id);
    return sr?.route;
  }
  return storageObj.route;
}

export function SetCurrentRouteAsLastRoute() {
  let currRoute = getSsCurrentRoute();
  if (currRoute) {
    setLsLastRoute(currRoute);
    lsUpdateLastUsed(currRoute?.id);
  }
}

//// GETTERS ////
export function GetSavedRoutesTitles(): { id: number, title: string, isFav: boolean }[] {
  return Object.values(getLsSavedRoutes())
  .map(r => { return { id: r.id, title: r.title, lastOpened: r.lastUsed, isFav: !!r.fav } })
  .sort((a, b) => {
    let result = 0;
    if ((a.isFav && b.isFav) || (!a.isFav && !b.isFav)) {
      result = (b.lastOpened || b.id) - (a.lastOpened || a.id);
    } else {
      result = a.isFav ? -1 : 1;
    }
    return result;
  });
}

export function GetExampleRoutesInfo(includeTxts: boolean = false): { key: string, title: string }[] {
  return Object.keys(exampleRoutes)
    .filter(er => exampleRoutes[er].json || includeTxts)
    .map(er => { return { key: er, title: exampleRoutes[er].title }; });
}

export function GetSavedRoute(id: number): Route.Route {
  let lsRoute = getLsSavedRoute(id);
  if (lsRoute) {
    // TODO: check for lsRoute.route version etc?
    return Route.Route.newFromJSONObject(lsRoute.route);
  } else {
    return null;
  }
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
        lsUpdateLastUsed(ssCR.id);
      } else {
        throw new Error(`No route found from storage ${ssCR}`);
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
function setCurrentRoute(route: Route.Route, storageObj: StorageTempRoute) {
  route.getAllMessages().forEach(m => console.warn(m.toString()));
  Route.Route.instance = route;
  setSsCurrentRoute(storageObj);
  setLsLastRoute(storageObj);
  lsUpdateLastUsed(storageObj.id);
}

export function OpenSavedRoute(routeId: number): Route.Route {
  let route = GetSavedRoute(routeId);
  if (route) {
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

//// SAVED ROUTES STUFF ////
export function CreateAndOpenNewRoute(gameKey: string, title: string, template?: string): Route.Route {
  // TODO: support creating a new route from a template (e.g. basic red run)
  console.debug("Creating game...", gameKey, title);
  let game = GetGame(gameKey);
  let rootSection = new Route.RouteSection(game, new RouteEntryInfo(title));
  let routeSection = rootSection.addNewSection("First Section");
  routeSection.addNewDirections("This is an example of what to do");
  let route = new Route.Route(game, rootSection);
  let savedRoute = saveToLocalStorage(route.getJSONObject());
  return OpenSavedRoute(savedRoute.id);
}

export function SetFavoriteRoute(id: number, isFavorite: boolean) {
  lsSetFavoriteRoute(id, isFavorite);
}

export function SaveRoute(route: Route.Route, overwriteCurrentRoute: boolean = false): Route.Route {
  let id;
  if (overwriteCurrentRoute) {
    let ssCurr = getSsCurrentRoute();
    id = ssCurr?.id;
  }
  let savedRoute = saveToLocalStorage(route.getJSONObject(), id);
  return OpenSavedRoute(savedRoute.id);
}

// TODO
// function saveRoute(route: Route.Route, storageObj: StorageTempRoute) {

//   let routeJSON = route.getJSONObject();
//   storageObj: StorageTempRoute = { route: routeJSON, ts: new Date().getTime() };
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
  lsUpdateLastUsed(currRoute?.id);
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
          let storageObj: StorageTempRoute = { route: routeJSON, ts: new Date().getTime() };
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

export function ExportRouteFile(filename: string, printerSettings?: any, id?: number): Route.Route {
  console.debug("Exporting to route file...", filename, printerSettings);
  let route: Route.Route;
  if (id == null) {
    route = GetCurrentRoute();
  } else {
    route = GetSavedRoute(id);
  }
  if (route != null) {
    return RouteIO.ExportRouteToFile(route, filename, printerSettings);
  } else {
    throw new Error("No route found to export!");
  }
}

//// BACKUP STUFF ////

export function ExportBackup() {
  let backup = getLsSavedRoutes();
  let backupText = JSON.stringify(backup);
  let d = new Date();
  let filename = `psr-router-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.psrrdata`;
  RouteIO.ExportTextToFile(backupText, filename);
}

export function OpenBackupFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    if (file) {
      let fileReader = new FileReader();
      fileReader.onload = function (e) {
        try {
          // TODO: safety checks before closing current route?
          CloseCurrentRoute();
          setLsSavedRoutes(JSON.parse(<string>((<FileReader>(e.target)).result)));
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
  CloseCurrentRoute();
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
