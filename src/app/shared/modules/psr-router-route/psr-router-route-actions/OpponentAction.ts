// TODO: naming?
// imports
import { RouterMessage } from '../../psr-router-util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { BSettingsAction } from './BSettingsAction';
import { DirectionAction } from './DirectionAction';
import { SwapAction } from './SwapAction';
import { SwapPokemonAction } from './SwapPokemonAction';
import { UseAction } from './UseAction';
import { BattleEntrant, BattleStage } from '../RouteBattle';

// TODO: get these from RouteBattle
const oppActions: { [key: string]: (obj: ActionJSON, game: Model.Game) => AAction } = {};
oppActions[BSettingsAction.ACTION_TYPE.toUpperCase()] = BSettingsAction.newFromJSONObject;
oppActions[DirectionAction.ACTION_TYPE.toUpperCase()] = DirectionAction.newFromJSONObject;
oppActions[SwapAction.ACTION_TYPE.toUpperCase()] = SwapAction.newFromJSONObject;
oppActions[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = SwapPokemonAction.newFromJSONObject;
oppActions[UseAction.ACTION_TYPE.toUpperCase()] = UseAction.newFromJSONObject;

export class OpponentAction extends AAction {
    public static readonly ACTION_TYPE: string = "Opp";
    public static readonly oppActions: { [key: string]: (obj: ActionJSON, game: Model.Game) => AAction } = oppActions;

    constructor(
        public readonly oppIndex: number,
        private actions: AAction[] = [],
        public readonly entrants: BattleEntrant[] = []
    ) {
        super();
        this.actionString = "The 'Opp' action is not implemented yet";
    }

    public get actionType(): string {
        return OpponentAction.ACTION_TYPE;
    }

    public addAction(action: AAction) {
        if (OpponentAction.oppActions[action.actionType]) {
            this.actions.push(action);
        }
    }

    public applyAction(player: Model.Player, battleStage?: BattleStage): void {
        super.applyAction(player, battleStage);
        if (battleStage) {
            battleStage.setEntrants(this.entrants);
        }
        this.actions.forEach(action => {
            if (OpponentAction.oppActions[action.actionType]) {
                action.applyAction(player, battleStage);
            }
        });
        this.addMessage(new RouterMessage("The 'Opp' action is not fully implemented yet", RouterMessage.Type.Warning));
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let oppIndex = obj.properties.oppIndex;
        let actions = [];
        obj.actions.forEach(action => {
            if (OpponentAction.oppActions[action.type.toUpperCase()]) {
                // Just a check for extra safety
                actions.push(OpponentAction.oppActions[action.type.toUpperCase()](action, game))
            }
        });
        let entrants: { partyIndex: number, faint: boolean }[] = obj.properties.entrants;
        let oppEntrants: BattleEntrant[] = [];
        if (entrants && entrants.length > 0) {
            entrants.forEach(e => oppEntrants.push(new BattleEntrant(e.partyIndex, e.faint)));
        }
        return new OpponentAction(oppIndex, actions, oppEntrants);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.oppIndex = this.oppIndex;
        obj.properties.entrants = [];
        if (this.entrants && this.entrants.length > 0) {
            this.entrants.forEach(e => obj.properties.entrants.push({ partyIndex: e.partyIndex, faint: e.faint }));
        }
        this.actions.forEach(action => obj.actions.push(action.getJSONObject()));
        return obj;
    }
}
