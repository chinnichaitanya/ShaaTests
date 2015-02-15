'use strict';

angular.module('shaastraApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('formsCreate', {
        url: '/forms/create',
        templateUrl: 'app/forms/create/create.html',
        controller: 'CreateCtrl'
      })
      .state('formsView', {
        url: '/forms/:id/view',
        templateUrl: 'app/forms/view/view.html',
        controller: 'ViewCtrl'
      });      
  });