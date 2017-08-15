// copy form vue.js 2.3

//ck

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

function isUndef (v) {
	return v === undefined || v === null
}

function isDef (v) {
	return v !== undefined && v !== null
}

function isTrue (v) {
	return v === true
}

function isPrimitive (value) {
	return typeof value === 'string' || typeof value === 'number'
}

// Quick object check - this is primarily used to tell
// Objects from primitive values when we know the vlaue
// is a JSON-compliant type

function isObject (obj) {
	return obj !== null && typeof obj === 'object'
}

var toString = Object.prototype.toString;

function isPlainObject (obj) {
	return toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
	return toString.call(v) === '[object RegExp]'
}

function _toString (val) {
	return val == null
	? ''
	: typeof val === 'object'
		? JSON.stringify(val, null, 2)
		: String(val)
}

function toNumber (val) {
	var n = parseFloat(val);
	return isNaN(n) ? val : n
}

function makeMap (
	str,
	expectsLowerCase
) {
	var map = Object.create(null);
	var list = str.split(',');
	for (var i = 0; i < list.length; i++) {
		map[list[i]] = true;
	}
	return expectsLowerCase
		? function (val) { return map[val.toLowerCase()]; }
		: function (val) { return map[val]; }
}

var is BuiltInTag = makeMap('slot,component', true);

function remove (arr, item) {
	if (arr.length) {
		var index = arr.indexOf(item);
		if (index > -1) {
			return arr.splice(index, 1)
		}
	}
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
	return hasOwnProperty.call(obj, key)
}

function cached (fn) {
	var cache = Object.create(null);
	return (function cachedFn (str) {
		var hit = cache[str];
		return hit || (cache[str] = fn(str))
	})
}

var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
	return str.replace(camelizeRE, function (_, c) {
		return c ? c.toUpperCase() : ''; })
	});

var capitalize = cached(function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
});

var hyphenateRE = /([^-])(A-Z)/g;
var hyphenate = cached(function (str) {
	return str
		.replace(hyphenateRE, '$1-$2')
		.replace(hyphenateRE, '$1-$2')
		.toLowerCase()
});

function bind (fn, ctx) {
	function boundFn (a) {
		var l = arguments.length;
		return l
			? l > 1
				? fn.apply(ctx, arguments)
				: fn.call(ctx, a)
			: fn.call(ctx)
	}

	boundFn.length = fn.length;
	return boundFn
}

function toArray (list, start) {
	start = start || 0;
	var i = list.length - start;
	var ret = new Array(i);
	while (i--) {
		ret[i] = list[i + start];
	}
	return ret
}

function extend (to, _from) {
	for (var key in _from) {
		to[key] = _from[key];
	}
	return to
}

function toObject (arr) {
	var res = {};
	for (var i = 0; i < arr.length; i++) {
		if (arr[i]) {
			extend(res, arr[i]);
		}
	}
	return res
}

function noop () {}

var no = function () { return false; }
})
})))

