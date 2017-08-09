import { Meteor } from 'meteor/meteor';
import { Projects } from '/imports/projects.js';

Meteor.startup(() => {
  // code to run on server at startup
	if(Projects.all().count() ==  0) {
		Projects.create({name:"project 1"});
		Projects.create({name:"project 2"});
		Projects.create({name:"project 3"});
		Projects.create({name:"project 4"});
	}
});

