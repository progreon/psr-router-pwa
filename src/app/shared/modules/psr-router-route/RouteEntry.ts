'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Player, Location } from '../psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';

/**
 * A class representing a route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteEntry {
  public static readonly ENTRY_TYPE: string = "ENTRY";
  protected _eventsEnabled: boolean;
  protected _location: Location;
  protected _observers: ((entry: RouteEntry, type: RouteEntry.ObservableType) => (void))[];
  protected _player: Player;
  private _nextPlayer: Player;
  public readonly messages: RouterMessage[];

  /**
   *
   * @param game      The Game object this route entry uses.
   * @param info      The info for this entry.
   * @param location  The location in the game where this entry occurs.
   */
  constructor( //
    public readonly game: Game, //
    public readonly info: RouteEntryInfo = new RouteEntryInfo(), //
    location: Location = null) {
    //// INPUT VARIABLES ////
    this._location = location;
    //// OTHERS ////
    this.messages = [];
    this._eventsEnabled = true;
    this._observers = [];
    this._player = undefined;
    this._nextPlayer = undefined;
  }

  public get entryType(): string {
    return RouteEntry.ENTRY_TYPE;
  }

  public get location() {
    return this._location;
  };

  public set location(location: Location) {
    if (this._location != location) {
      this._location = location;
      //TODO: this.wildEncounters.reset();
      this._firePropertiesChanged();
    }
  }

  /**
   * Gets the player when entering this entry. Be aware this might still be undefined.
   */
  public get player(): Player {
    return this._player;
  }

  /**
   * Gets the player when exiting this entry. Be aware this might still be undefined.
   */
  public get nextPlayer(): Player {
    return this._nextPlayer;
  }

  /**
   * This sets the next player, and also fires the "APPLIED" observable event if said so
   * @param nextPlayer 
   */
  protected updateNextPlayer(nextPlayer: Player, fireApplied: boolean) {
    this._nextPlayer = nextPlayer;
    if (fireApplied) {
      this._fireApplied();
    }
  }

  /**
   * Apply this entry to the player (which holds the state of the game).
   * @param player The player before this entry. If undefined, just recalculate.
   */
  apply(player?: Player, fireApplied = true) {
    let nextPlayer: Player;
    this.messages.splice(0); // Clear the messages
    if (player) {
      this._player = player;
    }

    if (this._player) {
      nextPlayer = this._player.clone();
      // TODO: this.wildEncounters.apply(nextPlayer); // Defeat wild encounters
    } else {
      this.messages.push(new RouterMessage("There is no player set!", RouterMessage.Type.Error));
    }

    this.updateNextPlayer(nextPlayer, fireApplied);
  }

  /**
   * Gets all of its entries, including itself as the first one.
   * @returns The entry list.
   */
  public get entryList(): RouteEntry[] {
    return [this];
  }

  addMessage(routerMessage: RouterMessage) {
    this.messages.push(routerMessage);
  }

  /**
   * Gets the most important message type that this entry has.
   * @returns The current message type with the highest priority.
   */
  getMessageType(): RouterMessage.Type {
    let type = RouterMessage.Type.Info;
    this.messages.forEach(m => { if (m.type.valueOf() < type.valueOf()) type = m.type });
    return type;
  }

  //// OBSERVER STUFF ////

  // for testing?
  triggerRefresh() {
    this.apply();
  }

  /**
   * Add a listener function to this entry.
   * Hint: .bind(this)
   *
   * @param callback
   */
  addObserver(callback: (entry: RouteEntry, type: RouteEntry.ObservableType) => (void)) {
    this._observers.push(callback);
  }

  hasObserver(callback: (entry: RouteEntry, type: RouteEntry.ObservableType) => (void)): boolean {
    return this._observers.includes(callback);
  }

  /**
   * Notify listeners that apply was done, to tell them to refresh the displayed data.
   * @todo Test!!!
   */
  protected _fireApplied() {
    this._triggerObservers(RouteEntry.ObservableType.APPLIED);
  }

  /**
   * Notify listeners that the properties have been updated, to retrigger the apply calls.
   * @todo Test!!!
   */
  protected _firePropertiesChanged() {
    this._triggerObservers(RouteEntry.ObservableType.PROPERTIES_CHANGED);
  }

  /**
   *
   * @param type
   * @todo Test!!!
   */
  protected _triggerObservers(type: RouteEntry.ObservableType) {
    if (this._eventsEnabled) {
      this._observers.forEach(f => {
        f(this, type);
      });
    }
  }

  //// STRINGS ////

  toString(): string {
    return this.info.toString();
  }

  /**
   * @todo doc
   * @todo lcoation
   */
  getJSONObject(): EntryJSON {
    // { type, info: {title, summary, description}, location, data } // data = specific entry data
    let type = this.entryType;
    let info = { title: this.info.title, summary: this.info.summary, description: this.info.description };
    let location = ""; // TODO, parse from this._location;
    let obj = new EntryJSON(type, info, location);
    return obj;
  }

  /**
   * @todo doc
   */
  static newFromJSONObject(obj: EntryJSON, game: Game): RouteEntry {
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    return new RouteEntry(game, info, location);
  }
}

export namespace RouteEntry {
  export enum ObservableType {
    APPLIED, PROPERTIES_CHANGED
  }
}
