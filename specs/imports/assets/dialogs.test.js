
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Dialogs } from '/imports/assets/dialogs.js';
import { Scenes } from '/imports/scenes.js';

if(Meteor.isServer) {

describe('Dialogs', function() {

	function createDialog(name="test dialog") { return Dialogs.$create({name:name, sceneId:"1"}) }
	function destroyAll() { Dialogs.destroyAll() }

	beforeEach(function() {
		destroyAll()
	})

	it('counts', function() {
		expect(Dialogs.count()).to.equal(0)
	})

	it('is created', function() {
		const dialog = Dialogs.$create({name:'toto', sceneId:"1"})
		expect(Dialogs.count()).to.equal(1)
	})

	it('can delete all', function() {
		expect(destroyAll).not.to.throw()
	})

	it('belongs to a scene', function() {
		scene = Scenes.$create({name:'scene1', description:'coucou', scenarioId:"1"})
		dialog = scene.$create_dialog({name:"dialog1", data:""})
		expect(dialog.scene()._id).to.equal(scene._id)
		scene.destroy()
	})

	it('has children', function() {
		dialog = createDialog()
		child1 = createDialog("child dialog 1")
		dialog.attach(child1)
		child2 = createDialog("child dialog 2")
		dialog.attach(child2)
		expect(dialog.children().count()).to.equal(2)
	})

})
}
