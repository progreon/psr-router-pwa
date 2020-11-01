// imports
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';
import { RouteBattle } from '../RouteBattle';

/**
 * @todo cover multiline description? (with indentations)
 */
export class DirectionAction extends AAction {
    public static readonly ACTION_TYPE: string = "";

    constructor(
        description: string
    ) {
        super(description);
    }

    public get actionType(): string {
        return DirectionAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, battleStage?: RouteBattle.Stage): void {
        super.applyAction(player, battleStage);
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        return new DirectionAction(obj.description);
    }

    public getJSONObject(): ActionJSON {
        return new ActionJSON(this.actionType, this.description);
    }
}
