/*!
 * Brickrouge dev-master (http://brickrouge.org)
 * Copyright 2016 Olivier Laviale <olivier.laviale@gmail.com>.
 * Licensed under the New BSD License
 */

var Brickrouge = {}

!function (Brickrouge)
{
	"use strict";

	Brickrouge.run = function() {

		try
		{
			Brickrouge.Widget.parse(document.body)
		}
		catch (e)
		{
			console.error(e)
		}

		Brickrouge.Widget.monitor()
	}

} (Brickrouge);
!function(Brickrouge) {

	"use strict";

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
		from: function(element) {

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

} (Brickrouge);
!function(Brickrouge) {

	"use strict";

	const OBSERVER_PROPERTY = '$brickrouge:observers'

	/**
	 * @interface
	 */
	function Subject() {}

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
		getObservers: function(type) {

			var observers

			if (!(OBSERVER_PROPERTY in this))
			{
				this[OBSERVER_PROPERTY] = []
			}

			observers = this[OBSERVER_PROPERTY]

			if (!type)
			{
				return observers
			}

			if (!(type in observers))
			{
				observers[type] = []
			}

			return observers[type]
		},

		/**
		 * Attach an observer.
		 *
		 * @param {string} type Event type.
		 * @param {function} callback
		 */
		attachObserver: function(type, callback) {

			var observers = this.getObservers(type)

			if (observers.indexOf(callback) !== -1)
			{
				throw new Error("Observer already attached for type `" + type + '`')
			}

			observers.push(callback)
		},

		/**
		 * Detach an observer.
		 *
		 * @param {function} callback
		 */
		detachObserver: function(callback) {

			var observers = this.getObservers(null), type, typeObservers, k

			for (type in Object.keys(observers))
			{
				typeObservers = observers[type]
				k = typeObservers.indexOf(callback)

				if (k === -1) continue

				typeObservers.splice(k, 1)
			}
		},

		/**
		 * Notify observers of a change.
		 *
		 * @param {string} type
		 * @param {Array} payload
		 */
		notifyObservers: function(type, payload) {

			var observers = this.getObservers(type), i, y

			if (!observers.length)
			{
				return
			}

			for (i = 0, y = observers.length ; i < y ; i++)
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
		}
	}

	/**
	 * @interface
	 */
	Brickrouge.Subject = Subject

	Brickrouge.attachObserver = Subject.prototype.attachObserver
	Brickrouge.detachObserver = Subject.prototype.detachObserver
	Brickrouge.notifyObservers = Subject.prototype.notifyObservers
	Brickrouge.getObservers = Subject.prototype.getObservers

} (Brickrouge);
!function(Brickrouge) {

	"use strict";

	const IS_ATTRIBUTE = 'brickrouge-is'
	const OPTIONS_ATTRIBUTE = 'brickrouge-options'
	const WIDGET_SELECTOR = '[' + IS_ATTRIBUTE + ']'

	var factories = []
	var widgets = []
	var observer = null

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
	 * when the factory fails to instantiate the widget.
	 */
	function build(element)
	{
		var type = element.getAttribute(IS_ATTRIBUTE)
		, widget

		if (!type)
		{
			throw new Error("The `" + IS_ATTRIBUTE + "` attribute is not defined or empty.")
		}

		widget = factory(type)(element, resolveOptions(element))

		if (!widget)
		{
			throw new Error("The widget factory `" + type + "` failed to instantiate widget.")
		}

		try
		{
			Brickrouge.notifyObservers('widget', [ widget ])
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
	 *
	 * @return {Array} An array of the widgets built in this fragment, which might also include
	 * previously built widgets.
	 */
	function parse(fragment)
	{
		var elements, i = 0, j, widgets = []

		fragment = fragment || document.body

		if (isWidget(fragment))
		{
			widgets.push(from(fragment))
		}

		elements = fragment.querySelectorAll('[' + IS_ATTRIBUTE + ']')

		for (j = elements.length ; i < j ; i++)
		{
			widgets.push(from(elements[i]))
		}

		Brickrouge.notifyObservers('parse', [ fragment, widgets ])

		return widgets
	}

	/**
	 * Monitor DOM mutations to instantiate new widgets.
	 */
	function monitor()
	{
		if (observer) return

		observer = new MutationObserver(function(mutations) {

			mutations.forEach(function(mutation) {

				var i, j, node, nodes = mutation.addedNodes

				for (i = 0, j = nodes.length ; i < j ; i++)
				{
					node = nodes[i]

					if (!isWidget(node)) continue

					from(node)
				}

			})

		})

		observer.observe(document.body, { childList: true })
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
	Brickrouge.register = register
	Brickrouge.registered = factory
	Brickrouge.parse = parse
	Brickrouge.from = from

	Brickrouge.Widget = {

		IS_ATTRIBUTE: IS_ATTRIBUTE,
		OPTIONS_ATTRIBUTE: OPTIONS_ATTRIBUTE,
		SELECTOR: WIDGET_SELECTOR,

		from: from,
		parse: parse,
		register: register,
		registered: factory,
		monitor: monitor

	}

} (Brickrouge);
