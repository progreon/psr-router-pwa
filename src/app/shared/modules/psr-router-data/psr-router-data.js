import _games from 'SharedData/games.json';
import _types from 'SharedData/types.json';
import _items1 from 'SharedData/items-1.json';
import _moves1 from 'SharedData/moves-1.json';
import _pokemon1 from 'SharedData/pokemon-1.json';
import _trainersRB from 'SharedData/trainers-rb.json';
// TODO: badges!

// import { Model } from 'SharedModules/psr-router-model/psr-router-model';
import { Item, Type, Move, Pokemon, Game, GameInfo, ExperienceGroup } from '../psr-router-model';

function loadItems(gen) {
  var _items;
  switch (gen) {
    case 1:
      _items = _items1;
      break;
    default:
      _items = {};
      break;
  }

  var Items = {};

  if (gen == 1) {
    for (var key in _items) {
      if (key !== "info") {
        var item = _items[key];
        Items[key] = new Item(key, item[0], item[1], item[2], item[3], item[4], item[5]);
      }
    }
  }

  return Items;
}

function loadTypes(gen) {
  var Types = {};

  for (var i = 0; i < _types["types"].length; i++) {
    var key = _types["types"][i];
    Types[key] = new Type(key, _types["names"][i], _types["isPhysical"][i]);
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
  var _moves;
  switch (gen) {
    case 1:
      _moves = _moves1;
      break;
    default:
      _moves = {};
      break;
  }

  var Moves = {};

  if (gen == 1) {
    for (var key in _moves) {
      if (key !== "info") {
        var move = _moves[key];
        var type = types[move[3]];
        var cat = (type.isPhysical ? "physical" : "special");
        Moves[key] = new Move(key, move[0], move[1], move[2], type, move[4], move[5], cat, move[6]);
      }
    }
  }

  return Moves;
}

function loadPokemon(gen, types) {
  var _pokemon;
  switch (gen) {
    case 1:
      _pokemon = _pokemon1;
      break;
    default:
      _pokemon = {};
      break;
  }

  var PokemonMap = {};

  if (gen == 1) {
    for (var id = 1; id < _pokemon.length; id++) {
      var params = _pokemon[id];
      var pokemon = new Pokemon(params[0], id, params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[9], params[9], params[8]);
      PokemonMap[pokemon.key] = pokemon;
    }
  }

  return PokemonMap
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
    var gameInfo = new GameInfo(gameKey, info.name, info.gen, info.year, _games.platforms[info.platform]);
    var items = loadItems(gameInfo.gen);
    var types = loadTypes(gameInfo.gen);
    var typeChart = loadTypeChart(gameInfo.gen);
    var moves = loadMoves(gameInfo.gen, types);
    var pokemon = loadPokemon(gameInfo.gen, types);
    var experienceGroup = ExperienceGroup; // TODO: gen dependent OR static in Game-class OR only use it in Pokemon-class
    var game = new Game(experienceGroup, gameInfo, items, types, typeChart, moves, pokemon);
  }
  return game;
};
