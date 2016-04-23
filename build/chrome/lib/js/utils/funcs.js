function unixTimeToDate(timestamp){
  var a = new Date(timestamp * 1000);
  var months = [' Jan ',' Feb ',' Mar ',' Apr ',' May ',' Jun ',' Jul ',' Aug ',' Sep ',' Oct ',' Nov ',' Dec '];
  var yr = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hr = a.getHours();
  var min = '0' + a.getMinutes();
  var sec = '0' + a.getSeconds();
  var time = date+month+yr+', '+hr+':'+min.substr(-2)+':'+sec.substr(-2);
  return time;
}

function numberWithCommas(x) {
  var whole = x.split(".")[0];
  var decimal = x.split(".")[1];
  whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (decimal == undefined) {
    return whole;
  } else {
    return whole + '.' + decimal;
  }
  // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function coinsFromAtomic(atomic) {
  var digits = atomic.length;
  var coins = '';
  if (digits <= 12) {
    var decimal = '';
    for (var i = digits; i < 12; i++) decimal += '0';
    decimal += atomic;
    coins = '0.' + decimal;
  } else {
    coins = atomic.substring(0, digits-12)+'.'+atomic.substring(digits-12, digits);
  }
  return coins;
}

function coinsToAtomic(coins) {
  var whole = coins.split(".")[0];
  var decimal = coins.split(".")[1];
  if (decimal == undefined) decimal = '000000000000';
  for (var i = decimal.length; i < 12; i++) decimal += '0';
  var atomic = whole + decimal;
  return atomic;
}

function genRandomHexPayID (type) {
  var aaa;
  if (type == 'integrated') {
    aaa = new Uint32Array(2);
  } else {
    aaa = new Uint32Array(8);
  }
  var key = crypto.getRandomValues(aaa);
  var pay_id = '';
  for (var i=0; i<key.length; i++) {
    var hexString = key[i].toString(16);
    while (hexString.length < 8) { hexString = '0' + hexString; }
    pay_id += hexString;
  }
  return pay_id;
}

function deleteProperties(objectToClean) {
  for (var x in objectToClean) if (objectToClean.hasOwnProperty(x)) delete objectToClean[x];
}