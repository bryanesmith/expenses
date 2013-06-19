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

// Main module
angular.module('expensesApp',['expensesApp.service']);

// Controller
var ExpensesController = function($scope, $http, Expenses, Categories) {
  $scope.expensesData   = Expenses.get();
  $scope.categoriesData = Categories.get();
  $scope.addExpense     = function() {
    console.dir( $scope.expense );
    // TODO Use ngResource
    var expense = $scope.expense;
    $http.post('/api/expenses', expense).success(function() {
      $scope.init();
      $scope.expensesData   = Expenses.get();
    }).error(function() {
      alert('There was an error');
    });
  };
  $scope.init = function() {
    $scope.expense = {};
    var date = new Date().toJSON().slice(0,10);
    $scope.expense.date = date;
  };
};

