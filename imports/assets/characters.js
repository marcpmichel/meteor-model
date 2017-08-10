
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Scenes } from '/imports/scenes.js';
import { Assets, AssetsCollection } from '/imports/assets/assets.js';

export const Characters = new class extends AssetsCollection {
	constructor() {
		super('character');
		const schema = new SimpleSchema({
			sceneId: { type: String }
		});

		this.attachSchema(schema);

		// hack for inheritance
		this._find_ = this.find;
		this.find = this.all;
	}

	all(conds={}) { conds.type='character'; return this._find_(conds); }
	count(conds={}) { return this.all(conds).count(); }
}

Characters.helpers({
	destroy() { Assets.remove(this._id); }, 
	scene() { return Scenes.findOne(this.sceneId); }
});

