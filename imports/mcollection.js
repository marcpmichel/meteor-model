
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import check from 'meteor/check';

export class MCollection extends Mongo.Collection {
	constructor(config) {

		_.defaults(config, { 
			collectionName: null,  // mongo collection
			schema: null, 		// SimpleSchema & collection2
			behaviors: [],		// behaviors names ( ex: ['timestampable', 'sortable' ] ) // see sewdn:collection-behaviours
			hasMany: [],			// associations; ex: { name: 'wheels', collection: Wheels , foreignKey: 'carId', dependant: 'destroy' }
			hasOne: [],				
			belongsTo: [],
			STI: false, 			// { key: 'type', value: 'B' } ??
		});

		// check(config.collectionName);
		super(config.collectionName, { _suppressSameNameError:true });

		this.config = config;
		var self = this;

		if(config.schema) this.attachSchema(new SimpleSchema(config.schema));

		// inject behaviors
		_.each(config.behaviors, (b) => { console.log(b, this[b]); this[b].call(); });

		const documentMethods = {}

		// create has_many methods
		_.each(config.hasMany, (options, name) => {
			// console.log("name:", name, "options:", options);
			documentMethods[name] = function(conds={}) {
				conds[options.foreignKey] = this._id;
				return options.collection.find(conds);
			}

			documentMethods['create_'+name] = function(attrs) {
				attrs[options.foreignKey] = this._id;
				return options.collection.create(attrs);
			}
		});

		// create belongs to method
		_.each(config.belongsTo, (options, name) => {
			documentMethods[name] = function() {
				return options.collection.findOne(this[options.key]);
			}
		});

		documentMethods['destroy'] = function() {
			//config.hasMany.forEach( (assoc) => {
				// call destroy on each hasMany assoc
			//});
			self.remove(this._id);
		}

		this.helpers(documentMethods);  // collection-helpers
	}

	all(attrs={}) { return this.find(attrs); }
	count(attrs={}) { return this.find(attrs).count(); }
	create(attrs={}) { return this.insert(attrs); }
	$create(attrs={}) { return this.findOne(this.create(attrs)); }
	destroyAll(conds={}) { this.all(conds).forEach( doc=>doc.destroy() ) }
}


