# Brickrouge.js

**Brickrouge.js** creates encapsulated and interoperable custom elements—or widgets—from HTML
elements. Because the HTML is already there, widgets come to life seamlessly for the user, without
bump or refresh.

The special attribute `brickrouge-is` is used to recognize Brickrouge widgets from classic HTML
elements, it defines the name of the widget factory.

**Brickrouge.js** is framework agnostic.





## Usage

The following example demonstrates how to create a widget that creates a copy of itself when its
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





## Running Brickrouge.js

`Brickrouge.run()` is used to run **Brickrouge.js**. The DOM is observed for mutations and widgets
found in `document.body` are built.

The best practice to use this method is as a _DOM ready_ callback:

```js
document.addEventListener('DOMContentLoaded', Brickrouge.run)
```

> The [MutationObserver][] interface—or DOM polling if it's not available—is used to
automatically build new widgets.





## Events

### A widget has been built

The `widget` event is fired after a widget has been built.

```js
Brickrouge.observe('widget', function(widget) {

    console.log('A widget has been built:', widget)

})
```





### The DOM was updated

The `update` event is fired after the DOM was updated.

```js
Brickrouge.observe('update', function(fragment, elements, widgets) {

    console.log('This fragment updated the DOM:', fragment)
    console.log('These elements are new widgets:', elements)
    console.log('These widgets have been built:', widgets)

})
```

> **Note:** The event is fired a first time after **Brickrouge.js** is ran.





### Brickrouge.js is running

The `running` event is fired after **Brickrouge.js** is ran.

```js
Brickrouge.observe('running', function() {

	console.log('Brickrouge.js is running, we can do stuff')

})
```






## Helpers

- `Brickrouge.isWidget()`: Whether the element is a widget.

- `Brickrouge.isBuilt()`: Whether the widget for this element is built.

- `Brickrouge.uidOf()`: Returns the unique identifier associated with an element. If the
`uniqueNumber` property is available it will return it, otherwise it creates a unique identifier of
its own.

- `Brickrouge.clone()`: Clone a custom element, taking care of removing sensitive attributes.

- `Brickrouge.Dataset.from()`: Returns the dataset values associated with an element.

- `Brickrouge.Widget.from()` or `Brickrouge.from()`: Returns the widget associated with an element
and creates it if needed.





----------





## Build

To build **Brickrouge.js** you first need to [install webpack](http://webpack.github.io/docs/installation.html), then just use the command `make`. The files `dist/brickrouge.js` and `dist/brickrouge-uncompressed.js` should be built.

```bash
$ git clone git@github.com:Brickrouge/Brickrouge.js.git
$ cd Brickrouge.js
$ make
```





## License

**brickrouge.js** is licensed under the New BSD License - See the [LICENSE](LICENSE) file for details.





[MutationObserver]: https://developer.mozilla.org/en/docs/Web/API/MutationObserver
