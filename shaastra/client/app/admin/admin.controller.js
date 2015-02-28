'use strict';

angular.module('shaastraApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, FormService, DashService) {

    // // Use the User $resource to fetch all users
    // $scope.users = User.query();

    // $scope.delete = function(user) {
    //   User.remove({ id: user._id });
    //   angular.forEach($scope.users, function(u, i) {
    //     if (u === user) {
    //       $scope.users.splice(i, 1);
    //     }
    //   });
    // };

    // getting all the categories
    $scope.options = DashService.options;
    $scope.applying = '';

    $scope.changeTo = function(value) {
      $scope.applying = value;

// NEED TO OPTIMIZE THIS THING
      FormService.formValuesAll($scope.applying).then(function(responses) {
        // using responses.length because responses has one element if there are no responses for that form
        if(responses.length != 0) {
          // console.log('sssss');
          // console.log('responses below :');
          // console.log(responses);
          $scope.formResponses = responses;
        } else {
          // console.log('sdasdas');
          $scope.formResponses = [];
        }
      });
    };



  });
