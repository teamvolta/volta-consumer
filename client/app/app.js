angular.module('consumer',[
  'dashboard',
  'ngRoute'
])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/dashboard', {
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardController'
    })
    .otherwise({
      redirectTo: '/'
    })
}])