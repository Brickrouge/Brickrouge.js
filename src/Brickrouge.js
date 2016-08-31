import { uidOf, empty, mixin } from './utils'
import { clone } from './clone'
import Dataset from './Dataset'
import Subject from './Subject'
import Widget from './widget'
import Brickrouge from './stub'

export default Object.defineProperties(Brickrouge, {

	EVENT_UPDATE:      { value: Widget.UpdateEvent },
	EVENT_RUNNING:     { value: Widget.RunningEvent },
	EVENT_WIDGET:      { value: Widget.WidgetEvent },

	uidOf:             { value: uidOf },
	empty:             { value: empty },
	clone:             { value: clone },
	mixin:             { value: mixin },
	Dataset:           { value: Dataset },
	Subject:           { value: Subject },

	isWidget:          { value: Widget.isWidget },
	isBuilt:           { value: Widget.isBuilt },
	register:          { value: Widget.register },
	registered:        { value: Widget.registered },
	from:              { value: Widget.from },
	run:               { value: Widget.run },

	observeUpdate: { value: function (callback) {

		this.observe(Widget.UpdateEvent, callback)

	}},

	observeRunning: { value: function (callback) {

		this.observe(Widget.RunningEvent, callback)

	}},

	observeWidget: { value: function (callback) {

		this.observe(Widget.WidgetEvent, callback)

	}}

})
