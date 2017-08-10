
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Locations } from '/imports/assets/locations.js';
import { Scenes } from '/imports/scenes.js';

if(Meteor.isServer) {

	describe('Locations', function() {

		function createLocation(name="test location") { 
			return Locations.$create({ name:name, sceneId:"1" })
		}

		beforeEach(function() {
			Locations.destroyAll();
		});

		it('can be created', function() {
			createLocation()
			expect(Locations.count()).to.equal(1)
		})

		it('belongs to a scene', function() {
			scene = Scenes.$create({name:"scene 1", scenarioId: "1"})
			loc = Locations.$create({name:"location 1", sceneId: scene._id})
			expect(scene.locations().count()).to.equal(1)
		});

	});

}

