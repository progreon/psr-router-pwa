/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const DVS = 16;

// <editor-fold desc="BadgeBoosts">
// TODO: player constructor?

const MIN_BADGE_BOOST = 0;
const MAX_BADGE_BOOST = 99;

/**
 * Class holding badge boosts
 *
 * @class
 */
function BadgeBoosts() {
    /**
     * The values array: [atk, def, spd, spc]
     */
    this.values = [0, 0, 0, 0];
    /**
     *
     * @param {type} atk
     * @param {type} def
     * @param {type} spd
     * @param {type} spc
     * @returns {BadgeBoosts}
     */
    this.setValues = function(atk, def, spd, spc) {
        atk = parseInt(atk);
        def = parseInt(def);
        spd = parseInt(spd);
        spc = parseInt(spc);
        this.values = [atk, def, spd, spc];

        for (var i = 0; i < this.values.length; i++)
            if (this.values[i] < BadgeBoosts.MIN())
                this.values[i] = BadgeBoosts.MIN();
            else if (this.values[i] > BadgeBoosts.MAX())
                this.values[i] = BadgeBoosts.MAX();

        return this;
    };
    /**
     * Returns the attack badge boost.
     *
     * @returns {number}
     */
    this.atk = function() {
        return this.values[0];
    };
    /**
     * Returns the defense badge boost.
     *
     * @returns {number}
     */
    this.def = function() {
        return this.values[1];
    };
    /**
     * Returns the speed badge boost.
     *
     * @returns {number}
     */
    this.spd = function() {
        return this.values[2];
    };
    /**
     * Returns the special badge boost.
     *
     * @returns {number}
     */
    this.spc = function() {
        return this.values[3];
    };
    /**
     *
     * @param {number} index 0:atk, 1:def, 2:spd, 3:spc
     * @returns {number}
     */
    this.getValue = function(index) {
        return this.values[parseInt(index)];
    };
    this.toString = function() {
        return '[' + this.atk() + ', ' + this.def() + ', ' + this.spd() + ', ' + this.spc() + ']';
    };
    /**
     *
     * @returns {BadgeBoosts}
     */
    this.clone = function() {
        return new BadgeBoosts(this.atk, this.def, this.spd, this.spc);
    };
}

BadgeBoosts.MIN = function() {
    return MIN_BADGE_BOOST;
};
BadgeBoosts.MAX = function() {
    return MAX_BADGE_BOOST;
};

// </editor-fold>

// <editor-fold desc="TODO: BattleEntry">

// TODO

// </editor-fold>

// <editor-fold desc="DVRange">

/**
 * Class representing a DV-range
 *
 * @class
 */
function DVRange() {
    /**
     * The DVs array, not necessarily in order
     */
    this.dvs = [];
    /**
     *
     * @param {Number} dv [0, 15]
     * @returns {undefined}
     */
    this.addDV = function(dv) {
        dv = parseInt(dv);
        if (dv >= 0 && dv <= 15 && !this.dvs.includes(dv)) {
            this.dvs.push(dv);
        }
    };
    /**
     * Returns the minimum value of this range
     * @returns {number}
     */
    this.getMin = function() {
        var min = 15;
        this.dvs.forEach(function(dv) {
            if (dv < min) {
                min = dv;
            }
        });
        return min;
    };
    /**
     * Returns the maximum value of this range
     * @returns {number}
     */
    this.getMax = function() {
        var max = 0;
        this.dvs.forEach(function(dv) {
            if (dv > max) {
                max = dv;
            }
        });
        return max;
    };
    /**
     * Combine another range into this one
     * @param {DVRange} dvRange
     * @returns {undefined}
     */
    this.combine = function(dvRange) {
        var dvrThis = this;
        dvRange.dvs.forEach(function(dv) {
            dvrThis.addDV(dv);
        });
    };
    /**
     *
     * @returns {String}
     */
    this.toString = function() {
        switch (this.dvs.length) {
            case 0:
                return '-';
            case 1:
                return this.dvs[0].toString();
            case 2:
                return this.getMin() + '/' + this.getMax();
            default:
                return this.getMin() + '-' + this.getMax();
        }
    };
}

// </editor-fold>

// <editor-fold desc="IntPair">

