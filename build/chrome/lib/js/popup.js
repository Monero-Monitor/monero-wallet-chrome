var wallet_info = {
  port: '',
  address: '',
  balance: '0',
  unlockedBalance: '0',
  height: '0',
  status: "off"
};

document.addEventListener('DOMContentLoaded', function () {
  
  // Get wallet info from settings:
  chrome.storage.sync.get({
    walletPort: ''
  }, function(items) {
    // Once ready, update information:
    wallet_info.port = items.walletPort;
    if (Number(wallet_info.port) >= 1 && Number(wallet_info.port) <= 65535) {
      get_wallet_info();
    } else {
      // If wallet port is not set correctly, take them to the options page.
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('/data/html/options.html'));
      }
    }
  });
  
  contactsDB.open(function () { console.log('Contacts DB initialized.'); });
  
  startButtonListeners();
  
  document.getElementById('send-button').addEventListener('click', confirmSend);
  
  document.getElementById('send-contact-0').addEventListener('click', function () {
    chooseSendContacts('send-dest-0');
  });
  
  document.getElementById('save-contact-0').addEventListener('click', function () {
    chooseSaveContacts('send-dest-0');
  });
  
  document.getElementById('random-pay-id').addEventListener('click', function () {
    // Check if integrated payment ID is selected:
    var int_pay_id = checkIntegrated();
    
    var random_pay_id;
    
    if (int_pay_id == 1) {
      random_pay_id = genRandomHexPayID('integrated');
    } else {
      random_pay_id = genRandomHexPayID('');
    }
    
    document.getElementById('receive-pay-id').value = random_pay_id;
  });
  
  // Handle new contact form submissions.
  document.getElementById('save-contact-button').addEventListener('click', function () {
    document.getElementById('save-contact-button').disabled = true;
    storeNewContact();
  });
  
  removeBadge();
  
});

function removeBadge() {
  chrome.browserAction.setBadgeText({text:''});
}

