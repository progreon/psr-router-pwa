// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntryInfo } from '../util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from '../parse/EntryJSON';
import { IAction } from './IAction';

export class SwapPokemonAction implements IAction {
    constructor(
        private partyIndex1: number,
        private partyIndex2: number,
        private description: string) { }

    public getActionType(): string {
        return "SwapP";
    }

    public apply(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO
        entry.addMessage(new RouterMessage("The 'Swap Pokemon' action is not implemented yet", RouterMessage.Type.Warning));
        return player;
    }

    public toString(): string {
        // TODO
        return "The 'Swap Pokemon' action is not implemented yet";
    }
}
