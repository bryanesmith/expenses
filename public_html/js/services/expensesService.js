(function (angular, $, window) { 
  'use strict';

  var services = angular.module('expensesApp.expensesService', []);

  services.factory('ExpensesService', ['$http', function ($http) {
    return {

      getExpenses: function(callback) {
        $http.get("/api/expenses").success(function(response){
          callback(response);
        });
      },

      addExpense: function(expense, callback) {
        $http.post('/api/expenses', expense).success(function(response) {
          callback(response);
        }).error(function() {
          alert('There was an error');
        });
      }
    };
  }]);
}(angular, $, window));
