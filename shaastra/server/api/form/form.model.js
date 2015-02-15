'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new Schema({
	formId: String,
	formName: String,
	role: {
		type: String,
		default: 'All'
	},
	fields: []
});

module.exports = mongoose.model('Form', FormSchema);