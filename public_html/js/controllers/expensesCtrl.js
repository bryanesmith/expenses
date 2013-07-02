// Controller
var ExpensesController = function($scope, $http, ExpensesService, CategoriesService, SummariesService) {

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
    var date = getCurrentDate();
    $scope.setDate( date );

    // Get expenses
    ExpensesService.getExpenses(getExpensesCallback); 

    // Get categories
    CategoriesService.getCategories(getCategoriesCallback);
  }

  //
  $scope.init = function() {

    $scope.reset();

    // Load vendor via config.js
    $(window).load(function() {
      rickshawInit();
      momentJsInit();
      datepickerInit( $scope.setDate );
    });

  };
};

