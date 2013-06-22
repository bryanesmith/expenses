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
  $scope.timeAgo = function(datetime) {
    return moment(datetime, "YYYY-MM-DD hh:mm:ss").calendar();
  }

  // 
  $scope.getExpense = function(id) {

    for ( var i = 0; i < $scope.categoriesData.length; i++ ) {
      var category = $scope.categoriesData[i];

      if ( category['id'] === id ) {
        return category['category'];
      }
    }

    return '(unknown)';
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
