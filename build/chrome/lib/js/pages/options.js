document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById('save').addEventListener('click', save_options);
  // document.getElementById('clear').addEventListener('click', clear_storage);
});

function save_options() {
  // Read settings from Options pop-up box:
  var walletPort = String(document.getElementById('monero-wallet-cli-port').value);
  var saveUserAgent = false, userAgent = '';
  if (document.getElementById('options-save-user-agent').checked) {
    var saveUserAgent = true;
    var userAgent = String(document.getElementById('options-user-agent').value);
  }
  // Save options in Chrome storage:
  if (Number(walletPort) >= 1 && Number(walletPort) <= 65535) {
    chrome.storage.sync.set({
      walletPort: walletPort,
      saveUserAgent: saveUserAgent,
      userAgent: userAgent
    }, function() {
      var status = document.getElementById('status');
      updateWalletInfo(walletPort, saveUserAgent, userAgent);
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  } else {
    var status = document.getElementById('status');
    chrome.storage.sync.set({
      walletPort: '18082',
      saveUserAgent: saveUserAgent,
      userAgent: userAgent
    }, function() {
      var status = document.getElementById('status');
      updateWalletInfo(walletPort, saveUserAgent, userAgent);
      document.getElementById('monero-wallet-cli-port').value = 18082;
      status.textContent = 'Options saved. Port invalid... set to 18082.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });


    setTimeout(function() {
      status.textContent = '';
      save_options();
    }, 2000);
  }
}

function restore_options() {
  // Get saved options from Chrome storage:
  chrome.storage.sync.get({
    walletPort: '',
    saveUserAgent: false,
    userAgent: ''
  }, function(items) {
    document.getElementById('monero-wallet-cli-port').value = items.walletPort;
    document.getElementById('options-save-user-agent').checked = items.saveUserAgent;
    document.getElementById('options-user-agent').value = items.userAgent;
  });
}

function clear_storage() {
  // Clear all saved options in Chrome storage:
  chrome.storage.sync.clear( function() {
    var status = document.getElementById('status')
    document.getElementById('monero-wallet-cli-port').value = '';
    document.getElementById('options-save-user-agent').checked = false;
    status.textContent = 'Options cleared';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function updateWalletInfo(port, saveUserAgent, userAgent) {
  var request = {
    greeting: "Monero monero-wallet-cli Update Wallet Info",
    newWalletPort: port,
    saveUserAgent: saveUserAgent,
    userAgent: userAgent
  };
  chrome.runtime.sendMessage(request, function (resp) {
    console.log(resp);
  });
};
