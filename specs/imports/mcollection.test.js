
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { MCollection } from '/imports/mcollection.js';

if(Meteor.isServer) {

describe('MCollection', function() {

	function createCollection(config) {
		return new class extends MCollection {} (config)
	}

	function reset() {
		const Cars = new class extends MCollection {} ({collectionName: 'cars'})
		const Wheels = new class extends MCollection {} ({collectionName: 'wheels'})
		Cars.remove({});
		Wheels.remove({});
	}

	beforeEach(function() {
		reset();
	})
	
	describe('configuration', function() {

		it('initializes', function() {
			car_config = { collectionName: 'cars' };
			const Cars = new class extends MCollection {} (car_config)
			expect(Cars.find).to.be.a('function');
		});

		it('configures a schema', function() {
			car_config = {
				collectionName: 'cars', 
				schema: { name:{type:String }, power:{type:Number} }
			}
			const Cars = new class extends MCollection {} (car_config)
			function insert_wrong_car() {  Cars.insert({name: "2CV"}) }
			expect(insert_wrong_car).to.throw(Error);
		})

		it('adds behaviors', function() {
			car_config = { collectionName: 'cars', behaviors: [ 'timestampable' ] }
			const Cars = new class extends MCollection {} (car_config)
			Cars.insert({name:'F40'})
			car = Cars.findOne()
			expect(_.isDate(car.createdAt)).to.be.true
		})

	})

	describe('collection methods', function() {
		it('has a create method', function() {
			const Cars = new class extends MCollection {} ({collectionName: 'cars'})
			id = Cars.create({name: '106'})
			car = Cars.findOne(id)
			expect(car._id).to.equal(id)
		})

		it('has a $create method', function() {
			const Cars = new class extends MCollection {} ({collectionName: 'cars'})
			car = Cars.$create({name: '106'})
			expect(car.name).to.equal('106')
		})

		it('has a all method', function() {
			const Cars = createCollection({collectionName:'cars'})
			Cars.create({name:'one'})
			Cars.create({name:'two'})
			expect(Cars.all().fetch()).to.be.an('array')
			expect(Cars.all({name:'one'}).count()).to.equal(1);
		})

		it('has a count method', function() {
			const Cars = createCollection({collectionName:'cars'})
			Cars.create({name:'one'})
			Cars.create({name:'two'})
			expect(Cars.count()).to.equal(2);
		})

		it('has a destroyAll method', function() {
			const Cars = createCollection({collectionName:'cars'})
			Cars.create({name:'one'})
			Cars.create({name:'two'})
			Cars.destroyAll()
			expect(Cars.count()).to.equal(0)
		})

	})

	describe('document methods', function() {

		it('creates a destroy document method', function() {
			car_config = { collectionName: 'cars' }
			const Cars = new class extends MCollection {} (car_config)
			Cars.insert({name:'F40'})
			car = Cars.findOne()
			expect( car ).to.respondTo('destroy');
		})

		it('creates has_many relationships', function() {
			const wheels_config = { collectionName: 'wheels' };
			const Wheels = new class extends MCollection {} (wheels_config)

			const car_config = {
				collectionName: 'cars', 
				hasMany: { 'wheels': { collection:Wheels, foreignKey:'carId' } }
			}
			const Cars = new class extends MCollection {} (car_config)
			Cars.create({name: "DS"})
			const car = Cars.findOne()
			// console.log(car);
			expect( car.wheels).to.be.a('function')
			expect(car).itself.to.respondTo('wheels')
			expect(car).itself.to.respondTo('create_wheels')

			car.create_wheels({name: 'wheel1'})
			car.create_wheels({name: 'wheel2'})

			expect(car.wheels().count()).to.equal(2)
		})

		it('creates a hasOne relationship', function() {
			const Configs = createCollection({collectionName: 'config'});
			const Projects = createCollection({
				collectionName: 'profile', 
				hasOne:{ 'config': { collection: Configs, key: 'configId' } } 
			});
			config = Configs.$create({name:'Config1'})
			project = Projects.$create({name:'Project1', configId: config._id })
			expect(project.config).to.be.a('function');
		})

		it('creates belongsTo relationship', function() {
			const Cars = createCollection({collectionName: 'cars'})
			const Wheels = createCollection({
				collectionName: 'wheels', 
				belongsTo: { 'car': { collection: Cars, key: 'carId' } }
			})

			car = Cars.$create({name:'megane'})
			wheel = Wheels.$create({name:'wheel1', carId: car._id })

			expect(wheel.car).to.be.a('function')
			expect(wheel.car()._id).to.equal(car._id)
		})

		it('can have both hasMany and belongsTo relationships', function() {

			const Cars = createCollection({
				collectionName:'cars', 
				hasMany: { 'wheels': { collection: function(){return Wheels;}, foreignKey: 'carId' } }
			})

			const Wheels = createCollection({
				collectionName:'wheels',
				belongsTo: { 'car': { collection: Cars, key:'carId' } }
			})

			car = Cars.$create({name:'one'})
			wheel1 = car.$create_wheels({name: 'w1'})
			wheel2 = Wheels.findOne(car.create_wheels({name: 'w2'}))

			expect(car.wheels().count()).to.equal(2)
			expect(wheel1.car()._id).to.equal(car._id);
			expect(wheel2.car()._id).to.equal(car._id);
		})
	})


})
}



