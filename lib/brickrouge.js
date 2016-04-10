/*!
 * Brickrouge dev-master (http://brickrouge.org)
 * Copyright 2016 Olivier Laviale <olivier.laviale@gmail.com>.
 * Licensed under the New BSD License
 */

define([

	'./core',
	'olvlvl-subject',
	'./utils',
	'./widget',
	'./clone'

], function(Brickrouge, Subject) {

	Object.assign(Brickrouge, Subject.prototype)
	Object.defineProperty(Brickrouge, 'Subject', { value: Subject })

	return window.Brickrouge = Brickrouge

})
