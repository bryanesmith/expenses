/*
 * Moment.js - http://momentjs.com/
 */
function momentJsInit() {
  var fullDate = 'L';
  moment.lang('en', {
    calendar : {
      lastDay : '[Yesterday]',
      sameDay : '[Today]',
      nextDay : '[Tomorrow]',
      lastWeek : fullDate,
      sameElse : fullDate
    }
  });
}

/*
 * Rickshaw - http://code.shutterstock.com/rickshaw/
 */
var DailyGraph = (function() {

  var my = {},
      graph = false;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function initGraph(categories) {

    if ( ! my.graph ) {
      my.graph = new Rickshaw.Graph( {
        element: document.querySelector("#daily-expense-chart .chart-container"),
        renderer: 'bar',
        padding: { top: .05 },
        series: categories 
      });

      my.graph.render();

      var yAxis = new Rickshaw.Graph.Axis.Y({
          graph: my.graph,
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT
      });

      yAxis.render();

      var hoverDetail = new Rickshaw.Graph.HoverDetail( {
          graph: my.graph,
          //xFormatter: function(x) {  },
          yFormatter: function(y) { return "$" + y }
      } );

    } // If not loaded
  } // initGraph

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function updateGraph(categories) {

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
    // Issue: https://github.com/shutterstock/rickshaw/issues/135
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
    //my.graph.configure({
    //  series: categories
    //});

    for (var i = 0; i < categories.length; i++) {
      my.graph.series[i] = categories[i];
    }

    my.graph.render();

  } // updateGraph

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handleUpdate(categories) {
    if ( ! my.graph ) {
      initGraph(categories); 
    } else {
      updateGraph(categories);
    }
  } // handleUpdate 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function prepareDailySummaryCategories(origCategories) {

    if ( origCategories.length == 0 ) {
      return null;
    }

    // Clone - http://davidwalsh.name/javascript-clone-array
    var categories = origCategories.slice(0);

    var colors = new Array( 'SlateGrey', 'steelblue', 'DarkSeaGreen', 'lightblue' );

    categories = categories.sort(function(a,b){return a.totalCost - b.totalCost}).reverse();

    if ( categories.length > 4 ) {
      // If greater than four, find greatest three values and sum the rest
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
      categories = _categories;
    }

    /*
     *  {
     *    data: [ { x: 0, y: 40 }, { x: 1, y: 55 }, { x: 2, y: 42  },  { x: 3, y:50  },  { x: 4, y: 39 },  { x: 5, y: 41 },  { x: 6, y: 34 } ],
     *    color: 'SlateGrey',
     *    name: 'Rent and utiltities'
     *  }
     */
    var catObjs = [];
    for (var i=0; i<categories.length; i++) {
      var cat = categories[i];
      var roundedCost = Math.round(parseFloat(cat.totalCost)); 
      var data = [];

      // TODO: need daily summaries for 'Other' category 
      if ( cat.dailyCosts ) {
        for (var j=0; j<cat.dailyCosts.length; j++) {
          var dailySummary = cat.dailyCosts[j];
          var cost = Math.round(parseFloat(dailySummary.cost));
          var datum = { x: j, y: cost }; 
          data.push( datum );
        }
      } else {
        for (var j=0; j<7; j++ ) {
          data.push( {x:j, y:5} );
        }
      }

      var catObj = {
        color: colors[i], 
        data: data,
        name: cat.category
      };
      catObjs.push( catObj );
    }

    return catObjs;

  } // prepareDailySummaryCategories

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  my.update = function( data ) {

    var categories = prepareDailySummaryCategories( data );

    if ( !categories ) {
      return;
    }

    handleUpdate(categories);

  }; // handleDailyExpenses

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  return my;

}()); // DailyGraph module

/**
 * JQuery UI Datepicker - 
 */
function datepickerInit( callback ) {
  $( "#inputDate" ).datepicker({
    onSelect: function(date) {
      callback( date );
    }
  });
}
