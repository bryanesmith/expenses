(function (angular, $, window) { 
  'use strict';

  var services = angular.module('expensesApp.categoriesService', []);

  services.factory('CategoriesService', ['$http', function ($http) {
    return {

      getCategories: function(callback) {
        $http.get("/api/categories").success(function(response){
          callback(response);
        });
      }
    };

  }]);
}(angular, $, window));
