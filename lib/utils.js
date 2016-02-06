!function(Brickrouge) {

	"use strict";

	const UNIQUE_NUMBER_PROPERTY = 'uniqueNumber'

	var uniqueNumberIndex = 0

	/**
	 * Return the unique identifier a node.
	 *
	 * @param {Node} node
	 *
	 * @return {number}
	 */
	Brickrouge.uidOf = function(node) {

		return node[UNIQUE_NUMBER_PROPERTY] || (node[UNIQUE_NUMBER_PROPERTY] = ++uniqueNumberIndex)

	}

	/**
	 * Camel case dashed-name.
	 *
	 * @param {string} string
	 *
	 * @return {string}
	 */
	Brickrouge.camelCase = function(string) {

		return String(string).replace(/-\D/g, function(match) {
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
		from: function(element) {

			var dataset = {}
			, attributes = element.attributes
			, i = 0
			, y = attributes.length
			, attr

			for (; i < y; i++)
			{
				attr = attributes[i]

				if (!attr.name.match(/^data-/)) continue;

				dataset[Brickrouge.camelCase(attr.name.substring(5))] = attr.value
			}

			return dataset

		}

	}

} (Brickrouge);
