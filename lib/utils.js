define([

	'./core'

], function(Brickrouge) {

	const UNIQUE_NUMBER_PROPERTY = 'uniqueNumber'

	let uniqueNumberIndex = 0

	/**
	 * Return the unique identifier a node.
	 *
	 * @param {Node} node
	 *
	 * @return {number}
	 */
	Brickrouge.uidOf = function (node) {

		return node[UNIQUE_NUMBER_PROPERTY] || (node[UNIQUE_NUMBER_PROPERTY] = ++uniqueNumberIndex)

	}

	/**
	 * Efficiently empty an element.
	 *
	 * @param {Element} element
	 */
	Brickrouge.empty = function (element) {

		while (element.firstChild)
		{
			element.removeChild(element.firstChild)
		}

	}

	/**
	 * Camel case dashed-name.
	 *
	 * @param {string} string
	 *
	 * @return {string}
	 */
	Brickrouge.camelCase = function (string) {

		return String(string).replace(/-\D/g, match => {

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
		from: function (element) {

			const dataset = {}
			const attributes = element.attributes

			for (let attr of attributes)
			{
				if (!attr.name.match(/^data-/)) continue

				dataset[Brickrouge.camelCase(attr.name.substring(5))] = attr.value
			}

			return dataset

		}
	}

})