var get_wallet_info = function () {
  var request = {greeting: "Monero Simplewallet Send Wallet Info"};
  chrome.runtime.sendMessage(request, function (resp) {
    wallet_info.port = resp.port;
    
    if (resp.status == 'ok') {
      wallet_info.status = resp.status;
    
      document.getElementById('wallet-status-online').style.display = 'inline-block';
      document.getElementById('wallet-status-offline').style.display = 'none';
      
      if (wallet_info.balance != resp.balance) {
        wallet_info.balance = resp.balance;
        document.getElementById('balance').textContent = numberWithCommas(wallet_info.balance);
        document.getElementById('send-total-balance').textContent = numberWithCommas(resp.balance);
      }
      
      if (wallet_info.unlocked_balance != resp.unlockedBalance) {
        wallet_info.unlocked_balance = resp.unlockedBalance;
        document.getElementById('unlocked-balance').textContent = numberWithCommas(wallet_info.unlocked_balance);
        document.getElementById('send-unlocked-balance').textContent = numberWithCommas(resp.unlockedBalance);
      }
      
      if (wallet_info.height != resp.height) {
        wallet_info.height = resp.height;
        document.getElementById('wallet-height').textContent = wallet_info.height;
      }
      
      if (wallet_info.address != resp.address) {
        wallet_info.address = resp.address;
        document.getElementById('address-string').textContent = wallet_info.address;
        document.getElementById('address-string-ell').textContent = '...';
        var qrcode = new QRCode("address-qr", {
          text: "monero:" + wallet_info.address,
          width: 192,
          height: 192,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
      }
      
    } else {
      wallet_info.status = resp.status;
      
      document.getElementById('wallet-status-online').style.display = 'none';
      document.getElementById('wallet-status-offline').style.display = 'inline-block';
    }
    
    setTimeout(get_wallet_info, 5000);
  });
};

function makeReceiveQR() {
  document.getElementById('receive-qr-info').style.display = 'block';
  var amount =  document.getElementById('receive-amount').value;
  var payment_id =  document.getElementById('receive-pay-id').value;
  
  // Check if integrated payment ID is selected:
  var int_pay_id = checkIntegrated();
  
  // Make QR code:
  if (int_pay_id == 1) {
    receiveIntegratedQR(payment_id, amount);
  } else {
    receiveNormalQR(payment_id, amount);
  }
}

function checkIntegrated () {
  var int_pay_id = '';
  var radios1 = document.getElementsByName('int-pay-id');
  for (var i = 0; i < radios1.length; i++) {
    if (radios1[i].checked) {
	  int_pay_id = radios1[i].value;
	  break;
	}
  }
  return int_pay_id;
}

function receiveIntegratedQR (payment_id, amount) {
  makeIntegratedAddress(wallet_info.port, payment_id,
    function (resp) {
      console.log(resp);
      if (resp.hasOwnProperty('result')) {
        document.getElementById('receive-qr').innerHTML = '';
        
        var integrated_address = resp.result.integrated_address;
        var amnt_str = String(amount);
        
        var uri_string = 'monero:' + integrated_address;
        if (amnt_str.length > 0) uri_string += '?amount=' + amnt_str;
    
        var qrcode = new QRCode('receive-qr', {
          text: uri_string,
          width: 192,
          height: 192,
          colorDark : '#000000',
          colorLight : '#FFFFFF',
          correctLevel : QRCode.CorrectLevel.H
        });
        
        document.getElementById('receive-integrated-address').innerHTML = '';
        document.getElementById('receive-integrated-address').innerHTML = integrated_address;
        document.getElementById('receive-integrated-address-ell').innerHTML = '...';
      }
    },
    function (error) {
      console.log(error);
    }
  );
}

function receiveNormalQR (payment_id, amount) {
  var amnt_str   = String(amount);
  var pay_id_str = String(payment_id);
  
  var uri_string = 'monero:' + wallet_info.address;
  if (amnt_str.length > 0)   uri_string += '?amount=' + amnt_str;
  if (pay_id_str.length > 0) uri_string += '?payment_id=' + pay_id_str;
  
  document.getElementById('receive-qr').innerHTML = '';
  var qrcode = new QRCode('receive-qr', {
    text: uri_string,
    width: 192,
    height: 192,
    colorDark : '#000000',
    colorLight : '#FFFFFF',
    correctLevel : QRCode.CorrectLevel.H
  });
  
  document.getElementById('receive-integrated-address').innerHTML = '';
  document.getElementById('receive-integrated-address-ell').innerHTML = '';
}

function getAllIndices(transfers, tx_hash) {
  var indices = [];
  for (var i = 0; i < transfers.length; i++) {
    if (transfers[i].tx_hash.substring(1,transfers[i].tx_hash.length-1) == tx_hash) {
      indices.push(i);
    }
  }
  return indices;
}

function fillTransactionTable(tx_table_id, transfer_type) {
  incomingTransfers(wallet_info.port, transfer_type,
    function (resp) { // Successfully get transfers
      
      var transfers = resp.result.transfers;
      var unique_transfers = [];
      
      // Clear table and re-insert header:
      var table = document.getElementById(tx_table_id);
      table.innerHTML = '<tr id="tx-line-top"><th class="tx-number">#</th><th class="tx-amount">Amount</th><th class="tx-hash">Hash</th></tr>';
      
      // Loop through all incoming transfers, and group by tx hash
      var k = 0;
      var l_tr = transfers.length;
      for (var i = 0; i < l_tr; i++) {
        var transfer_i = transfers[i];
        var transfer_hash = transfer_i.tx_hash.substring(1,transfer_i.tx_hash.length-1);
        
        // If this is the first time seeing a tx hash, get all instances and process them
        if (unique_transfers.indexOf(transfer_hash) == -1) {
          unique_transfers.push(transfer_hash);
          
          // Many txs have multiple outputs. Sum output amounts for the given tx hash
          var transfer_indices = getAllIndices(transfers, transfer_hash);
          var transfer_amount = 0;
          for (var j = 0; j < transfer_indices.length; j++) {
            transfer_amount += Number(transfers[transfer_indices[j]].amount);
          }
          
          // Insert a new row into the table and add tx information
          var row = table.insertRow(1);
          row.id = 'tx-row-' + k;
          row.className = 'tx-row';
          if (k%2 == 0) {
            row.style.background = '#F0F0F0';
          }
          
          var number = row.insertCell(0);
          number.className = 'tx-number';
          number.id = 'tx-number-' + k;
          number.innerHTML = String(k+1);
          
          var amount = row.insertCell(1);
          amount.className = 'tx-amount';
          amount.id = 'tx-amount-' + k;
          amount.innerHTML = coinsFromAtomic(transfer_amount.toString()) + " &nbsp;";
          
          var hash   = row.insertCell(2);
          hash.className = 'tx-hash';
          hash.id = 'tx-hash-' + k;
          hash.innerHTML = '<div class="in-tx-hash"><a target="_blank" href="http://moneroblocks.info/search/' + transfer_hash + '">' + transfer_hash + '</a></div><div class="in-tx-hash-ell">...</div>';
          
          k += 1;
        }
      }
    },
    function (err) { // There was an error getting transfers
      document.getElementById('txs-error').innerHTML = 'There was an error retrieving your incoming transactions.';
      document.getElementById('txs-error').style.display('inline-block');
    }
  );
}

// Send Monero to destination on button click
function sendMonero () {
  var addresses = document.getElementsByClassName('send-input-dest');
  var amounts = document.getElementsByClassName('send-input-amount');
  var dests = [];
  for (var i=0; i < addresses.length; i++) {
    var amnt = JSONbig.parse(coinsToAtomic(amounts[i].value));
    var addr = addresses[i].value;
    if (JSONbig.stringify(amnt).length > 0 && addr.length > 0) {
      dests.push({amount: amnt, address: addr });
    }
  }
  
  var pay_id = document.getElementById('send-pay-id').value;
  var mixin = Number(document.getElementById('send-mixin').value);
  
  if (pay_id.length == 0) { pay_id = undefined; }
  if (mixin.length == 0 || mixin < 3) { mixin = 3; }
  
  var fee = undefined, unlock_time = undefined, get_tx_key = true, new_algo = true;
  
  transferSplit(wallet_info.port, dests, pay_id, fee, mixin, unlock_time, get_tx_key, new_algo,
    function (resp) {
      console.log(resp);
      if (resp.hasOwnProperty("result")) {
        // Send successful:
        var tx_hash_list = resp.result.tx_hash_list;
        var status = document.getElementById('send-success');
        for (var i=0; i < tx_hash_list.length; i++) {
          document.getElementById('send-txhashlist-popup').innerHTML += tx_hash_list[i] + '<br>';
        }
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 20000);
      } else if (resp.hasOwnProperty("error")) {
        // Send unsuccessful:
        var status = document.getElementById('send-error');
        status.innerHTML = "Error: " + resp.error.message;
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 10000);
      } else {
        // Unknown error:
        var status = document.getElementById('send-error');
        status.innerHTML = 'There was an error sending your transaction.';
        status.style.display = 'block';
        setTimeout(function() {
          status.style.display = 'none';
        }, 10000);
      }
    },
    function (err) {
      var status = document.getElementById('send-error');
      status.innerHTML = 'There was an error connecting to Simplewallet.';
      status.style.display = 'block';
      setTimeout(function() {
        status.style.display = 'none';
      }, 10000);
    }
  );
}

