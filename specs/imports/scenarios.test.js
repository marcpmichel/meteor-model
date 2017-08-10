
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Scenarios } from '/imports/scenarios.js';

if(Meteor.isServer) {

describe('Scenarios', function() {

	function createScenario() { return Scenarios.create({name:"test scenario", projectId:"1" }) }

	beforeEach(function() {
		Scenarios.destroyAll()
	})

	it('can create a Scenario', function() {
		expect(createScenario).not.to.throw()
	})

	it('can delete all', function() {
		createScenario()
		Scenarios.destroyAll()
		expect(Scenarios.count()).to.equal(0)
	})

	it('has scenes', function() {
		const sid = createScenario()
		const scenario = Scenarios.findOne(sid)
		let n = scenario.scenes().count()	
		expect(n).to.equal(0)
	})

	it('can create a scene', function() {
		const sid = createScenario()
		const scenario = Scenarios.findOne(sid)
		scenario.create_scene({name:"test scene", description:"test scene"})
		// console.log(scenario.scenes().fetch())
		let n = scenario.scenes().count()
		expect(n).to.equal(1)
	})

});
}
