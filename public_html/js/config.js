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
 *
 */
function handleDailyExpenses(data) {
  var categories = prepareDailySummaryCategories( data );

  if ( !categories ) {
    return;
  }

  dailySummaryGraphInit(categories);
}

/*
 *
 */
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
    var otherCost = 0;
    for ( var i=0; i<categories.length; i++ ) {
      otherCost += categories[i].totalCost; 
    }
    _categories.push({ cost: otherCost, category: 'Other' });
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
}

/*
 * Rickshaw - 
 */
//function rickshawInit() {
function dailySummaryGraphInit(categories) {

  /*
  var graph = new Rickshaw.Graph( {
    element: document.querySelector("#daily-expense-chart .chart-container"),
    renderer: 'bar',
    padding: { top: .05 },
    series: [{
      data: [ { x: 0, y: 40 }, { x: 1, y: 55 }, { x: 2, y: 42  },  { x: 3, y:50  },  { x: 4, y: 39 },  { x: 5, y: 41 },  { x: 6, y: 34 } ],
      color: 'SlateGrey',
      name: 'Rent and utiltities'
    }, {
      data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 22 },  { x: 3, y: 12 },  { x: 4, y: 22 },  { x: 5, y: 23 },  { x: 6, y: 17 } ],
      color: 'steelblue',
      name: 'Groceries'
    }, {
      data: [ { x: 0, y: 12 }, { x: 1, y: 12 }, { x: 2, y: 13 },  { x: 3, y: 13 },  { x: 4, y: 12 },  { x: 5, y: 8 },  { x: 6, y: 7 } ],
      color: 'DarkSeaGreen',
      name: 'Household'
    }, {
      data: [ { x: 0, y: 25 }, { x: 1, y: 16 }, { x: 2, y: 36 },  { x: 3, y: 47 },  { x: 4, y: 25 },  { x: 5, y: 16 },  { x: 6, y: 36 } ],
      color: 'lightblue',
      name: 'Other'
    }

    ]
  });
  */

  var graph = new Rickshaw.Graph( {
    element: document.querySelector("#daily-expense-chart .chart-container"),
    renderer: 'bar',
    padding: { top: .05 },
    series: categories
  });
 
  graph.render();

  var yAxis = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT
  });

  yAxis.render();

  var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph,
      //xFormatter: function(x) {  },
      yFormatter: function(y) { return "$" + y }
  } );
}

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
