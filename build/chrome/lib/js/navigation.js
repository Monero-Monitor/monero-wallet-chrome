function openStatus(code) {
  // Display wallet off status
  closeAll();
  document.getElementById('status-tab').style.display = 'block';
  if (code == "success") {
    document.getElementById('status-success').style.display = 'inline-block';
    document.getElementById('status-error').style.display = 'none';
  } else if (code == "error") {
    document.getElementById('status-success').style.display = 'none';
    document.getElementById('status-error').style.display = 'inline-block';
    document.getElementById('status-port').innerHTML = wallet_info.port;
  }
}

function openMenu() {
  if (document.getElementById('menubar').style.display == 'block') {
    document.getElementById('menubar').style.display = 'none';
  } else {
    document.getElementById('menubar').style.display = 'block';
  }
}

function openOverview() {
  // Switch to Network tab:
  closeAll();
  document.getElementById('overview-tab').style.display = 'block';
}

function openSend() {
  // Switch to Send tab:
  closeAll();
  document.getElementById('send-tab').style.display = 'block';
}

function openReceive() {
  // Switch to Receive tab:
  closeAll();
  document.getElementById('receive-tab').style.display = 'block';
}

function openTransactions() {
  // Switch to Transactions tab:
  closeAll();
  document.getElementById('transactions-tab').style.display = 'block';
  fillIncomingTransactionTable("in-txs-table", "all");
}

function closeAll(){
  document.getElementById('menubar').style.display = 'none';
  document.getElementById('status-tab').style.display = 'none';
  document.getElementById('overview-tab').style.display = 'none';
  document.getElementById('send-tab').style.display = 'none';
  document.getElementById('receive-tab').style.display = 'none';
  document.getElementById('receive-qr-info').style.display = 'none';
  document.getElementById('transactions-tab').style.display = 'none';
}

function openKeys() {
  var action_url = "/data/html/keys.html";
  chrome.tabs.create({ url: action_url });
}

function openContacts() {
  var action_url = "/data/html/contacts.html";
  chrome.tabs.create({ url: action_url });
}

function openOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('/data/html/options.html'));
  }
}

function powerDownWallet() {
  stopWallet(wallet_info.port, function() {
    openStatus('success');
    document.getElementById('wallet-status-online').style.display = 'none';
    document.getElementById('wallet-status-offline').style.display = 'inline-block';
  });
}

function startButtonListeners() {
  // Add event listeners to navigation buttons and links:
  document.getElementById('menu-img').addEventListener('click', openMenu);
  document.getElementById('overviewButton').addEventListener('click', openOverview);
  document.getElementById('sendButton').addEventListener('click', openSend);
  document.getElementById('receiveButton').addEventListener('click', openReceive);
  document.getElementById('transactionsButton').addEventListener('click', openTransactions);
  
  document.getElementById('menu-img').addEventListener('mouseenter', function () {
    document.getElementById('menuButton').style.background = '#FAFAFA';
  });
  document.getElementById('menu-img').addEventListener('mouseleave', function () {
    document.getElementById('menuButton').style.background = '#303030';
  });
  
  // Add event listeners to menubar links:
  document.getElementById('keysButton').addEventListener('click', openKeys);
  document.getElementById('contactsButton').addEventListener('click', openContacts);
  document.getElementById('settingsButton').addEventListener('click', openOptions);
  document.getElementById('stopButton').addEventListener('click', powerDownWallet);
  
  
  // Listen for user clicking "+" send destination button
  document.getElementById('add-dest').addEventListener('click', function() {
    var destinations = document.getElementById('send-dest-and-amount');
    
    var send_dests = document.getElementsByClassName('send-input-dest');
    var i = send_dests.length;
    
    var new_dest_field = document.createElement('div');
    new_dest_field.className = 'send-dest-field';
    new_dest_field.innerHTML = '<input type="text" class="send-input-dest" id="send-dest-'+i+'" placeholder="Enter destination address"><img class="send-contact-icon" id="send-contact-'+i+'"><img class="save-contact-icon" id="save-contact-'+i+'">';
    new_dest_field.setAttribute("data-id", 'dest-field-'+i);
    
    var new_amnt_field = document.createElement('div');
    new_amnt_field.className = 'send-amount-field';
    new_amnt_field.innerHTML = '<input type="text" class="send-input-amount" id="send-amount-'+i+'" placeholder="Enter amount (XMR)">';
    new_amnt_field.setAttribute("data-id", 'amnt-field-'+i);
    
    destinations.appendChild(new_dest_field);
    destinations.appendChild(new_amnt_field);
    
    document.getElementById('send-contact-'+i).addEventListener('click', function () {
      chooseSendContacts('send-dest-'+i);
    });
    
    document.getElementById('save-contact-'+i).addEventListener('click', function () {
      chooseSaveContacts('send-dest-'+i);
    });
  });
  
  // Listen for user clicking "-" send destination button
  document.getElementById('subtract-dest').addEventListener('click', function() {
    var send_dests = document.getElementsByClassName('send-dest-field');
    var send_amounts = document.getElementsByClassName('send-amount-field');
    var i = send_dests.length;
    if (i > 1) {
      send_dests[i-1].remove();
      send_amounts[i-1].remove();
    }
  });
  
  // Listen for closing Send Select Contact
  document.getElementById('cancel-contact').addEventListener('click', function() {
    document.getElementById('send-contact-list').style.display = 'none';
  });
  
  // Listen for closing Send Select Contact
  document.getElementById('cancel-save-button').addEventListener('click', function() {
    document.getElementById('save-contact-dialog').style.display = 'none';
  });
  
  document.getElementById('receive').addEventListener('click', makeReceiveQR);
  
  // Listen for transaction type tab toggle:
  document.getElementById('incoming-txs').addEventListener('click', function () {
    document.getElementById('incoming-txs').style.background = '#505050';
    document.getElementById('incoming-txs').style.color = '#FAFAFA';
    document.getElementById('outgoing-txs').style.background = '#FAFAFA';
    document.getElementById('outgoing-txs').style.color = '#505050';
    
    document.getElementById('in-txs-table').style.display = 'inline-block';
    document.getElementById('out-txs-table').style.display = 'none';
    
    fillIncomingTransactionTable("in-txs-table", "all");
  });
  document.getElementById('outgoing-txs').addEventListener('click', function () {
    document.getElementById('incoming-txs').style.background = '#FAFAFA';
    document.getElementById('incoming-txs').style.color = '#505050';
    document.getElementById('outgoing-txs').style.background = '#505050';
    document.getElementById('outgoing-txs').style.color = '#FAFAFA';
    
    document.getElementById('in-txs-table').style.display = 'none';
    document.getElementById('out-txs-table').style.display = 'inline-block';
    
    fillOutgoingTransactionTable("out-txs-table");
  });
}