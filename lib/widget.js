!function(Brickrouge) {

	"use strict";

	const IS_ATTRIBUTE = 'brickrouge-is'
	const BUILT_ATTRIBUTE = 'brickrouge-built'
	const OPTIONS_ATTRIBUTE = 'brickrouge-options'
	const WIDGET_SELECTOR = '[' + IS_ATTRIBUTE + ']'

	var factories = []
	var widgets = []
	var parsed = []
	var monitoring = null

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
				console.log(e)
			}
		}

		elements = fragment.querySelectorAll('[' + IS_ATTRIBUTE + ']:not([' + BUILT_ATTRIBUTE + '])')

		for (j = elements.length ; i < j ; i++)
		{
			try {
				widgets.push(from(elements[i]))
			} catch (e) {
				console.log(e)
			}
		}

		parsed.splice(parsed.indexOf(fragment), 1)

		Brickrouge.notify('widgets', [ widgets, fragment ])
	}

	/**
	 * Monitor DOM mutations to instantiate new widgets.
	 */
	function monitor()
	{
		var constructor = MutationObserver || WebkitMutationObserver

		if (monitoring) return

		constructor ? monitorByObserver(constructor) : monitorByPolling()
	}

	function monitorByObserver(constructor)
	{
		var observer = new constructor(function(mutations) {

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

	function monitorByPolling()
	{
		setInterval(function () {

			parse(document.body)

		}, 1000)
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
