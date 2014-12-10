/*jslint node:true*/

(function() {
    var mocha = require('mocha'),
        assert = require("assert"),
        lyonesse = require('./index');


    describe('Lyonesse', function() {

        describe('#toScss()', function() {

            it('should return a valid scss string from a lyonesse string with one value', function() {
                var res = lyonesse.toScss({color: '#000'});
                assert.equal('$color: #000;', res);
            });

            it('should return an empty string from a lyonesse string with no value', function() {
                var res = lyonesse.toScss({});
                assert.equal('', res);
            });

            it('should return a valid scss string from a lyonesse string with two values', function() {
                var res = lyonesse.toScss({color: '#000', plop: 'val'});
                assert.equal('$color: #000;\n$plop: val;', res);
            });

            it('should return a valid scss string from a lyonesse string one numeric value', function() {
                var res = lyonesse.toScss({color: 5});
                assert.equal('$color: 5;', res);
            });

            it('should return a valid scss string from a lyonesse object when lyonesse namespace is used', function(){
                var res = lyonesse.toScss({color: {bg: {light: 5, dark: 0}}});
                assert.equal('$color-bg-light: 5;\n$color-bg-dark: 0;', res);
            });
        });


        describe('#toJs()', function() {

            it('should return a valid JS string from a lyonesse string with one value', function() {
                var res = lyonesse.toJs({color: '#000'});
                assert.equal(res, 'var color = \'#000\';');
            });

            it('should return a valid JS string from a lyonesse string with many dashes', function() {
                var res = lyonesse.toJs({'color-for-background': '#000'});
                assert.equal(res, 'var color_for_background = \'#000\';');
            });

            it('should return an empty string from a lyonesse string with no value', function() {
                var res = lyonesse.toJs({});
                assert.equal(res, '');
            });

            it('should return a valid JS string from a lyonesse string with two values', function() {
                var res = lyonesse.toJs({color: '#000', plop: 'val'});
                assert.equal(res, 'var color = \'#000\',\n    plop = \'val\';');
            });

            it('should return a valid JS string from a lyonesse string one numeric value', function() {
                var res = lyonesse.toJs({color: '5'});
                assert.equal(res, 'var color = 5;');
            });

            it('should return a valid JS string from a lyonesse string one numeric value and a key containing a hyphen', function() {
                var res = lyonesse.toJs({'co-lor': '5'});
                assert.equal(res, 'var co_lor = 5;');
            });

            it('should return a valid JS string from a lyonesse string one numeric value with given JS simple namespace option', function() {
                var res = lyonesse.toJs({color: '5'}, {namespace: 'hello'});
                assert.equal(res, 'var hello = {\n    color: 5\n};');
            });

            it('should return a valid JS string from a lyonesse string one numeric value with given JS nested namespace option', function() {
                var res = lyonesse.toJs({color: '5'}, {namespace: 'hello.world'});
                assert.equal(res, 'hello.world = {\n    color: 5\n};');
            });

            it('should return a valid JS string from a lyonesse string one numeric value with given JS nested namespace option and closure', function() {
                var res = lyonesse.toJs({color: '5'}, {namespace: 'hello.world', closure: true});
                assert.equal(res, '(function() {\n    \'use strict\';\n    hello.world = {\n        color: 5\n    };\n}());');
            });


            it('should return a valid JS string from a lyonesse object one numeric value when lyonesse namespace is used', function(){
                var res = lyonesse.toJs({color: {bg: {light: 5, dark: 0}}});
                assert.equal('var color = {\n    bg: {\n        light: 5,\n        dark: 0\n    }\n};', res);
            });

        });


        describe('#parse()', function() {
            it('should return an empty object for an empty string', function(){
                assert.equal(0, Object.keys(lyonesse.parse('')).length);
            });

            it('should return an empty object when only comments are given', function(){
                assert.equal(0, Object.keys(lyonesse.parse('# Hello\n # Comments')).length);
            });

            it('should return an object with one value when one value is given', function(){
                assert.equal(1, Object.keys(
                        lyonesse.parse('some: thing')
                    ).length);
            });

            it('should return an object with two values when two values are given', function(){
                assert.equal(2, Object.keys(
                        lyonesse.parse('some: thing\n any: thing ')
                    ).length);
            });

            it('should return a deep object with one value in given namespace when namespace is used', function(){
                var result = lyonesse.parse('some:\n\tany: thing');
                assert.equal(1, Object.keys(result).length);
                assert.equal(1, Object.keys(result.some).length);
            });

            it('should return a deep object with two nested values when nested namespace is used', function(){
                var result = lyonesse.parse('some:\n\tany:\n\t\tthing: plop');
                assert.equal(1, Object.keys(result).length);
                assert.equal(1, Object.keys(result.some).length);
                assert.equal(1, Object.keys(result.some.any).length);
                assert.equal('plop', result.some.any.thing);
            });


            it('should return a deep object with two nested values when nested namespace is used', function(){
                var result = lyonesse.parse('some:\n\tany:\n\t\tthing: plop\n\tother: value');
                assert.equal(1, Object.keys(result).length);
                assert.equal(2, Object.keys(result.some).length);
                assert.equal(1, Object.keys(result.some.any).length);
                assert.equal('plop', result.some.any.thing);
                assert.equal('value', result.some.other);
            });

            it('should return an object with two values when two values are given with comments', function(){
                assert.equal(2, Object.keys(
                        lyonesse.parse('# Hello comment\nsome: thing\n#\n any: thing \n    # more comments')
                    ).length);
            });
        });


        describe('#solve()', function() {
            it('should return an object with one value replaced by another value', function(){
                var obj = lyonesse.solve(lyonesse.parse('some: thing\nother:$some'));
                assert.equal('thing', obj.other);
            });
            it('should return an object with one value replaced by another value when using nested namespaces', function(){
                var obj = lyonesse.solve(lyonesse.parse('some: thing\nany:\n\tother:$some'));
                assert.equal('thing', obj.any.other);
            });
        });


        describe('README namespaces examples', function() {
            it('should return expected result when targeting JS', function(){
                var res = lyonesse.fromString('my:\n    namespace:\n        color: #000\n    inside: #f00\nglobal: #fff');
                assert.equal(res, 'var my = {\n    namespace: {\n        color: \'#000\'\n    },\n    inside: \'#f00\'\n},\n    global = \'#fff\';');
            });
            it('should return expected result when targeting scss', function(){
                var res = lyonesse.fromString('my:\n    namespace:\n        color: #000\n    inside: #f00\nglobal: #fff', {target: 'scss'});
                assert.equal(res, '$my-namespace-color: #000;\n$my-inside: #f00;\n$global: #fff;');
            });
        });
        
    });

}());