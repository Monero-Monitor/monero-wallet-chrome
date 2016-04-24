/* 
 * JavaScript for opening a new Send tab when a Monero URI is clicked.
 */
var send_href;

// Listen for a payment request to open a tab to send Monero to a Monero URI
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (request.greeting == "Monero Simplewallet Payment Request") {
    
    send_href = request.href;
    
    var send_tab = chrome.tabs.create({url: '/data/html/send.html'});
    
    sendResponse("Payment Request Received.");
  }
});

// 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (request.greeting == "Monero Simplewallet Fill Send Page") {
    sendResponse(send_href);
    deleteProperties(send_href);
  }
});