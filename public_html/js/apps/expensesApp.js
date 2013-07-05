(function() {

  // Main module
  angular.module('expensesApp',['expensesApp.expensesService', 'expensesApp.categoriesService', 'expensesApp.summariesService']).
    config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when( '/expenses', {templateUrl: 'partials/expenses.html', controller: ExpensesController }).
        when( '/finances', {templateUrl: 'partials/finances.html' }).
        when( '/categories', {templateUrl: 'partials/categories.html' }).
        when( '/recurring-expenses', {templateUrl: 'partials/recurring-expenses.html' }).
        otherwise({redirectTo: '/expenses'});
    }]);

}())
