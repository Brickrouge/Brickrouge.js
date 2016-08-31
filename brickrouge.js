const UNIQUE_NUMBER_PROPERTY = 'uniqueNumber'

let uniqueNumberIndex = 0

/**
 * Return the unique identifier a node.
 *
 * @param {Node} node
 *
 * @return {number}
 */
function uidOf(node) {

	return node[UNIQUE_NUMBER_PROPERTY] || (node[UNIQUE_NUMBER_PROPERTY] = ++uniqueNumberIndex)

}

/**
 * Efficiently empty an element.
 *
 * @param {Element} element
 */
function empty(element) {

	while (element.firstChild)
	{
		element.removeChild(element.firstChild)
	}

}

/**
 * @param {Function} Base The parent class to extend.
 * @param ...mixins The classes to mix in.
 *
 * @returns {{}}
 */
function mixin(Base /*, ...mixins*/)
{
	const properties = {}
	const mixins = Array.prototype.slice.call(arguments, 1) // until nodejs gets rest parameters

	for (let mixin of mixins) {
		let prototype = mixin.prototype
		for (let property of Object.getOwnPropertyNames(prototype)) {
			properties[property] = { value: prototype[property] }
		}
	}

	delete properties.constructor

	const mixed = class extends Base {}

	Object.defineProperties(mixed.prototype, properties)

	return mixed
}

/**
 * Camel case dashed-name.
 *
 * @param {string} string
 *
 * @return {string}
 */
function camelCase(string) {

	return String(string).replace(/-\D/g, match => {

		return match.charAt(1).toUpperCase()

	})

}

/**
 * Return the dataset values.
 *
 * @param {Element} element
 *
 * @return {Object}
 */
function from(element) {

	const dataset = {}
	const attributes = element.attributes

	for (let attr of attributes)
	{
		if (!attr.name.match(/^data-/)) continue

		dataset[camelCase(attr.name.substring(5))] = attr.value
	}

	return dataset

}

var Dataset = {

	from: from

}

const OBSERVERS_PROPERTY = Symbol("Subject observers")
const NAME_PROPERTY = Symbol("Subject event name")

/**
 * Asserts that an event name is valid.
 *
 * @param name
 *
 * @throws Error if `name` is not a string.
 */
function assertNameIsValid(name)
{
	if ('symbol' !== typeof name)
	{
		throw new Error("Event name is not a symbol")
	}
}

/**
 * Retrieve event name from an event constructor.
 *
 * @param {function} constructor
 *
 * @returns {string}
 *
 * @throws Error if `constructor` is not an event constructor.
 */
function retrieveNameFromConstructor(constructor)
{
	if ('function' !== typeof constructor  || !(NAME_PROPERTY in constructor))
	{
		throw new Error(`Expecting an event instance, got: ${constructor}`)
	}

	const name = constructor[NAME_PROPERTY]

	assertNameIsValid(name)

	return name
}

/**
 * Retrieve event name from ab event instance.
 *
 * @param {object} event
 *
 * @returns {string}
 *
 * @throws Error if `event` is not an event instance.
 */
function retrieveNameFromInstance(event)
{
	if ('object' !== typeof event || !(NAME_PROPERTY in event.__proto__.constructor))
	{
		throw new Error("Expected an Event instance")
	}

	const name = event.__proto__.constructor[NAME_PROPERTY]

	assertNameIsValid(name)

	return name
}

/**
 * Return the observers array.
 *
 * @protected
 *
 * @param {Subject} subject
 * @param {string|null} name Event name, or `null` to get all observers.
 *
 * @return {Array}
 */
function getObservers(subject, name) {

	if (!(OBSERVERS_PROPERTY in subject))
	{
		subject[OBSERVERS_PROPERTY] = []
	}

	const observers = subject[OBSERVERS_PROPERTY]

	if (!name)
	{
		return observers
	}

	if (!(name in observers))
	{
		observers[name] = []
	}

	return observers[name]
}

var Subject = class
{
	/**
	 * Creates an event constructor given a name and a constructor.
	 *
	 * @param {function} constructor
	 *
	 * @returns {function}
	 */
	static createEvent(constructor)
	{
		constructor[NAME_PROPERTY] = Symbol("Event symbol")

		return constructor
	}

	/**
	 * Attach an observer.
	 *
	 * @param {function} constructor Event constructor.
	 * @param {function} callback
	 *
	 * @return {Subject}
	 */
	observe(constructor, callback)
	{
		const symbol = retrieveNameFromConstructor(constructor)
		const observers = getObservers(this, symbol)

		if (observers.indexOf(callback) !== -1)
		{
			throw new Error("Observer already attached", constructor)
		}

		observers.push(callback)

		return this
	}

	/**
	 * Detach an observer.
	 *
	 * @param {function} callback
	 *
	 * @return {Subject}
	 */
	unobserve(callback)
	{
		const observers = getObservers(this, null)

		for (let type of Object.getOwnPropertySymbols(observers))
		{
			let typeObservers = observers[type]
			let k = typeObservers.indexOf(callback)

			if (k === -1)
			{
				continue
			}

			typeObservers.splice(k, 1)
		}

		return this
	}

	/**
	 * Notify observers of a change.
	 *
	 * @param {object} event
	 *
	 * @return {Subject}
	 */
	notify(event)
	{
		const name = retrieveNameFromInstance(event)
		const observers = getObservers(this, name)

		for (let observer of observers)
		{
			try
			{
				observer.call(null, event)
			}
			catch (e)
			{
				console.error(e)
			}
		}

		return this
	}
}

