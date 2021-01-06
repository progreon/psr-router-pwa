// imports
import * as Model from 'SharedModules/psr-router-model/Model';
import { RouterMessage } from '../../psr-router-util';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { RouteBattle } from '../RouteBattle';

export abstract class AAction {
    public readonly messages: RouterMessage[] = [];
  
    protected actionString: string = "";
    protected description: string = "";

    constructor(description: string = "") {
        this.description = description;
    }

    addMessage(routerMessage: RouterMessage) {
      this.messages.push(routerMessage);
    }

    public abstract get actionType(): string;
    // TODO: change to (BattleStage) => ()
    public applyAction(player: Model.Player, battleStage?: RouteBattle.Stage): void {
        this.messages.splice(0);
    }
    public abstract getJSONObject(): ActionJSON;

    public toString(): string {
        if (this.actionString && this.description) {
            return this.actionString + ": " + this.description;
        } else {
            return this.actionString || this.description || this.actionType; // TODO
        }
    }
}
