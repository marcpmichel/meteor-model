
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { Scenarios } from '/imports/scenarios.js';
import { Dialogs } from '/imports/assets/dialogs.js';
import { Locations } from '/imports/assets/locations.js';
import { Characters } from '/imports/assets/characters.js';

export const Scenes = new class extends Mongo.Collection {
  constructor() {
    super('scenes');

    this.schema = new SimpleSchema({
      scenarioId: { type: String },
      name: { type: String },
      description: { type: String, optional: true, defaultValue:"add a description" },
      owner: { type: String, optional: true },
			parentId: { type: String, defaultValue:"" }
    });
		this.attachSchema(this.schema);
  }

  all(conds={}) { return this.find(conds); }
	count(conds={}) { return this.all(conds).count(); }
  // validate(data) { return this.schema ? this.schema.validate(data) : data; }
  // clean(data) { return this.schema ? this.schema.clean(data) : data; }
  create(attrs) { /* this.clean(attrs); this.validate(attrs); */ return Scenes.insert(attrs); }
  $create(attrs) { return Scenes.findOne(this.create(attrs)); }
	destroyAll(conds={}) {
		this.all(conds).forEach( scene => scene.destroy() );
	}
}

Scenes.helpers({
		destroy() {
			this.dialogs().forEach(doc => doc.destroy() )
			return Scenes.remove(this._id);
		},

	// belongs to Scenarios
    scenario() { return Scenarios.findOne(this.scenarioId); },
	// has_many Dialogs
    dialogs(conds={}) { conds.sceneId = this._id; return Dialogs.all(conds); },
    create_dialog(attrs) { attrs.sceneId = this._id; return Dialogs.create(attrs); },
		$create_dialog(attrs) { return Dialogs.findOne(this.create_dialog(attrs)); },

    locations(conds={}) { conds.sceneId = this._id; return Locations.all(conds); },
    create_location(attrs) { attrs.sceneId = this._id; return Locations.create(attrs); },
		$create_location(attrs) { return Locations.findOne(this.create_location(attrs)); },

    characters(conds={}) { conds.sceneId = this._id; return Characters.all(conds); },
    create_character(attrs) { attrs.sceneId = this._id; return Characters.create(attrs); },
		$create_character(attrs) { return Characters.findOne(this.create_character(attrs)); },

		attach(scene) { return Scenes.update({_id: scene._id}, {$set: { parentId: this._id } } ) },
		children() { return Scenes.all({parentId: this._id}) }
});

if(Meteor.isServer) {
  Meteor.methods({
  });
}