/**
 * Class representing a number pair
 *
 * @param {number} int1
 * @param {number} int2
 * @class
 */
function IntPair(int1, int2) {
    this.int1 = parseInt(int1);
    this.int2 = parseInt(int2);
    this.setValues = function(int1, int2) {
        this.int1 = parseInt(int1);
        this.int2 = parseInt(int2);
    };
    /**
     *
     * @returns {String}
     */
    this.toString = function() {
        return '<' + this.int1 + ';' + this.int2 + '>';
    };
}

// </editor-fold>

// <editor-fold desc="Range">

/**
 * Class holding a range of numbers and keeps count of how many per number.
 *
 * @class
 */
function Range() {
    this.values = {};
    this.count = 0;
    this.min = 0;
    this.max = 0;
    /**
     * Add a value to the range.
     *
     * @param {number} value
     * @returns {undefined}
     */
    this.addValue = function(value) {
        value = parseInt(value);
        if (!(value in this.values))
            this.values[value] = 1;
        else
            this.values[value]++;
        this.count++;
        if (this.count === 1)
            this.min = this.max = value;
        else
        if (value < this.min)
            this.min = value;
        else if (value > this.max)
            this.max = value;
    };
    /**
     * Add a value multiple times to the range.
     *
     * @param {number} value
     * @param {number} count
     * @returns {undefined}
     */
    this.addValues = function(value, count) {
        var i;
        for (i = 0; i < parseInt(count); i++) {
            this.addValue(value);
        }
    };
    /**
     * Combine another range into this one.
     *
     * @param {Range} range
     * @returns {undefined}
     */
    this.combine = function(range) {
        for (var value in range.values) {
            this.addValues(value, range.values[value]);
        }
    };
    /**
     * Checks if the given value falls between the min and max of this range.
     *
     * @param {number} value
     * @returns {Boolean}
     */
    this.containsValue = function(value) {
        return this.min <= parseInt(value) && parseInt(value) <= this.max;
    };
    /**
     * Checks if the given range has values between the min and max of this range.
     *
     * @param {Range} range
     * @returns {Boolean}
     */
    this.containsOneOf = function(range) {
        return (this.min <= range.min && range.min <= this.max)
                || (range.min <= this.min && this.min <= range.max);
    };
    /**
     * Get an array with all of the values;
     *
     * @returns {Array}
     */
    this.getValuesArray = function() {
        var vs = [];

        for (var i in this.values)
            for (var j = 0; j < this.values[i]; j++)
                vs.push(i);

        vs.sort(function(a, b) {
            return a - b;
        });
        return vs;
    };
    /**
     * Returns a new range with the divided values.
     *
     * @param {number} d
     * @returns {Range}
     */
    this.divideBy = function(d) {
        var newRange = new Range();
        for (var value in this.values) {
            newRange.addValues(value / d, this.values[value]);
        }
        return newRange;
    };
    /**
     * Returns a new range with the multiplied values.
     *
     * @param {number} m
     * @returns {Range}
     */
    this.multiplyBy = function(m) {
        var newRange = new Range();
        for (var value in this.values) {
            newRange.addValues(value * m, this.values[value]);
        }
        return newRange;
    };
    /**
     * Returns a new range with the added values.
     *
     * @param {number} a
     * @returns {Range}
     */
    this.add = function(a) {
        var newRange = new Range();
        for (var value in this.values) {
            newRange.addValues(+value + +a, this.values[value]);
        }
        return newRange;
    };
    /**
     * Returns a new range with the added values.
     *
     * @param {Range} ra
     * @returns {Range}
     */
    this.addRange = function(ra) {
        var newRange = new Range();
        for (var value1 in this.values) {
            for (var value2 in ra.values) {
                newRange.addValues(+value1 + +value2, this.values[value1] * ra.values[value2]);
            }
        }
        return newRange;
    };
    /**
     * Returns a new range with the substracted values.
     *
     * @param {number} s
     * @returns {Range}
     */
    this.substract = function(s) {
        var newRange = new Range();
        for (var value in this.values) {
            newRange.addValues(value - s, this.values[value]);
        }
        return newRange;
    };
    /**
     * Returns a new range with the substracted values.
     *
     * @param {Range} rs
     * @returns {Range}
     */
    this.substractRange = function(rs) {
        var newRange = new Range();
        for (var value1 in this.values) {
            for (var value2 in rs.values) {
                newRange.addValues(value1 - value2, this.values[value1] * rs.values[value2]);
            }
        }
        return newRange;
    };
    /**
     *
     * @returns {String}
     */
    this.toString = function() {
        if (this.min === this.max)
            return this.min;
        else
            return this.min + '-' + this.max;
    };
    /**
     *
     * @returns {Range}
     */
    this.clone = function() {
        var range = new Range();
        range.values = this.values;
        range.count = this.count;
        range.min = this.min;
        range.max = this.max;
        return range;
    };
}

