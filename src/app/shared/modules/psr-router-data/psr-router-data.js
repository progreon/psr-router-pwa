import _games from 'SharedData/games.json';
import _types from 'SharedData/types.json';
import _items1 from 'SharedData/items-1.json';
import _moves1 from 'SharedData/moves-1.json';
import _pokemon1 from 'SharedData/pokemon-1.json';
import _trainersRB from 'SharedData/trainers-rb.json';
// TODO: badges!

import * as ModelRBY from '../psr-router-model/model-rby';

function loadItems(gen) {
  var Items = {};

  switch (gen) {
    case 1:
      for (var key in _items1) {
        if (key !== "info") {
          var item = _items1[key];
          Items[key] = new ModelRBY.Item(key, item[0], item[1], item[2], item[3], item[4], item[5]);
        }
      }
      break;
  }

  return Items;
}

function loadTypes(gen) {
  var Types = {};

  for (var i = 0; i < _types["types"].length; i++) {
    var key = _types["types"][i];
    Types[key] = new ModelRBY.Type(key, _types["names"][i], _types["isPhysical"][i]);
  }

  return Types;
}

// TODO: TypeChart class?
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

function getTypeMultiplier(typeChart, typeAtk, typeDef1, typeDef2) {
  var m = 1.0;

  if (typeChart.length > 0) {
    m *= TypeChart[typeAtk][typeDef1];
    if (typeDef2) {
      m *= TypeCharts[typeAtk][typeDef2];
    }
  }

  return m;
}

function loadMoves(gen, types) {
  var Moves = {};

  switch (gen) {
    case 1:
      for (var key in _moves1) {
        if (key !== "info") {
          var move = _moves1[key];
          var type = types[move[3]];
          var cat = (type.isPhysical ? "physical" : "special");
          Moves[key] = new ModelRBY.Move(key, move[0], move[1], move[2], type, move[4], move[5], cat, move[6]);
        }
      }
      break;
  }

  return Moves;
}

function loadPokemon(gen, types) {
  var PokemonMap = {};

  switch (gen) {
    case 1:
      for (var id = 1; id < _pokemon1.length; id++) {
        var p = _pokemon1[id];
        var pokemon = new ModelRBY.Pokemon(p[0], id, p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]);
        PokemonMap[pokemon.key] = pokemon;
      }
      break;
  }

  return PokemonMap;
}

function loadTrainers(gameKey) {
  var Trainers = {};

  switch (gameKey) {
    case "r":
    case "b":
      for (var loc in _trainersRB) {
        for (var tClass in _trainersRB[loc]) {
          _trainersRB[loc][tClass].forEach(t => {
            var party = t.party; // TODO: parse!! (after parsing default pokemon moves)
            var trainer = new ModelRBY.Trainer(t.key, t.name, tClass, party, loc, t.alias);
            Trainers[trainer.key.toUpperCase()] = trainer;
          });
        }
      }
      break;
  }

  return Trainers;
}

/**
 * Get a game instance.
 * @param {string}  gameKey   The key string of a game.
 * @returns {Game}  The game instance.
 */
export function GetGame(gameKey) {
  var info = _games[gameKey];
  var game;
  if (info) {
    var model;
    var engine;
    switch (gameKey) {
      case "r":
      case "b":
      case "y":
        model = ModelRBY;
    }
    var gameInfo = new model.GameInfo(gameKey, info.name, info.gen, info.year, _games.platforms[info.platform]);
    var items = loadItems(gameInfo.gen);
    var types = loadTypes(gameInfo.gen);
    var typeChart = loadTypeChart(gameInfo.gen);
    var moves = loadMoves(gameInfo.gen, types);
    var pokemon = loadPokemon(gameInfo.gen, types);
    var experienceGroups = model.ExperienceGroups; // TODO: gen dependent OR static in Game-class OR only use it in Pokemon-class
    var trainers = loadTrainers(gameKey);
    var game = new model.Game(model, engine, experienceGroups, gameInfo, items, types, typeChart, moves, pokemon, trainers);
  }
  return game;
};
