// import * as _games from 'SharedData/games.json';
// import * as _types from 'SharedData/types.json';
// import * as _items1 from 'SharedData/items-1.json';
// import * as _moves1 from 'SharedData/moves-1.json';
// import * as _movesLearnedRB from 'SharedData/moves-learned-1.json';
// import * as _pokemon1 from 'SharedData/pokemon-1.json';
// import * as _trainersRB from 'SharedData/trainers-rb.json';
// // TODO: badges!

// import * as Model from '../psr-router-model/Model';
// import * as ModelAbstract from '../psr-router-model/ModelAbstract';
// import * as Model1 from '../psr-router-model/Model1';
// import * as ModelDummy from '../psr-router-model/ModelDummy';

// /**
//  *
//  * @param gen The generation of the game
//  */
// function loadItems(gen: number) {
//   let Items: { [key: string]: ModelAbstract.Item; } = {};

//   switch (gen) {
//     case 1:
//       for (let key in _items1) {
//         if (key !== "info") {
//           let item = _items1[key];
//           Items[key] = new Model1.Item(key, item[0], item[1], item[2], item[3], item[4], item[5]);
//         }
//       }
//       break;
//   }

//   return Items;
// }

// /**
//  *
//  * @param gen The generation of the game
//  */
// function loadTypes(gen: number) {
//   let Types: { [key: string]: ModelAbstract.Type; } = {};

//   for (let i = 0; i < _types["types"].length; i++) {
//     let key = _types["types"][i];
//     Types[key] = new Model1.Type(key, _types["names"][i], _types["isPhysical"][i]);
//   }

//   return Types;
// }

// /**
//  *
//  * @param gen The generation of the game
//  * @todo TypeChart class?
//  */
// function loadTypeChart(gen: number) {
//   let TypeChart = {};

//   _types["charts"].forEach(function(el) {
//     if (el["gens"].indexOf(gen) >= 0) {
//       for (let tKey in el["chart"]) {
//         TypeChart[tKey] = {};
//         for (let j = 0; j < el["chart"][tKey].length; j++) {
//           TypeChart[tKey][Object.keys(el["chart"])[j]] = el["chart"][tKey][j];
//         }
//       }
//     }
//   });

//   return TypeChart;
// }

// // TODO
// function getTypeMultiplier(typeChart, typeAtk, typeDef1, typeDef2) {
//   let m = 1.0;

//   if (typeChart.length > 0) {
//     m *= typeChart[typeAtk][typeDef1];
//     if (typeDef2) {
//       m *= typeChart[typeAtk][typeDef2];
//     }
//   }

//   return m;
// }

// /**
//  *
//  * @param gen   The generation of the game
//  * @param types The types available in the game
//  */
// function loadMoves(gen: number, types: { [key: string]: ModelAbstract.Type; }) {
//   let Moves: { [key: string]: ModelAbstract.Move; } = {};

//   switch (gen) {
//     case 1:
//       for (let key in _moves1) {
//         if (key !== "info") {
//           let move = _moves1[key];
//           let type = types[move[3]];
//           let physical = type.isPhysical;
//           Moves[key] = new Model1.Move1(key, move[0], move[1], move[2], type, move[4], move[5], physical, move[6]);
//         }
//       }
//       break;
//   }

//   return Moves;
// }

// /**
//  *
//  * @param gameKey The key of the game
//  * @param types   The types available in the game
//  */
// function loadPokemon(gameKey : string, types : { [key: string]: ModelAbstract.Type; }) {
//   let PokemonMap : { [key: string]: ModelAbstract.Pokemon; } = {};

