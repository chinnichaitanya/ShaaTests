'use strict';

angular.module('shaastraApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, FormService, DashService, socket) {

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

    // getting all the forms
    $scope.allForms = '';
    $scope.applying = '';
    $scope.message = '';

    FormService.formById(0).then(function(responses) {
      if(responses.length != 0) {
        $scope.allForms = responses;
        socket.syncUpdates('form', $scope.allForms);
      } else {
        $scope.allForms = '';
      }
    });


    // getting all the categories
    $scope.options = DashService.options;

    // changes the $scope.applying value and thereby search all the responses w.r.t category
    $scope.changeTo = function(value) {
      $scope.applying = value;
      $scope.formResponses = '';

// NEED TO OPTIMIZE THIS THING

// getting all the responses of a particular category
      FormService.formValuesAll($scope.applying).then(function(responses) {
        // using responses.length because responses has one element if there are no responses for that form
        if(responses.length != 0) {
          $scope.formResponses = responses;
        } else {
          $scope.formResponses = '';
        }
      });
    };

    // destroy a particular form
    $scope.destroy = function(id) {
      $http.post('/api/forms/delete', { del_id: id })
        .success(function(message) {
          $scope.message = message;
        })
        .error(function(message) {
          $scope.message = '';
        });
    }

    // removing all the messages in scope 
    $scope.closeAlert = function() {
      $scope.message = {};
    }

    $scope.$on('$destroy', function () {
      console.log('tee');
      socket.unsyncUpdates('form');
    });    

  });
