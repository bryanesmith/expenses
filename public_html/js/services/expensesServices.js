// Service
angular.module('expensesApp.service',['ngResource']).
  factory('Expenses', function($resource){
      return $resource('/api/expenses', {},{
          get: {method: 'GET', isArray:true}
      });
  }).factory('Categories', function($resource){
      return $resource('/api/categories', {}, {
          get: {method: 'GET', isArray:true}
      });
  });

