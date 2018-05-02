class Link {
    constructor(prev) {
        this.prev = prev;
        this.next = null;
        this.factor = 0;
        this.probability = 0;
    }

    to(next) {
        this.next = next;
        return this;
    }

    get dt() {
        return this.next.t - this.prev.t;
    }

}

module.exports = Link;
