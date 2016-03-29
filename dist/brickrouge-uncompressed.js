/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * Brickrouge dev-master (http://brickrouge.org)
	 * Copyright 2016 Olivier Laviale <olivier.laviale@gmail.com>.
	 * Licensed under the New BSD License
	 */

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(1),
		__webpack_require__(2),
		__webpack_require__(3),
		__webpack_require__(4),
		__webpack_require__(5)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Brickrouge) {

		return window.Brickrouge = Brickrouge

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

		return {}

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(1)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Brickrouge) {

		const UNIQUE_NUMBER_PROPERTY = 'uniqueNumber'

		var uniqueNumberIndex = 0

		/**
		 * Return the unique identifier a node.
		 *
		 * @param {Node} node
		 *
		 * @return {number}
		 */
		Brickrouge.uidOf = function(node) {

			return node[UNIQUE_NUMBER_PROPERTY] || (node[UNIQUE_NUMBER_PROPERTY] = ++uniqueNumberIndex)

		}

		/**
		 * Efficiently empty an element.
		 *
		 * @param {Element} element
		 */
		Brickrouge.empty = function(element) {

			while (element.firstChild)
			{
				element.removeChild(element.firstChild)
			}

		}

		/**
		 * Camel case dashed-name.
		 *
		 * @param {string} string
		 *
		 * @return {string}
		 */
		Brickrouge.camelCase = function(string) {

			return String(string).replace(/-\D/g, function(match) {
				return match.charAt(1).toUpperCase()
			})

		}

		Brickrouge.Dataset = {

			/**
			 * Return the dataset values.
			 *
			 * @param {Element} element
			 *
			 * @return {Object}
			 */
			from: function (element) {

				var dataset = {}
					, attributes = element.attributes
					, i = 0
					, y = attributes.length
					, attr

				for (; i < y; i++)
				{
					attr = attributes[i]

					if (!attr.name.match(/^data-/)) continue;

					dataset[Brickrouge.camelCase(attr.name.substring(5))] = attr.value
				}

				return dataset

			}
		}

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(1)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Brickrouge) {

		const OBSERVER_PROPERTY = '$brickrouge:observers'

		/**
		 * @interface
		 */
		function Subject() { }

		Subject.prototype = {

			/**
			 * Return the observers array.
			 *
			 * @protected
			 *
			 * @param {string|null} type The event type, of `null` to get all observers.
			 *
			 * @return {Array}
			 */
			getObservers: function (type) {

				var observers

				if (!(OBSERVER_PROPERTY in this)) {
					this[OBSERVER_PROPERTY] = []
				}

				observers = this[OBSERVER_PROPERTY]

				if (!type) {
					return observers
				}

				if (!(type in observers)) {
					observers[type] = []
				}

				return observers[type]
			},

			/**
			 * Attach an observer.
			 *
			 * @param {string} type Event type.
			 * @param {function} callback
			 *
			 * @return {this}
			 */
			observe: function (type, callback) {

				var observers = this.getObservers(type)

				if (observers.indexOf(callback) !== -1)
				{
					throw new Error("Observer already attached for type `" + type + '`')
				}

				observers.push(callback)

				return this
			},

			/**
			 * Detach an observer.
			 *
			 * @param {function} callback
			 *
			 * @return {this}
			 */
			unobserve: function (callback) {

				var observers = this.getObservers(null), type, typeObservers, k

				for (type in Object.keys(observers))
				{
					typeObservers = observers[type]
					k = typeObservers.indexOf(callback)

					if (k === -1) continue

					typeObservers.splice(k, 1)
				}

				return this
			},

			/**
			 * Notify observers of a change.
			 *
			 * @param {string} type
			 * @param {Array} payload
			 *
			 * @return {this}
			 */
			notify: function (type, payload) {

				var observers = this.getObservers(type), i, y

				if (!observers.length)
				{
					return this
				}

				for (i = 0, y = observers.length; i < y; i++)
				{
					try
					{
						observers[i].apply(null, payload)
					}
					catch (e)
					{
						console.error(e)
					}
				}

				return this
			}
		}

		/**
		 * @interface
		 */
		Brickrouge.Subject = Subject

		Brickrouge.observe = Subject.prototype.observe
		Brickrouge.unobserve = Subject.prototype.unobserve
		Brickrouge.notify = Subject.prototype.notify
		Brickrouge.getObservers = Subject.prototype.getObservers

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(1)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Brickrouge) {

		"use strict";

		const IS_ATTRIBUTE = 'brickrouge-is'
		const INVALID_IS_ATTRIBUTE = 'brickrouge-invalid-is'
		const BUILT_ATTRIBUTE = 'brickrouge-built'
		const OPTIONS_ATTRIBUTE = 'brickrouge-options'
		const WIDGET_SELECTOR = '[' + IS_ATTRIBUTE + ']'

		var factories = []
		var widgets = []
		var parsed = []

		/**
		 * Return the factory of a widget type.
		 *
		 * @param {string} type Widget type.
		 *
		 * @return {function} Widget factory.
		 *
		 * @throws Error in attempt to use a type for which no factory is defined.
		 */
		function factory(type)
		{
			if (!(type in factories))
			{
				throw new Error("There is no widget factory for type `" + type + "`")
			}

			return factories[type]
		}

		/**
		 * Whether a node is a widget.
		 *
		 * @param {Element} node
		 *
		 * @returns {boolean} `true` if the node has the {@link IS_ATTRIBUTE} attribute, `false` otherwise.
		 */
		function isWidget(node)
		{
			return typeof node == 'object' && 'getAttribute' in node && !!node.getAttribute(IS_ATTRIBUTE)
		}

		/**
		 * Whether a widget is built for the element.
		 *
		 * @param {Element} element
		 *
		 * @returns {boolean}
		 */
		function isBuilt(element)
		{
			var uniqueNumber = Brickrouge.uidOf(element)

			return uniqueNumber in widgets
		}

		/**
		 * Invalidates a custom element.
		 *
		 * @param {Element} element
		 */
		function invalidate(element)
		{
			element.setAttribute(INVALID_IS_ATTRIBUTE, element.getAttribute(IS_ATTRIBUTE))

			element.removeAttribute(IS_ATTRIBUTE)
		}

		/**
		 * Resolve the options for the widget.
		 *
		 * @param {Element} element The element used to create the widget
		 *
		 * @return {Object}
		 */
		function resolveOptions(element)
		{
			if (element.hasAttribute(OPTIONS_ATTRIBUTE))
			{
				return JSON.parse(element.getAttribute(OPTIONS_ATTRIBUTE))
			}

			return Brickrouge.Dataset.from(element)
		}

		/**
		 * Build the widget associated with an element.
		 *
		 * The `brickrouge.widget` event is fired on the `window` object when a widget is constructed.
		 * The event is fired with the widget and its element as arguments. If an error occurs while
		 * the event is processed it is caught and logged to the console as an error.
		 *
		 * @param {Element} element An element
		 *
		 * @return {Object}
		 *
		 * @throw Error in attempt to build a widget from an element without {@link IS_ATTRIBUTE}, or
		 * when the factory fails to build the widget.
		 */
		function build(element)
		{
			var type = element.getAttribute(IS_ATTRIBUTE)
			, widget = null

			if (!type)
			{
				invalidate(element)

				throw new Error("The `" + IS_ATTRIBUTE + "` attribute is not defined or empty.")
			}

			try {
				widget = factory(type)(element, resolveOptions(element))
			} catch (e) {
				console.error(e)
			}

			if (!widget)
			{
				invalidate(element)

				throw new Error("The widget factory `" + type + "` failed to build the widget.")
			}

			element.setAttribute(BUILT_ATTRIBUTE, "")

			try
			{
				Brickrouge.notify('widget', [ widget ])
			}
			catch (e)
			{
				console.error(e)
			}

			return widget
		}

		/**
		 * Return the widget associated with an element.
		 *
		 * @param {Element} element
		 *
		 * @return {Object}
		 */
		function from(element)
		{
			var uniqueNumber = Brickrouge.uidOf(element)

			if (uniqueNumber in widgets)
			{
				return widgets[uniqueNumber]
			}

			return widgets[uniqueNumber] = build(element)
		}

		/**
		 * Parse a DOM fragment for widgets to build.
		 *
		 * @param {Element} fragment
		 */
		function parse(fragment)
		{
			var elements, i = 0, j, widgets = []

			fragment = fragment || document.body

			if (parsed.indexOf(fragment) !== -1) {
				return
			}

			parsed.push(fragment)

			if (isWidget(fragment) && !isBuilt(fragment))
			{
				try {
					widgets.push(from(fragment))
				} catch (e) {
					console.error(e)
				}
			}

			elements = fragment.querySelectorAll('[' + IS_ATTRIBUTE + ']:not([' + BUILT_ATTRIBUTE + '])')

			for (j = elements.length ; i < j ; i++)
			{
				try {
					widgets.push(from(elements[i]))
				} catch (e) {
					console.error(e)
				}
			}

			parsed.splice(parsed.indexOf(fragment), 1)

			Brickrouge.notify('update', [ fragment, elements, widgets ])
		}

		/**
		 * Monitor DOM mutations to build new widgets.
		 */
		function monitor()
		{
			var observer = MutationObserver || WebkitMutationObserver

			function monitorByObserver(observer)
			{
				new observer(function(mutations) {

					var elements = []

					mutations.forEach(function(mutation) {

						Array.prototype.forEach.call(mutation.addedNodes, function(node) {

							if (!(node instanceof Element) || elements.indexOf(node) !== -1) {
								return
							}

							elements.push(node)

						})

					})

					if (!elements.length) return

					elements.forEach(parse)

				}).observe(document.body, { childList: true, subtree: true })
			}

			function monitorByPolling()
			{
				var previousState = document.body.innerHTML

				setInterval(function () {

					if (previousState == document.body.innerHTML) {
						return
					}

					previousState = document.body.innerHTML

					parse(document.body)

				}, 1000)
			}

			observer ? monitorByObserver(observer) : monitorByPolling()
		}

		/**
		 * Registers a widget factory.
		 *
		 * @param {string} type Widget type.
		 * @param {function} factory Factory callback.
		 */
		function register(type, factory)
		{
			factories[type] = factory
		}

		Brickrouge.isWidget = isWidget
		Brickrouge.isBuilt = isBuilt
		Brickrouge.register = register
		Brickrouge.registered = factory
		Brickrouge.from = from
		Brickrouge.run = function () {

			monitor()
			parse(document.body)

			Brickrouge.notify('running')

		}

		return Brickrouge.Widget = {

			IS_ATTRIBUTE: IS_ATTRIBUTE,
			BUILT_ATTRIBUTE: BUILT_ATTRIBUTE,
			OPTIONS_ATTRIBUTE: OPTIONS_ATTRIBUTE,
			SELECTOR: WIDGET_SELECTOR,

			from: from,
			register: register,
			registered: factory

		}

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [

		__webpack_require__(1),
		__webpack_require__(4)

	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Brickrouge, widget) {

		/**
		 * Clone a custom element, taking care of removing sensitive attributes.
		 *
		 * @param {Element} element
		 *
		 * @returns {Element}
		 */
		Brickrouge.clone = function(element) {

			const BUILT_ATTRIBUTE = widget.BUILT_ATTRIBUTE

			var clone = element.cloneNode(true)

			clone.removeAttribute(BUILT_ATTRIBUTE)
			Array.prototype.forEach.call(clone.querySelectorAll('[' + BUILT_ATTRIBUTE + ']'), function(element) {
				element.removeAttribute(BUILT_ATTRIBUTE)
			})

			return clone
		}

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ }
/******/ ]);