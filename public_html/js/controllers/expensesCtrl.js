// Controller
var ExpensesController = function($scope, $http, $window, $location, $routeParams, ExpensesService, CategoriesService, SummariesService) {

  $scope.expensesData   = {};
  $scope.categoriesData = {};
  var page = parseInt( $routeParams.page );
  $scope.current = {
    page: page
  };
  $scope.selected = {
    page: page
  };
  $scope.count = {
    expenses: 0,
    pages: {
      expenses: 0
    }
  };

  //
  $scope.timeAgo = function(datetime) {
    return moment(datetime, "YYYY-MM-DD hh:mm:ss").calendar();
  }

  //
  $scope.goToPage = function() {
    $location.path( '/expenses/' + $scope.selected.page );
  }

  // If five pages, then returns [ 0, 1, ..., 4 ]
  $scope.expensePages = function() {
    var pages = [];
    for(var i=0; i<$scope.count.pages.expenses; i++) {
      pages.push(i);
    }
    return pages;
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
    ExpensesService.addExpense($scope.expense, function() { 
      $scope.reset(); 
    });
  };

  //
  $scope.deleteExpense = function(id) {
    var rm = confirm("Really delete this expense? (Cannot be undone.)");
    if (rm == true) {
      ExpensesService.deleteExpense(id, function() {
        $scope.reset(); 
      });
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
    ExpensesService.getExpenses($scope.current.page, function( data ) {
      $scope.expensesData = data;    
    }); 

    ExpensesService.getExpenseCount(function( data ) {

      var count = parseInt( data.expenses );
      $scope.count.expenses = count;    

      // TODO: parameterize or set somewhere so shared with server-side logic
      var page_size = 50;
      var pages = Math.ceil( count / page_size );
      $scope.count.pages.expenses = pages;
    });

    // Get categories
    CategoriesService.getCategories(function(data) {
      $scope.categoriesData = data;
    });

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

