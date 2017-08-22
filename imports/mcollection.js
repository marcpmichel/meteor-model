
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
			before_create: null,  // callback
			before_update: null,  // callback
			before_delete: null,  // callback
			after_create: null,  // callback
			after_update: null,  // callback
			after_delete: null,  // callback
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
				const ret = collection(options).create(attrs);
				callback('after_create', attrs);
				return ret;
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
			_callback('before_delete');
			self.remove(this._id);
			_callback('after_delete');
		}

		documentMethods['update'] = function(attrs) {
			if(!_callback('before_update', attrs)) return;
			// do update
			_callback('after_update', attrs);
		}

		this.helpers(documentMethods);  // collection-helpers
		// this.helpers({pouet() { return "pouet"; }}) 
	}

	function _callback(name, attrs) {
			return (_.isFunction(options[name]) && options[name](attrs)) || true;
	}

	all(attrs={}) { return this.find(attrs); }
	count(attrs={}) { return this.find(attrs).count(); }
	create(attrs={}) { 
		if(!_callback('before_create', attrs)) return;
		const id = this.insert(attrs); 
		_callback('after_create', attrs);
		return id;
	}
	$create(attrs={}) { return this.findOne(this.create(attrs)); }
	destroyAll(conds={}) { this.all(conds).forEach( doc=>doc.destroy() ) }
}


