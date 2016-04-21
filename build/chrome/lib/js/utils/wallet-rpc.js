/*
 * (c) Copyright 2016 bigreddmachine.
 * 
 * These functions enable interactions with the Monero Simplewallet JSON RPC interface
 * using javascript in the browser. This requires the json-bigint.js in order to parse
 * Simplewallet numbers larger than the precision possible by Javascript.
 *
 * See LICENSE for terms and use.
 */

function walletJSONrpc(port, method, params, onSuccess, onFailure) {
  // Set up JSON RPC call:
  var host = "http://127.0.0.1";
  var url  = host.concat(":", String(port), "/json_rpc");
  var data = {
    jsonrpc: "2.0",
    id: "0",
    method: method
  };
  if (params != undefined) { data.params = params; }
  var json_string = JSONbig.stringify(data);
  
  // Javascript POST Method:
  var xhttp = new XMLHttpRequest();
  xhttp.onerror = function() { onFailure('HTTP Request Failed'); };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onload = function() {
    if (xhttp.readyState == 4) {
      try {
        var resp = JSONbig.parse(xhttp.responseText);
        onSuccess(resp);
      } catch (err) {
        onFailure('HTTP Request Failed');
      }
    }
  }
  xhttp.send(json_string);
}

// Get the balance of connected simplewallet:
function getBalance(port, onSuccess, onFailure) {
  var method = "getbalance";
  walletJSONrpc(port, method, undefined,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Get the address of connected simplewallet:
function getAddress(port, onSuccess, onFailure) {
  var method = "getaddress";
  walletJSONrpc(port, method, undefined,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Get the height of connected simplewallet:
function getHeight(port, onSuccess, onFailure) {
  var method = "getheight";
  walletJSONrpc(port, method, undefined,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Make a transfer from connected simplewallet:
function transfer(port, destinations, payment_id, fee, mixin, unlock_time, get_tx_key, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "transfer";
  var params = { destinations: destinations }
  if (payment_id != undefined) { params.payment_id = payment_id; }
  if (fee != undefined) { params.fee = fee; }
  if (mixin != undefined) { params.mixin = mixin; }
  if (unlock_time != undefined) { params.unlock_time = unlock_time; }
  if (get_tx_key != undefined) { params.get_tx_key = get_tx_key; }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Make a transfer from connected simplewallet:
function transferSplit(port, destinations, payment_id, fee, mixin, unlock_time, get_tx_key, new_algorithm, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "transfer_split";
  var params = { destinations: destinations }
  if (payment_id != undefined) { params.payment_id = payment_id; }
  if (fee != undefined) { params.fee = fee; }
  if (mixin != undefined) { params.mixin = mixin; }
  if (unlock_time != undefined) { params.unlock_time = unlock_time; }
  if (get_tx_key != undefined) { params.get_tx_key = get_tx_key; }
  if (new_algorithm != undefined) { 
    params.new_algorithm = new_algorithm;
  } else {
    params.new_algorithm = true;
  }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Sweep dust of connected simplewallet:
function sweepDust(port, onSuccess, onFailure) {
  var method = "sweep_dust";
  walletJSONrpc(port, method, undefined, function(resp){
    callback(resp);
  });
}

// Store simplewallet:
function store(port, onSuccess, onFailure) {
  var method = "store";
  walletJSONrpc(port, method, undefined,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}


// Look up payments by payment ID:
function getPayments(port, payment_id, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "get_payments";
  var params = { payment_id: payment_id }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Look up bulk payments by payment IDs:
function getBulkPayments(port, payment_ids, min_block_height, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "get_bulk_payments";
  var params = { payment_ids: payment_ids } // payment_ids is array of ID strings
  if (min_block_height != undefined) { params.min_block_height = min_block_height; }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Get list of incoming transfers (types: 'all', 'available', 'unavailable'):
function incomingTransfers(port, transfer_type, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "incoming_transfers";
  var params = { transfer_type: transfer_type }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}

// Get wallet key (types: 'view_key', 'mnemonic'):
function queryKey(port, key_type, onSuccess, onFailure) {
  // Make sure key_type is valid:
  if (key_type != 'mnemonic' && key_type != 'view_key') {
    console.log('Invalid key type: ' + String(key_type));
  }
  
  // Set up JSON_RPC call:
  var method = "query_key";
  var params = { key_type: key_type }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}


// Create an integrated address from address and (optional) payment ID:
function makeIntegratedAddress(port, payment_id, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "make_integrated_address";
  if (payment_id != undefined) {
    var params = { payment_id: payment_id }
  } else {
    var params = { payment_id: "" }
  }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
    /*
    // Display integrated address:
    var integrated_address = resp.result.integrated_address;
    */
}


// Split integrated address into address and payment ID:
function splitIntegratedAddress(port, integrated_address, onSuccess, onFailure) {
  // Set up JSON_RPC call:
  var method = "split_integrated_address";
  var params = { integrated_address: integrated_address }
  
  // Do JSON_RPC call:
  walletJSONrpc(port, method, params,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
    /*
    // Display payment ID and standard address:
    var payment_id = resp.result.payment_id;
    var standard_address = resp.result.standard_address;
    */
}


// Disconnect simplewallet:
function stopWallet(port, onSuccess, onFailure) {
  var method = 'stop_wallet';
  walletJSONrpc(port, method, undefined,
    function(resp) {
      onSuccess(resp);
    },
    function(e){
      onFailure(e);
    }
  );
}
