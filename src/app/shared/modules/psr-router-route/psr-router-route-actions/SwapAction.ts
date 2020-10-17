// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntryInfo } from '../util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from '../parse/EntryJSON';
import { IAction } from './IAction';

export class SwapAction implements IAction {
    constructor(
        private item1: Model.Item,
        private item2: Model.Item,
        private itemIndex1: number,
        private itemIndex2: number,
        private description: string) { }

    public getActionType(): string {
        return "Swap";
    }

    public apply(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO
        entry.addMessage(new RouterMessage("The 'Swap' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    public toString(): string {
        // TODO
        return "The 'Swap' action is not implemented yet";
    }
}
