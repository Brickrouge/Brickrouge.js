import Subject from './Subject'
import Dataset from './Dataset'
import { uidOf, empty, mixin } from './utils'
import { clone } from './clone'

export default Object.defineProperties({}, {

	Dataset:           { value: Dataset },
	Subject:           { value: Subject },

	uidOf:             { value: uidOf },
	empty:             { value: empty },
	mixin:             { value: mixin },
	clone:             { value: clone },

	notify:            { value: Subject.prototype.notify },
	observe:           { value: Subject.prototype.observe },
	unobserve:         { value: Subject.prototype.unobserve }

})
