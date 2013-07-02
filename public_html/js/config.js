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
 * Rickshaw - 
 */
function rickshawInit() {
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
