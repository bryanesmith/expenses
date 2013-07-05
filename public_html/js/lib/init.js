var Init = function() {

  var datepickerCallback = function(){};

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
  function datepicker() {
    $( "#inputDate" ).datepicker({
      onSelect: function(date) {
        datepickerCallback( date );
      }
    });
  }

  /**
   * Loads user-specified options.
   */
  function loadOptions( options ) {
    if ( options.hasOwnProperty('datepickerCallback') ) {
      datepickerCallback = options.datepickerCallback;
    }
  }

  /**
   * Initialize everything. Accepts object argument with the following properties:
   *  - datepickerCallback: callback that accepts date whenever datepicker is selected by user.
   */
  function run(options) {

    loadOptions( options ); 

    // Run initializations here
    datepicker();
    momentJS();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  return {
    run: run 
  };

}(); // Init module

