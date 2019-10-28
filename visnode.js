"use strict";

var MAXCHARGE = 100;
// var EDGE_DECAY_RATE = 0.2;
var VisNode = /** @class */ (function () {
    function VisNode(threshold, decayRate, startingCharge, edgeDecayReduction=50) {
        if (startingCharge === void 0) { startingCharge = 0; }
        this.children = [];
        this.edges = [];
        this.threshold = threshold;
        this.decayRate = decayRate;
        this.charge = startingCharge;
        this.edgeDecayReduction = clamp(edgeDecayReduction, 0, 200);
    }
    VisNode.prototype.tick = function () {
        this.distributeCharge();
    };
    VisNode.prototype.decay = function () {
        this.charge = clamp(this.charge - this.charge * this.decayRate, 0.1,  this.charge);
    }
    VisNode.prototype.distributeCharge = function () {
        if (this.charge < this.threshold) {
            return this.decayEdges();
        }
        const witholding = this.threshold/MAXCHARGE;
        this.charge -= witholding;

        var remainingEdges = [];
        for (var i = 0; i < this.edges.length; i++) {
            remainingEdges.push(i);
        }
        var dischargedEdges = [];
        var itts = 0;
        while (remainingEdges.length > 0 && itts++ < 10) {
            var newRemainingEdges = [];
            for (var _i = 0, remainingEdges_1 = remainingEdges; _i < remainingEdges_1.length; _i++) {
                var i = remainingEdges_1[_i];
                var child = this.children[i];
                var edge = this.edges[i];
                var chargeShare = this.charge / remainingEdges.length;
                if (chargeShare > edge) {
                    child.charge += edge;
                    this.charge -= edge;
                    dischargedEdges.push(i);
                    // this.edges[i] += 0.01
                }
                else {
                    newRemainingEdges.push(i);
                }
            }
            remainingEdges = newRemainingEdges;
        }
        var edgesToDistribute = [];
        for (var i = 0; i < this.edges.length; i++) {
            if (dischargedEdges.includes(i))
                continue;
            edgesToDistribute.push(i);
        }
        var chargePortion = this.charge / edgesToDistribute.length;
        for (var i = 0; i < edgesToDistribute.length; i++) {
            var edgeIndex = edgesToDistribute[i];
            var target = this.children[edgeIndex];
            target.charge += chargePortion;
            this.charge -= chargePortion;
        }
        this.charge += witholding
        return this.growEdges();
    };
    VisNode.prototype.decayEdges = function () {
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i] = max(this.edges[i] - Math.sqrt(this.edges[i]) / (this.edgeDecayReduction/5), 0);
        }
    };
    VisNode.prototype.growEdges = function () {
        let reduceDecay = false;
        for (var i = 0; i < this.edges.length; i++) {
            this.edges[i] = this.edges[i] + (100/this.edgeDecayReduction)*Math.sqrt(this.children[i].charge);
            reduceDecay += this.edges[i] > 100;
        }
        if (reduceDecay) {
            this.decayRate -= clamp(Math.sqrt(this.decayRate, 2), 0, this.decayRate)
        }
    };
    VisNode.prototype.input = function (charge) {
        this.charge = min(this.charge + charge, MAXCHARGE);
        if (this.charge == MAXCHARGE) {
            this.decayRate *= 2;
        }
    };
    VisNode.prototype.addConnection = function (target, edgeThrougput) {
        this.children.push(target);
        this.edges.push(edgeThrougput);
    };
    return VisNode;
}());

function min(a, b) {
    if (a < b)
        return a;
    return b;
}

function max(a, b) {
    if (a > b)
        return a;
    return b;
}

function clamp(a, n, x) {
    return max(min(a, x), n);
}
