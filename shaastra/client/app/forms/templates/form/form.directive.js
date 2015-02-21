'use strict';

angular.module('shaastraApp')
  .directive('formDirective', function () {
    return {
        controller: function($scope) {
            $scope.submit = function() {
                window.alert('Form submitted...');
                // window.console.log($scope);                
                $scope.form.submitted = true;
            };

            $scope.cancel = function() {
                window.alert('Form canceled...');
            };
        },
        templateUrl: 'app/forms/templates/form/form.html',
        restrict: 'E',
        scope: {
            form:'='
        }
    };
  });
