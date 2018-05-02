var Link = require('./link');

class BiNode {
    constructor(t, underV) {
        this.ulink = new Link(this);
        this.dlink = new Link(this);
        this.t = t;
        this.underV = underV;
        this.value = 0;
    }

    extend(t, slice) {
        if (slice.length==0) {
            this.ulink.to(slice.add(new BiNode(t)));
            this.dlink.to(slice.add(new BiNode(t)));
        } else {
            this.ulink.to(slice[slice.length-1]);
            this.dlink.to(slice.add(new BiNode(t)));
        } 
    }

    calibrate(factors, probabilities) {
        this.ulink.factor = factors[0];
        this.ulink.probability = probabilities[0];
        this.ulink.next.underV = this.underV*this.ulink.factor;

        this.dlink.factor = factors[1];
        this.dlink.probability = probabilities[1];
        this.dlink.next.underV = this.underV*this.dlink.factor;
    }

    calibrate2(vol, curve) {
        this.ulink.factor = Math.exp(vol*Math.sqrt(this.ulink.dt));
        this.ulink.probability = (this.ulink.factor*Math.exp(-curve*this.ulink.dt)-Math.exp(-curve*this.ulink.dt))/(this.ulink.factor*this.ulink.factor-1);
        this.ulink.next.underV = this.underV*this.ulink.factor;

        this.dlink.factor = Math.exp(-vol*Math.sqrt(this.dlink.dt));
        this.dlink.probability = Math.exp(-curve*this.dlink.dt) - this.ulink.probability;
        this.dlink.next.underV = this.underV*this.dlink.factor;
    }
     
    get pv() {
        if (this.ulink.next && this.dlink.next)
            return this.ulink.next.value*this.ulink.probability+this.dlink.next.value*this.dlink.probability;
        else
            return 0;
    }
}

module.exports = BiNode;
