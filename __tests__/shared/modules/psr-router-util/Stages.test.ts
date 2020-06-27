import { Stages } from 'SharedModules/psr-router-util';

let bb: Stages;
test('init', () => {
    bb = new Stages();
    expect(bb.atk).toBe(0);
    expect(bb.def).toBe(0);
    expect(bb.spd).toBe(0);
    expect(bb.spc).toBe(0);
});
test('set & properties', () => {
    bb.setStages(1, 2, 3, 4);
    expect(bb.atk).toBe(1);
    expect(bb.def).toBe(2);
    expect(bb.spd).toBe(3);
    expect(bb.spc).toBe(4);
});
test('getValue', () => {
    expect(() => bb.getValue(-1)).toThrowError(RangeError);
    expect(bb.atk).toBe(bb.getValue(0));
    expect(bb.def).toBe(bb.getValue(1));
    expect(bb.spd).toBe(bb.getValue(2));
    expect(bb.spc).toBe(bb.getValue(3));
    expect(() => bb.getValue(4)).toThrowError(RangeError);
});
test('string', () => {
    expect(bb.toString()).toBe("{atk:1, def:2, spd:3, spc:4}");
});
test('clone', () => {
    let bbc: Stages = bb.clone();
    expect(bbc.atk).toBe(1);
    expect(bbc.def).toBe(2);
    expect(bbc.spd).toBe(3);
    expect(bbc.spc).toBe(4);
});
test('min - max', () => {
    expect(() => bb.setStages(Stages.MIN - 10, Stages.MIN + 1, Stages.MAX - 1, Stages.MAX + 10)).toThrow(RangeError);
});