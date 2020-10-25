// imports
import { RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { BattleStage } from '../RouteBattle';

export class TmAction extends AAction {
    public static readonly ACTION_TYPE: string = "Tm";

    constructor(
        private tm: Model.Item,
        private partyIndex: number = 0,
        private moveIndex: number = 0,
        description: string = ""
    ) {
        super(description);
        this.actionString = "The 'Teach' action is not implemented yet";
    }

    public get actionType(): string {
        return TmAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: BattleStage): void {
        super.applyAction(player, battleStage);
        // TODO
        this.addMessage(new RouterMessage("The 'Teach' action is not implemented yet", RouterMessage.Type.Warning));
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let tm = game.findItemByName(obj.properties.tm);
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
