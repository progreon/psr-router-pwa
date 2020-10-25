// imports
import { RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { BattleStage } from '../RouteBattle';

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

    public applyAction(player: Model.Player, battleStage?: BattleStage): void {
        super.applyAction(player, battleStage);
        // TODO: implement GetI-entry first
        this.actionString = `Swap ${this.item1?.name || "slot " + (+this.itemIndex1 + 1)} with ${this.item2?.name || "slot " + (+this.itemIndex2 + 1)}`;
        this.addMessage(new RouterMessage("The 'Swap' action is not fully implemented yet", RouterMessage.Type.Warning));
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
