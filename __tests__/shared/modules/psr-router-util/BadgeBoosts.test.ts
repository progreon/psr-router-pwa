import { BadgeBoosts } from 'SharedModules/psr-router-util';

let bb: BadgeBoosts;
test('init', () => {
    bb = new BadgeBoosts();
    expect(bb.values).toEqual([0, 0, 0, 0]);
});
test('set & properties', () => {
    bb.setValues(1, 2, 3, 4);
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
    expect(bb.toString()).toBe("[1, 2, 3, 4]");
});
test('clone', () => {
    let bbc: BadgeBoosts = bb.clone();
    expect(bbc.atk).toBe(1);
    expect(bbc.def).toBe(2);
    expect(bbc.spd).toBe(3);
    expect(bbc.spc).toBe(4);
});
test('min - max', () => {
    bb.setValues(BadgeBoosts.MIN - 10, BadgeBoosts.MIN + 1, BadgeBoosts.MAX - 1, BadgeBoosts.MAX + 10);
    expect(bb.atk).toBe(BadgeBoosts.MIN);
    expect(bb.def).toBe(BadgeBoosts.MIN + 1);
    expect(bb.spd).toBe(BadgeBoosts.MAX - 1);
    expect(bb.spc).toBe(BadgeBoosts.MAX);
});