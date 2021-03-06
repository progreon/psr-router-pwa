// imports
import { RouterError, RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { RouteBattle } from '../RouteBattle';

export class TmAction extends AAction {
    public static readonly ACTION_TYPE: string = "Tm";

    constructor(
        private tm: Model.Item,
        private partyIndex: number = 0,
        private moveIndex: number = -1,
        description: string = ""
    ) {
        super(description);
    }

    public get actionType(): string {
        return TmAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: RouteBattle.Stage): void {
        super.applyAction(player, battleStage);
        if (!this.tm || !this.tm.isTmOrHm()) {
            this.addMessage(new RouterMessage("No tm defined", RouterMessage.Type.Error));
            this.actionString = "[TM error]";
            return;
        }
        let tmIndex = player.getItemIndex(this.tm);
        this.actionString = `Teach ${this.tm.name} (${this.tm.value}) (s${tmIndex + 1})`;
        if (!player.team[this.partyIndex]) {
            this.addMessage(new RouterMessage("Party index out of range: " + this.partyIndex, RouterMessage.Type.Error));
            return;
        }
        this.actionString = `${this.actionString} to ${player.team[this.partyIndex]}`;
        if (this.moveIndex >= 0 && this.moveIndex < player.team[this.partyIndex].moveset.length) {
            this.actionString = `${this.actionString} over ${player.team[this.partyIndex].moveset[this.moveIndex].move} (s${this.moveIndex + 1})`;
        } else if (this.moveIndex >= 0) {
            this.addMessage(new RouterMessage("Move index out of range: " + this.moveIndex, RouterMessage.Type.Error));
            return;
        }
        let result = player.useItem(this.tm, this.partyIndex, this.moveIndex, battleStage, true);
        if (!result) {
            this.addMessage(new RouterMessage("Unable to teach " + this.tm.toString() + " to " + player.team[this.partyIndex].toString() + " here, do you have it?", RouterMessage.Type.Error));
        }
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let tm = game.findItemByName(obj.properties.tm);
        if (!tm) {
            throw new RouterError(`TM "${obj.properties.tm}" was not found!`);
        }
        if (!tm.isTmOrHm()) {
            throw new RouterError(`"${obj.properties.tm}" is not a TM!`)
        }
        let partyIndex = obj.properties.partyIndex;
        let moveIndex = obj.properties.moveIndex;
        return new TmAction(tm, partyIndex, moveIndex, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.tm = this.tm?.key;
        obj.properties.partyIndex = this.partyIndex;
        obj.properties.moveIndex = this.moveIndex;
        return obj;
    }
}
