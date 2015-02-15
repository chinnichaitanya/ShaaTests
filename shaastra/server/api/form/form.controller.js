/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Form = require('./form.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

// Get the list of forms
exports.index = function(req, res) {
	Form.find(function (err, forms) {
		if(err) { return handleError(res, err); }
		return res.json(200, forms);
	});
};	

// Get a single form
exports.show = function(req, res) {
	Form.findById(req.params.id, function (err, form) {
		if(err) { return handleError(res, err); }
		if(!form) { return res.send(404); }
		return res.json(form);
	});
};

// Create a new form in the db
exports.create = function(req, res) {
	var newForm = new Form(req.body); 
	var formDetails = req.body;
	newForm.formId = formDetails.formValues.form_id;
	newForm.formName = formDetails.formValues.form_name;
	newForm.role = formDetails.formValues.form_role.value;
	newForm.fields = formDetails.formValues.form_fields;
	// console.log(formDetails.formValues.form_fields);
	newForm.save(function(err, form) {
		if(err) return validationError(res, err);
		else console.log('Form saved');
	});
};

// Deletes a form from the db
exports.destroy = function(req, res) {

};

function handleError(res, err) {
	return res.send(500, err);
}