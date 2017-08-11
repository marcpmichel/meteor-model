// import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/node_modules/webix/webix.css'
import 'webix';
import 'webix-meteor-data';
//import '/lib/webix-meteor.js';
const Projects = new Meteor.Collection('projects'); // Projects.all(); 
const projects_proxy = webix.proxy('meteor', Projects);
// import {Projects} from '/imports/projects.js';


const ui = {};
ui.toolbar = { view:'toolbar', elements: [
				{ view:'label', label:'Hey' },
				{ view:'button', id:'show_modal', label:'modal', autowidth: true, align:'right' }
			]}

ui.list = { id:'list', view:'list', template:'#name#', select:true, width: 250,
	data: [
		{id:1, name:'one'},
		{id:2, name:'two'},
		{id:3, name:'three'}
	]
}

ui.form = { id:'form', view:'form', elements: [
	{view:'text', name:'name', label:'name' },
	{ cols: [
		{view:'button', label:'add', type:'form', id:'submit', autowidth: true },
		{}
	]},
	{}
]}

ui.content = { cols: [ ui.list, ui.form ]}
ui.layout = { rows:[ ui.toolbar, ui.content ] }


webix.ready(function() {
	webix.ui(ui.layout);
/*
	$$('show_modal').attachEvent('onItemClick', function() { $$('modal1').show(); });
*/
	// $$('list').load(webix.proxy('meteor', Projects));
	$$('list').load(projects_proxy)

	$$('list').attachEvent('onAfterLoad', function() {
		$$('list').select($$('list').getFirstId());
	});

	$$('list').attachEvent('onItemClick', function(id) { 
		webix.message( $$('list').getItem(id).name ); 
	});

	$$('submit').attachEvent('onItemClick', function() {
		const vals = $$('form').getValues();
		console.log(vals);
		Projects.insert(vals, function(err, res) {
			if(err) webix.error(err);
			else webix.message(res);
		});
	});

});

