// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntryInfo } from '../util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from '../parse/EntryJSON';
import { IAction } from './IAction';

export class TmAction implements IAction {
    constructor(
        private tm: Model.Item,
        private partyIndex: number,
        private moveIndex: number,
        private description: string) { }

    public getActionType(): string {
        return "Tm";
    }

    public apply(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO
        entry.addMessage(new RouterMessage("The 'Tm' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    public toString(): string {
        // TODO
        return "The 'Tm' action is not implemented yet";
    }
}
