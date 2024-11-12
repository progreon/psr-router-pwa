import { RouteAction } from "../action/RouteAction";
import { GameState } from "../util/GameState";

export abstract class RouteEntry {
    protected childNodes: RouteEntry[] = [];
    protected actions: RouteAction[] = [];
    public apply(gameState: GameState): GameState {
        return new GameState(gameState);
    }
}