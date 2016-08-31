const UNIQUE_NUMBER_PROPERTY = 'uniqueNumber'

let uniqueNumberIndex = 0

/**
 * Return the unique identifier a node.
 *
 * @param {Node} node
 *
 * @return {number}
 */
export function uidOf(node) {

	return node[UNIQUE_NUMBER_PROPERTY] || (node[UNIQUE_NUMBER_PROPERTY] = ++uniqueNumberIndex)

}

/**
 * Efficiently empty an element.
 *
 * @param {Element} element
 */
export function empty(element) {

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
export function mixin(Base /*, ...mixins*/)
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
