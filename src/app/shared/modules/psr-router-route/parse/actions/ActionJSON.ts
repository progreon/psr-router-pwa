export class ActionJSON {
    public constructor(
        public type: string = "",
        public description: string = "",
        public actions: ActionJSON[] = [],
        public properties: { [key: string]: any } = {}
    ) { }

    public getJSONObject(): any {
        return { type: this.type, description: this.description, actions: this.actions, properties: this.properties };
    }
}