// Update the list of contacts.
function chooseSendContacts(addr_form_id) {
  document.getElementById('send-contact-list').style.display = 'block';
  contactsDB.open(function () {
    contactsDB.fetchContacts(function(contacts) {
  
      var contactList = document.getElementById('send-contacts');
      contactList.innerHTML = '';
      
      for (var i = 0; i < contacts.length; i++) {
        // Read the contacts backwards (most recent first).
        var contact = contacts[(contacts.length - 1 - i)];
        
        var li = document.createElement('li');
        li.id = 'send-contact-' + contact.timestamp;
        
        var contactName = document.createElement('span');
        contactName.className = 'send-contact-name';
        contactName.innerHTML = contact.name;
        contactName.setAttribute("data-id", contact.xmr_address);
        li.appendChild(contactName);
        
        contactList.appendChild(li);
        
        // Setup an event listener for the checkbox.
        li.addEventListener('click', function(e) {
          var addr = String(e.target.getAttribute('data-id'));
          document.getElementById(addr_form_id).value = addr;
          document.getElementById('send-contact-list').style.display = 'none';
        });
      }
    
    });
  });
}

// Update the list of contacts.
function chooseSaveContacts(addr_form_id) {
  document.getElementById('save-contact-dialog').style.display = 'block';
  document.getElementById('save-contact-addr').value = document.getElementById(addr_form_id).value;
  document.getElementById('save-contact-button').disabled = false;
}

