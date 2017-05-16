import {
	run as widgetRun,
	isWidget,
	isBuilt,
	register,
	factory,
	createOrReuse
} from './widget'

import { UpdateEvent, RunningEvent, WidgetEvent } from './events'
import Brickrouge from './stub'

/**
 * @fires Brickrouge#running
 */
function run()
{
	widgetRun()
	Brickrouge.notify(new RunningEvent)
}

export default Object.defineProperties(Brickrouge, {

	isWidget:   { value: isWidget },
	isBuilt:    { value: isBuilt },
	register:   { value: register },
	registered: { value: factory },
	from:       { value: createOrReuse },
	run:        { value: run },

	observeUpdate: { value: function (callback) {

		this.observe(UpdateEvent, callback)

	}},

	observeRunning: { value: function (callback) {

		this.observe(RunningEvent, callback)

	}},

	observeWidget: { value: function (callback) {

		this.observe(WidgetEvent, callback)

	}}

})
