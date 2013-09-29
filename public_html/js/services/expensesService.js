(function (angular, $, window) { 
  'use strict';

  var services = angular.module('expensesApp.expensesService', []);

  services.factory('ExpensesService', ['$http', function ($http) {
    return {

      getAllExpenses: function(callback) {
        $http.get("/api/expenses").success(function(response){
          callback(response);
        });
      },

      getExpenses: function(page, callback) {
        $http.get("/api.php?path=expenses&page=" + page).success(function(response){
          callback(response);
        });
      },

      getExpenseCount: function(callback) {
        $http.get("/api/count/expenses").success(function(response){
          callback(response);
        });
      },

      addExpense: function(expense, callback) {
        $http.post('/api/expenses', expense).success(function(response) {
          callback(response);
        }).error(function() {
          alert('There was an error');
        });
      },

      deleteExpense: function(id, callback) {
        $http.delete('/api/expenses/' + id).success(function(response) {
          callback(response);
        }).error(function() {
          // Try workaround, DELETE HTTP request might be filtered by server
          $http.post('/api/delete/expenses/' + id).success(function(response) { 
            callback(response);
          }).error(function() {
            alert('There was an error');
          });
        });
      }
    };
  }]);
}(angular, $, window));
