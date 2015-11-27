# Brickrouge.js

**Brickrouge.js** creates encapsulated and interoperable custom elements—or widgets—from HTML elements. Because the HTML is already there, widgets come to life seamlessly for your user, without bump or refresh.

The special attribute `brickrouge-is` is used to recognize Brickrouge widgets from classic HTML elements, it defines the name of the widget factory.

**Brickrouge.js** is framework agnostic.

## Usage

The following example demonstrates how to create a widget that creates a clone of itself when its button is pressed.

```html
<div brickrouge-is="copy"><button>copy</button></div>
```

```js
!function(Brickrouge) {

	// Defining a private constructor
	function Copy(element, options)
	{
		element
		.querySelector('button')
		.addEventListener('click', function() {
			var copy = element.cloneNode(true)
			, parent = element.parentNode
			
			parent.insertBefore(copy, element)
			parent.insertBefore(element, copy)
		}, false)
	}

	// Registering factory for 'copy' widgets
	Brickrouge.register("copy", function(element, options) {
		return new Copy(element, options)
	})

} (Brickrouge)
```

## Running Brickrouge

`Brickrouge.run()` is used to run Brickrouge. The method instantiates the widgets found in `document.body`, then waits for DOM mutations to instantiate new widgets. The best place to invoke the method is a _DOM ready_ callback:

```js
document.addEventListener('DOMContentLoaded', Brickrouge.run)
```

If the browser doesn't provide the [MutationObserver][] interface, or if you want to parse a container yourself you can use the `parse()` method:

```js
Brickrouge.parse()
// or
Brickrouge.parse(document.body)

// parse a specific container
Brickrouge.parse(document.getElementById('my-container'))
```



## Helpers

- `Brickrouge.isWidget()`: whether the element is a widget.

- `Brickrouge.uidOf()`: returns the unique identifier associated with an element. If the `uniqueNumber` property is available it will return it, otherwise it creates a unique identifier of its own.

- `Brickrouge.Dataset.from()`: returns the dataset values associated with and element.

- `Brickrouge.from()` or `Brickrouge.Widget.from()`: returns the widget associated with an element and creates it if needed.





[MutationObserver]: https://developer.mozilla.org/en/docs/Web/API/MutationObserver