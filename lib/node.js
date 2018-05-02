var Link = require('./link');

class Node {
    constructor(t, underV) {
        this.ulink = new Link(this);
        this.dlink = new Link(this);
        this.mlink = new Link(this);
        this.t = t;
        this.underV = underV;
        this.value = 0;
    }

    extend(t, slice) {
        if (slice.length==0) {
            this.ulink.to(slice.add(new Node(t)));
            this.mlink.to(slice.add(new Node(t)));
            this.dlink.to(slice.add(new Node(t)));
        } else {
            this.ulink.to(slice[slice.length-2]);
            this.mlink.to(slice[slice.length-1]);
            this.dlink.to(slice.add(new Node(t)));
        } 
    }

    calibrate(factors, probabilities) {
        this.ulink.factor = factors[0];
        this.ulink.probability = probabilities[0];
        this.ulink.next.underV = this.underV*this.ulink.factor;

        this.dlink.factor = factors[1];
        this.dlink.probability = probabilities[1];
        this.dlink.next.underV = this.underV*this.dlink.factor;

        this.mlink.factor = 1;
        this.mlink.probability = 1-probabilities[0]-probabilities[1];
        this.mlink.next.underV = this.underV;
    }

    calibrate2(vol, curve) {
        this.ulink.factor = Math.exp(vol*Math.sqrt(2*this.ulink.dt));
        this.ulink.probability = (Math.exp(curve*this.ulink.dt/2) - Math.exp(-vol*Math.sqrt(this.ulink.dt/2)))/(Math.exp(vol*Math.sqrt(this.ulink.dt/2)) - Math.exp(-vol*Math.sqrt(this.ulink.dt/2)));
        this.ulink.probability *= this.ulink.probability;
        this.ulink.next.underV = this.underV*this.ulink.factor;

        this.dlink.factor = Math.exp(-vol*Math.sqrt(2*this.dlink.dt));
        this.dlink.probability = (Math.exp(vol*Math.sqrt(this.dlink.dt/2)) - Math.exp(curve*this.dlink.dt/2))/(Math.exp(vol*Math.sqrt(this.dlink.dt/2)) - Math.exp(-vol*Math.sqrt(this.dlink.dt/2)));
        this.dlink.probability *= this.dlink.probability;
        this.dlink.next.underV = this.underV*this.dlink.factor;

        this.mlink.factor = 1;
        this.mlink.probability = 1-this.ulink.probability-this.dlink.probability;
        this.mlink.next.underV = this.underV;
    }
     
    get pv() {
        if (this.ulink.next && this.mlink.next && this.dlink.next)
            return this.ulink.next.value*this.ulink.probability+this.mlink.next.value*this.mlink.probability+this.dlink.next.value*this.dlink.probability;
        else
            return 0;
    }
}

module.exports = Node;
