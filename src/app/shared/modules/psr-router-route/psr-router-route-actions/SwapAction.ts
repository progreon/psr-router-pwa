// imports
import { RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { RouteBattle } from '../RouteBattle';

export class SwapAction extends AAction {
    public static readonly ACTION_TYPE: string = "Swap";

    constructor(
        private item1: Model.Item,
        private item2: Model.Item,
        private itemIndex1: number,
        private itemIndex2: number,
        description: string = ""
    ) {
        super(description);
    }

    public get actionType(): string {
        return SwapAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: RouteBattle.Stage): void {
        super.applyAction(player, battleStage);
        // this.actionString = `Swap ${this.item1?.name || "slot " + (+this.itemIndex1 + 1)} with ${this.item2?.name || "slot " + (+this.itemIndex2 + 1)}`;

        let result = false;
        let itemIndex1 = this.itemIndex1;
        let itemIndex2 = this.itemIndex2;
        if (this.item1 && this.item2) {
            itemIndex1 = player.getItemIndex(this.item1);
            itemIndex2 = player.getItemIndex(this.item2);
            result = player.swapItems(this.item1, this.item2);
            this.actionString = `Swap ${this.item1.name} (s${itemIndex1 + 1}) with ${this.item2.name} (s${itemIndex2 + 1})`;
        } else if (this.item1 && this.itemIndex2 != null) {
            itemIndex1 = player.getItemIndex(this.item1);
            let item2 = player.getItemByIndex(this.itemIndex2);
            result = player.swapItemToSlot(this.item1, this.itemIndex2);
            this.actionString = `Swap ${this.item1.name} (s${itemIndex1 + 1}) with slot ${+this.itemIndex2 + 1} (${item2?.name || "unknown"})`;
        } else if (this.item2 && this.itemIndex1 != null) {
            let item1 = player.getItemByIndex(this.itemIndex1);
            itemIndex2 = player.getItemIndex(this.item2);
            result = player.swapItemToSlot(this.item2, this.itemIndex1);
            this.actionString = `Swap slot ${this.itemIndex1 + 1} (${item1?.name || "unknown"}) with ${this.item2.name} (s${itemIndex2 + 1})`;
        } else if (this.itemIndex1 != null && this.itemIndex2 != null) {
            let item1 = player.getItemByIndex(this.itemIndex1);
            let item2 = player.getItemByIndex(this.itemIndex2);
            result = player.swapItemsByIndex(this.itemIndex1, this.itemIndex2);
            this.actionString = `Swap slot ${this.itemIndex1 + 1} (${item1?.name || "unknown"}) with slot ${+this.itemIndex2 + 1} (${item2?.name || "unknown"})`;
        }
        if (itemIndex1 != itemIndex2) {
            this.actionString += `, ${itemIndex1 < itemIndex2 ? "↓" : "↑"}${Math.abs(itemIndex1 - itemIndex2)}`;
        }
        if (!result) {
            this.addMessage(new RouterMessage("Please provide two (indices of) items to swap!", RouterMessage.Type.Error));
        }
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let item1 = game.findItemByName(obj.properties.item1);
        let item2 = game.findItemByName(obj.properties.item2);
        let itemIndex1 = obj.properties.itemIndex1;
        let itemIndex2 = obj.properties.itemIndex2;
        return new SwapAction(item1, item2, itemIndex1, itemIndex2, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.item1 = this.item1?.key;
        obj.properties.item2 = this.item2?.key;
        obj.properties.itemIndex1 = this.itemIndex1;
        obj.properties.itemIndex2 = this.itemIndex2;
        return obj;
    }
}
