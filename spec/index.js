var expect = require('chai').expect;
var Handlebars = require('injectify/runtime');

Handlebars.registerHelper('block-helper', function (options) {
    return options.fn(options.hash);
});

Handlebars.registerHelper('value-helper', function (value1, value2, options) {
    return options.fn({value1: value1, value2: value2});
});

describe('injectify-condition', function () {

    it('block helper', function () {
        var blockTemplate = require('./fixture/block-helper.hbs');

        expect(blockTemplate({}).trim()).to.equal('mobile then');
    });

    it('block helper without else block', function () {
        var blockTemplate = require('./fixture/block-helper-without-else.hbs');

        expect(blockTemplate({}).trim()).to.equal('');
    });

    it('if block helper', function () {
        var blockTemplate = require('./fixture/if-block-helper.hbs');

        expect(blockTemplate({}).trim()).to.equal('then');
    });

    it('if block helper without else', function () {
        var blockTemplate = require('./fixture/if-block-helper-without-else.hbs');

        expect(blockTemplate({}).trim()).to.equal('');
    });

    it('unless block helper', function () {
        var blockTemplate = require('./fixture/unless-block-helper.hbs');

        expect(blockTemplate({}).trim()).to.equal('then');
    });

    it('unless block helper without else', function () {
        var blockTemplate = require('./fixture/unless-block-helper-without-else.hbs');

        expect(blockTemplate({}).trim()).to.equal('');
    });

    it('unless block helper without else', function () {
        var blockTemplate = require('./fixture/skip-if.hbs');

        expect(blockTemplate({}).trim()).to.equal('else');
    });

    it('pass as hash to block helper', function () {
        var blockTemplate = require('./fixture/pass-as-hash-to-block.hbs');

        expect(blockTemplate({}).trim()).to.equal('value - true - false');
    });

    it('pass as value to block helper', function () {
        var blockTemplate = require('./fixture/pass-as-value-to-block.hbs');

        expect(blockTemplate({}).trim()).to.equal('value - true - false');
    });

});