function storeNewContact () {
  var contactName = document.getElementById('save-contact-name');
  var contactAddr = document.getElementById('save-contact-addr');
  var contactInfo = document.getElementById('save-contact-info');
  
  // Get the contact.
  var name = contactName.value;
  var xmr_addr = contactAddr.value;
  var info = contactInfo.value;
    
  // Check to make sure the name and xmr_addr are not blank (or just spaces).
  if (name.replace(/ /g,'') != '' && xmr_addr.replace(/ /g,'') != '') {
    // Create the contact.
    contactsDB.createContact(name, xmr_addr, info, function(contact) {
      var status = document.getElementById('save-success');
      status.innerHTML = 'Contact saved successfully.';
      status.style.display = 'block';
      setTimeout(function() {
        status.style.display = 'none';
      }, 5000);
    });
  }
  
  // Reset the input fields.
  contactName.value = '';
  contactAddr.value = '';
  contactInfo.value = '';
  
  document.getElementById('save-contact-dialog').style.display = 'none';
}

function confirmSend () {

  document.getElementById('send-confirm-popup').style.display = 'block';
  document.querySelector('#verify-send-checkbox').checked = false;
  document.getElementById("send-confirm-yes").disabled = true;
  
  var addresses = document.getElementsByClassName('send-input-dest');
  var amounts = document.getElementsByClassName('send-input-amount');
  var pay_id = document.getElementById('send-pay-id').value;
  var mixin = document.getElementById('send-mixin').value;
  
  document.getElementById('send-confirm-payid').innerHTML = 'Payment ID: ' + pay_id;
  document.getElementById('send-confirm-mixin').innerHTML = 'Mixin: ' + mixin;
  
  // Add all destinations to list:
  var ul = document.getElementById('send-confirm-list');
  ul.innerHTML = '';
  for (var i = 0; i < addresses.length; i++) {
    var address = addresses[i].value;
    var amount = amounts[i].value;
    
    var li = document.createElement('li');
    li.id = 'send-confirm-' + i;
    
    // Add address to confirm list item:
    var addr_head = document.createElement('h3');
    addr_head.className = 'send-confirm-header';
    addr_head.innerHTML = 'Address:';
    li.appendChild(addr_head);
    
    var addr = document.createElement('div');
    addr.className = 'send-confirm-field';
    addr.innerHTML = address.substring(0,48) + ' ' + address.substring(48,address.length);
    li.appendChild(addr);
    
    // Add amount to confirm list item:
    var amnt_head = document.createElement('h3');
    amnt_head.className = 'send-confirm-header';
    amnt_head.innerHTML = 'Amount:';
    li.appendChild(amnt_head);
    
    var amnt = document.createElement('div');
    amnt.className = 'send-confirm-field';
    amnt.innerHTML = amount + ' XMR';
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
    console.log('click');
    sendMonero();
    document.getElementById('send-confirm-popup').style.display = 'block';
  };
  document.getElementById('send-confirm-no').onclick = function () {
    document.getElementById('send-confirm-popup').style.display = 'none';
  };
  
}
