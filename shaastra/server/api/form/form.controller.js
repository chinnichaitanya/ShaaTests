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

// Get a single form by id
exports.showById = function(req, res) {
	Form.findById(req.params.id, function (err, form) {
		if(err) { return handleError(res, err); }
		if(!form) { return res.send(404); }
		return res.json(form);
	});
};

// Get a form by category
exports.showByCategory = function(req, res) {
	// refer http://docs.mongodb.org/manual/tutorial/query-documents/#match-an-array-element
	// refer http://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value

	Form.find( {'form_category.0.value' : req.params.category}, function (err, form) {
		// console.log('params : ' + req.params.category);
		if(err) { return handleError(res, err); }
		if(!form[0]) { console.log('no form has been found!'); return res.send(404); }
		return res.json(form[0]);
	});
};

// Get filled form values of the user
exports.showValues = function(req, res) {
	var actualForm = new Object();
	Form.find( {'form_category.0.value' : req.params.category}, function (err, form) {
		if(err) { return handleError(res, err); }
		if(!form[0]) { 
			console.log('no form has been found!'); return res.send(404); 
		} else {
			// console.log(form);
			actualForm = form[0];
			var len = actualForm.form_responses.length;

//////////////////////// WHERE IS THE ERROR IN THIS ??? ////////////////////////////

			console.log(actualForm.form_responses[2][0].userId);
			console.log(req.user._id);
			
			for(var i=0; i<len; i++) {
				// refer http://stackoverflow.com/questions/11637353/comparing-mongoose-id-and-strings

				// if(actualForm.form_responses[i][0].userId.toString() === req.user._id.toString()) {
				if(actualForm.form_responses[i][0].userId.equals(req.user._id)) {
					console.log('compared');
					console.log(actualForm.form_responses[i][0]);
					return res.json(actualForm.form_responses[i][0]);
				} else {
					return res.json();
				}
			}						
		}

	});
};

// Create a new form in the db
exports.create = function(req, res) {
	var newForm = new Form(req.body); 
	var formDetails = req.body;
	
	// need to make alerts here after authenticating the details
	newForm.form_id = formDetails.formValues.form_id;
	newForm.form_name = formDetails.formValues.form_name;
	newForm.form_category = formDetails.formValues.form_category;
	if(formDetails.formValues.form_role.value) {
		newForm.form_role = formDetails.formValues.form_role.value;
	}
	newForm.form_fields = formDetails.formValues.form_fields;
	// console.log(formDetails.formValues.form_fields);
	newForm.save(function(err, form) {
		if(err) return validationError(res, err);
		else console.log('Form is saved successfully');
	});
};

exports.submitForm = function(req, res) {
	Form.findById(req.body.formId, function(err, form) {
		if(err) { return handleError(res, err); }
		if(!form) { 
			console.log('No form found!');
			return res.send('Error occurred!! Could not submit your response'); 
		} else {
			var len = form.form_responses.length;
			var old_user = false;

//////////////////////// NEED TO DO THIS UPDATE KA THING ////////////////////////////

			for(var i=0; i<len; i++) {

				console.log(form.form_responses[i][0].userId);
				console.log(req.user._id);
				// if(form.form_responses[i][0].userId === req.user._id) {	// this cmp is not working
				if(form.form_responses[i][0].userEmail === req.user.email) {	// this is working

					// storing the created date in some temporary variable as it gets over-written
					var createdDate = form.form_responses[i][0].responseCreatedOn;

					console.log('createdDate : ' + createdDate);
					console.log('i :' + i);
												
					// appending additional data about the user to formValues 
					req.body.formValues[0].userId = req.user._id;
					req.body.formValues[0].userName = req.user.name;
					req.body.formValues[0].userEmail = req.user.email;
					req.body.formValues[0].responseCreatedOn = Date.now();
					req.body.formValues[0].responseUpdatedOn = Date.now();
					
					form.form_responses[i][0] = req.body.formValues[0];

					console.log(req.body.formValues[0]);
					console.log(form.form_responses[i][0]);

					// updating the original response created date
					form.form_responses[i][0].responseCreatedOn = createdDate;
					
					// updating the form updated date
					form.updated_on = Date.now();

					form.update(
						{ 'form._id': req.body.formId },
						{
							$set: {
								'form_responses.$.0': req.body.formValues[0]
							}
						}, function(err) {
							console.log('error occurred');
							console.log(err);
						}
					)

					old_user = true;
				}
			}
			
			if(old_user === true) {
				console.log('Duplicate detected - successfully updated');
				return res.send('Updated successfully');
			} else {
				// console.log(req.user);
				req.body.formValues[0].userId = req.user._id;
				req.body.formValues[0].userName = req.user.name;
				req.body.formValues[0].userEmail = req.user.email;
				req.body.formValues[0].responseCreatedOn = Date.now();
				req.body.formValues[0].responseUpdatedOn = Date.now();
				
				// console.log(req.body.formValues);

				form.form_responses.push(req.body.formValues);
				form.updated_on = Date.now();

				// console.log('form_responses : ' + req.body.formValues);

				form.save(function(err, updatedForm) {
					if(err) return validationError(res, err);
					else console.log('Response noted successfully LOL');
				});
			}
		}
	});
};

// Deletes a form from the db
exports.destroy = function(req, res) {

};

function handleError(res, err) {
	return res.send(500, err);
}