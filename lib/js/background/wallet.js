/*
 * JavaScript for monitoring wallet info in the background.
 */
var wallet_info = {
  port: '',
  address: '',
  balance: '--',
  unlockedBalance: '--',
  height: '--',
  status: "off"
};

// Listen for part of the extension requesting wallet info and reply:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (request.greeting == "Monero Simplewallet Send Wallet Info") {
    sendResponse(wallet_info);
  }
});

// Listen for extension changing the wallet port:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (request.greeting == "Monero Simplewallet Update Wallet Port") {
    wallet_info.port = request.newWalletPort;
    getAddress(wallet_info.port,
      function (resp) {
        wallet_info.address = resp.result.address;
      },
      function (err) {
        wallet_info.status = 'off';
      }
    );
    sendResponse("Wallet port updated.");
  }
});

// Get wallet status and address:
var get_status = function () {
  if (Number(wallet_info.port) >= 1 && Number(wallet_info.port) <= 65535) {
    getAddress(wallet_info.port,
      function (resp) {
        if (wallet_info.status == 'off') removeErrorBadge();
        wallet_info.status = 'ok';
        wallet_info.address = resp.result.address;
        setTimeout(get_status, 10000);
      },
      function (err) {
        wallet_info.status = 'off';
        addErrorBadge();
        setTimeout(get_status, 10000);
      }
    );
  } else {
    // If valid port hasn't been set, pause, then retry
    addErrorBadge();
    setTimeout(get_status, 10000);
  }
};

// Setup polling to check wallet height:
var get_height = function () {
  if (Number(wallet_info.port) >= 1 && Number(wallet_info.port) <= 65535 && wallet_info.status == 'ok') {
    getHeight(wallet_info.port,
      function (resp) {
        // Update height, pause, then check again
        wallet_info.height = resp.result.height;
        setTimeout(get_height, 5000);
      },
      function (err) {
        wallet_info.status = 'off';
        setTimeout(get_height, 5000);
      }
    );
  } else {
    // If valid port hasn't been set, pause, then retry
    setTimeout(get_height, 5000);
  }
};

// Setup polling to check wallet balance:
var get_balance = function () {
  if (Number(wallet_info.port) >= 1 && Number(wallet_info.port) <= 65535 && wallet_info.status == 'ok') {
    getBalance(wallet_info.port,
      function (resp) {
        var old_balance = wallet_info.balance;
        // Update balance, pause, then check again
        wallet_info.balance = coinsFromAtomic(resp.result.balance.toString());
        wallet_info.unlockedBalance = coinsFromAtomic(resp.result.unlocked_balance.toString());
        
        if (old_balance != wallet_info.balance) {
          updateBadge();
        }
        setTimeout(get_balance, 5000);
      },
      function (err) {
        wallet_info.status = 'off';
        setTimeout(get_balance, 5000);
      }
    );
  } else {
    // If valid port hasn't been set, pause, then retry
    if (wallet_info.status == 'ok') {
      chrome.runtime.openOptionsPage();
    }
    setTimeout(get_balance, 5000);
  }
};

function updateBadge() {
  chrome.browserAction.setBadgeBackgroundColor({color: '#FC6622'});
  chrome.browserAction.setBadgeText({text:'!'});
}

function addErrorBadge() {
  chrome.browserAction.setBadgeBackgroundColor({color: '#DD3333'});
  chrome.browserAction.setBadgeText({text:'X'});
}

function removeErrorBadge() {
  chrome.browserAction.setBadgeText({text:''});
}

// Monitor wallet info from storage and json_rpc:
function monitorWalletInfo() {
  chrome.storage.sync.get({
    walletPort: ''
  }, function(items) {
    wallet_info.port = items.walletPort;
    
    // If port is not set, launch the start menu
    if (wallet_info.port == undefined || wallet_info.port == "") {
      chrome.storage.sync.set({
        walletPort: 18082
      },
      function() {
        var start_tab = chrome.tabs.create({url: '/data/html/start.html'});
      });
    }
    
    // Start wallet info polling:
    get_status();
    get_balance();
    get_height();
  });
}

monitorWalletInfo();

