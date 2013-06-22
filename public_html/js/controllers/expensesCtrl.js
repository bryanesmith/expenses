// Controller
var ExpensesController = function($scope, $http, ExpensesService, CategoriesService) {

  $scope.expensesData   = {};
  $scope.categoriesData = {};

  // 
  function getExpensesCallback( data ) {
    $scope.expensesData = data; 
  }

  // 
  function getCategoriesCallback( data ) {
    $scope.categoriesData = data;
  }

  // 
  function addExpenseCallback(response) {
    $scope.init(); 
  }

  //
  $scope.addExpense = function() {
    ExpensesService.addExpense($scope.expense, addExpenseCallback);
  };

  //
  $scope.init = function() {
    $scope.expense = {};

    // Set data
    var date = getCurrentDate();
    $scope.expense.date = date;

    // Get expenses
    ExpensesService.getExpenses(getExpensesCallback); 

    // Get categories
    CategoriesService.getCategories(getCategoriesCallback);
  };
};

