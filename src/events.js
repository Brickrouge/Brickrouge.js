import Subject from './Subject'

/**
 * @event Brickrouge#running
 * @type {Function}
 */
export const RunningEvent = Subject.createEvent(function () {

})

/**
 * @param {object} widget
 *
 * @event Brickrouge#widget
 * @type {Function}
 * @property {object} widget - The widget that was built.
 */
export const WidgetEvent = Subject.createEvent(function (widget) {

	this.widget = widget

})

/**
 * @param {Element} fragment
 * @param {Array<Element>} elements
 * @param {Array<object>} widgets
 *
 * @event Brickrouge#update
 * @type {Function}
 * @property {Element} fragment - The fragment that triggered the update.
 * @property {Array<Element>} elements - The new widget elements.
 * @property {Array<object>} widgets - The widgets that were built.
 */
export const UpdateEvent = Subject.createEvent(function (fragment, elements, widgets) {

	this.fragment = fragment
	this.elements = elements
	this.widgets = widgets

})
