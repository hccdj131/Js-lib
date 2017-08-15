/* Zepto v1.2.0 - zepto event ajax form ie - monidaima */
(function(global, factory) {
	if (typeof define === 'function' && define.amd)
		define(function() { return factory(global) })
	else
		factory(global)
}(this, function(window) {
	var Zepto = (function() {
	var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
	  document = window.document,
	  elementDisplay = {}, classCache = {},
	  cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
	  fragmentRE = /^\s*<(w+|!)[^>]*>/,
	  singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	  tagExpanderRe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	  rootNodeRE = /^(?:body|html)$/i,
	  capitalRE = /([A-Z])/g,

	  // special attributes that should be get/set via method calls
	  methodAttributes = ['val', 'css', 'html', 'text', 'date', 'width', 'height', 'offset'],

	  adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	  table = document.createElement('table'),
	  tableRow = document.createElement('tr'),
	  containers = {
	  	'tr':document.createElement('tbody'),
	  	'tbody': table, 'thead': table, 'tfoot': table,
	  	'td': tableRow, 'th': tableRow,
	  	'*': document.createElement('div')
	  },
	  readyRE = /complete|loaded|interactive/,
	  simpleSelectorRE = /^[\w-]*$/,
	  class2type = {},
	  toString = class2type.toString,
	  zepto = {},
	  camelize, uniq,
	  tempParent = document.createElement('div'),
	  propMap = {
	  	'tabindex': 'tabIndex',
	  	'readonly': 'readOnly',
	  	'for': 'htmlFor',
	  	'class': 'className',
	  	'maxlength': 'maxLength',
	  	'cellspacing': 'cellSpacing',
	  	'cellpadding': 'cellPadding',
	  	'rowspan': 'rowSpan',
	  	'colspan': 'colSpan',
	  	'usemap': 'useMap',
	  	'frameborder': 'frameBorder',
	  	'contenteditable': 'contentEditable'
		},
		isArray = Array.isArray ||
		  function(object){ return object instanceof Array }

	zepto.matches = function(element, selector) {
		if (!selector || !element || element.nodeType !== 1) return falese
		var matchesSelector = element.matches || element.webkitMatchesSelector ||
							  element.mozMatchesSelector || element.oMatchesSelector ||
							  element.matchesSelector
		if (matchesSelector) return matchesSelector.call(element, selector)
		// fall back to performing a selector:
		var match, parent = element.parentNode, temp = !parent
		if (temp) (parent = tempParent).appendChild(element)
		match = ~zepto.qsa(parent, selector).indexOf(element)
		temp && tempParent.removeChild(element)
		return match
	}

	function type(obj) {
		return obj == null ? String(obj) :
		  class2type[toString.call(obj)] || "object"
	}

	function isFunction(value) { return type(value) == "function" }
	function isWindow(obj)     { return obj != null && obj == obj.window }
	function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
	function isObject(obj)     { return type(obj) == "object" }
	function isPlainObject(obj) {
		return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	}

	function likeArray(obj) {
		var length = !!obj && 'length' in obj && obj.length,
		  type = $.type(obj)

		return 'function' != type && !isWindow(obj) && (
			'array' == type || length === 0 ||
			  (typeof length == 'number' && length > 0 && (length - 1) in obj)
		)
	}

	function compact(array) { return filter.call(array, function(item){ return item != null }) }
	function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
	camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : ''}) }
	function dasherize(str) {
		return str.replace(/::/g, '/')
			   .replace(/([A-Z]+)[A-Z][a-z])/g, '$1_$2')
			   .replace(/([a-z\d])([A-Z])/g, '$1_$2')
			   .replace(/_/g, '-')
			   .toLowerCase()
	}
	uniq = function(array){ return filter.call(array,function(item, idx){ return array.indexOf(item) == idx }) }

	function classRE(name) {
		return name in classCache ?
		  classCache[name] : (classCache[name] = new RegExp('(^|\\s') + name + '(\\s|$'))
	}

	function defaultDisplay(nodeName) {
		var element, display
		if (!elementDisplay[nodeName]) {
			element = document.createElement(nodeName)
			document.body.appendChild(element)
			display = getComputedStyle(element, '').getPropertyValue("display")
			element.parentNode.removeChild(element)
			display == "none" && (display = "block")
			elementDisplay[nodeName] = display
		}
		return elementDisplay[nodeName] = display
	  }

	  function children(element) {
	  	return 'children' in element ?
	  		slice.call(element.children) :
	  		$.map(element.childNodes, function(node){ if (node.nodeType == 1) return node})
	  }

	  function Z(dom, selector) {
	  	var i, len = dom ? dom.length : 0
	  	for (i = 0; i < len; i++) this[i] = dom[i]
	  	this.length = len
	  	this.selector = selector || ''
	  }

	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overridden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function(html, name, properties) {
	  	var dom, nodes, container

	  	// A special case optimization for a single tag
	  	if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

	  	if (!dom) {
	  		if (html.replace) html = html.replace(tagExpanderRE, "<$1><$2>")
	  		if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	  		if (!(name in containers)) name = '*'

	  		container = containers[name]
	  		container.innerHTML = '' + html
	  		dom = $.each(slice.call(container.childNodes), function(){
	  			container.removeChild(this)
	  		})
	  	}

	  	if (isPlainObject(properties)) {
	  		nodes = $(dom)
	  		$.each(properties, function(key, value) {
	  			if (methodAttributes.indexOf(key) > -1) nodes[key](value)
	  			else nodes.attr(key,value)
	  		})
	  	}

	  	return dom
	  }

	  // `$.zepto.Z` swaps out the prototype of the given `dom` array
	  // of nodes with `$.fn` and thus supplying all the Zepto functions
	  // to the array. This method can be overridden in plugins.
	  zepto.Z = function(dom,selector) {
	  	return new Z(dom, selector)
	  }

	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // Special cases).
	  zepto.init = function(selector, context) {
	  	var dom
	  	// If nothing given, return an empty Zepto collection
	  	if (!selector) return zepto.Z()
	  	// Optimize for string selectors
	    else if (typeof selector == 'string') {
	    	selector = selector.trim()
	    	// If there's a context, create a collection on that context first, and select
	    	// nodes from there
	    	else if (context !== undefined) return $(context).find(selector)
	    	// If it's a CSS selector, use it to select nodes.
	    	else dom = zepto.qsa(document, selector)
	    }
	  }


	})
})
})