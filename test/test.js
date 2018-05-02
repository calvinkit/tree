var assert = require('assert');

describe('TriNomial Tree', function() {
    var Tree = require('./../lib/tree');
    var tree = new Tree('trinomial','european','call',1,100,100,0.1,0);
    tree.build(1000);

    it('should have 1000 slices', function() {
        assert.strictEqual(tree.slices.length, 1000);
    });

    it('last slice shoud have 1999 nodes', function() {
        assert.strictEqual(tree.slices[tree.slices.length-1].length, 1999);
    });

    it('return right call option value', function() {
        assert.strictEqual(+(tree.slices[0][0].value.toFixed(7)),+(3.9852697602137126.toFixed(7)));
    });
});


describe('BiNomial Tree', function() {
    var Tree = require('./../lib/tree');
    var tree = new Tree('binomial','european','call',1,100,100,0.1,0);
    tree.build(1000);

    it('should have 1000 slices', function() {
        assert.strictEqual(tree.slices.length, 1000);
    });

    it('last slice shoud have 1000 nodes', function() {
        assert.strictEqual(tree.slices[tree.slices.length-1].length, 1000);
    });

    it('return right call option value', function() {
        assert.strictEqual(+(tree.slices[0][0].value.toFixed(7)),+(3.9867644.toFixed(7)));
    });
});

