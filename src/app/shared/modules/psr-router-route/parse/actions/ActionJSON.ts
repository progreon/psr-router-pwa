export class ActionJSON {
    public constructor(
        public type: string = "",
        public description: string = "",
        public properties: { [key: string]: any } = {},
        public actions: ActionJSON[] = []
    ) { }

    public getJSONObject(): any {
        return { type: this.type, description: this.description, actions: this.actions, properties: this.properties };
    }
}
