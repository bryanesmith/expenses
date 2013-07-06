/*
 * Rickshaw - http://code.shutterstock.com/rickshaw/
 */
var DailyGraph = function() {

  var graph  = false,
      colors = new Array( 'SlateGrey', 'steelblue', 'DarkSeaGreen', 'lightblue' );

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function createGraph( categories ) {
    return new Rickshaw.Graph( {
      element: document.querySelector("#daily-expense-chart .chart-container"),
      renderer: 'bar',
      padding: { top: .05 },
      series: categories 
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function createYAxis() {
    return new Rickshaw.Graph.Axis.Y({
      graph: graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function createHoverDetail() {
    return new Rickshaw.Graph.HoverDetail( {
      graph: graph,
      //xFormatter: function(x) {  },
      yFormatter: function(y) { return "$" + y }
    } );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function clear() {
    graph = false;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function initGraph(categories) {
    if ( ! graph ) {
      graph = createGraph( categories );
      graph.render();

      var yAxis = createYAxis();
      yAxis.render();

      var hoverDetail = createHoverDetail();

    } // If not loaded
  } // initGraph

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function updateGraph(categories) {

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
    // Issue: https://github.com/shutterstock/rickshaw/issues/135
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
    //graph.configure({
    //  series: categories
    //});

    for (var i = 0; i < categories.length; i++) {
      graph.series[i] = categories[i];
    }

    graph.render();

  } // updateGraph

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handleUpdate(categories) {
    if ( !graph ) {
      initGraph(categories); 
    } else {
      updateGraph(categories);
    }
  } // handleUpdate 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  // Picks top categories, and sums up all others as 'Misc' category
  function pickTopCategories(categories) {
    var _categories = new Array();
    for (var i=0; i<3; i++) {
      _categories.push(categories.shift()); 
    }
    var otherTotalCost = 0;
    var otherDailyCosts = new Array();
    for ( var i=0; i<categories.length; i++ ) {
      var cat = categories[i];
      otherTotalCost += cat.totalCost; 
      for ( var j=0; j<cat.dailyCosts.length; j++ ) {
        var dailyExpense = cat.dailyCosts[j];
        var otherDailyExpense = otherDailyCosts[j]; 
        if ( !otherDailyExpense ) {
          otherDailyExpense = { date: dailyExpense.date, cost: 0 };
          otherDailyCosts[j] = otherDailyExpense;
        }
        otherDailyExpense.cost += dailyExpense.cost;
      }
    }
    _categories.push({ totalCost: otherTotalCost, dailyCosts: otherDailyCosts, category: 'Other' });
    return _categories;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -   
  function sortCategories( categories ) {
    return categories.sort(function(a,b){return a.totalCost - b.totalCost}).reverse();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  /*
   * Convert from: 
   * [
   *   {
   *     "id": "1",
   *     "category": "Groceries",
   *     "totalCost": "0",
   *     "dailyCosts": [
   *       { "cost":"XX.XX", "date":"YYYY-MM-DD 00:00:00" }, // Day 1
   *       ...
   *       { "cost":"XX.XX", "date":"YYYY-MM-DD 00:00:00" }  // Day 7
   *   },
   *   // Other categories
   * ]
   *
   * To: 
   * [
   *   {
   *     data: [ { x: 0, y: XX.XX }, ..., { x: 6, y: XX.XX } ],
   *     color: 'SlateGrey',
   *     name: 'Groceries'
   *   }, 
   *   // Other categories
   * ]
   */
  function convertServiceDataToSeries( categories ) {

    var catObjs = [];

    for (var i=0; i<categories.length; i++) {
      var cat = categories[i];
      var data = [];

      for (var j=0; j<cat.dailyCosts.length; j++) {
        var dailySummary = cat.dailyCosts[j];
        var cost = Math.round(parseFloat(dailySummary.cost));
        data.push({ x: j, y: cost });
      }

      catObjs.push({
        color: colors[i], 
        data: data,
        name: cat.category
      });
    }

    return catObjs;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function prepareDailySummaryCategories(origCategories) {

    if ( origCategories.length == 0 ) {
      return null;
    }

    // Clone - http://davidwalsh.name/javascript-clone-array
    var categories = origCategories.slice(0);


    categories = sortCategories( categories );

    if ( categories.length > 4 ) {
      categories = pickTopCategories(categories);
    }

    return convertServiceDataToSeries( categories );

  } // prepareDailySummaryCategories

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function update( data ) {

    var categories = prepareDailySummaryCategories( data );

    if ( !categories ) {
      return;
    }

    handleUpdate(categories);

  }; // handleDailyExpenses

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  return {
    clear: clear,
    update: update  
  };

}(); // DailyGraph module


