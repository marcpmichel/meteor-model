
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Dialogs } from '/imports/dialogs.js';
import { Scenes } from '/imports/scenes.js';

if(Meteor.isServer) {

describe('Dialogs', function() {

	function deleteAll() { Dialogs.deleteAll(); }

	beforeEach(function() {
		deleteAll();
	});

	it('counts', function() {
		expect(Dialogs.count()).to.equal(0);
	});

	it('is created', function() {
		const dialog = Dialogs.$create({name:'toto'});
		expect(Dialogs.count()).to.equal(1);
	});

	it('can delete all', function() {
		expect(deleteAll).not.to.throw();
	});

	it('belongs to a scene', function() {
		scene = Scenes.$create({name:'scene1', description:'coucou', scenarioId:"1"});
		dialog = scene.$create_dialog({name:"dialog1", data:""});
		console.log(dialog, dialog.scene(), scene);
		expect(dialog.scene()._id).to.equal(scene._id);
		scene.destroy();
	});

});
}
