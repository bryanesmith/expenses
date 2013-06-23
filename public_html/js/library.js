// Source: http://stackoverflow.com/a/6982840
function getCurrentDate() {
  var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if(month < 10) 
      month = "0" + month;
  if(day < 10) 
      day = "0" + day;
  return now.getFullYear() + '-' + month + '-' + day;
}

//
function notImplemented() {
  alert("Not implemented"); 
  return false;
}

