// Check links and add onclick to Monero URIs:
function checkLinksOnPage() {
  var links_on_page = document.getElementsByTagName("a");
  for (var i = 0; i < links_on_page.length; i++) {  
    if (links_on_page[i].href.substring(0,7) == 'monero:') {
      links_on_page[i].onclick = function () { openSimplewalletSend(this.href); return false; }
    }
  }
}
checkLinksOnPage();

// Parses Monero URI and puts into wallet's Send tab and opens wallet:
function openSimplewalletSend(href) {
  var parsed_href = parseMoneroURI(href);
  var href_json = {
    address: parsed_href.address,
    amount: (parsed_href.hasOwnProperty("amount") ? parsed_href.amount : 0),
    payment_id: (parsed_href.hasOwnProperty("payment_id") ? parsed_href.payment_id : ""),
    mixin: (parsed_href.hasOwnProperty("mixin") ? parsed_href.mixin : 3)
  };
  
  var request = {greeting: "Monero Simplewallet Payment Request", href: href_json};
  chrome.runtime.sendMessage(request, function(resp) { console.log(resp); });
}

// Parse Monero URIs:
function parseMoneroURI(url) {
  var parsed = { url: url };
  var r = /^monero:([a-zA-Z0-9]{95})(?:\?(.*))?$/;
  var match = r.exec(url);
  if (!match) return null;

  if (match[2]) {
    var queries = match[2].split('&');
    for (var i = 0; i < queries.length; i++) {
      var query = queries[i].split('=');
      if (query.length == 2) {
        parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
      }
    }
  }

  parsed.address = match[1];
  return parsed;
}