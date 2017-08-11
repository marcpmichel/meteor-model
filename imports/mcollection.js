
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
		_.each(config.behaviors, (b) => { this[b](); });


		// inject relations methods 

		function collection(options) {
				return _.isFunction(options.collection) ? options.collection() : options.collection;
		}

		const documentMethods = {}

		// hasMany
		_.each(config.hasMany, (options, name) => {

			documentMethods[name] = function(conds={}) {
				conds[options.foreignKey] = this._id;
				return collection(options).find(conds);
			}

			documentMethods['create_'+name] = function(attrs) {
				attrs[options.foreignKey] = this._id;
				return collection(options).create(attrs);
			}

			documentMethods['$create_'+name] = function(attrs) {
				attrs[options.foreignKey] = this._id;
				const id = collection(options).create(attrs);
				return collection(options).findOne(id);
			}
		});

		// hasOne
		_.each(config.hasOne, (options, name) => {
			documentMethods[name] = function() {
				conds = {}; conds[key] = this._id;
				return collection(options).findOne(conds);
			}
		})

		// belongsTo
		_.each(config.belongsTo, (options, name) => {
			documentMethods[name] = function() {
				return collection(options).findOne(this[options.key]);
			}
		});

		documentMethods['destroy'] = function() {
			// TODO: call destroy on each hasMany and hasOne assoc
			// _.each(config.hasMany, (options, name) => {
		  //   if(options.dependent == 'destroy') {
			//   }
			// })
			self.remove(this._id);
		}

		this.helpers(documentMethods);  // collection-helpers
		// this.helpers({pouet() { return "pouet"; }}) 
	}

	all(attrs={}) { return this.find(attrs); }
	count(attrs={}) { return this.find(attrs).count(); }
	create(attrs={}) { return this.insert(attrs); }
	$create(attrs={}) { return this.findOne(this.create(attrs)); }
	destroyAll(conds={}) { this.all(conds).forEach( doc=>doc.destroy() ) }
}


