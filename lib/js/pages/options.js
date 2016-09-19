document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById('save').addEventListener('click', save_options);
  // document.getElementById('clear').addEventListener('click', clear_storage);
});

function save_options() {
  // Read settings from Options pop-up box:
  var walletPort = String(document.getElementById('monero-wallet-cli-port').value);

  // Save options in Chrome storage:
  if (Number(walletPort) >= 1 && Number(walletPort) <= 65535) {
    chrome.storage.sync.set({
      walletPort: walletPort
    }, function() {
      var status = document.getElementById('status');
      updatePort(walletPort);
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  } else {
    var status = document.getElementById('status');
    status.textContent = 'Invalid Port.';
    document.getElementById('monero-wallet-cli-port').value = 18082;
    setTimeout(function() {
      status.textContent = '';
      save_options();
    }, 2000);
  }
}

function restore_options() {
  // Get saved options from Chrome storage:
  chrome.storage.sync.get({
    walletPort: ''
  }, function(items) {
    document.getElementById('monero-wallet-cli-port').value = items.walletPort;
  });
}

function clear_storage() {
  // Clear all saved options in Chrome storage:
  chrome.storage.sync.clear( function() {
    var status = document.getElementById('status')
    document.getElementById('monero-wallet-cli-port').value = '';
    status.textContent = 'Options cleared';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function updatePort(port) {
  var request = {greeting: "Monero monero-wallet-cli Update Wallet Port", newWalletPort: port };
  chrome.runtime.sendMessage(request, function (resp) {
    console.log(resp);
  });
};
