var walletPort;

document.addEventListener('DOMContentLoaded', function () {
  // After send.html loads in a new tab, request background/send.js for the found href
  getMoneroURIfromBackground();
  
  // Get wallet info from settings:
  getBalanceAndDisplay();
  
  // Add event listener to send button:
  document.getElementById('send-button-popup').addEventListener('click', sendMoneroNewTab);
});

// Requests Monero URI info that was found by background/send.js and fills send form:
function getMoneroURIfromBackground() {
  var request = {greeting: "Monero Simplewallet Fill Send Page"};
  chrome.runtime.sendMessage(request, function (response) { 
    document.getElementById('send-dest-popup-0').value   = response.address;
    document.getElementById('send-amount-popup-0').value = response.amount;
    document.getElementById('send-pay-id-popup').value   = response.payment_id;
    document.getElementById('send-mixin-popup').value    = response.mixin;
  });
}

// Request wallet info from background/wallet.js and display
function getBalanceAndDisplay() {
  var request = {greeting: "Monero Simplewallet Send Wallet Info"};
  chrome.runtime.sendMessage(request, function (resp) { 
    if (resp.status == 'ok') {
      document.getElementById('send-status-offline').style.display = "none";
      document.getElementById('send-button-popup').style.display = "block";
      walletPort = resp.port;
      document.getElementById('send-total-balance-popup').textContent = numberWithCommas(resp.balance);
      document.getElementById('send-unlocked-balance-popup').textContent = numberWithCommas(resp.unlockedBalance);
    } else {
      document.getElementById('send-status-offline').style.display = "inline-block";
      document.getElementById('send-button-popup').style.display = "none";
    }
  });
}

// Send Monero to destination on button click
function sendMoneroNewTab () {
  var destination = document.getElementById('send-dest-popup-0').value;
  var amount = String(document.getElementById('send-amount-popup-0').value);
  var pay_id = document.getElementById('send-pay-id-popup').value;
  var mixin = Number(document.getElementById('send-mixin-popup').value);
  
  if (pay_id.length == 0) { pay_id = undefined; }
  if (mixin.length == 0 || mixin < 3) { mixin = 3; }
  
  var fee = undefined, unlock_time = undefined, get_tx_key = true, new_algo = true;
  var dests = [{amount: coinsToAtomic(amount), address: destination}];
  
  transferSplit(walletPort, dests, pay_id, fee, mixin, unlock_time, get_tx_key, new_algo,
    function (resp) {
      if (resp.hasOwnProperty("result")) {
        // Send successful:
        var tx_hash_list = resp.result.tx_hash_list;
        var status = document.getElementById('send-success-popup');
        for (var i=0; i < tx_hash_list.length; i++) {
          document.getElementById('send-txhashlist-popup').innerHTML += tx_hash_list[i] + '<br>';
        }
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 20000);
      } else if (resp.hasOwnProperty("error")) {
        // Send unsuccessful:
        var status = document.getElementById('send-error-popup');
        status.innerHTML = "Error: " + resp.error.message;
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 10000);
      } else {
        // Unknown error:
        var status = document.getElementById('send-error-popup');
        status.innerHTML = 'There was an error sending your transaction.';
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 10000);
      }
    },
    function (err) {
      var status = document.getElementById('send-error-popup');
      status.innerHTML = 'There was an error connecting to Simplewallet.';
      status.style.display = 'block';
      setTimeout(function() {
        status.style.display = 'none';
      }, 10000);
    }
  );
}