/*!
 * Brickrouge dev-master (http://brickrouge.org)
 * Copyright 2016 Olivier Laviale <olivier.laviale@gmail.com>.
 * Licensed under the New BSD License
 */

var Brickrouge = {}

!function (Brickrouge)
{
	"use strict";

	Brickrouge.run = function() {

		try
		{
			Brickrouge.Widget.parse(document.body)
		}
		catch (e)
		{
			console.error(e)
		}

		Brickrouge.Widget.monitor()
	}

} (Brickrouge);
