(function (angular, $, window) { 
  'use strict';

  var services = angular.module('expensesApp.expensesService', []);

  services.factory('ExpensesService', ['$http', function ($http) {
    return {

      getAllExpenses: function(callback) {
        $http.get("/http-api/expenses").success(function(response){
          callback(response);
        });
      },

      getExpenses: function(page, callback) {
        $http.get("/api.php?path=expenses&page=" + page).success(function(response){
          callback(response);
        });
      },

      getExpenseCount: function(callback) {
        $http.get("/http-api/count/expenses").success(function(response){
          callback(response);
        });
      },

      addExpense: function(expense, callback) {
        $http.post('/http-api/expenses', expense).success(function(response) {
          callback(response);
        }).error(function() {
          alert('There was an error');
        });
      },

      editExpense: function(expense, id, callback) {
        $http.put('/http-api/expenses/' + id, expense).success(function(response) {
          callback(response);
        }).error(function() {
          // Try workaround, PUT HTTP request might be filtered by server
          $http.post('/http-api/put/expenses/' + id, expense).success(function(response) { 
            callback(response);
          }).error(function() {
            alert('There was an error');
          });
        });
      },

      deleteExpense: function(id, callback) {
        $http.delete('/http-api/expenses/' + id).success(function(response) {
          callback(response);
        }).error(function() {
          // Try workaround, DELETE HTTP request might be filtered by server
          $http.post('/http-api/delete/expenses/' + id).success(function(response) { 
            callback(response);
          }).error(function() {
            alert('There was an error');
          });
        });
      }
    };
  }]);
}(angular, $, window));
