// TODO: naming?
// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { BSettingsAction } from './BSettingsAction';
import { DirectionAction } from './DirectionAction';
import { SwapAction } from './SwapAction';
import { SwapPokemonAction } from './SwapPokemonAction';
import { UseAction } from './UseAction';

// TODO: is this the way to go?
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
        private oppIndex: number,
        private actions: AAction[] = [],
        description: string = ""
    ) {
        super(description);
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

    public applyAction(player: Model.Player, entry: RouteEntry): Model.Player {
        // TODO: before & after player?
        this.actions.forEach(action => {
            if (OpponentAction.oppActions[action.actionType]) {
                player = action.applyAction(player, entry)
            }
        });
        entry.addMessage(new RouterMessage("The 'Opp' action is not fully implemented yet", RouterMessage.Type.Warning));
        return player;
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
        return new OpponentAction(oppIndex, actions, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.oppIndex = this.oppIndex;
        this.actions.forEach(action => obj.actions.push(action.getJSONObject()));
        return obj;
    }
}
