define([

	'./core'

], function(Brickrouge) {

	const OBSERVER_PROPERTY = '$brickrouge:observers'

	/**
	 * @interface
	 */
	function Subject() { }

	Subject.prototype = {

		/**
		 * Return the observers array.
		 *
		 * @protected
		 *
		 * @param {string|null} type The event type, of `null` to get all observers.
		 *
		 * @return {Array}
		 */
		getObservers: function (type) {

			var observers

			if (!(OBSERVER_PROPERTY in this)) {
				this[OBSERVER_PROPERTY] = []
			}

			observers = this[OBSERVER_PROPERTY]

			if (!type) {
				return observers
			}

			if (!(type in observers)) {
				observers[type] = []
			}

			return observers[type]
		},

		/**
		 * Attach an observer.
		 *
		 * @param {string} type Event type.
		 * @param {function} callback
		 */
		observe: function (type, callback) {

			var observers = this.getObservers(type)

			if (observers.indexOf(callback) !== -1)
			{
				throw new Error("Observer already attached for type `" + type + '`')
			}

			observers.push(callback)
		},

		/**
		 * Detach an observer.
		 *
		 * @param {function} callback
		 */
		unobserve: function (callback) {

			var observers = this.getObservers(null), type, typeObservers, k

			for (type in Object.keys(observers))
			{
				typeObservers = observers[type]
				k = typeObservers.indexOf(callback)

				if (k === -1) continue

				typeObservers.splice(k, 1)
			}
		},

		/**
		 * Notify observers of a change.
		 *
		 * @param {string} type
		 * @param {Array} payload
		 */
		notify: function (type, payload) {

			var observers = this.getObservers(type), i, y

			if (!observers.length)
			{
				return
			}

			for (i = 0, y = observers.length; i < y; i++)
			{
				try
				{
					observers[i].apply(null, payload)
				}
				catch (e)
				{
					console.error(e)
				}
			}
		}
	}

	/**
	 * @interface
	 */
	Brickrouge.Subject = Subject

	Brickrouge.observe = Subject.prototype.observe
	Brickrouge.unobserve = Subject.prototype.unobserve
	Brickrouge.notify = Subject.prototype.notify
	Brickrouge.getObservers = Subject.prototype.getObservers

})
