// imports
import { RouterError, RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { RouteBattle } from '../RouteBattle';

export class SwapMoveAction extends AAction {
    public static readonly ACTION_TYPE: string = "SwapM";

    constructor(
        private move1: ModelAbstract.Move,
        private move2: ModelAbstract.Move,
        private moveIndex1: number,
        private moveIndex2: number,
        description: string = ""
    ) {
        super(description);
    }

    public get actionType(): string {
        return SwapMoveAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: RouteBattle.Stage): void {
        super.applyAction(player, battleStage);
        this.actionString = `Move swap ${this.move1?.name || "slot " + (+this.moveIndex1 + 1)} with ${this.move2?.name || "slot " + (+this.moveIndex2 + 1)}`;

        let battler = battleStage.getCompetingBattler();
        let moveset = battler.moveset;
        let moveIndex1 = this.moveIndex1 == null ? moveset.map(ms => ms.move).indexOf(this.move1) : this.moveIndex1;
        let moveIndex2 = this.moveIndex2 == null ? moveset.map(ms => ms.move).indexOf(this.move2) : this.moveIndex2;
        if (moveIndex1 < 0) {
            this.addMessage(new RouterMessage(`Can't swap ${this.move1.name}, we don't have it`, RouterMessage.Type.Error));
            return;
        } else if (moveIndex2 < 0) {
            this.addMessage(new RouterMessage(`Can't swap ${this.move2.name}, we don't have it`, RouterMessage.Type.Error));
            return;
        } else if (moveset[moveIndex1] == null || moveset[moveIndex2] == null) {
            this.addMessage(new RouterMessage(`Can't swap to an empty move slot`, RouterMessage.Type.Error));
        }
        let moveSlot1 = moveset[moveIndex1];
        moveset[moveIndex1] = moveset[moveIndex2];
        moveset[moveIndex2] = moveSlot1;
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let move1 = game.findMoveByName(obj.properties.move1);
        if (obj.properties.move1 && !move1) {
            throw new RouterError(`Move "${obj.properties.move1}" was not found!`);
        }
        let move2 = game.findMoveByName(obj.properties.move2);
        if (obj.properties.move2 && !move2) {
            throw new RouterError(`Move "${obj.properties.move2}" was not found!`);
        }
        let moveIndex1 = obj.properties.moveIndex1;
        let moveIndex2 = obj.properties.moveIndex2;
        return new SwapMoveAction(move1, move2, moveIndex1, moveIndex2, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.move1 = this.move1?.key;
        obj.properties.move2 = this.move2?.key;
        obj.properties.moveIndex1 = this.moveIndex1;
        obj.properties.moveIndex2 = this.moveIndex2;
        return obj;
    }
}
