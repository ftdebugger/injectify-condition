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

            walker.registerTransform('PathExpression', function(node) {
                if (node.depth > 0) {
                    node.depth--;
                }

                return node;
            });

            return walker.walk(node);
        }

        return node;
    };

    // injectify.bus.on('node', function(event) {
    //     console.log(JSON.stringify(event.node, null, 2));
    // })

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

    // injectify.walker.registerTransform('HashPair', function (node) {
    //     if (node.value.type === 'SubExpression' && accept(node.value)) {
    //         node.value = booleanNode(blocks[node.value.path.original]);
    //     }
    //
    //     return node;
    // });
    //
    injectify.walker.registerTransform('SubExpression', function (node) {
        if (accept(node)) {
            return booleanNode(blocks[node.path.original]);
        }

        return node;
    });
});
