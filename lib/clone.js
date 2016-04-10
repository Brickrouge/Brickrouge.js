define([

	'./core',
	'./widget'

], function(Brickrouge, widget) {

	/**
	 * Clone a custom element, taking care of removing sensitive attributes.
	 *
	 * @param {Element} element
	 *
	 * @returns {Element}
	 */
	Brickrouge.clone = function (element) {

		const BUILT_ATTRIBUTE = widget.BUILT_ATTRIBUTE
		const clone = element.cloneNode(true)

		clone.removeAttribute(BUILT_ATTRIBUTE)
		Array.prototype.forEach.call(clone.querySelectorAll('[' + BUILT_ATTRIBUTE + ']'), element => {

			element.removeAttribute(BUILT_ATTRIBUTE)

		})

		return clone
	}

})
