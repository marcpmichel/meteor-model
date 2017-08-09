
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
// import SimpleSchema from 'simpl-schema';
import { Scenes } from '/imports/scenes.js';
import { Projects } from '/imports/projects.js';

//class ScenariosCollection extends Mongo.Collection {
export const Scenarios = new class extends Mongo.Collection {
  constructor() {
    super('scenarios');
    this.schema = new SimpleSchema({
      projectId: { type: String },        // id of the project this asset is part of.
      name: { type: String },
      description: { type: String, optional: true },
      owner: { type: String, optional: true }
    });
  }

  all(conds={}) { return this.find(conds); }
	count(conds) { return this.all(conds).count(); }
  validate(data) { return this.schema ? this.schema.validate(data) : data; }
  clean(data) { return this.schema ? this.schema.clean(data) : data; }
  create(attrs) { this.clean(attrs); this.validate(attrs); return Scenarios.insert(attrs); }
	deleteAll(conds={}) { 
		Scenarios.find(conds).fetch().forEach((doc)=>{ const s = Scenarios.findOne(doc._id); s.destroy(); });
	}

}

// export const Scenarios = new ScenariosCollection();

Scenarios.helpers({
		destroy() {
				this.scenes().forEach( doc => doc.destroy() );
				return Scenarios.remove(this._id);
		},
 // has many scenes
    scenes(conds={}) { conds.scenarioId = this._id; return Scenes.find(conds); },
    create_scene(attrs) { attrs.scenarioId = this._id; return Scenes.create(attrs); },
 // belongs to project
    project() { return Projects.findOne(this.projectId); },
});

if(Meteor.isServer) {

  Meteor.methods({

  });

}
