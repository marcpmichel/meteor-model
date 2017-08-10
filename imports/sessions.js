
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Projects } from '/imports/projects.js';
import { Assets } from '/imports/assets/assets.js';


export const Sessions = new class extends Mongo.Collection {

	constructor() {
		super('sessions');
		
		this.attachSchema(new SimpleSchema({  // aldeed:collection2
			name: { type: String },
			branchName: { type: String },

			this.timestampable(); // sewdn:collection-behaviours
		}));

		

	}


}
