angular.module('consumer',[
  'dashboard',
  // 'ngRoute'
  'ui.router'
])

.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");

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
}])

// .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//   $routeProvider
//     .when('/dashboard', {
//       templateUrl: 'app/dashboard/dashboard.html',
//       controller: 'DashboardController'
//     })
//     .otherwise({
//       redirectTo: '/'
//     });
//   $locationProvider.html5Mode({
//     enabled: true,
//     requireBase: false
//   });
// }])