import { uidOf } from './utils'
import Dataset from './Dataset'
import { RunningEvent, WidgetEvent, UpdateEvent } from './events'
import Brickrouge from './stub'

export const IS_ATTRIBUTE = 'brickrouge-is'
export const BUILT_ATTRIBUTE = 'brickrouge-built'
export const OPTIONS_ATTRIBUTE = 'brickrouge-options'
export const WIDGET_SELECTOR = '[' + IS_ATTRIBUTE + ']'
const INVALID_IS_ATTRIBUTE = 'brickrouge-invalid-is'
const WIDGET_NOT_BUILT_SELECTOR = '[' + IS_ATTRIBUTE + ']:not([' + BUILT_ATTRIBUTE + '])'

const factories = []
const widgets = []
const parsed = []

/**
 * Return the factory of a widget type.
 *
 * @param {string} type Widget type.
 *
 * @return {function} Widget factory.
 *
 * @throws Error in attempt to use a type for which no factory is defined.
 */
export function factory(type)
{
	if (!(type in factories))
	{
		throw new Error(`There is no widget factory for type "${type}"`)
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
export function isWidget(node)
{
	return typeof node === 'object' && 'getAttribute' in node && !!node.getAttribute(IS_ATTRIBUTE)
}

/**
 * Whether a widget is built for the element.
 *
 * @param {Element} element
 *
 * @returns {boolean}
 */
export function isBuilt(element)
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

		throw new Error(`The "${IS_ATTRIBUTE}" attribute is not defined or empty.`)
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

		throw new Error(`The widget factory "${type}" failed to build the widget.`)
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
export function createOrReuse(element)
{
	const uniqueNumber = uidOf(element)

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
	const widgets = []

	fragment = fragment || document.body

	if (parsed.indexOf(fragment) !== -1) {
		return
	}

	parsed.push(fragment)

	if (isWidget(fragment) && !isBuilt(fragment))
	{
		try
		{
			widgets.push(createOrReuse(fragment))
		}
		catch (e)
		{
			console.error(e)
		}
	}

	let elements = fragment.querySelectorAll(WIDGET_NOT_BUILT_SELECTOR)

	for (let element of elements)
	{
		try
		{
			widgets.push(createOrReuse(element))
		}
		catch (e)
		{
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
	const observer = MutationObserver || WebkitMutationObserver

	function monitorByObserver(observer)
	{
		new observer(mutations => {

			const elements = []

			mutations.forEach(mutation => {

				Array.prototype.forEach.call(mutation.addedNodes, node => {

					if (!(node instanceof Element) || elements.indexOf(node) !== -1)
					{
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
		let previousState = document.body.innerHTML

		setInterval(() => {

			if (previousState === document.body.innerHTML) {
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
export function register(type, factory)
{
	factories[type] = factory
}

/**
 * @fires Brickrouge#running
 */
export function run() {

	monitor()
	parse(document.body)

	Brickrouge.notify(new RunningEvent)

}

export default {

	IS_ATTRIBUTE: IS_ATTRIBUTE,
	BUILT_ATTRIBUTE: BUILT_ATTRIBUTE,
	OPTIONS_ATTRIBUTE: OPTIONS_ATTRIBUTE,
	SELECTOR: WIDGET_SELECTOR,

	isWidget: isWidget,
	isBuilt: isBuilt,
	register: register,
	registered: factory,
	from: createOrReuse,
	run: run

}
