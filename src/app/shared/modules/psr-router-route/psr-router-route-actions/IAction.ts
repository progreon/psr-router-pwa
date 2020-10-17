// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntryInfo } from '../util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from '../parse/EntryJSON';

export interface IAction {
    getActionType(): string;
    apply(player: Model.Player, entry: RouteEntry): Model.Player;
    toString(): string;
}
