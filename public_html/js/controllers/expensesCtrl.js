// Controller
var ExpensesController = function($scope, $http, $window, ExpensesService, CategoriesService, SummariesService) {

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
    $scope.reset(); 
  }

  // 
  function deleteExpenseCallback(response) {
    $scope.reset(); 
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
  $scope.deleteExpense = function(id) {
    var rm = confirm("Are you sure you want to delete this? (Cannot be undone.)");
    if (rm == true) {
      ExpensesService.deleteExpense(id, deleteExpenseCallback);
    }
  }

  //
  $scope.setDate = function(date) {
    $scope.expense.date = date;
  }

  // 
  $scope.reset = function() {

    $scope.expense = {};

    // Set data
    var date = Library.getCurrentDate();
    $scope.setDate( date );

    // Get expenses
    ExpensesService.getExpenses(getExpensesCallback); 

    // Get categories
    CategoriesService.getCategories(getCategoriesCallback);

    // Get daily summaries
    SummariesService.getDailySummaries(DailyGraph.update);
  }

  //
  $scope.init = function() {
    Init.run({ datepickerCallback: $scope.setDate });
    DailyGraph.clear(); // Reset DailyGraph so that it can be redrawn
    $scope.reset();
  };
};

