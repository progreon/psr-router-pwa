// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntryInfo } from '../util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from '../parse/EntryJSON';
import { IAction } from './IAction';

export class UseAction implements IAction {
    constructor(
        private item: Model.Item,
        private count: string,
        private partyIndex: number,
        private moveIndex: number,
        private description: string) { }

    public getActionType(): string {
        return "Use";
    }

    public apply(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO
        entry.addMessage(new RouterMessage("The 'Use' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    public toString(): string {
        // TODO
        return "The 'Use' action is not implemented yet";
    }
}
