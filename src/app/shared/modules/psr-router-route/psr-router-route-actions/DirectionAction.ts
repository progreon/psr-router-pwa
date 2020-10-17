// imports
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { IAction } from './IAction';

/**
 * @todo cover multiline description? (with indentations)
 */
export class DirectionAction implements IAction {
    constructor(
        private description: string) { }

    public getActionType(): string {
        return "";
    }

    public apply(player: Model.Player, entry: RouteEntry): Model.Player {
        return player;
    }

    public toString(): string {
        return this.description;
    }
}
