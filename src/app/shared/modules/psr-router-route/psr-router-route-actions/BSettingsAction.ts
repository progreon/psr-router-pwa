// TODO: naming?
// imports
import { RouterMessage } from '../../psr-router-util';
import { RouteEntry } from '..';
import * as Model from 'SharedModules/psr-router-model/Model';
import { AAction } from './AAction';
import { ActionJSON } from '../parse/actions/ActionJSON';

export class BSettingsAction extends AAction {
    public static readonly ACTION_TYPE: string = "BSettings";

    constructor(
        private settings: { key: string, value: string[] }[],
        private partyIndex: number = 0,
        description: string = ""
    ) {
        super(description);
        this.actionString = "The 'BSettings' action is not fully implemented yet";
    }

    public get actionType(): string {
        return BSettingsAction.ACTION_TYPE;
    }

    public applyAction(player: Model.Player, entry: RouteEntry): Model.Player {
        this.settings.forEach(setting => {
            switch (setting.key.toUpperCase()) {
                case "TEACH":
                    if (setting.value.length != 2) {
                        entry.addMessage(new RouterMessage(`The '${setting.key}' action requiers 2 values`, RouterMessage.Type.Error));
                    } else {
                        let newMove = entry.game.findMoveByName(setting.value[0]);
                        let oldMove = entry.game.findMoveByName(setting.value[1]);
                        if (!newMove) {
                            entry.addMessage(new RouterMessage(`Could not find move ${setting.value[0]}`, RouterMessage.Type.Error));
                        } else if (!oldMove) {
                            entry.addMessage(new RouterMessage(`Could not find move ${setting.value[1]}`, RouterMessage.Type.Error));
                        } else {
                            this.actionString = ""; // TODO
                            player.team[this.partyIndex].settings.addLevelUpMove(newMove, oldMove);
                        }
                    }
                    break;
                default:
                    entry.addMessage(new RouterMessage(`The '${setting.key}' action is not implemented (yet)`, RouterMessage.Type.Warning));
            }
        });
        return player;
    }

    static newFromJSONObject(obj: ActionJSON, game: Model.Game): AAction {
        return new BSettingsAction(obj.properties.settings, obj.properties.partyIndex, obj.description);
    }

    public getJSONObject(): ActionJSON {
        let obj = new ActionJSON(this.actionType, this.description);
        obj.properties.partyIndex = this.partyIndex;
        obj.properties.settings = this.settings;
        return obj;
    }
}
