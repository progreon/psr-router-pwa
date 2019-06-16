export class EntryJSON {
    public constructor(
        public type: string,
        public info: { title?: string, summary?: string, description?: string } = { },
        public location: string = "",
        public entries: EntryJSON[] = [],
        public properties: { [key: string]: any } = {}
    ) { }

    public getJSONObject(): any {
        return { type: this.type, info: this.info, location: this.location, entries: this.entries, properties: this.properties };
    }
}