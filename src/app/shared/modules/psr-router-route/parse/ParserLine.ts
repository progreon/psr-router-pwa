export class ParserLine {
    public constructor(
        public depth: number,
        public line: string,
        public ln?: number
    ) { }
}