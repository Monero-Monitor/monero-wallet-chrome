var contactsDB = (function() {
  var cDB = {};
  var datastore = null;
  
  /**
   * Open a connection to the datastore.
   */
  cDB.open = function(callback) {
    var version = 1;
    var request = indexedDB.open('contacts', version);
    
    request.onupgradeneeded = function(e) {
      var db = e.target.result;
      
      e.target.transaction.onerror = cDB.onerror;
      
      // Delete the old datastore.
      if (db.objectStoreNames.contains('contact')) {
        db.deleteObjectStore('contact');
      }
      
      // Create a new datastore.
      var store = db.createObjectStore('contact', {
        keyPath: 'timestamp'
      });
    };
    
    request.onsuccess = function(e) {
      datastore = e.target.result; // Get a reference to the DB.
      callback();
    };
    
    request.onerror = cDB.onerror;
  };
  
  /**
   * Fetch all of the contacts in the datastore.
   */
  cDB.fetchContacts = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['contact'], 'readwrite');
    var objStore = transaction.objectStore('contact');
    
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);
    
    var contacts = [];
    
    transaction.oncomplete = function(e) {
      callback(contacts);
    };
    
    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      contacts.push(result.value);
      
      result.continue();
    };
    
    cursorRequest.onerror = cDB.onerror;
  };
  
  /**
   * Create a new contact.
   */
  cDB.createContact = function(name, xmr_addr, info, callback) {
    var timestamp = new Date().getTime();
    var contact = {
      'name': name,
      'xmr_address': xmr_addr,
      'info': info,
      'timestamp': timestamp
    };
    
    // Get DB and initiate a new transaction:
    var db = datastore;
    
    var transaction = db.transaction(['contact'], 'readwrite');

    // Datastore request handling:
    var objStore = transaction.objectStore('contact');
    
    var request = objStore.put(contact);
    
    request.onsuccess = function(e) {
      callback(contact);
    };
    
    request.onerror = cDB.onerror;
  };
  
  /**
   * Delete a contact.
   */
  cDB.deleteContact = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['contact'], 'readwrite');
    var objStore = transaction.objectStore('contact');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };
  
  return cDB; // Export the cDB object.
})();