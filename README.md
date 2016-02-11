# Brickrouge.js

**Brickrouge.js** creates encapsulated and interoperable custom elements—or widgets—from HTML
*elements. Because the HTML is already there, widgets come to life seamlessly for the user, without
*bump or refresh.

The special attribute `brickrouge-is` is used to recognize Brickrouge widgets from classic HTML
elements, it defines the name of the widget factory.

**Brickrouge.js** is framework agnostic.





## Usage

The following example demonstrates how to create a widget that creates a clone of itself when its
button is pressed.

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
	Brickrouge.register('copy', function(element, options) {
		return new Copy(element, options)
	})

} (Brickrouge)
```





## Running Brickrouge

`Brickrouge.run()` is used to run Brickrouge. The method instantiates the widgets found in
`document.body`, then waits for DOM mutations to instantiate new widgets. The best place to invoke
the method is a _DOM ready_ callback:

```js
document.addEventListener('DOMContentLoaded', Brickrouge.run)
```

Brickrouge uses the [MutationObserver][] interface—or DOM polling if it's not available—to
automatically instantiate new widgets, so you don't have to care about that, still if you care you
may call the `parse()` method yourself:

```js
Brickrouge.parse()
// or
Brickrouge.parse(document.body)

// parse a specific container
Brickrouge.parse(document.getElementById('my-container'))
```





## Events

### A widget has been built

The `widget` event is fired after a widget has been built.

```js
Brickrouge.attachObserver('widget', function(widget) {

    console.log('A widget has been built:', widget)

})
```





### Multiple widgets have been built

The `widgets` event is fired after multiple widgets have been built, after parsing a document
fragment.

```js
Brickrouge.attachObserver('widgets', function(widgets, fragment) {

    console.log('Widgets have been built:', widgets)

})
```





## Helpers

- `Brickrouge.isWidget()`: whether the element is a widget.

- `Brickrouge.isBuilt()`: whether the widget for this element is built.

- `Brickrouge.uidOf()`: returns the unique identifier associated with an element. If the
`uniqueNumber` property is available it will return it, otherwise it creates a unique identifier of
its own.

- `Brickrouge.Dataset.from()`: returns the dataset values associated with and element.

- `Brickrouge.from()` or `Brickrouge.Widget.from()`: returns the widget associated with an element
and creates it if needed.





----------

## License

**brickrouge.js** is licensed under the New BSD License - See the [LICENSE](LICENSE) file for details.





[MutationObserver]: https://developer.mozilla.org/en/docs/Web/API/MutationObserver
