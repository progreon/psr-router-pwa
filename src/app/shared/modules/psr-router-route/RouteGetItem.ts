'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import { EntryJSON } from './parse/EntryJSON';

/**
 * A class representing a route-entry that gets you an item.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteGetItem extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "GetI";
  private _item: Model.Item;
  public get item() { return this._item; }
  private _count: number;
  public get count() { return this._count; }
  private _tradedFor: Model.Item;
  public get tradedFor() { return this._tradedFor; }

  /**
   *
   * @param game        The Game object this route entry uses.
   * @param choices     The different battlers to choose from.
   * @param preference  The preferred choise.
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, item: Model.Item, count: number = 1, tradedFor: Model.Item = null, info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    this._item = item;
    this._count = count;
    this._tradedFor = tradedFor;
  }

  public get entryType(): string {
    return RouteGetItem.ENTRY_TYPE;
  }

  apply(player?: Model.Player, fireApplied = true): void {
    super.apply(player, false);
    let nextPlayer = super.nextPlayer;

    if (this.tradedFor) {
      if (nextPlayer.getItemCount(this.tradedFor) == 0) {
        this.addMessage(new RouterMessage(`You don't have "${this.tradedFor.name}" to trade for "${this.item.name}"`, RouterMessage.Type.Warning));
      } else {
        nextPlayer.tossItem(this.tradedFor, 1, false, true);
      }
    }
    if (this.item) {
      if (!nextPlayer.addItem(this.item, this.count, false, true)) {
        this.addMessage(new RouterMessage(`You don't have enough room for this item`, RouterMessage.Type.Error));
      }
    } else {
      this.addMessage(new RouterMessage(`No item set to get`, RouterMessage.Type.Error));
    }

    super.updateNextPlayer(nextPlayer, fireApplied);
  }

  toString(): string {
    let str = this.info?.toString();
    if (!str?.trim()) {
      str = `Get ${this.item}`;
      if (this.count != 1) {
        str += ` x${this.count}`;
      }
      if (this.tradedFor) {
        str += ` for ${this.tradedFor}`;
      }
    }
    return str;
  }

  getJSONObject(): EntryJSON {
    let obj = super.getJSONObject();
    obj.properties.item = this.item.key;
    obj.properties.count = this.count;
    obj.properties.tradedFor = this.tradedFor?.key;
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteGetItem {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location

    let item = game.findItemByName(obj.properties.item);
    let count = obj.properties.count;
    if (!item) {
      messages.push(new RouterMessage(`Item "${obj.properties.item}" not found`, RouterMessage.Type.Error));
    }
    let tradedFor = game.findItemByName(obj.properties.tradedFor);
    if (!tradedFor && obj.properties.tradedFor) {
      messages.push(new RouterMessage(`Item "${obj.properties.tradedFor}" not found`, RouterMessage.Type.Error));
    }

    let entry = new RouteGetItem(game, item, count, tradedFor, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
