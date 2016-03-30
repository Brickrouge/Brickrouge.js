define([

	'./core'

], function(Brickrouge) {

	const OBSERVER_PROPERTY = '$brickrouge:observers'

	function assertNameIsValid(name)
	{
		if (typeof name !== 'string')
		{
			throw new Error("Event name is not a string")
		}
	}

	/**
	 * Retrieve event name from an event constructor.
	 *
	 * @param {function} constructor
	 *
	 * @returns {string}
	 */
	function retrieveNameFromConstructor(constructor)
	{
		if (typeof constructor !== 'function' || !('name' in constructor))
		{
			throw new Error("Expecting an event instance, got: `" + constructor + "`")
		}

		let name = constructor.name

		assertNameIsValid(name)

		return name
	}

	/**
	 * Retrieve event name from ab event instance.
	 *
	 * @param {object} event
	 *
	 * @returns {string}
	 */
	function retrieveNameFromInstance(event)
	{
		if (typeof event !== 'object' || !('name' in event.__proto__.constructor))
		{
			throw new Error("Expected an Event instance")
		}

		let name = event.__proto__.constructor.name

		assertNameIsValid(name)

		return name
	}

	/**
	 * @interface
	 */
	function Subject()
	{

	}

	Subject.prototype = {

		/**
		 * Return the observers array.
		 *
		 * @protected
		 *
		 * @param {string|null} name Event name, or `null` to get all observers.
		 *
		 * @return {Array}
		 */
		getObservers: function (name) {

			let observers

			if (!(OBSERVER_PROPERTY in this)) {
				this[OBSERVER_PROPERTY] = []
			}

			observers = this[OBSERVER_PROPERTY]

			if (!name) {
				return observers
			}

			if (!(name in observers)) {
				observers[name] = []
			}

			return observers[name]
		},

		/**
		 * Attach an observer.
		 *
		 * @param {function} constructor Event constructor.
		 * @param {function} callback
		 *
		 * @return {this}
		 */
		observe: function (constructor, callback) {

			let name = retrieveNameFromConstructor(constructor)
			let observers = this.getObservers(name)

			if (observers.indexOf(callback) !== -1)
			{
				throw new Error("Observer already attached for event `" + name + '`')
			}

			observers.push(callback)

			return this
		},

		/**
		 * Detach an observer.
		 *
		 * @param {function} callback
		 *
		 * @return {this}
		 */
		unobserve: function (callback) {

			let observers = this.getObservers(null)
			let typeObservers

			for (let type in Object.keys(observers))
			{
				typeObservers = observers[type]
				let k = typeObservers.indexOf(callback)

				if (k === -1) continue

				typeObservers.splice(k, 1)
			}

			return this
		},

		/**
		 * Notify observers of a change.
		 *
		 * @param {object} event
		 *
		 * @return {this}
		 */
		notify: function (event) {

			let name = retrieveNameFromInstance(event)
			let observers = this.getObservers(name)

			if (!observers.length)
			{
				return this
			}

			for (let i = 0, y = observers.length; i < y; i++)
			{
				try
				{
					observers[i].call(null, event)
				}
				catch (e)
				{
					console.error(e)
				}
			}

			return this
		}
	}

	/**
	 * Creates an event given a name and a constructor.
	 *
	 * @param {string} name
	 * @param {function} constructor
	 *
	 * @returns {function}
	 */
	Subject.createEvent = function (name, constructor) {

		Object.defineProperty(constructor, 'name', { value: name })

		return constructor

	}

	/**
	 * @interface
	 */
	return Brickrouge.Subject = Subject

})
