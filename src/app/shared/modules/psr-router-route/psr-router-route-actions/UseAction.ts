// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { BattleStage } from '../RouteBattle';

export class UseAction extends AAction {
    public static readonly ACTION_TYPE: string = "Use";

    constructor(
        private item: Model.Item,
        private count: string = "1",
        private partyIndex: number = 0,
        private moveIndex: number = 0,
        description: string = ""
    ) {
        super(description);
    }

    public get actionType(): string {
        return UseAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: BattleStage): void {
        super.applyAction(player, battleStage);
        if (!this.item) {
            this.addMessage(new RouterMessage("No item defined", RouterMessage.Type.Error));
            this.actionString = "[Use error]";
            return;
        }
        this.actionString = `Use ${this.count == '*' ? "all " : ""}${this.item.name}`;
        if (+this.count > 1) {
            this.actionString = `${this.actionString} ${this.count} times`;
        }
        if (this.item.isUsedOnPokemon()) {
            if (!player.team[this.partyIndex]) {
                this.addMessage(new RouterMessage("Party index out of range: " + this.partyIndex, RouterMessage.Type.Error));
                return;
            }
            this.actionString = `${this.actionString} on ${player.team[this.partyIndex]}`;
            if (this.item.isUsedOnMove()) {
                if (this.moveIndex >= 0 && this.moveIndex < player.team[this.partyIndex].moveset.length) {
                    this.actionString = `${this.actionString}, on ${player.team[this.partyIndex].moveset[this.moveIndex]}`;
                } else {
                    this.addMessage(new RouterMessage("Move index out of range: " + this.moveIndex, RouterMessage.Type.Error));
                }
            }
        }
        if (this.count == "?") {
            this.actionString = `${this.actionString}?`;
        }
        let result = player.useItem(this.item, this.partyIndex, this.moveIndex, battleStage);
        if (result) {
            let i = 1, count = this.count == "*" ? player.getItemCount(this.item) : this.count;
            while (result && i < +count) {
                result = player.useItem(this.item, this.partyIndex, this.moveIndex, battleStage);
                i++;
            }
            if (i == +count) result = true;
        }
        if (!result) {
            this.addMessage(new RouterMessage("Unable to use " + this.item.toString() + (+this.count > 1 ? this.count + " times" : "") + (!!this.item.type && " on " + player.team[this.partyIndex].toString() || " here") + ", do you have it?", RouterMessage.Type.Error));
        }
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let item = game.findItemByName(obj.properties.item);
        let count = obj.properties.count;
        let partyIndex = obj.properties.partyIndex;
        let moveIndex = obj.properties.moveIndex;
        return new UseAction(item, count, partyIndex, moveIndex, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.item = this.item?.key;
        obj.properties.count = this.count;
        obj.properties.partyIndex = this.partyIndex;
        obj.properties.moveIndex = this.moveIndex;
        return obj;
    }
}
