
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import check from 'meteor/check';

export class MCollection extends Mongo.Collection {

	static Declare(config) {
		return new class extends MCollection {} (config);
	}

	constructor(config) {

		_.defaults(config, { 
			collectionName: null,  // mongo collection
			schema: null, 		// SimpleSchema & collection2
			behaviors: [],		// behaviors names ( ex: ['timestampable', 'sortable' ] ) // see sewdn:collection-behaviours
			hasMany: [],			// associations; ex: { name: 'wheels', collection: Wheels , foreignKey: 'carId', dependant: 'destroy' }
			hasOne: [],				
			belongsTo: [],
			STI: false, 			// { key: 'type', value: 'B' } ??
			callbacks: {
				before_create: null,
				before_update: null,
				before_destroy: null,
				after_create: null,
				after_update: null,
				after_destroy: null
			}
		});

		// check(config.collectionName);
		super(config.collectionName, { _suppressSameNameError:true });

		this.config = config;
		this.callbacks = config.callbacks;
		var self = this;

		if(config.schema) this.attachSchema(new SimpleSchema(config.schema));

		// inject behaviors
		_.each(config.behaviors, (b) => { this[b](); });


		// ------- inject relations methods --------

		// Working around the forward declaration problem :
		// i.e. : declare Cars has many Wheels, then declare Wheels belongsTo Cars
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
				self._callback('after_create', attrs);
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
			if(options.as) name = options.as;
			documentMethods[name] = function() {
				conds = {}; conds[options.key] = self._id;
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
			if(!self._callback('before_destroy')) return;
			self.remove(this._id);
			self._callback('after_destroy');
		}

		documentMethods['update'] = function(attrs={}) {
			if(!self._callback('before_update', attrs)) return;
			self.update(this._id, {$set: attrs});
			self._callback('after_update', attrs);
		}

		this.helpers(documentMethods);  // collection-helpers
		// this.helpers({pouet() { return "pouet"; }})
	}

	_callback(name, attrs) {
		const cb = this.callbacks[name]
		return _.isFunction(cb) ? cb(attrs) : true;
	}

	all(attrs={}) { return this.find(attrs); }
	count(attrs={}) { return this.find(attrs).count(); }
	create(attrs={}) { 
		if(!this._callback('before_create', attrs)) return;
		const id = this.insert(attrs); 
		this._callback('after_create', attrs);
		return id;
	}
	$create(attrs={}) { return this.findOne(this.create(attrs)); }
	destroyAll(conds={}) { this.all(conds).forEach( doc=>doc.destroy() ) }
}


