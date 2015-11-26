!function(Brickrouge) {

	"use strict";

	var uniqueNumberIndex = 0

	/**
	 * Returns the unique identifier a node.
	 *
	 * @param {Node} node
	 *
	 * @return {number}
	 */
	Brickrouge.uidOf = function(node) {

		return node.uniqueNumber || (node.uniqueNumber = ++uniqueNumberIndex)

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
		 * Returns the dataset values.
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

			for (; i < y; i++) {
				attr = attributes[i]

				if (!attr.name.match(/^data-/)) continue;

				dataset[Brickrouge.camelCase(attr.name.substring(5))] = attr.value
			}

			return dataset

		}

	}

} (Brickrouge);
