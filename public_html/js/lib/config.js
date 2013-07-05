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
