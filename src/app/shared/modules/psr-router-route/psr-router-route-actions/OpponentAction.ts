// TODO: naming?
// imports
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { RouteBattle } from '../RouteBattle';

export class OpponentAction extends AAction {
    public static readonly ACTION_TYPE: string = "Opp";

    constructor(
        public readonly oppIndex: number,
        public readonly actions: AAction[] = [],
        public readonly entrants: RouteBattle.Entrant[] = []
    ) {
        super();
    }

    public get actionType(): string {
        return OpponentAction.ACTION_TYPE;
    }

    public addAction(action: AAction) {
        this.actions.push(action);
    }

    public applyAction(player: Model.Player, battleStage?: RouteBattle.Stage): void {
        super.applyAction(player, battleStage);
        if (battleStage) {
            battleStage.setEntrants(this.entrants);
        }
        this.actionString = `On ${battleStage.getTrainerBattler().toString()} (${this.oppIndex + 1})`;
        this.actions.forEach(action => {
            action.applyAction(player, battleStage);
            action.messages.forEach(m => this.addMessage(m));
        });
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        let oppIndex = obj.properties.oppIndex;
        let actions = [];
        obj.actions.forEach(action => {
            let newAction = RouteBattle.POSSIBLE_ACTIONS[action.type?.toUpperCase()] || RouteBattle.DEFAULT_ACTION;
            if (newAction) {
                // Just a check for extra safety
                actions.push(newAction(action, game))
            }
        });
        let entrants: { partyIndex: number, faint: boolean }[] = obj.properties.entrants;
        let oppEntrants: RouteBattle.Entrant[] = [];
        if (entrants && entrants.length > 0) {
            entrants.forEach(e => oppEntrants.push(new RouteBattle.Entrant(e.partyIndex, e.faint)));
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
