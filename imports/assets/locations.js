
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { Scenes } from '/imports/scenes.js';
import { Assets, AssetsCollection } from '/imports/assets/assets.js';

export const Locations = new class extends AssetsCollection {

	constructor() {
		super('location');
		this.schema = new SimpleSchema({
			// name: { type: String },
			// type: { type: String, allowedValues: ['location'] },
			sceneId: { type: String },
			// description: { type: String, optional: true },
			// data: { type: Object, defaultValue: {} },
		});

		this.attachSchema(this.schema);

		this._find_ = this.find;
		this.find = this.all;
	}

	all(conds={}) { conds.type='location'; return this._find_(conds);  }
	
}

Locations.helpers({
		scene() { return Scenes.findOne(this.sceneId) },
		destroy() { Assets.remove(this._id); }
});



