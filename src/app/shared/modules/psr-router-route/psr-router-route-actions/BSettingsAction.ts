// TODO: naming?
// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';

export class BSettingsAction extends AAction {
    public static readonly ACTION_TYPE: string = "BSettings";

    constructor(
        private settings: { key: string, value: string[] }[],
        private partyIndex: number = 0,
        description: string = ""
    ) {
        super(description);
        this.actionString = "The 'BSettings' action is not implemented yet";
    }

    public get actionType(): string {
        return BSettingsAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO
        entry.addMessage(new RouterMessage("The 'BSettings' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        return new BSettingsAction(obj.properties.settings, obj.properties.partyIndex, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.partyIndex = this.partyIndex;
        obj.properties.settings = this.settings;
        return obj;
    }
}
