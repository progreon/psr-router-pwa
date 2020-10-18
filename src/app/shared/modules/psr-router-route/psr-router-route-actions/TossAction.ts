// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';

export class TossAction extends AAction {
    public static readonly ACTION_TYPE: string = "Toss";

    constructor(
        private item: Model.Item,
        private count: string = "1",
        description: string = ""
    ) {
        super(description);
    }

    public get actionType(): string {
        return TossAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO: implement GetI-entry first
        this.actionString = `Toss ${this.count == "0" ? "all" : this.count} ${this.item.name}`;
        entry.addMessage(new RouterMessage("The 'Toss' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let item = game.findItemByName(obj.properties.item);
        let count = obj.properties.count;
        return new TossAction(item, count, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.item = this.item?.key;
        obj.properties.count = this.count;
        return obj;
    }
}
