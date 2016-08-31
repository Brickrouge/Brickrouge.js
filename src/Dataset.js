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

export default {

	from: from

}
