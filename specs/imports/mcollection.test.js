
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
		const DrivingWheels = new class extends MCollection {} ({collectionName: 'driving_wheels'})
		Cars.remove({});
		Wheels.remove({});
		DrivingWheels.remove({});
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

		it.skip('destroys relations', function() {
			const Wheels = createCollection({collectionName: 'wheels'})
			const Cars = createCollection({ 
				collectionName: 'cars', 
				hasMany: { 'wheels': { collection: Wheels, foreignKey: 'carId' } } 
			})
			const car = Cars.$create({name:'a car'})
			// create Wheels
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
			const DrivingWheels = createCollection({collectionName: 'driving_wheels'});
			const Cars = createCollection({
				collectionName: 'cars', 
				hasOne:{ 'config': { collection: DrivingWheels, key: 'drivingWheelId', as: 'driving_wheel' } } 
			});
			drivingWheel = DrivingWheels.$create({name:'The driving wheel'})
			car = Cars.$create({name:'A car', drivingWheelId: drivingWheel._id })
			expect(car.driving_wheel).to.be.a('function');
			// FIXME
			expect(car.driving_wheel()._id).to.equal(drivingWheel._id);
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
				hasMany: { 'wheels': { 
					collection: function() {return Wheels}, // Wheels is not declared yet...
					foreignKey: 'carId'
				}}
			});

			const Wheels = createCollection({
				collectionName:'wheels',
				belongsTo: { 'car': {
					collection: function() { return Cars }, 
					key:'carId' }
				}
			})

			car = Cars.$create({name:'one'})
			wheel1 = car.$create_wheels({name: 'w1'})
			wheel2 = Wheels.findOne(car.create_wheels({name: 'w2'}))

			expect(car.wheels().count()).to.equal(2)
			expect(wheel1.car()._id).to.equal(car._id);
			expect(wheel2.car()._id).to.equal(car._id);
		})
	})

	describe('Callbacks', function() {
		describe('beforeCreate', function() {
			it('has a beforeCreate callback', function() {
				const Cars = createCollection({
					collectionName:'cars',
					callbacks: { 
						before_create: function(attrs) { attrs.name = 'before_create called'; return true; }
					}
				})
				
				car = Cars.$create({name:"name"});
				expect(car.name).to.equal("before_create called");
			})

			it('does not create if callback returns false', function() {
				const Cars = createCollection({
					collectionName:'cars',
					callbacks: {
						before_create: function(attrs) { attrs.name='before_create called'; return false; }
					}
				})

				car = Cars.$create({name:"hey"});
				expect(car).to.be.undefined;
			})

		});

		describe('after_create', function() {
			it('has a after_create callback', function() {
				let after_create_called = false;
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: {
						after_create: function(attrs) {
							after_create_called = true;
						}
					}
				})

				expect(after_create_called).to.be.false;
				Cars.create({name: 'a car'});
				expect(after_create_called).to.be.true;
			})
		})

		describe('before_update', function() {
			it('has a before_update callback', function() {
				let before_update_called = false
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: {
						before_update: function(attrs) {
							before_update_called = true;
						}
					}
				})
				const car = Cars.$create({name:'another car'})
				expect(before_update_called).to.be.false
				car.update({name: "my car"})
				expect(before_update_called).to.be.true
			})

			it('does not update if before_update returns false', function() {
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: {
						before_update: function(attrs) { return false; }
					}
				})
				let car = Cars.$create({name: 'my car'})
				car.update({name: 'xxx'})
				car = Cars.findOne(car._id)
				expect(car.name).to.equal('my car')
			})
		})

		describe('after_update', function() {
			it('has an after_update callback', function() {
				let after_update_called = false;
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: { after_update: function(attrs) { after_update_called = true } }
				})
				const car = Cars.$create({name:'a car'})
				car.update({name:'my car'})
				expect(after_update_called).to.be.true
			})
		})

		describe('before_destroy', function() {
			it('has a before_destroy callback', function() {
				let before_destroy_called = false
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: { before_destroy: function(attrs) { before_destroy_called = true } }
				})
				const car = Cars.$create({name:'car1'})
				car.destroy();
				expect(before_destroy_called).to.be.true
			})

			it('does not destroy if the callback returns false', function() {
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: { before_destroy: function(attrs) { return false; } }
				})
				let car = Cars.$create({name:'car1'})
				car.destroy()
				car = Cars.findOne(car._id)
				expect(car).not.to.be.undefined
			})
		})

		describe('after_destroy', function() {
			it('has an after_destroy callback', function() {
				let after_destroy_called = false
				const Cars = createCollection({
					collectionName: 'cars',
					callbacks: { after_destroy: function(attrs) { after_destroy_called = true } }
				})
				let car = Cars.$create({name:'car1'})
				car.destroy()
				car = Cars.findOne(car._id)
				expect(after_destroy_called).to.be.true
			})
		})

	}) 

})
}



