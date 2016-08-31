import { BUILT_ATTRIBUTE } from './widget'

/**
 * Clone a custom element, taking care of removing sensitive attributes.
 *
 * @param {Element} element
 *
 * @returns {Element}
 */
export function clone(element) {

	const clone = element.cloneNode(true)

	clone.removeAttribute(BUILT_ATTRIBUTE)
	Array.prototype.forEach.call(clone.querySelectorAll('[' + BUILT_ATTRIBUTE + ']'), element => {

		element.removeAttribute(BUILT_ATTRIBUTE)

	})

	return clone
}
