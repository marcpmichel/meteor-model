
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Assets } from '/imports/assets/assets.js';


if(Meteor.isServer) {

describe('Assets', function() {

	function createAsset() { return Assets.$create({name:"asset1"}) }

	beforeEach(function() {
		Assets.deleteAll()
	});
	
	it('creates', function() {
		createAsset()
		expect(Assets.count()).to.equal(1)
	});

	it('destroys', function() {
		const asset = createAsset()
		expect(Assets.count()).to.equal(1);
		asset.destroy();
		expect(Assets.count()).to.equal(0);
	})

})
 
}


