/*jslint node:true*/

(function() {
    var mocha = require('mocha'),
        assert = require("assert"),
        jessy = require('./index');


    describe('Jessy', function() {

        describe('#toSass()', function() {

            it('should return a valid saas string from a jessy string with one value', function() {
                var res = jessy.toSass({color: '#000'});
                assert.equal('$color: #000;', res);
            });

            it('should return an empty string from a jessy string with no value', function() {
                var res = jessy.toSass({});
                assert.equal('', res);
            });

            it('should return a valid saas string from a jessy string with two values', function() {
                var res = jessy.toSass({color: '#000', plop: 'val'});
                assert.equal('$color: #000;\n$plop: val;', res);
            });

            it('should return a valid saas string from a jessy string one numeric value', function() {
                var res = jessy.toSass({color: 5});
                assert.equal('$color: 5;', res);
            });

        });


        describe('#toJs()', function() {

            it('should return a valid JS string from a jessy string with one value', function() {
                var res = jessy.toJs({color: '#000'});
                assert.equal('var color = \'#000\';', res);
            });

            it('should return an empty string from a jessy string with no value', function() {
                var res = jessy.toJs({});
                assert.equal('', res);
            });

            it('should return a valid JS string from a jessy string with two values', function() {
                var res = jessy.toJs({color: '#000', plop: 'val'});
                assert.equal('var color = \'#000\',\n    plop = \'val\';', res);
            });

            it('should return a valid JS string from a jessy string one numeric value', function() {
                var res = jessy.toJs({color: '5'});
                assert.equal('var color = 5;', res);
            });

            it('should return a valid JS string from a jessy string one numeric value and a key containing a hyphen', function() {
                var res = jessy.toJs({'co-lor': '5'});
                assert.equal('var co_lor = 5;', res);
            });

            it('should return a valid JS string from a jessy string one numeric value with given simple namespace', function() {
                var res = jessy.toJs({color: '5'}, {namespace: 'hello'});
                assert.equal('var hello = {\n    color: 5\n};', res);
            });

            it('should return a valid JS string from a jessy string one numeric value with given nested namespace', function() {
                var res = jessy.toJs({color: '5'}, {namespace: 'hello.world'});
                assert.equal('hello.world = {\n    color: 5\n};', res);
            });
        });


        describe('#parse()', function() {
            it('should return an empty object for an empty string', function(){
                assert.equal(0, Object.keys(jessy.parse('')).length);
            });

            it('should return an empty object when only comments are given', function(){
                assert.equal(0, Object.keys(jessy.parse('# Hello\n # Comments')).length);
            });

            it('should return an object with one value when one value is given', function(){
                assert.equal(1, Object.keys(
                        jessy.parse('some: thing')
                    ).length);
            });

            it('should return an object with two values when two values are given', function(){
                assert.equal(2, Object.keys(
                        jessy.parse('some: thing\n any: thing ')
                    ).length);
            });

            it('should return an object with two values when two values are given with comments', function(){
                assert.equal(2, Object.keys(
                        jessy.parse('# Hello comment\nsome: thing\n#\n any: thing \n    # more comments')
                    ).length);
            });
        });

        
    });

}());