define([

	'./core',
	'./subject'

], function(Brickrouge, Subject) {

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
	 * @event Brickrouge#running
	 * @type {object}
	 */
	let RunningEvent = Subject.createEvent('running', function () {

	})

	/**
	 * @param {object} widget
	 *
	 * @event Brickrouge#widget
	 * @type {object}
	 * @property {object} widget - The widget that was built.
	 */
	let WidgetEvent = Subject.createEvent('widget', function (widget) {

		this.widget = widget

	})

	/**
	 * @param {Element} fragment
	 * @param {Array<Element>} elements
	 * @param {Array<object>} widgets
	 *
	 * @event Brickrouge#update
	 * @type {object}
	 * @property {Element} fragment - The fragment that triggered the update.
	 * @property {Array<Element>} elements - The new widget elements.
	 * @property {Array<object>} widgets - The widgets that were built.
	 */
	let UpdateEvent = Subject.createEvent('update', function (fragment, elements, widgets) {

		this.fragment = fragment
		this.elements = elements
		this.widgets = widgets

	})

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
	 *
	 * @fires Brickrouge#widget
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
			Brickrouge.notify(new WidgetEvent(widget))
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
	 * @fires Brickrouge#update
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

		Brickrouge.notify(new UpdateEvent(fragment, elements, widgets))
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

	/**
	 * @fires Brickrouge#running
	 */
	function run() {

		monitor()
		parse(document.body)

		Brickrouge.notify(new RunningEvent)

	}

	Object.defineProperties(Brickrouge, {

		EVENT_UPDATE:  { value: UpdateEvent },
		EVENT_RUNNING: { value: RunningEvent },
		EVENT_WIDGET:  { value: WidgetEvent },

		isWidget:      { value: isWidget },
		isBuilt:       { value: isBuilt },
		register:      { value: register },
		registered:    { value: factory },
		from:          { value: from },
		run:           { value: run }

	})

	let Widget = {

	}

	Object.defineProperties(Widget, {

		IS_ATTRIBUTE:      { value: IS_ATTRIBUTE },
		BUILT_ATTRIBUTE:   { value: BUILT_ATTRIBUTE },
		OPTIONS_ATTRIBUTE: { value: OPTIONS_ATTRIBUTE },
		SELECTOR:          { value: WIDGET_SELECTOR },

		isWidget:      { value: isWidget },
		isBuilt:       { value: isBuilt },
		register:      { value: register },
		registered:    { value: factory },
		from:          { value: from }

	})

	return Brickrouge.Widget = Widget

})
