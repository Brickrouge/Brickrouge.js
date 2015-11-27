!function(Brickrouge) {

	"use strict";

	var /** @const **/ OBSERVER_PROPERTY = '$brickrouge:observers'

	/**
	 * @interface
	 */
	function Subject() {}

	Subject.prototype = {

		/**
		 * Returns the observers array.
		 *
		 * @protected
		 *
		 * @param {string|null} type The event type, of `null` to get all observers.
		 *
		 * @return {Array}
		 */
		getObservers: function(type) {

			var observers

			if (!(OBSERVER_PROPERTY in this))
			{
				this[OBSERVER_PROPERTY] = []
			}

			observers = this[OBSERVER_PROPERTY]

			if (!type)
			{
				return observers
			}

			if (!(type in observers))
			{
				observers[type] = []
			}

			return observers[type]
		},

		/**
		 * Attaches an observer.
		 *
		 * @param {string} type Event type.
		 * @param {function} callback
		 */
		attachObserver: function(type, callback) {

			var observers = this.getObservers(type)

			if (observers.indexOf(callback) !== -1)
			{
				throw new Error("Observer already attached for type \"" + type + '"')
			}

			observers.push(callback)
		},

		/**
		 * Detaches an observer.
		 *
		 * @param {function} callback
		 */
		detachObserver: function(callback) {

			var observers = this.getObservers(), type, typeObservers, k

			for (type in Object.keys(observers))
			{
				typeObservers = observers[type]
				k = typeObservers.indexOf(callback)

				if (k === -1) continue

				typeObservers.splice(k, 1)
			}
		},

		/**
		 * Notifies observers of a change.
		 *
		 * @param {string} type
		 * @param {Array} payload
		 */
		notifyObservers: function(type, payload) {

			var observers = this.getObservers(type), i, y

			if (!observers.length)
			{
				return
			}

			for (i = 0, y = observers.length ; i < y ; i++)
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

	Brickrouge.attachObserver = Subject.prototype.attachObserver
	Brickrouge.detachObserver = Subject.prototype.detachObserver
	Brickrouge.notifyObservers = Subject.prototype.notifyObservers
	Brickrouge.getObservers = Subject.prototype.getObservers

} (Brickrouge);
