
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Characters } from '/imports/assets/characters.js';
import { Scenes } from '/imports/scenes.js';

describe('Characters', function() {

	function createCharacter(name="test character") { 
		return Characters.$create({name:name, sceneId:"1" })
	}

	beforeEach(function() { Characters.destroyAll() })

	it('can be created', function() {
		createCharacter()
		expect(Characters.count()).to.equal(1)
	});

	it('belongs to a scene', function() {
		scene = Scenes.$create({name:'scene1', description:'coucou', scenarioId:'1' })
		character = scene.$create_character({ name:'char1'});
		expect(character.scene()._id).to.equal(scene._id);
		scene.destroy();
	});

})
