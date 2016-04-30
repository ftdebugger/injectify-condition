var injectify = require('injectify');
var walkerFactory = require('injectify/lib/walker').factory;

var empty = function () {
    return {
        type: 'ContentStatement',
        original: '',
        value: '',
        rightStripped: false,
        leftStripped: false
    };
};

var booleanNode = function (value) {
    return {
        type: 'BooleanLiteral',
        value: value,
        original: value
    };
};

injectify.installPlugin(function (injectify) {
    var blocks = injectify.options.condition || {};

    var accept = function (node) {
        if (!node.path) {
            return false;
        }

        return node.path.original in blocks;
    };

    var modify = function (node, source, expect) {
        if (blocks[node.path.original] === expect) {
            return bubbleNodes(source.program) || empty();
        } else {
            return bubbleNodes(source.inverse) || empty();
        }
    };

    var bubbleNodes = function (node) {
        if (node) {
            var walker = walkerFactory();

            walker.registerPreTransform('PathExpression', function (node, options) {
                if (node.depth >= options.depth && node.depth > 0) {
                    node.depth--;
                }

                return node;
            });

            node = walker.walk(node);
        }

        return node;
    };

    injectify.walker.registerPreTransform('BlockStatement', function (node) {
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

    injectify.walker.registerPreTransform('SubExpression', function (node) {
        if (accept(node)) {
            return booleanNode(blocks[node.path.original]);
        }

        return node;
    });

    injectify.walker.registerPostTransform('Program', function (node) {
        if (node.body.length === 1 && node.body[0].type === 'Program') {
            return node.body[0];
        }

        return node;
    });
});
