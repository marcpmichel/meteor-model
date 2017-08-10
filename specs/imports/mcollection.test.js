
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { MCollection } from '/imports/mcollection.js';

if(Meteor.isServer) {

describe('MCollection', function() {

	function reset() {
		const Cars = new class extends MCollection {} ({collectionName: 'cars'})
		Cars.destroyAll();
	}

	beforeEach(function() {
		reset();
	})
	
	it('initializes', function() {
		car_config = { collectionName: 'cars' };
		const Cars = new class extends MCollection {} (car_config)
	});

	it('has collection methods', function() {
		const Cars = new class extends MCollection {} ({collectionName: 'cars'})
		car = Cars.$create({name: '106'});
		expect(car.name).to.equal('106');
	})

	it('configures a schema', function() {
		car_config = {
			collectionName: 'cars', 
			schema: { name:{type:String }, power:{type:Number} }
		}
		const Cars = new class extends MCollection {} (car_config)
		function insert_wrong_car() {  Cars.insert({name: "2CV"}) }
		expect(insert_wrong_car).to.throw(Error);
	})

	it.skip('adds behaviors', function() {
		car_config = { collectionName: 'cars', behaviors: [ 'timestampable' ] }
		const Cars = new class extends MCollection {} (car_config)
		Cars.insert({name:'F40'})
		car = Cars.findOne()
		console.log(car)
		expect(_.isDate(car.createdAt)).to.be.true
	})

	it('creates a destroy document method', function() {
		car_config = {
			collectionName: 'cars', 
			// hasMany: { 'wheels': { collection Wheels, foreignKey:'carId' } }
		}
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
		const car = Cars.findOne();
		// console.log(car);
		expect( car.wheels).to.be.a('function');
		expect(car).itself.to.respondTo('wheels');
		expect(car).itself.to.respondTo('create_wheels');

		car.create_wheels({name: 'wheel1'})
		car.create_wheels({name: 'wheel2'})

		expect(car.wheels().count()).to.equal(2)
	})

	it.skip('creates belongsTo relationship', function() {
	})

})
}



