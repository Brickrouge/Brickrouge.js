/*!
 * Brickrouge dev-master (http://brickrouge.org)
 * Copyright 2016 Olivier Laviale <olivier.laviale@gmail.com>.
 * Licensed under the New BSD License
 */

define([

	'./core',
	'olvlvl-subject',
	'./widget',
	'./utils',
	'./clone'

], function(Brickrouge, Subject, Widget) {

	Object.defineProperties(Brickrouge, {

		Subject:   { value: Subject },
		Widget:    { value: Widget },

		notify:    { value: Subject.prototype.notify },
		observe:   { value: Subject.prototype.observe },
		unobserve: { value: Subject.prototype.unobserve }

	})

	return window.Brickrouge = Brickrouge

})
