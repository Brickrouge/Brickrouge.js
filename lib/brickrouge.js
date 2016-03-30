/*!
 * Brickrouge dev-master (http://brickrouge.org)
 * Copyright 2016 Olivier Laviale <olivier.laviale@gmail.com>.
 * Licensed under the New BSD License
 */

define([

	'./core',
	'./utils',
	'./subject',
	'./widget',
	'./clone'

], function(Brickrouge, Utils, Subject) {

	Object.assign(Brickrouge, Subject.prototype)

	return window.Brickrouge = Brickrouge

});