var Brickrouge = {

	notify:    Subject.prototype.notify,
	observe:   Subject.prototype.observe,
	unobserve: Subject.prototype.unobserve

}

const IS_ATTRIBUTE = 'brickrouge-is'
const BUILT_ATTRIBUTE = 'brickrouge-built'
const OPTIONS_ATTRIBUTE = 'brickrouge-options'
const WIDGET_SELECTOR = '[' + IS_ATTRIBUTE + ']'
const INVALID_IS_ATTRIBUTE = 'brickrouge-invalid-is'
const WIDGET_NOT_BUILT_SELECTOR = '[' + IS_ATTRIBUTE + ']:not([' + BUILT_ATTRIBUTE + '])'

const factories = []
const widgets = []
/**
 * @event Brickrouge#running
 * @type {object}
 */
const RunningEvent = Subject.createEvent(function () {

})

/**
 * @param {object} widget
 *
 * @event Brickrouge#widget
 * @type {object}
 * @property {object} widget - The widget that was built.
 */
const WidgetEvent = Subject.createEvent(function (widget) {

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
const UpdateEvent = Subject.createEvent(function (fragment, elements, widgets) {

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
		throw new Error(`There is no widget factory for type \`${type}\``)
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
	const uniqueNumber = uidOf(element)

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

	return Dataset.from(element)
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
	const type = element.getAttribute(IS_ATTRIBUTE)
	let widget = null

	if (!type)
	{
		invalidate(element)

		throw new Error(`The \`${IS_ATTRIBUTE}\` attribute is not defined or empty.`)
	}

	try
	{
		widget = factory(type)(element, resolveOptions(element))
	}
	catch (e)
	{
		console.error(e)
	}

	if (!widget)
	{
		invalidate(element)

		throw new Error(`The widget factory \`${type}\` failed to build the widget.`)
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
function from$1(element)
{
	const uniqueNumber = uidOf(element)

	if (uniqueNumber in widgets)
	{
		return widgets[uniqueNumber]
	}

	return widgets[uniqueNumber] = build(element)
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

var Widget = {

	IS_ATTRIBUTE: IS_ATTRIBUTE,
	BUILT_ATTRIBUTE: BUILT_ATTRIBUTE,
	OPTIONS_ATTRIBUTE: OPTIONS_ATTRIBUTE,
	SELECTOR: WIDGET_SELECTOR,

	UpdateEvent: UpdateEvent,
	RunningEvent: RunningEvent,
	WidgetEvent: WidgetEvent,

	isWidget: isWidget,
	isBuilt: isBuilt,
	register: register,
	registered: factory,
	from: from$1

}

/*
Object.defineProperties(Brickrouge, {

	EVENT_UPDATE:  { value: UpdateEvent },
	EVENT_RUNNING: { value: RunningEvent },
	EVENT_WIDGET:  { value: WidgetEvent },

	isWidget:      { value: isWidget },
	isBuilt:       { value: isBuilt },
	register:      { value: register },
	registered:    { value: factory },
	from:          { value: from },
	run:           { value: run },

	observeUpdate: { value: function (callback) {

		this.observe(UpdateEvent, callback)

	}},

	observeRunning: { value: function (callback) {

		this.observe(RunningEvent, callback)

	}},

	observeWidget: { value: function (callback) {

		this.observe(WidgetEvent, callback)

	}}

})
*/
/*
return Object.defineProperties({}, {

	IS_ATTRIBUTE:      { value: IS_ATTRIBUTE },
	BUILT_ATTRIBUTE:   { value: BUILT_ATTRIBUTE },
	OPTIONS_ATTRIBUTE: { value: OPTIONS_ATTRIBUTE },
	SELECTOR:          { value: WIDGET_SELECTOR },

	isWidget:          { value: isWidget },
	isBuilt:           { value: isBuilt },
	register:          { value: register },
	registered:        { value: factory },
	from:              { value: from }

})
*/

var main = Object.defineProperties(Brickrouge, {

	uidOf:             { value: uidOf },
	empty:             { value: empty },
	mixin:             { value: mixin },
	Dataset:           { value: Dataset },
	Subject:           { value: Subject },

	IS_ATTRIBUTE:      { value: Widget.IS_ATTRIBUTE },
	BUILT_ATTRIBUTE:   { value: Widget.BUILT_ATTRIBUTE },
	OPTIONS_ATTRIBUTE: { value: Widget.OPTIONS_ATTRIBUTE },
	SELECTOR:          { value: Widget.SELECTOR },

	isWidget:          { value: Widget.isWidget },
	isBuilt:           { value: Widget.isBuilt },
	register:          { value: Widget.register },
	registered:        { value: Widget.registered },
	from:              { value: Widget.from },
	run:               { value: Widget.run },

	observeUpdate: { value: function (callback) {

		this.observe(Widget.UpdateEvent, callback)

	}},

	observeRunning: { value: function (callback) {

		this.observe(Widget.RunningEvent, callback)

	}},

	observeWidget: { value: function (callback) {

		this.observe(Widget.WidgetEvent, callback)

	}}

})

export default main;