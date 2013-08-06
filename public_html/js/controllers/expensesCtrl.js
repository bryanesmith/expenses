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

    // 
    // TODO: This is wrong for two reasons:
    //
    //    1. Re-registering event handler for $viewContentLoaded
    //       each time reset() is called
    //
    //    2. This event is not happening every time addExpense(...)
    //       is called.
    //
    // 
    //
    $scope.$on('$viewContentLoaded', function(){
      // Get daily summaries
      SummariesService.getDailySummaries(DailyGraph.update);
    });
  }

  //
  $scope.init = function() {

    $scope.reset();

    $scope.$on('$viewContentLoaded', function(){
      Init.run({ datepickerCallback: $scope.setDate });
      DailyGraph.clear(); // Reset DailyGraph so that it can be redrawn
    });

  };
};

