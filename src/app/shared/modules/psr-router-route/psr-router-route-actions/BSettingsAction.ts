// TODO: naming?
// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntryInfo } from '../util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from '../parse/EntryJSON';
import { IAction } from './IAction';

export class BSettingsAction implements IAction {
    constructor(
        private map: { [key: string]: string } // TEMP
    ) { }

    public getActionType(): string {
        return "BSettings";
    }

    public apply(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO
        entry.addMessage(new RouterMessage("The 'BSettings' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    public toString(): string {
        // TODO
        return "The 'BSettings' action is not implemented yet";
    }
}
