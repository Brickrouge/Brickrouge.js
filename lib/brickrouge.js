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

	Object.assign(Brickrouge, Subject.prototype)

	Object.defineProperties(Brickrouge, {

		Subject: { value: Subject },
		Widget:  { value: Widget }

	})

	return window.Brickrouge = Brickrouge

})
