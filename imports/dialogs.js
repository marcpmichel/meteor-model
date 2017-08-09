
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { Scenes } from '/imports/scenes.js';
import { Assets, AssetsCollection } from '/imports/assets/assets.js';

export const Dialogs = new class extends AssetsCollection {
	constructor() {
		super('dialog');
	}

	all(conds={}) { return this.find(conds); }
	count(conds={}) { return this.all(conds).count(); }
	// validate(data) { return this.schema ? this.schema.validate(data) : data; }
	// clean(data) { return this.schema ? this.schema.clean(data) : data; }
	// create(attrs) { this.clean(attrs); this.validate(attrs); return this.insert(attrs); }
	// $create(attrs) { return this.findOne(this.create(attrs)); }
	deleteAll(conds={}) { this.all(conds).forEach( doc=>doc.destroy() ); }

}

Dialogs.helpers({
	scene() { console.log("Dialog.scene() sceneId: ", this.sceneId); return Scenes.findOne(this.sceneId); },
	destroy() { Assets.remove(this._id);  }
});




