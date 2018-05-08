var Node = require('./node');
var BiNode = require('./binode');
var Link = require('./link');
var Slice = require('./slice');

class Tree {
    constructor(tstyle,estyle,type,expiry,strike,underlying,vol,curve) {
        this.tstyle = tstyle;
        this.estyle = estyle;
        this.expiry = expiry;
        this.strike = strike;
        this.type = type;
        this.underlying = underlying;
        this.vol = vol;
        this.curve = curve;
        this.slices = new Slice();
    }

    // Recombining tree
    build(steps) {
        let curr, ufactor, dfactor, uprobability, dprobability;
        var dt = this.expiry/steps;

        // Precalculate u/m/d
        if (this.tstyle == 'trinomial') {
            curr = this.slices.add(new Slice(new Node(0, this.underlying)));
            ufactor = Math.exp(this.vol*Math.sqrt(2*dt));
            dfactor = Math.exp(-this.vol*Math.sqrt(2*dt));
            uprobability = (Math.exp(this.curve*dt/2) - Math.exp(-this.vol*Math.sqrt(dt/2)))/(Math.exp(this.vol*Math.sqrt(dt/2)) - Math.exp(-this.vol*Math.sqrt(dt/2)));
            uprobability *= uprobability;
            dprobability = (Math.exp(this.vol*Math.sqrt(dt/2)) - Math.exp(this.curve*dt/2))/(Math.exp(this.vol*Math.sqrt(dt/2)) - Math.exp(-this.vol*Math.sqrt(dt/2)));
            dprobability *= dprobability;
        } else {
            curr = this.slices.add(new Slice(new BiNode(0, this.underlying)));
            ufactor = Math.exp(this.vol*Math.sqrt(dt));
            uprobability = (ufactor*Math.exp(-this.curve*dt)-Math.exp(-this.curve*dt))/(ufactor*ufactor-1);

            dfactor = Math.exp(-this.vol*Math.sqrt(dt));
            dprobability = Math.exp(-this.curve*dt) - uprobability;
        }

        // Forward sweap to get underV
        for (var i=1; i<steps; i++) {
            var next = this.slices.add(new Slice());
            curr.forEach((e) => {
                e.extend(i*dt, next);
                e.calibrate([ufactor,dfactor],[uprobability,dprobability]);
                //e.calibrate2(this.vol, this.curve);
            });
            curr = next;
        }
        this.backward();
        return this.slices[0][0].value;
    }

    // Backward sweap to get nodeV
    backward() {
        for (var i=this.slices.length-1; i>=0; i--) {
            var slice = this.slices[i]; 
            for (var j=0; j<slice.length; j++) {
                var node = slice[j];
                if (i==this.slices.length-1) { // Terminal value
                    switch (this.type)
                    {
                    case 'call':
                        node.value = Math.max(0, node.underV-this.strike);
                        break;
                    case 'put':
                        node.value = Math.max(0, this.strike-node.underV);
                        break;
                    case 'straddle':
                        node.value = Math.max(0, this.strike-node.underV, node.underV-this.strike);
                        break;
                    default:
                        node.value = 0;
                        break;
                    }
                } else {
                    var PV = node.pv;
                    if (this.estyle!='european') {
                        switch (this.type)
                        {
                        case 'call':
                            node.value = Math.max(0, node.underV-this.strike, PV);
                            break;
                        case 'put':
                            node.value = Math.max(0, this.strike-node.underV, PV);
                            break;
                        case 'straddle':
                            node.value = Math.max(0, this.strike-node.underV, node.underV-this.strike, PV);
                            break;
                        default:
                            node.value = 0;
                            break;
                        }
                    }
                    node.value = PV;
                }
            }
        }
    }
}

module.exports = Tree;
