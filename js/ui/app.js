var app = angular.module('facebook-archive-scrapper', ['ngMaterial', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/', '/landing');
  $urlRouterProvider.when('', '/landing');

  $stateProvider
    .state('landing', {
      url: '/landing',
      templateUrl: './../view/landing.html'
    })
    .state('allProfiles', {
      url: '/all-profiles',
      templateUrl: './../view/all-profile.html'
    });
});

app.directive('genderOutput', function () {
  return {
    restrict: 'E',
    templateUrl: './../view/gender-output.html',
    scope: {
      gender: '='
    }
  };
});

app.directive('variableOutput', function () {
  return {
    restrict: 'E',
    templateUrl: './../view/variable-output.html',
    scope: {
      label: '@',
      value: '='
    }
  };
});

app.directive('arrayDialog', ($mdDialog) => {
  return {
    restrict: 'E',
    templateUrl: './../view/array-dialog.html',
    scope: {
      arrayValues: '=',
      dialogTitle: '@'
    },
    link: linkFunc
  };

  function linkFunc(scope) {
    scope.openDialog = function (event) {
      scope.arrayValues = scope.arrayValues;
      let modalObj = {
        scope: scope,
        templateUrl: './../view/modals/array-modal.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        preserveScope: true
      };
    
      $mdDialog.show(modalObj).then(angular.noop).finally(angular.noop);
      scope.cancel = $mdDialog.cancel;
    };
  }
});

app.controller('IndexController', function ($scope, $http) {
  $http.get('./../gender.json')
    .then(resp => {
      $scope.totalProfilesCount = resp.data.totalProfilesCount;
      $scope.male = resp.data.male;
      $scope.female = resp.data.female;
      $scope.unknown = resp.data.unknown;
      $scope.isError = false;
    }).catch(error => {
      $scope.isError = true;
      $scope.isGenderJSONError = false;
    });
});

app.controller('AllProfileController', function ($scope, $http, $mdDialog) {
  $scope.objKeys = Object.keys;
  $http.get('./../master.json')
    .then(resp => {
      $scope.allProfiles = resp.data;
      $scope.isError = false;
    }).catch(error => {
      $scope.isError = true;
      $scope.isMasterJSONError = true;
    });

  $scope.openFriendsDialog = (event, object) => {
    $scope.friendsObject = object;
    $scope.modalTitle = 'List of Friends';
    let modalObj = {
      scope: $scope,
      templateUrl: './../view/modals/friends-modal.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      preserveScope: true
    };
  
    $mdDialog.show(modalObj).then(angular.noop).finally(angular.noop);
    $scope.cancel = $mdDialog.cancel;
  };

  $scope.openVideoPhotoDialog = (event, object, type) => {
    $scope.videoPhotoObject = object;
    $scope.type = type;
    let modalObj = {
      scope: $scope,
      templateUrl: './../view/modals/video-photos-modal.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true,
      preserveScope: true
    };
  
    $mdDialog.show(modalObj).then(angular.noop).finally(angular.noop);
    $scope.cancel = $mdDialog.cancel;
  };
});