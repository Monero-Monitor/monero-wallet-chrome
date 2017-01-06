var wallet_info = {
  port: '',
  address: '',
  balance: '0',
  unlockedBalance: '0',
  height: '0',
  status: "off",
  saveAuth: false,
  username: '',
  password: ''
};

document.addEventListener('DOMContentLoaded', function () {
  // After send.html loads in a new tab, request background/send.js for the found href
  getMoneroURIfromBackground();

  // Get wallet info from settings:
  getBalanceAndDisplay();

  outgoingTxsDB.open(function () { console.log('Outgoing Txs DB initialized.'); });

  // Add event listener to send button:
  document.getElementById('send-button-popup').addEventListener('click', confirmSend);
});

// Requests Monero URI info that was found by background/send.js and fills send form:
function getMoneroURIfromBackground() {
  var request = {greeting: "Monero monero-wallet-rpc Fill Send Page"};
  chrome.runtime.sendMessage(request, function (response) {
    document.getElementById('send-dest-popup-0').value   = response.address;
    document.getElementById('send-amount-popup-0').value = response.amount;
    document.getElementById('send-pay-id-popup').value   = response.payment_id;
    document.getElementById('send-mixin-popup').value    = response.mixin;
  });
}

// Request wallet info from background/wallet.js and display
function getBalanceAndDisplay() {
  var request = {greeting: "Monero monero-wallet-rpc Send Wallet Info"};
  chrome.runtime.sendMessage(request, function (resp) {
    if (resp.status == 'ok') {
      document.getElementById('send-status-offline').style.display = "none";
      document.getElementById('send-button-popup').style.display = "block";
      wallet_info = resp;
      document.getElementById('send-total-balance-popup').textContent = numberWithCommas(resp.balance);
      document.getElementById('send-unlocked-balance-popup').textContent = numberWithCommas(resp.unlockedBalance);
    } else {
      document.getElementById('send-status-offline').style.display = "inline-block";
      document.getElementById('send-button-popup').style.display = "none";
    }
  });
}

function confirmSend () {

  document.getElementById('send-confirm-popup').style.display = 'block';
  document.querySelector('#verify-send-checkbox').checked = false;
  document.getElementById("send-confirm-yes").disabled = true;

  var addresses = document.getElementsByClassName('send-input-dest-popup');
  var amounts = document.getElementsByClassName('send-input-amount-popup');
  var pay_id = document.getElementById('send-pay-id-popup').value;
  var mixin = document.getElementById('send-mixin-popup').value;

  if (pay_id == "" || pay_id == undefined) {
    document.getElementById('send-confirm-payid').innerHTML = 'none';
  } else {
    document.getElementById('send-confirm-payid').innerHTML = pay_id;
  }

  if (mixin == "" || mixin == undefined) {
    document.getElementById('send-confirm-mixin').innerHTML = '3';
  } else {
    document.getElementById('send-confirm-mixin').innerHTML = mixin;
  }

  // Add all destinations to list:
  var ul = document.getElementById('send-confirm-list');
  ul.innerHTML = '';
  for (var i = 0; i < addresses.length; i++) {
    var address = addresses[i].value;
    var amount = amounts[i].value;

    var li = document.createElement('li');
    li.id = 'send-confirm-' + i;

    // Add address to confirm list item:
    var addr_head = document.createElement('div');
    addr_head.className = 'send-confirm-header';
    addr_head.innerHTML = 'Address:';
    li.appendChild(addr_head);

    var addr = document.createElement('div');
    addr.className = 'send-confirm-field';
    addr.innerHTML = address.substring(0,48) + ' ' + address.substring(48,address.length);
    li.appendChild(addr);

    // Add amount to confirm list item:
    var amnt_head = document.createElement('div');
    amnt_head.className = 'send-confirm-header';
    amnt_head.innerHTML = 'Amount:';
    li.appendChild(amnt_head);

    var amnt = document.createElement('div');
    amnt.className = 'send-confirm-field';
    if (amount != '') amnt.innerHTML = amount + ' XMR';
    li.appendChild(amnt);

    if (i%2 == 0) {
      li.style.background = '#F0F0F0';
    }

    // Add completed item to list:
    ul.appendChild(li);
  }

  document.querySelector('#verify-send-checkbox').addEventListener('change', function () {
    if (document.querySelector('#verify-send-checkbox').checked) {
      document.getElementById("send-confirm-yes").disabled = false;
    } else {
      document.getElementById("send-confirm-yes").disabled = true;
    }
  });

  document.getElementById('send-confirm-yes').onclick = function () {
    document.getElementById("send-confirm-yes").disabled = true;
    document.querySelector('#verify-send-checkbox').checked = false;
    sendMoneroNewTab();
    document.getElementById('send-confirm-popup').style.display = 'none';
  };
  document.getElementById('send-confirm-no').onclick = function () {
    document.getElementById('send-confirm-popup').style.display = 'none';
  };

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
  var dests = [{amount: JSONbig.parse(coinsToAtomic(amount)), address: destination}];

  transferSplit(wallet_info.port, dests, pay_id, fee, mixin, unlock_time, get_tx_key, new_algo,
    function (resp) {
      if (resp.hasOwnProperty("result")) {
        // Send successful:
        var tx_hash_list = resp.result.tx_hash_list;
        var status = document.getElementById('send-success-popup');

        var tx_hashes = [];
        for (var i=0; i < tx_hash_list.length; i++) {
          var this_hash = tx_hash_list[i];
          tx_hashes.push(this_hash);
          document.getElementById('send-txhashlist-popup').innerHTML += '<a target="_blank" href="http://explore.moneroworld.com/search?value=' + this_hash + '">' + this_hash + '</a><br>';
        }

        outgoingTxsDB.createOutgoingTx(pay_id, dests, tx_hashes, function(contact) {
          console.log('Outgoing tx successfully stored in database.');
        });

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
      status.innerHTML = 'There was an error connecting to monero-wallet-rpc.';
      status.style.display = 'block';
      setTimeout(function() {
        status.style.display = 'none';
      }, 10000);
    }
  );
}
