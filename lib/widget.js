!function(Brickrouge) {

	"use strict";

	var /** @const **/ IS_ATTRIBUTE = 'brickrouge-is'
	, /** @const **/ OPTIONS_ATTRIBUTE = 'brickrouge-options'
	, /** @const **/ WIDGET_SELECTOR = '[' + IS_ATTRIBUTE + ']'
	, factories = []
	, widgets = []
	, observer = null

	/**
	 * Returns the factory of a widget type.
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
			throw new Error("There is no widget factory for type " + type)
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
	 * Resolves the options for the widget.
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
	 * Builds the widget associated with an element.
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
			throw new Error("The " + IS_ATTRIBUTE + " attribute is not defined or empty.")
		}

		widget = factory(type)(element, resolveOptions(element))

		if (!widget)
		{
			throw new Error("The widget factory " + type + " failed to instantiate widget.")
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
	 * Returns the widget associated with an element.
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
	 * Parses a DOM fragment for widgets to build.
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
	 * Monitors DOM mutations to instantiate new widgets.
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
	Brickrouge.parse = parse
	Brickrouge.from = from

	Brickrouge.Widget = {

		IS_ATTRIBUTE: IS_ATTRIBUTE,
		OPTIONS_ATTRIBUTE: OPTIONS_ATTRIBUTE,
		SELECTOR: WIDGET_SELECTOR,

		from: from,
		parse: parse,
		register: register,
		monitor: monitor

	}

} (Brickrouge);
