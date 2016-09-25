var wallet_info = {
  port: '',
  address: '',
  balance: '0',
  unlockedBalance: '0',
  height: '0',
  status: "off",
  saveUserAgent: false,
  userAgent: ''
};

document.addEventListener('DOMContentLoaded', function () {
  var request = {greeting: "Monero monero-wallet-cli Send Wallet Info"};
  chrome.runtime.sendMessage(request, function (resp) {
    wallet_info = resp;

    // Get mnemonic key:
    queryKey(wallet_info.port, 'mnemonic',
      function(resp) {
        var key = resp.result.key;
        document.getElementById('mnemonic-key').textContent = key;
        document.getElementById('error-key').textContent = '';
      },
      function (err) {
        document.getElementById('error-key').textContent = 'There was an error connecting to Simplewallet.';
      }
    );

    // Get view key:
    queryKey(wallet_info.port, 'view_key',
      function(resp) {
        var key = resp.result.key;
        document.getElementById('view-key').textContent = key;
        document.getElementById('error-key').textContent = '';
      },
      function (err) {
        document.getElementById('error-key').textContent = 'There was an error connecting to Simplewallet.';
      }
    );


  });
});
