(function (angular, $, window) { 
  'use strict';

  var services = angular.module('expensesApp.summariesService', []);

  services.factory('SummariesService', ['$http', function ($http) {
    return {

      getDailySummaries: function(callback) {
        $http.get("/api/summaries/daily").success(function(response){
          callback(response);
        });
      }

    };
  }]);
}(angular, $, window));