// </editor-fold>

// <editor-fold desc="RangePerDV (TODO: test)">

/**
 * Class representing a number pair
 *
 * @class
 */
function RangePerDV() {
    this.count = 0;
    this.valuesPerDV = [];
    for (var i = 0; i < DVS; i++) {
        this.valuesPerDV.push(new Range());
    }
    this.min = 0;
    this.max = 0;
    /**
     * Add a value to the range.
     *
     * @param {number} dv
     * @param {number} value
     * @returns {undefined}
     */
    this.addValue = function(dv, value) {
        dv = parseInt(dv);
        value = parseInt(value);
        if (dv < 0 || dv >= DVS)
            throw new RangeError("dv must be in range [0," + (DVS - 1) + "]!");

        this.valuesPerDV[dv].addValue(value);
        this.count++;
        if (this.count === 1)
            this.min = this.max = value;
        else
        if (value < this.min)
            this.min = value;
        else if (value > this.max)
            this.max = value;
    };
    /**
     * Add a range to a dv.
     *
     * @param {number} dv
     * @param {RangePerDV} range
     * @returns {undefined}
     */
    this.addValues = function(dv, range) {
        if (!(dv in this.valuesPerDV))
            this.valuesPerDV[dv] = range.clone();
        else
            this.valuesPerDV[dv].combine(range);
        this.count += range.count;
        this.min = Math.min(this.min, range.min);
        this.max = Math.max(this.max, range.max);
    };
    /**
     * Combine another range into this one
     * @param {RangePerDV} rangePerDV
     * @returns {undefined}
     */
    this.combine = function(rangePerDV) {
        for (var dv in rangePerDV.valuesPerDV) {
            this.addValues(dv, rangePerDV.valuesPerDV[dv]);
        }
    };
    /**
     * Checks if the given value falls between the min and max of this range.
     *
     * @param {number} value
     * @returns {Boolean}
     */
    this.containsValue = function(value) {
        return this.min <= value && value <= this.max;
    };
    /**
     * Checks if the given range has values between the min and max of this range.
     *
     * @param {RangePerDV} range
     * @returns {Boolean}
     */
    this.containsOneOf = function(range) {
        return (this.min <= range.min && range.min <= this.max)
                || (range.min <= this.min && this.min <= range.max);
    };
    /**
     * Get an array with all of the values;
     *
     * @returns {Array}
     */
    this.getValuesArray = function() {
        var vs = [];

        for (var dv = 0; dv < this.DVS; dv++)
            if (dv in this.valuesPerDV)
                for (var val in this.valuesPerDV[dv].getValuesArray())
                    vs.push(val);

        vs.sort(function(a, b) {
            return a - b;
        });
        return vs;
    };
    /**
     * Returns a new range with the divided values.
     *
     * @param {number} d
     * @returns {RangePerDV}
     */
    this.divideBy = function(d) {
        var newRange = new RangePerDV();
        for (var dv in this.valuesPerDV) {
            newRange.addValues(dv, this.valuesPerDV[dv].divideBy(d));
        }
        return newRange;
    };
    /**
     * Returns a new range with the multiplied values.
     *
     * @param {number} m
     * @returns {RangePerDV}
     */
    this.multiplyBy = function(m) {
        var newRange = new RangePerDV();
        for (var dv in this.valuesPerDV) {
            newRange.addValues(dv, this.valuesPerDV[dv].multiplyBy(m));
        }
        return newRange;
    };
    /**
     * Returns a new range with the added values.
     *
     * @param {number} a
     * @returns {RangePerDV}
     */
    this.add = function(a) {
        var newRange = new RangePerDV();
        for (var dv in this.valuesPerDV) {
            newRange.addValues(dv, this.valuesPerDV[dv].add(a));
        }
        return newRange;
    };
    /**
     * Returns a new range with the added values.
     *
     * @param {RangePerDV} ra
     * @returns {RangePerDV}
     */
    this.addRange = function(ra) {
        var newRange = new RangePerDV();
        for (var dv in this.valuesPerDV) {
            newRange.addValues(dv, this.valuesPerDV[dv].addRange(ra.valuesPerDV[dv]));
        }
        return newRange;
    };
    /**
     * Returns a new range with the substracted values.
     *
     * @param {number} s
     * @returns {RangePerDV}
     */
    this.substract = function(s) {
        var newRange = new RangePerDV();
        for (var dv in this.valuesPerDV) {
            newRange.addValues(dv, this.valuesPerDV[dv].substract(s));
        }
        return newRange;
    };
    /**
     * Returns a new range with the substracted values.
     *
     * @param {RangePerDV} rs
     * @returns {RangePerDV}
     */
    this.substractRange = function(rs) {
        var newRange = new RangePerDV();
        for (var dv in this.valuesPerDV) {
            newRange.addValues(dv, this.valuesPerDV[dv].substractRange(rs.valuesPerDV[dv]));
        }
        return newRange;
    };
    /**
     *
     * @returns {String}
     */
    this.toString = function() {
        var str = '';

        for (var dv = 0; dv < this.DVS; dv++)
            if (dv in this.valuesPerDV)
                str += dv + ': ' + this.valuesPerDV[dv] + '<br />';
            else
                str += dv + ': -<br />';

        return str;
    };
    this.clone = function() {
        var rangePerDV = new RangePerDV();

        for (var dv in this.valuesPerDV) {
            rangePerDV.addValues(dv, this.valuesPerDV[dv]);
        }

        return rangePerDV;
    };
}

