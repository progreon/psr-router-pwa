/**
 * TODO: this is a temp setup to avoid the deep copy struggle, please change later!
 */
export class GameState {
    private _substates: { [name: string]: { [key: string]: string } } = {};

    /**
     * Copy constructor
     * 
     * @param gameState game state to copy
     */
    public constructor(gameState: GameState) {
        gameState.getSubstateNames().forEach(name => {
            this._substates[name] = { ...gameState.getSubstate(name) };
        });
    }

    public getSubstateNames(): string[] {
        return Object.keys(this._substates);
    }

    public getSubstate(name: string): { [key: string]: string } {
        return this._substates[name];
    }
}