
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';
import { Scenarios } from '/imports/scenarios.js';
import { Dialogs } from '/imports/dialogs.js';

export const Scenes = new class extends Mongo.Collection {
  constructor() {
    super('scenes');

		/*
		this.hasMany = {
			dialogs: { collection: Dialogs, dependent: 'destroy', foreignKey: 'sceneId' }
		}
		this.belongsTo = {
			scenario: { collection: Scenarios }
		}
		*/

    this.schema = new SimpleSchema({
      scenarioId: { type: String },
      name: { type: String },
      description: { type: String },
      owner: { type: String, optional: true }
    });
  }

  all(conds={}) { return this.find(conds); }
	count(conds={}) { return this.all(conds).count(); }
  validate(data) { return this.schema ? this.schema.validate(data) : data; }
  clean(data) { return this.schema ? this.schema.clean(data) : data; }
  create(attrs) { this.clean(attrs); this.validate(attrs); return Scenes.insert(attrs); }
  $create(attrs) { return Scenes.findOne(this.create(attrs)); }
	deleteAll(conds={}) {
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
    dialogs(conds={}) { conds.scenarioId = this._id; return Dialogs.find(conds); },
    create_dialog(attrs) { attrs.sceneId = this._id; return Dialogs.create(attrs); },
		$create_dialog(attrs) { return Dialogs.findOne(this.create_dialog(attrs)); },
});

if(Meteor.isServer) {
  Meteor.methods({
  });
}

