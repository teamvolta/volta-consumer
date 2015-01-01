angular.module('consumer',[
  'consumer.services',
  'dashboard',
  'ui.router'
])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('dashboard', {
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController',
      url: '/dashboard'
    });
    
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  }); 
}]);