//   switch (gameKey) {
//     case "r":
//     case "b":
//     case "y":
//       for (let id = 1; id < _pokemon1.length; id++) {
//         let p = _pokemon1[id];
//         let pokemon = new Model1.Pokemon1(<string>p[0], id, types[p[1]], types[p[2]], <number>p[3], <string>p[4], <number>p[5], <number>p[6], <number>p[7], <number>p[8], <number>p[9]);
//         PokemonMap[pokemon.key] = pokemon;
//       }
//   }
//   switch (gameKey) {
//     case "r":
//     case "b":
//       for (let p in _movesLearnedRB) {
//         let defaultMoves: string[] = [];
//         let tmMoves: string[] = [];
//         let learnedMoves: { [key: number]: string; } = {};
//         _movesLearnedRB[p].default.forEach((m: string) => defaultMoves.push(m));
//         _movesLearnedRB[p].tm.forEach((m: string) => tmMoves.push(m));
//         _movesLearnedRB[p].level.forEach((lm: string) => {
//           let split = lm.split("#");
//           let l = split[0];
//           let m = split[1];
//           if (learnedMoves[l]) { // safety check, this would mean a structure change in Pokemon::learnedMoves
//             console.warn(p, l, m);
//           }
//           learnedMoves[l] = m;
//         });
//         let pokemon = PokemonMap[p.toUpperCase()];
//         if (pokemon) {
//           pokemon.setDefaultMoves(defaultMoves);
//           pokemon.setLearnedMoves(learnedMoves);
//           pokemon.setTmMoves(tmMoves);
//         }
//       }
//       break;
//   }

//   return PokemonMap;
// }

// /**
//  *
//  * @param gameKey The key of the game
//  * @param pokemon The pokemon available in the game
//  */
// function loadTrainers(gameKey: string, pokemon: { [key: string]: ModelAbstract.Pokemon; }) {
//   let Trainers: { [key: string]: ModelAbstract.Trainer; } = {};

//   switch (gameKey) {
//     case "r":
//     case "b":
//       for (let loc in _trainersRB) {
//         for (let tClass in _trainersRB[loc]) {
//           _trainersRB[loc][tClass].forEach(t => {
//             let party = [];
//             t.party.forEach((pl: string) => {
//               let [p, l] = pl.split("#");
//               party.push(new Model1.Battler1(null, pokemon[p.toUpperCase()], null, true, parseInt(l)));
//             });
//             if (t.moves) {
//               t.moves.forEach((pimim: string) => {
//                 let [pi, mi, m] = pimim.split("#");
//                 party[pi].moveset[mi] = m;
//               });
//             }
//             let trainer = new Model1.Trainer(t.key, t.name, tClass, party, loc, t.alias);
//             Trainers[trainer.key.toUpperCase()] = trainer;
//           });
//         }
//       }
//       break;
//   }

//   return Trainers;
// }

// /**
//  * Get a game instance.
//  * @param {string}  gameKey   The key string of a game.
//  * @returns {Game}  The game instance.
//  */
// export function GetGame(gameKey: string): Model.Game {
//   let info = _games[gameKey];
//   let game: Model.Game;
//   let model: any;
//   let engine: any;
//   switch (gameKey) {
//     case "r":
//     case "b":
//     case "y":
//       model = Model1;
//       break;
//     default:
//       model = ModelDummy;
//   }
//   gameKey = gameKey || "?";
//   let gameInfo = new model.GameInfo(gameKey, info ? info.name : gameKey, info ? info.gen : 0, info ? info.year : "????", info ? _games.platforms[info.platform] : "???", !info || info.unsupported);
//   let items = loadItems(gameInfo.gen);
//   let types = loadTypes(gameInfo.gen);
//   let typeChart = loadTypeChart(gameInfo.gen);
//   let moves = loadMoves(gameInfo.gen, types);
//   let pokemon = loadPokemon(gameKey, types);
//   let experienceGroups = model.ExperienceGroups; // TODO: gen dependent OR static in Game-class OR only use it in Pokemon-class
//   let trainers = loadTrainers(gameKey, pokemon);
//   game = new model.Game(model, engine, gameInfo, experienceGroups, items, types, typeChart, moves, pokemon, trainers);
//   return game;
// };
