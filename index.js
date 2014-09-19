/*jslint node:true*/

(function(e) {

    'use strict';

    var fs = require('fs'),
        extend = require('util')._extend,

        TAB = '    ';

    /**
     * Returns a valid options object.
     * 
     * @param  {Object} options Given options
     * @return {Object}         Full valid options
     */
    e.defaults = function(options) {
        return extend({
            symbol: '$',
            namespace: null,
            target: 'js',
            quotes: '\'',
            closure: false
        }, options || {});
    };

    /**
     * Create a Sass or Js string from a Jessy file.
     * 
     * @param  {String}   path     Path to file
     * @param  {Object}   options  Options
     * @param  {Function} callback Callback
     */
    e.fromFile = function(path, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = e.defaults();
        } else {
            options = e.defaults(options);
        }

        fs.readFile(path, function(err, data) {
            if (!!err) {
                callback(err);
                return;
            }

            e.fromString(data.toString(), options, callback);
        });
    };



    /**
     * Create a Sass or Js string from a Jessy string.
     * 
     * @param  {String}   path     Path to file
     * @param  {Object}   options  Options
     * @param  {Function} callback Callback
     */
    e.fromString = function(str, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = e.defaults();
        } else {
            options = e.defaults(options);
        }

        var jessy = e.parse(str);

        if (options.target === 'js') {
            callback(null, e.toJs(jessy, options));
        } else {
            callback(null, e.toSass(jessy, options));
        }
    };

    /**
     * Create a sass string from a Jessy parsed object.
     * 
     * @param  {Object} obj     Jessy object
     * @param  {Object} options Options
     * @return {String}         Sass string
     */
    e.toSass = function(obj, options) {
        var k,
            res = [];

        if (Object.keys(obj).length === 0) {
            return '';
        }

        options = e.defaults(options);

        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                res.push(options.symbol + k + ': ' + obj[k] + ';');
            }
        }

        return res.join('\n');
    };

    /**
     * Create a JS string from a Jessy parsed object.
     * 
     * @param  {Object} obj     Jessy object
     * @param  {Object} options Options
     * @return {String}         JS string
     */
    e.toJs = function(obj, options) {
        var k,
            str,
            res = [],
            strRes,
            tab;

        if (Object.keys(obj).length === 0) {
            return '';
        }

        options = e.defaults(options);
        tab = options.closure ? TAB + TAB : TAB;

        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                str = k.replace('-', '_');

                if (!!options.namespace) {
                    str += ': ';
                } else {
                    str += ' = ';
                }

                if (!obj[k].match('^[0-9\.]+$')) {
                    str += options.quotes + obj[k] + options.quotes;
                } else {
                    str += obj[k];
                }

                res.push(str);
            }
        }

        if (!!options.namespace) {

            if (options.namespace.indexOf('.') > -1) {

                if (!!options.closure) {
                    strRes = '(function() {\n' + TAB + '\'use strict\';\n' + 
                        TAB + options.namespace + ' = {\n' + tab +
                        res.join(',\n' + tab) + '\n' + TAB + '};' + '\n}());';
                } else {

                    strRes = options.namespace + ' = {\n' + tab +
                        res.join(',\n' + tab) + '\n};';
                }

            } else {
                strRes = 'var ' + options.namespace + ' = {\n    ' +
                    res.join(',\n' + tab) + '\n};';
            }
        } else {
            strRes = 'var ' + res.join(',\n' + tab) + ';';
        }



        return strRes;
    };


    /**
     * Parse a jessy string and return an object.
     * 
     * @param  {String} str Jessy string
     * @return {Object}     Result of parsing
     */
    e.parse = function(str) {
        var a = str.split('\n'),
            i,
            l = a.length,
            line,
            idx,
            res = {};


        for (i = 0; i < l; i += 1) {
            line = a[i].trim();

            if (line.length > 0 && line[0] !== '#') {
                idx = line.indexOf(':');
                if (idx > -1) {
                    res[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
                }
            }
        }

        return res;
    };


}(exports));
