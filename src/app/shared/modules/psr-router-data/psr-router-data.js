import _games from 'SharedData/games.json';
import _items1 from 'SharedData/items-1.json';
import _moves1 from 'SharedData/moves-1.json';
import _pokemon1 from 'SharedData/pokemon-1.json';
import _types from 'SharedData/types.json';

import { Model } from 'SharedModules/psr-router-model/psr-router-model';

function loadItems(gen) {
  var Items = {};
  // var ItemsArray = [];

  for (var key in _items1) {
    if (key !== "info") {
      var item = _items1[key];
      Items[key] = new Model.Item(key, item[0], item[1], item[2], item[3], item[4], item[5]);
      // ItemsArray.push(Items[key]);
    }
  }

  return Items;
}

function loadTypes(gen) {
  var Types = {};
  // var TypesArray = [];

  for (var i = 0; i < _types["types"].length; i++) {
    var key = _types["types"][i];
    Types[key] = new Model.Type(key, _types["names"][i], _types["isPhysical"][i]);
    // TypesArray.push(Types[key]);
  }

  return Types;
}

function loadTypeChart(gen) {
  var TypeChart = {};

  _types["charts"].forEach(function(el) {
    if (el["gens"].indexOf(gen) >= 0) {
      for (var tKey in el["chart"]) {
        TypeChart[tKey] = {};
        for (var j = 0; j < el["chart"][tKey].length; j++) {
          TypeChart[tKey][Object.keys(el["chart"])[j]] = el["chart"][tKey][j];
        }
      }
    }
  });

  return TypeChart;
}

function getTypeMultiplier(typeAtk, typeDef1, typeDef2) {
  var m = 1.0;

  if (TypeChart.length > 0) {
    m *= TypeChart[typeAtk][typeDef1];
    if (typeDef2) {
      m *= TypeCharts[typeAtk][typeDef2];
    }
  }

  return m;
}

function loadMoves(gen, types) {
  var Moves = {};
  // var MovesArray = [];

  for (var key in _moves1) {
    if (key !== "info") {
      var move = _moves1[key];
      var type = types[move[3]];
      var cat = (type.isPhysical ? "physical" : "special");
      Moves[key] = new Model.Move(key, move[0], move[1], move[2], type, move[4], move[5], cat, move[6]);
      // MovesArray.push(Moves[key]);
    }
  }

  return Moves;
}

function loadPokemon(gen, types) {
  var PokemonMap = {};
  // var PokemonArray = [];

  for (var id = 1; id < _pokemon1.length; id++) {
    var params = _pokemon1[id];
    var pokemon = new Model.Pokemon(params[0], id, params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[9], params[9], params[8]);
    PokemonMap[pokemon.key] = pokemon;
    // PokemonArray.push(pokemon);
  }

  return PokemonMap
}


// TEMP (?), just for reference
export const Data = {
  games: _games,
  items1: _items1,
  moves1: _moves1,
  pokemon1: _pokemon1,
  types: _types
};

export function GetGame(gameKey) {
  var info = _games[gameKey];
  var gameInfo = new Model.GameInfo(gameKey, info.name, info.gen, info.year, _games.platforms[info.platform]);
  var items = loadItems(gameInfo.gen);
  var types = loadTypes(gameInfo.gen);
  var typeChart = loadTypeChart(gameInfo.gen);
  var moves = loadMoves(gameInfo.gen, types);
  var pokemon = loadPokemon(gameInfo.gen, types);
  var game = new Model.Game(gameInfo, items, types, typeChart, moves, pokemon);
  console.log(game);
  return game;
};
