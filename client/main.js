// import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '/node_modules/webix/webix.css'
import 'webix';
import 'webix-meteor-data';
import {Projects} from '/imports/projects.js';

const list_data = [
	{ id:1, value:'One'},
	{ id:2, value:'Two'},
	{ id:3, value:'Three'}
];

webix.ready(function() {
	webix.ui({
		rows:[
			{ view:'toolbar', elements: [
				{ view:'label', label:'Hey' },
				{ view:'button', id:'show_modal', label:'modal' }
			]},
			{ cols:[
				{ id:'list', view:'list', url:webix.proxy('meteor', Projects), template:'#name#', select:true, width: 250},
				{ view:'template', template:'webix' },
			]}
		]

	});
/*
	webix.ui({
		id:'modal1', view:'window', move:true, position:'center',
		head:{ view:'toolbar', elements:[ 
			{ view:'label', label:'Window1'}, 
			{ view:'button', label:'X', align:'right', autowidth: true, click:function() {$$('modal1').hide();  }  }
		]},
		body:{ template:'window !' }
	});

	$$('show_modal').attachEvent('onItemClick', function() { $$('modal1').show(); });
*/

	$$('list').attachEvent('onAfterLoad', function() { $$('list').select($$('list').getFirstId()); });
	$$('list').attachEvent('onItemClick', function(i) { webix.message(i); });


});

