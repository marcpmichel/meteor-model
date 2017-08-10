
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { Scenes } from '/imports/scenes.js';
import { Assets, AssetsCollection } from '/imports/assets/assets.js';

export const Dialogs = new class extends AssetsCollection {
	constructor() {
		super('dialog');
		this.schema = new SimpleSchema({
			// name: { type: String },
			// type: { type: String, allowedValues: ['dialog'] },
			sceneId: { type: String },
			// description: { type: String, optional: true },
			// data: { type: Object, defaultValue: {} },
			parentId: { type: String, defaultValue:"" }
		});

		this.attachSchema(this.schema);

		// hack for inheritance
		this._find_ = this.find;
		this.find = this.all;
	}

	// /!\ don't use find, use all() because of inheritance !
	all(conds={}) { conds.type='dialog'; return this._find_(conds); }
	count(conds={}) { return this.all(conds).count(); }
}

Dialogs.helpers({
	scene() { return Scenes.findOne(this.sceneId); },
	destroy() { Assets.remove(this._id);  },
	attach(dialog) { 
		return Dialogs.update({_id: dialog._id}, { $set: { parentId: this._id } } )
	},
	children() { return Dialogs.all({parentId: this._id }) }
});



