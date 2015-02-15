'use strict';

angular.module('shaastraApp')
  .service('FormService', function FormService($http) {

    var formsJsonPath = './static-data/sample_forms.json';

    return {
        fields:[
            {
                name : 'Textfield',
                value : 'textfield'
            },
            {
                name : 'E-mail',
                value : 'email'
            },
            {
                name : 'Password',
                value : 'password'
            },
            {
                name : 'Radio Buttons',
                value : 'radio'
            },
            {
                name : 'Dropdown List',
                value : 'dropdown'
            },
            {
                name : 'Date',
                value : 'date'
            },
            {
                name : 'Text Area',
                value : 'textarea'
            },
            {
                name : 'Checkbox',
                value : 'checkbox'
            },
            {
                name : 'Hidden',
                value : 'hidden'
            }
        ],
        roles: [
            {
                name : 'All can view',
                value : 'All'
            },
            {
                name : 'Only cores can view',
                value : 'Cores'
            },
            {
                name : 'Only cores and coords can view',
                value : 'Cores_Coords'
            }
        ],
        form: function (id) {
            // $http returns a promise, which has a then function, which also returns a promise
            return $http.get(formsJsonPath).then(function (response) {
                var requestedForm = {};
                angular.forEach(response.data, function (form) {
                    if (form.form_id === id){
                        requestedForm = form;
                    }
                });
                return requestedForm;
            });
        },
        forms: function() {
            return $http.get(formsJsonPath).then(function (response) {
                return response.data;
            });
        }
    };
});
