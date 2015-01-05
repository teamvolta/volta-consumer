angular.module('consumer',[
  'consumer.filters',
  'consumer.services',
  'consumer.directives',
  'dashboard',
  'controls',
  'usage',
  'market',
  'transactions',
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
      })
      .state('controls', {
        templateUrl: 'app/controls/controls.html',
        controller: 'controlsController',
        url: '/controls'
      })
      .state('usage', {
        templateUrl: 'app/usage/usage.html',
        controller: 'usageController',
        url: '/usage'
      })
      .state('market', {
        templateUrl: 'app/market/market.html',
        controller: 'marketController',
        url: '/market'
      })
      .state('transactions', {
        templateUrl: 'app/transactions/transactions.html',
        controller: 'transactionsController',
        url: '/transactions'
      });
      
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
])
.run(['$rootScope', function($rootScope) {
  $rootScope.sockectOn = false;
  $rootScope.data;

  console.log($rootScope.sockectOn, $rootScope.data);
}])