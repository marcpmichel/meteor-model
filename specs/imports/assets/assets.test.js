
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Assets } from '/imports/assets/assets.js';
import { Dialogs } from '/imports/assets/dialogs.js';

if(Meteor.isServer) {

describe('Assets', function() {

	function createAsset() { return Assets.$create({name:"asset1"}) }
	function createDialog() { return Dialogs.$create({name:"asset1", sceneId:"1" }) }

	beforeEach(function() {
		Assets.destroyAll()
	});

	describe('basics', function() {
		it('creates', function() {
			createAsset()
			expect(Assets.count()).to.equal(1)
		});

		it('destroys', function() {
			const asset = createAsset()
			expect(Assets.count()).to.equal(1)
			asset.destroy()
			expect(Assets.count()).to.equal(0)
		})
	});

	describe('inheritance', function() {
		it('is inheritable', function() {
			createAsset()
			expect(Assets.count()).to.equal(1)
			createDialog()
			expect(Assets.count()).to.equal(2)
			expect(Dialogs.count()).to.equal(1)
			Dialogs.destroyAll()
			expect(Assets.count()).to.equal(1)
		});

	});

})

}


