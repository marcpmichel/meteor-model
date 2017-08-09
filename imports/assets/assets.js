
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export class AssetsCollection extends Mongo.Collection {
	constructor(type) {
		// console.log(Mongo.getCollection('assets'));
		super('assets', { _suppressSameNameError:true });
		this.type = type || 'unknown';
		this.schema = new SimpleSchema({
			name: { type: String },
			type: { type: String, allowedValues: ['unknown', 'dialog', 'location', 'character'] },
			// sceneId: { type: String },
			description: { type: String, optional: true },
			data: { type: Object, defaultValue: {} }
		});
	}

	all(attrs={}) { return this.find(attrs); }
	deleteAll(attrs={}) { this.all(attrs).forEach( doc=>doc.destroy() ); }
	count(attrs={}) { return this.find(attrs).count(); }
	create(attrs={}) { 
		attrs.type = this.type;
		console.log("Assets.create() =>", attrs);
		this.schema.clean(attrs);
		this.schema.validate(attrs);
		return this.insert(attrs);
	}
	$create(attrs={}) { return this.findOne(this.create(attrs)); }
};

export const Assets = new AssetsCollection();

Assets.helpers({
	destroy() { return Assets.remove(this._id); }
});


