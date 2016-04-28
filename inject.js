var injectify = require('injectify');

var empty = function () {
    return {
        type: 'ContentStatement',
        original: '',
        value: '',
        rightStripped: false,
        leftStripped: false
    };
};

injectify.installPlugin(function (injectify) {
    var blocks = injectify.options.condition || {};

    var accept = function (node) {
        return node.path.original in blocks;
    };

    var modify = function (node, source, expect) {
        if (blocks[node.path.original] === expect) {
            return source.program || empty();
        } else {
            return source.inverse || empty();
        }
    };

    injectify.walker.registerTransform('BlockStatement', function (node) {
        var i, param;

        if (accept(node)) {
            return modify(node, node, true);
        }

        if (node.path.original === 'if') {
            for (i = 0; i < node.params.length; i++) {
                param = node.params[i];

                if (accept(param)) {
                    return modify(param, node, true);
                }
            }
        }

        if (node.path.original === 'unless') {
            for (i = 0; i < node.params.length; i++) {
                param = node.params[i];

                if (accept(param)) {
                    return modify(param, node, false);
                }
            }
        }

        return node;
    });
});