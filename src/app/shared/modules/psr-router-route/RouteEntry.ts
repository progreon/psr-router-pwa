'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Player, Location } from '../psr-router-model/Model';

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
  protected _observers: Function[];
  protected _playerBefore: Player;
  protected _playerAfter: Player;
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
    this._eventsEnabled = false;
    this._observers = [];
    this._playerBefore = undefined;
    this._playerAfter = undefined;
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
      this._fireDataUpdated();
    }
  }

  /**
   * Gets the player when entering this entry. Be aware this might still be undefined.
   */
  public get playerBefore(): Player {
    return this._playerBefore;
  }

  /**
   * Gets the player when exiting this entry. Be aware this might still be undefined.
   */
  public get playerAfter(): Player {
    return this._playerAfter;
  }

  /**
   * Apply this entry to the player (which holds the state of the game).
   * @param player The player before this entry. If undefined, just recalculate.
   * @return Returns the player after this entry (if you edit this instance, getPlayerAfter() will be edited too).
   */
  apply(player: Player = null): Player {
    let newPlayer: Player;
    this.messages.length = 0; // Clear the messages
    if (player)
      this._playerBefore = player;

    if (this._playerBefore) {
      newPlayer = this._playerBefore.clone();
      // TODO: this.wildEncounters.apply(newPlayer); // Defeat wild encounters
    } else {
      this.messages.push(new RouterMessage("There is no player set!", RouterMessage.Type.Error));
    }

    this._playerAfter = newPlayer;
    return newPlayer;
  }

  /**
   * Gets all of its entries, including itself as the first one.
   * @returns The entry list.
   */
  getEntryList(): RouteEntry[] {
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
    this._firePlayerUpdated();
  }

  /**
   * Add a listener function to this entry.
   * Hint: .bind(this)
   *
   * @param callback
   */
  addObserver(callback: Function) {
    this._observers.push(callback);
  }

  /**
  * Notify listeners that the data is updated, to tell them to refresh the displayed data.
  * @todo Test!!!
  */
  protected _fireDataUpdated() {
    this._triggerObservers("data");
  }

  /**
   * Notify listeners that the player is updated, to retrigger the apply call.
   * @todo Test!!!
   */
  protected _firePlayerUpdated() {
    this._triggerObservers("player");
  }

  /**
   *
   * @param type
   * @todo Test!!!
   */
  protected _triggerObservers(type: string) {
    if (this._eventsEnabled) {
      let athis = this;
      this._observers.forEach(function (f) {
        f(athis, type);
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
  getJSONObject(): any {
    // { type, info: {title, summary, description}, location, data } // data = specific entry data
    let type = this.entryType;
    let info = { title: this.info.title, summary: this.info.summary, description: this.info.description };
    let location = ""; // TODO, parse from this._location;
    let obj = { type, info, location };
    return obj;
  }

  /**
   * @todo doc
   */
  static newFromJSONObject(game: Game, obj: any): RouteEntry {
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    return new RouteEntry(game, info, location);
  }
}
