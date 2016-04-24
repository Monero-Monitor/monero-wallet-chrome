var outgoingTxsDB = (function() {
  var oDB = {};
  var datastore = null;
  
  /**
   * Open a connection to the datastore.
   */
  oDB.open = function(callback) {
    var version = 1;
    var request = indexedDB.open('outgoingTxs', version);
    
    request.onupgradeneeded = function(e) {
      var db = e.target.result;
      
      e.target.transaction.onerror = oDB.onerror;
      
      // Delete the old datastore.
      if (db.objectStoreNames.contains('outgoingTx')) {
        db.deleteObjectStore('outgoingTx');
      }
      
      // Create a new datastore.
      var store = db.createObjectStore('outgoingTx', {
        keyPath: 'timestamp'
      });
    };
    
    request.onsuccess = function(e) {
      datastore = e.target.result; // Get a reference to the DB.
      callback();
    };
    
    request.onerror = oDB.onerror;
  };
  
  /**
   * Fetch all of the outgoing txs in the datastore.
   */
  oDB.fetchOutgoingTxs = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['outgoingTx'], 'readwrite');
    var objStore = transaction.objectStore('outgoingTx');
    
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);
    
    var outgoingTxs = [];
    
    transaction.oncomplete = function(e) {
      callback(outgoingTxs);
    };
    
    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      outgoingTxs.push(result.value);
      
      result.continue();
    };
    
    cursorRequest.onerror = oDB.onerror;
  };
  
  /**
   * Create a new outgoing tx.
   */
  oDB.createOutgoingTx = function(pay_id, dests, hashes, callback) {
    var timestamp = new Date().getTime();
    var outgoingTx = {
      'payment_id': pay_id,
      'destinations': dests,
      'tx_hash_list': hashes,
      'timestamp': timestamp
    };
    
    // Get DB and initiate a new transaction:
    var db = datastore;
    
    var transaction = db.transaction(['outgoingTx'], 'readwrite');

    // Datastore request handling:
    var objStore = transaction.objectStore('outgoingTx');
    
    var request = objStore.put(outgoingTx);
    
    request.onsuccess = function(e) {
      callback(outgoingTx);
    };
    
    request.onerror = oDB.onerror;
  };
  
  /**
   * Delete an outgoing tx.
   */
  oDB.deleteOutgoingTx = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['outgoingTx'], 'readwrite');
    var objStore = transaction.objectStore('outgoingTx');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };
  
  return oDB; // Export the oDB object.
})();