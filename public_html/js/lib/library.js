var Library = function() {

  /*
   * Return current date in format MM/DD/YYYY
   *
   * Source: http://stackoverflow.com/a/6982840
   */
  function getCurrentDate() {
    var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();
    if(month < 10) 
        month = "0" + month;
    if(day < 10) 
        day = "0" + day;
    //return now.getFullYear() + '-' + month + '-' + day;
    return month + '/' + day + '/' + now.getFullYear();
  }

  /*
   * For stubed functionality, call this function to notify user.
   */
  function notImplemented() {
    alert("Not implemented"); 
    return false;
  }

  /*
   * Public members.
   */
  return {
    notImplemented: notImplemented,
    getCurrentDate: getCurrentDate
  };

}();
