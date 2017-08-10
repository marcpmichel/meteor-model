import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Scenes } from '/imports/scenes.js';

if(Meteor.isServer) {

describe('Scenes', function() {

	function createScene(name="test scene") { 
		return Scenes.$create({name: name, scenarioId: "1"}) 
	}
	function destroyAll() { Scenes.destroyAll() }

	beforeEach(function() {
		destroyAll()
	})

	it('counts', function() {
		expect(Scenes.count()).to.equal(0)
	})

	it('can delete all', function() {
		expect(destroyAll).not.to.throw()
	})

	it('can be created', function() {
		expect(createScene).not.to.throw()
	})

	it('has many dialogs', function() {
		const scene = createScene()
		scene.$create_dialog({ name:"test dialog 1" })
		scene.$create_dialog({ name:"test dialog 2" })
		expect(scene.dialogs().count()).to.equal(2)
	})

	it('has child scenes', function() {
		const scene = createScene()
		const child1 = createScene('child scene 1');
		scene.attach(child1);
		const child2 = createScene('child scene 2');
		scene.attach(child2);
		expect(scene.children().count()).to.equal(2);
	})

})
}

