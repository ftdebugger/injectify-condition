var expect = require('chai').expect;

describe('injectify-condition', function () {

    // it('block helper', function() {
    //     var blockTemplate = require('./fixture/block-helper.hbs');
    //
    //     expect(blockTemplate({}).trim()).to.equal('mobile then');
    // });
    //
    // it('block helper without else block', function() {
    //     var blockTemplate = require('./fixture/block-helper-without-else.hbs');
    //
    //     expect(blockTemplate({}).trim()).to.equal('');
    // });

    it('if block helper', function() {
        var blockTemplate = require('./fixture/if-block-helper.hbs');

        expect(blockTemplate({}).trim()).to.equal('then');
    });

    it('if block helper without else', function() {
        var blockTemplate = require('./fixture/if-block-helper-without-else.hbs');

        expect(blockTemplate({}).trim()).to.equal('');
    });

    it('unless block helper', function() {
        var blockTemplate = require('./fixture/unless-block-helper.hbs');

        expect(blockTemplate({}).trim()).to.equal('then');
    });

    it('unless block helper without else', function() {
        var blockTemplate = require('./fixture/unless-block-helper-without-else.hbs');

        expect(blockTemplate({}).trim()).to.equal('');
    });

});
