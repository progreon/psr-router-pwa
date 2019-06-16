export class ScopedLine {
    public type: string;
    public untypedLine: string;
    public scope: ScopedLine[] = [];
    constructor(public line?: string, public ln?: number) { }
}
