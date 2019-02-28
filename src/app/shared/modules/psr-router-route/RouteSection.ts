'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteBattle, RouteDirections, RouteEntry, RouteGetPokemon } from '.';
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Location, Player, Trainer } from '../psr-router-model/Model';

/**
 * A class representing a route-setions that holds multiple child entries.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
export class RouteSection extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "S";
  protected _children: RouteEntry[];
  /**
   *
   * @param game      The Game object this route entry uses.
   * @param info      The info for this entry.
   * @param location  The location in the game where this entry occurs.
   * @param children  The child entries of this entry.
   * @todo children in here and not in entry
   */
  constructor(game: Game, info: RouteEntryInfo, location?: Location, children: RouteEntry[] = []) {
    super(game, info, location);
    this._children = children;
  }

  public get entryType(): string {
    return RouteSection.ENTRY_TYPE;
  }

  /**
   * @param child
   * @todo TESTING!!
   */
  _applyAfterChild(child?: RouteEntry) {
    var currChildIdx = 0;
    if (child) {
      while (currChildIdx < this._children.length && this._children[currChildIdx] !== child) {
        currChildIdx++;
      }
    } else if (this._children.length > 0) {
      this._children[0].apply(this.playerAfter);
    }
    while (currChildIdx + 1 < this._children.length) {
      this._children[currChildIdx + 1].apply(this._children[currChildIdx].playerAfter);
      currChildIdx++;
    }
    this._fireDataUpdated();
    return this.playerAfter;
  }

  /**
   * Only for use during an update event!
   *
   * @param child
   * @param type  data, player, ...
   * @private
   */
  _childChanged(child: RouteEntry, type: string) {
    if (type === "player") {
      this._applyAfterChild(child);
      this._firePlayerUpdated();
    }
  }

  apply(player?: Player): Player {
    super.apply(player);
    return this._applyAfterChild();
  }

  /**
   * Get only the direct children.
   * @returns The list of direct children.
   */
  public get children(): RouteEntry[] {
    return this._children;
  }

  /**
   * Gets all of its entries, including itself as the first one.
   * @returns The entry list.
   */
  public get entryList(): RouteEntry[] {
    var entryList: RouteEntry[] = [this];

    if (this._children)
      this._children.forEach(c => { entryList.push(...c.getEntryList()) })

    return entryList;
  }

  // /**
  //  * Add a child entry.
  //  * @param {RouteEntry}  entry
  //  * @param {Function}    [observer]
  //  * @returns {RouteEntry} The added entry.
  //  * @protected
  //  * @todo refresh?
  //  */
  // _addEntry(entry: RouteEntry, observer: Function): RouteEntry {
  //   this._children.push(entry);
  //   if (observer)
  //     entry.addObserver(observer);
  //   this._fireDataUpdated();
  //   return entry;
  // }

  public get playerAfter() {
    if (this._children.length > 0) {
      return this._children[this._children.length - 1].playerAfter;
    } else {
      return super.playerAfter;
    }
  }

  _addEntry<T extends RouteEntry>(entry: T): RouteEntry {
    entry.addObserver(this._childChanged.bind(this));
    this._children.push(entry);
    return entry;
  }

  /**
   * Add a new battle entry.
   * @param trainer     The trainer to battle against.
   * @param title       A title for this entry.
   * @param summary     A summary for this entry.
   * @param description A long description.
   * @param location    The location in the game where this entry occurs.
   * @returns The added entry.
   * @todo
   */
  addNewBattle(trainer: Trainer, title: string = "", summary: string = "", description: string = "", location?: Location): RouteBattle {
    return <RouteBattle>this._addEntry(new RouteBattle(this.game, trainer, new RouteEntryInfo(title, summary, description), location ? location : super._location));
  }

  /**
   * Add new directions.
   * @param summary     The directions summary.
   * @param description A long description.
   * @param imageUrl    A link to an image (e.g. imgur).
   * @param location    The location in the game where this entry occurs.
   * @returns The added entry.
   */
  addNewDirections(summary: string, description: string = "", location?: Location): RouteSection {
    return <RouteSection>this._addEntry(new RouteDirections(this.game, new RouteEntryInfo("", summary, description), location ? location : super._location));
  }

  /**
   * Add a new child entry.
   * @param title     A title for this entry.
   * @param summary   A summary for this entry.
   * @param location  he location in the game where this entry occurs.
   * @returns The added entry.
   */
  addNewEntry(title: string = "", summary: string = "", description = "", location?: Location): RouteEntry {
    return this._addEntry(new RouteEntry(this.game, new RouteEntryInfo(title, summary, description), location ? location : super._location));
  }

  /**
   * Add a new pokemon entry.
   * @param choices     The pokemon to choose from.
   * @param preference  The preferred choices.
   * @param title       A title for this entry.
   * @param summary     A summary for this entry.
   * @param location    The location in the game where this entry occurs.
   * @returns The added entry.
   * @todo
   */
  addNewGetPokemon(choices: any, preference: number, title: string = "", summary: string = "", location?: Location): RouteGetPokemon {
    return <RouteGetPokemon>this._addEntry(new RouteGetPokemon(this.game, choices, preference, new RouteEntryInfo(title, summary), location ? location : super._location));
  }

  /**
   * Add a new section.
   * @param title       A title for this entry.
   * @param description A description for this entry.
   * @param location    The location in the game where this entry occurs.
   * @param children    The child entries of this entry.
   * @returns The added entry.
   */
  addNewSection(title: string, description: string = "", location?: Location, children: RouteEntry[] = []): RouteSection {
    return <RouteSection>this._addEntry(new RouteSection(this.game, new RouteEntryInfo(title, description), location ? location : super._location, children));
  }

  getJSONObject(): any {
    var obj = super.getJSONObject();
    obj.entries = [];
    this._children.forEach(c => obj.entries.push(c.getJSONObject()));
    return obj;
  }

  static newFromJSONObject(game: Game, obj: any): RouteSection {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    var children: RouteEntry[] = [];
    obj.entries.forEach(e => {
      var type = e.type && e.type.toUpperCase();
      switch (type) {
        case RouteBattle.ENTRY_TYPE.toUpperCase():
          children.push(RouteBattle.newFromJSONObject(game, e));
          break;
        case RouteEntry.ENTRY_TYPE.toUpperCase():
          children.push(RouteEntry.newFromJSONObject(game, e));
          break;
        case RouteGetPokemon.ENTRY_TYPE.toUpperCase():
          children.push(RouteGetPokemon.newFromJSONObject(game, e));
          break;
        case RouteSection.ENTRY_TYPE.toUpperCase():
          children.push(RouteSection.newFromJSONObject(game, e));
          break;
        case RouteDirections.ENTRY_TYPE.toUpperCase():
        default:
          children.push(RouteDirections.newFromJSONObject(game, e));
      }
    });

    var location = undefined; // TODO, parse from obj.location
    return new RouteSection(game, info, location, children);
  }
}
