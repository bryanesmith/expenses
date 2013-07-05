var Init = function() {

  /*
   * Moment.js - http://momentjs.com/
   */
  function momentJS() {
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
  function datepicker( callback ) {
    $( "#inputDate" ).datepicker({
      onSelect: function(date) {
        callback( date );
      }
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  return {
    datepicker: datepicker,
    momentJS: momentJS
  };

}(); // Init module

