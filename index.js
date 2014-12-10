/*jslint node:true*/

(function(e) {

    'use strict';

    var fs = require('fs'),
        stringify = require('stringify-object'),
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
            closure: false,
            solve: true,
            tab: TAB
        }, options || {});
    };

    /**
     * Create a Scss or Js string from a Lyonesse file.
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
     * Create a Scss or Js string from a Lyonesse string.
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

        var lyonesse = e.solve(e.parse(str)),
            result;

        if (options.target === 'js') {
            result = e.toJs(lyonesse, options);
        } else {
            result = e.toScss(lyonesse, options);
        }

        if (typeof callback === 'function') {
            callback(null, result);
        } else {
            return result;
        }
    };

    /**
     * Create a scss string from a Lyonesse parsed object.
     * 
     * @param  {Object} obj     Lyonesse object
     * @param  {Object} options Options
     * @return {String}         Scss string
     */
    e.toScss = function(obj, options, res, ns) {
        var k;
        res = res || [];

        if (Object.keys(obj).length === 0) {
            return '';
        }

        options = e.defaults(options);

        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                if (typeof obj[k] === 'object') {
                    e.toScss(obj[k], options, res, (!!ns ? ns + '-' : '') + k);
                } else {
                    res.push(options.symbol + (!!ns ? ns + '-' : '') + k + ': ' + obj[k] + ';');
                }
            }
        }

        return res.join('\n');
    };

    /**
     * Create a JS string from a Lyonesse parsed object.
     * 
     * @param  {Object} obj     Lyonesse object
     * @param  {Object} options Options
     * @return {String}         JS string
     */
    e.toJs = function(obj, options) {
        options = e.defaults(options);
        var k,
            str,
            res = [],
            tab = (options.closure ? options.tab : '') + options.tab,
            strRes;


        if (Object.keys(obj).length === 0) {
            return '';
        }

        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                str = k.replace(/-/gi, '_');

                if (!!options.namespace) {
                    str += ': ';
                } else {
                    str += ' = ';
                }

                if (typeof obj[k] === 'object') {
                    res.push(str + stringify(obj[k], { 
                        indent: options.tab,
                        singleQuotes: options.quotes === '\''
                    }));
                } else {

                    if (typeof obj[k] === 'string' &&
                        !obj[k].match('^[0-9\.]+$')) {
                        str += options.quotes + obj[k] + options.quotes;
                    } else {
                        str += obj[k];
                    }

                    res.push(str);
                }
            }
        }


        if (!!options.namespace) {

            if (options.namespace.indexOf('.') > -1) {

                if (!!options.closure) {
                    strRes = '(function() {\n' + options.tab + '\'use strict\';\n' + 
                        options.tab + options.namespace + ' = {\n' + tab +
                        res.join(',\n' + tab) + '\n' + options.tab + '};' + '\n}());';
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
     * Recursively parse a lyonesse string and return an object.
     * 
     * @param  {String} str Lyonesse string
     * @param  {String} [obj={}] Optional, target object
     * @return {Object}     Result of parsing
     */
    e.parse = function(str, obj, depth) {
        var a = str.replace(new RegExp(TAB, 'gi'), '\t').split('\n'),
            i,
            j,
            l = a.length,
            line,
            idx,
            key,
            value,
            childs,
            d = depth || 0,
            root = obj || {};

        for (i = 0; i < l; i += 1) {
            line = a[i];
            idx = line.indexOf(':');

            // Filter comments, empty lines and invalid lines
            if (!!line.trim().length && line.trim()[0] !== '#') {

                // Validate separator
                if (idx <= 0) {
                    throw new Error('ParseError at line #' + (i + 1) + 
                        ': no separator. Line content: ' + line);
                }

                key = line.slice(0, idx).trim();
                value = line.slice(idx + 1).trim();
                // New namespace
                if (!value.length) {
                    j = i + 1;
                    childs = [];
                    // Find child lines
                    while (j < l) {
                        idx = 0;
                        line = a[j];
                        while (line.indexOf('\t') === 0) {
                            line = line.slice(1);
                            idx += 1;
                        }
                        if (idx > d) {
                            childs.push(a[j]);
                        } else {
                            break;
                        }
                        j += 1;
                    }
                    i = j - 1;

                    // Set nested object and recursively parse child lines
                    root[key] = {};
                    if (childs.length) {
                        e.parse(childs.join('\n'), root[key], d + 1);
                    }
                } else {
                    root[key] = value;
                }
            }
        }

        return root;
    };

    /**
     * Solve variables in a lyonesse object.
     * 
     * @param  {Object} obj     Lyonesse object
     * @param  {Object} options Options
     * @return  {Object} Lyonesse object
     */
    e.solve = function(obj, options, root) {
        var key,
            val;

        root = root || obj;

        options = e.defaults(options);

        if (options.solve === false) {
            return obj;
        }

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];

                if (typeof val === 'object') {
                    obj[key] = e.solve(obj[key], options, root);
                } else if (val.indexOf(options.symbol) === 0 && 
                    root.hasOwnProperty(val.slice(1))) {
                    obj[key] = root[val.slice(1)];
                }
            }
        }

        return obj;
    };


}(exports));
