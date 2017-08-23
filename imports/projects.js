
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Scenarios } from '/imports/scenarios.js';

export const Projects = new class extends Mongo.Collection {
	constructor() {
		super('projects');
		this.schema = new SimpleSchema({
			name: { type: String },
			description: { type: String, optional: true }
		});
		this.attachSchema(this.schema);

		this.timestampable();
	}
	all(attrs={}) { return this.find(attrs); }
	count(attrs={}) { return this.find(attrs).count(); }
	create(attrs={}) { 
		// this.schema.clean(attrs); 
		//this.schema.validate(attrs); 
		return this.insert(attrs);
	}
	$create(attrs={}) { return this.findOne(this.create(attrs)); }
	destroyAll(conds={}) { this.all(conds).forEach( doc=>doc.destroy() ) }
};

Projects.helpers({
	// has many scenarios
	scenarios() { return Scenarios.find({projectId: this._id})},
	create_scenario(attrs={}) { attrs.projectId = this._id; return Scenarios.create(attrs); },
	$create_scenario(attrs={}) { return Scenarios.findOne(this.create_scenario(attrs)); },
	destroy() { this.scenarios().forEach( doc=>doc.destroy() ); Projects.remove(this._id);  }
});

Meteor.methods({
	'project.add'(attrs) {
		return Projects.create(attrs);
	},
	'project.delete'(projectId) {
		return Projects.findOne(projectId).destroy();
	}
})

Meteor.publish('projects', function() {
	return Projects.all();
})

