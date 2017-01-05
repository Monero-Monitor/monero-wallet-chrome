/*
 * JavaScript for opening a new Send tab when a Monero URI is clicked.
 */
var send_href;

// Listen for a payment request to open a tab to send Monero to a Monero URI
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greeting == "Monero monero-wallet-rpc Payment Request") {
    send_href = request.href;
    var send_tab = chrome.tabs.create({url: '/data/html/send.html'});
    sendResponse("Payment Request Received.");
  } else if (request.greeting == "Monero monero-wallet-rpc Fill Send Page" &&
      sender.tab.url === "chrome-extension://" + chrome.runtime.id + "/data/html/send.html") {
    sendResponse(send_href);
    deleteProperties(send_href);
  }
});
