'use strict';

var ViewCtrl = angular.module('shaastraApp').controller('ViewCtrl', function ($scope, FormService, $stateParams) {
    $scope.form = {};
	// read form with given id
	FormService.form($stateParams.id).then(function(form) {
		$scope.form = form;
	});
});
