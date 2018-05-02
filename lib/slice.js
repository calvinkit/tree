class Slice extends Array {
    constructor(nodes) {
        if (nodes) 
            super(nodes);
        else
            super();
    }

    add(node) {
        super.push(node);
        return node;
    }
}

module.exports = Slice;
