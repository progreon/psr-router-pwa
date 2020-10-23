// imports
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { ActionJSON } from '../parse/actions/ActionJSON';

export abstract class AAction {
    protected actionString: string = "";
    protected description: string = "";

    constructor(description: string = "") {
        this.description = description;
    }

    public abstract get actionType(): string;
    // TODO: change to (BattleStage) => ()
    public abstract applyAction(player: Model.Player, entry: RouteEntry): Model.Player;
    public abstract getJSONObject(): ActionJSON;

    public toString(): string {
        if (this.actionString && this.description) {
            return this.actionString + ": " + this.description;
        } else {
            return this.actionString || this.description || this.actionType; // TODO
        }
    }
}
