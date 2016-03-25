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





## Running Brickrouge

`Brickrouge.run()` is used to run **Brickrouge**. The DOM is observed for mutations and widgets
found in `document.body` are built.

It is advised to use the method as a _DOM ready_ callback:

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

> **Note:** The event is fired a first time after **Brickrouge** is ran.





### Brickrouge is running

The `running` event is fired after **Brickrouge** is ran.

```js
Brickrouge.observe('running', function() {

	console.log('Brickrouge is running, we can do stuff')

})
```






## Helpers

- `Brickrouge.isWidget()`: Whether the element is a widget.

	```js
	var element = document.getElementById('my-element')
	
	if (Brickrouge.isWidget(element)
	{
		console.log('is an widget')
	}
	else
	{
		console.log('is not a widget')
	}
	```

- `Brickrouge.isBuilt()`: Whether the widget for this element is built.

	```js
	var element = document.getElementById('my-element')
	
	if (Brickrouge.isBuilt(element)
	{
		console.log('widget is built')
	}
	else
	{
		console.log('widget is not built, also might not be a widget')
	}
	```

- `Brickrouge.uidOf()`: Returns the unique identifier associated with an element. If the
`uniqueNumber` property is available it will return it, otherwise it creates a unique identifier of
its own.

	```js
	var element = document.getElementById('my-element')

	console.log('uid:, Brickrouge.uidOf(element))
	```

- `Brickrouge.empty()`: Removes the children of an element.

	```js
	var element = document.getElementById('my-element')
	
	Brickrouge.empty(element)
	```

- `Brickrouge.clone()`: Clone a custom element, taking care of removing sensitive attributes.

	```js
	var element = document.getElementById('my-element')
	var clone = Brickrouge.clone(element)
	```

- `Brickrouge.Dataset.from()`: Returns the dataset values associated with an element.

	```js
	var element = document.getElementById('my-element')
	var dataset = Brickrouge.Dataset.from(element)
	```

- `Brickrouge.Widget.from()` or `Brickrouge.from()`: Returns the widget associated with an element
and creates it if needed.

	```js
	var element = document.getElementById('my-element')
	
	try
	{
		var widget = Brickrouge.from(element) 
	}
	catch (e)
	{
		console.log('probably not a widget')
	}
	```





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