// </editor-fold>

// <editor-fold desc="Stages">

const MIN_STAGE = -6;
const MAX_STAGE = 6;

/**
 * Class holding stages
 *
 * @class
 */
function Stages() {
    this.values = [0, 0, 0, 0];
    /**
     * Set the stages and returns this object.
     * (for example, you can run: var stages = new Stages().set(atk, def, spd, spc);)
     *
     * @param {number} atk
     * @param {number} def
     * @param {number} spd
     * @param {number} spc
     * @returns {Stages}
     */
    this.setStages = function(atk, def, spd, spc) {
        atk = parseInt(atk);
        def = parseInt(def);
        spd = parseInt(spd);
        spc = parseInt(spc);
        if (atk < Stages.MIN() || def < Stages.MIN() || spd < Stages.MIN() || spc < Stages.MIN()
                || atk > Stages.MAX() || def > Stages.MAX() || spd > Stages.MAX() || spc > Stages.MAX())
            throw new RangeError("stages must be in range [" + Stages.MIN() + "," + Stages.MAX() + "]!");

        this.values = [atk, def, spd, spc];
        return this;
    };
    /**
     * Returns the attack stage.
     *
     * @returns {number}
     */
    this.atk = function() {
        return this.values[0];
    };
    /**
     * Returns the defense stage.
     *
     * @returns {number}
     */
    this.def = function() {
        return this.values[1];
    };
    /**
     * Returns the speed stage.
     *
     * @returns {number}
     */
    this.spd = function() {
        return this.values[2];
    };
    /**
     * Returns the special stage.
     *
     * @returns {number}
     */
    this.spc = function() {
        return this.values[3];
    };
    /**
     *
     * @param {number} index 0:atk, 1:def, 2:spd, 3:spc
     * @returns {number}
     */
    this.getValue = function(index) {
        index = parseInt(index);
        if (index < 0 || index >= 4)
            throw new RangeError("index must be in range [0,3]!");
        return this.values[index];
    };
    this.toString = function() {
        return "{atk:" + this.atk() + ", def:" + this.def() + ", spd:" + this.spd() + ", spc:" + this.spc() + "}";
    };
    this.clone = function() {
        return new Stages().setStages(this.atk(), this.def(), this.spd(), this.spc());
    };
}

Stages.MIN = function() {
    return MIN_STAGE;
};
Stages.MAX = function() {
    return MAX_STAGE;
};

// </editor-fold>
