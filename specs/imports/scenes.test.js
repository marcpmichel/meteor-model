import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Scenes } from '/imports/scenes.js';

if(Meteor.isServer) {

describe('Scenes', function() {

	function deleteAll() { Scenes.deleteAll(); }

	beforeEach(function() {
		deleteAll();
	});

	it('counts', function() {
		expect(Scenes.count()).to.equal(0);
	});

	it('can delete all', function() {
		expect(deleteAll).not.to.throw();
	});

});
}
