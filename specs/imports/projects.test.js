
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Projects } from '/imports/projects.js';

if(Meteor.isServer) {

describe('Projects', function() {

	function createProject() { return Projects.$create({name: 'test', description:'test'}); }

	beforeEach(function() {
		Projects.remove({});
	});

	it('can create a project', function() {
		expect(createProject).not.to.throw()
		expect(Projects.count()).to.equal(1);
	});

	it('validates', function() {
		function bogusProject() { return Projects.create({}); }
		expect(bogusProject).to.throw(Error);
	});

	it('has many scenarios', function() {
		const proj = createProject();
		proj.create_scenario({ name:"scenario 1", description:"a scenario"});	
		expect(proj.scenarios().count()).to.equal(1);
	});

});
}

