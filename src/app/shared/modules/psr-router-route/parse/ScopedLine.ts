export class ScopedLine {
    public type: string; // TODO: make this into a getter & parse it here?
    public untypedLine: string; // TODO: make this into a getter & parse it here?
    public scope: ScopedLine[] = [];
    constructor(public line?: string, public ln?: number) { }
}
