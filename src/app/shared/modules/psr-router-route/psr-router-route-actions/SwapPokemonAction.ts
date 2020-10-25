// imports
import { RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { BattleStage } from '../RouteBattle';

export class SwapPokemonAction extends AAction {
    public static readonly ACTION_TYPE: string = "SwapP";

    constructor(
        private partyIndex1: number,
        private partyIndex2: number = 0,
        description: string = ""
    ) {
        super(description);
    }

    public get actionType(): string {
        return SwapPokemonAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: BattleStage): void {
        super.applyAction(player, battleStage);
        // TODO: also handle in battle swapping
        if (this.partyIndex1 >= 0 && this.partyIndex1 < player.team.length && this.partyIndex2 >= 0 && this.partyIndex2 < player.team.length) {
            this.actionString = `Swap ${player.team[this.partyIndex1]} with ${player.team[this.partyIndex2]}`;
            player.swapBattlers(this.partyIndex1, this.partyIndex2);
        } else {
            this.actionString = "[Swap error]";
            this.addMessage(new RouterMessage("Invalid party indices (ignoring)", RouterMessage.Type.Error));
        }
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let partyIndex1 = obj.properties.partyIndex1;
        let partyIndex2 = obj.properties.partyIndex2;
        return new SwapPokemonAction(partyIndex1, partyIndex2, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.partyIndex1 = this.partyIndex1;
        obj.properties.partyIndex2 = this.partyIndex2;
        return obj;
    }
}
