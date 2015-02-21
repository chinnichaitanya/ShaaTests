'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new Schema({
	form_id: String,
	form_name: String,
	form_role: {
		type: String,
		default: 'All'
	},
	form_fields: [],
	form_responses: []
});

module.exports = mongoose.model('Form', FormSchema);