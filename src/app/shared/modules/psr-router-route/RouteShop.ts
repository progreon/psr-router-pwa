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
export class RouteShop extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "Shop";
  private _shopEntries: RouteShop.Entry[];
  public get shopEntries() { return this._shopEntries; }

  /**
   *
   * @param game        The Game object this route entry uses.
   * @param choices     The different battlers to choose from.
   * @param preference  The preferred choise.
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, shopEntries: RouteShop.Entry[], info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    this._shopEntries = shopEntries;
  }

  public get entryType(): string {
    return RouteShop.ENTRY_TYPE;
  }

  apply(player?: Model.Player, fireApplied = true): void {
    super.apply(player, false);
    let nextPlayer = super.nextPlayer;

    let showNotEnoughMoneyMessage = false;
    this.shopEntries.forEach(se => {
      if (+se.count && +se.count > 0) {
        if (!nextPlayer.buyItem(se.item, +se.count, true)) {
          showNotEnoughMoneyMessage = true;
        }
      } else if (+se.count && +se.count < 0) {
        if (!nextPlayer.sellItem(se.item, -se.count, true)) {
          this.addMessage(new RouterMessage(`You cannot sell ${se.item}`, RouterMessage.Type.Error));
        }
      } else if (se.count == "*") {
        if (!nextPlayer.sellItem(se.item, nextPlayer.getItemCount(se.item))) {
          this.addMessage(new RouterMessage(`You cannot sell ${se.item}`, RouterMessage.Type.Error));
        }
      }
    });
    if (showNotEnoughMoneyMessage) {
      this.addMessage(new RouterMessage(`You don't have enough money for this`, RouterMessage.Type.Error));
    }

    super.updateNextPlayer(nextPlayer, fireApplied);
  }

  getJSONObject(): EntryJSON {
    let obj = super.getJSONObject();
    let entries: { item: string, count: string, description?: string }[] = [];
    this.shopEntries.forEach(se => {
      let entry: { item: string, count: string, description?: string } = { item: se.item.key, count: se.count };
      if (se.description) {
        entry.description = se.description;
      }
      entries.push(entry);
    });
    obj.properties.entries = entries;
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteShop {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location

    let shopEntries: RouteShop.Entry[] = [];
    if (obj.properties.entries) {
      let entries: { item: string, count: string, description?: string }[] = obj.properties.entries;
      entries.forEach(e => {
        let item = game.findItemByName(e.item);
        if (!item) {
          item = game.getDummyItem(e.item);
          messages.push(new RouterMessage(`Item "${e.item}" not found!`, RouterMessage.Type.Error));
        }
        let count = e.count;
        let description = e.description;
        shopEntries.push(new RouteShop.Entry(item, count, description));
      });
    }

    let entry = new RouteShop(game, shopEntries, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}

export namespace RouteShop {
  export class Entry {
    constructor(
      public item: Model.Item,
      public count: string,
      public description: string
    ) { }

    public getPrice(player: Model.Player): number {
      let price = 0;

      if (+this.count) {
        price = this.item.price * -this.count;
      } else if (this.count == "*") {
        price = this.item.price * player.getItemCount(this.item);
      }

      return price;
    }

    public toString(player: Model.Player) {
      let str = "";
      if (+this.count > 0) {
        str = `Buy ${this.item} x${this.count} (₽${-this.getPrice(player)})`;
      } else if (+this.count < 0) {
        str = `Sell ${this.item} x${-this.count} (₽${this.getPrice(player) / 2})`;
      } else if (this.count == "*") {
        str = `Sell all ${this.item} (₽${this.getPrice(player) / 2})`;
      }
      if (this.description) {
        str = `${str}: ${this.description}`;
      }
      return str;
    }
  }
}