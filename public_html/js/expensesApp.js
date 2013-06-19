// Source: http://stackoverflow.com/a/6982840
function getCurrentDate() {
  var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if(month < 10) 
      month = "0" + month;
  if(day < 10) 
      day = "0" + day;
  return now.getFullYear() + '-' + month + '-' + day;
}

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
    //var date = new Date().toJSON().slice(0,10);
    var date = getCurrentDate();
    $scope.expense.date = date;
  };
};

