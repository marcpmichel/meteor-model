
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { Scenes } from '/imports/scenes.js';
import { Assets, AssetsCollection } from '/imports/assets/assets.js';

export const Locations = new class extends AssetsCollection {

	constructor() {
		super('location');
	}

}

