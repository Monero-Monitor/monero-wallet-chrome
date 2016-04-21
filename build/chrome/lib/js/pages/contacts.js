// Once the page loads, retreive contacts and display.
document.addEventListener('DOMContentLoaded', function () {
  contactsDB.open(refreshContacts);
  
  // Listen for user clicking "+" send destination button
  document.getElementById('add-contact').addEventListener('click', function() {
    document.getElementById('new-contacts-div').style.display = 'inline-block';
    document.getElementById('add-contact-button').style.display = 'none';
  });
  
  // Listen for user clicking "-" send destination button
  document.getElementById('subtract-contact').addEventListener('click', function() {
    document.getElementById('new-contacts-div').style.display = 'none';
    document.getElementById('add-contact-button').style.display = 'inline-block';
  });
  
  var newContactButton = document.getElementById('new-contact-button');
  var newContactName = document.getElementById('new-contact-name');
  var newContactAddr = document.getElementById('new-contact-addr');
  var newContactInfo = document.getElementById('new-contact-info');
  
  // Handle new contact form submissions.
  newContactButton.onclick = function() {
    // Get the contact.
    var name = newContactName.value;
    var xmr_addr = newContactAddr.value;
    var info = newContactInfo.value;
    
    // Check to make sure the name and xmr_addr are not blank (or just spaces).
    if (name.replace(/ /g,'') != '' && xmr_addr.replace(/ /g,'') != '') {
      // Create the contact.
      contactsDB.createContact(name, xmr_addr, info, function(contact) {
        refreshContacts();
      });
    }
    
    // Reset the input fields.
    newContactName.value = '';
    newContactAddr.value = '';
    newContactInfo.value = '';
    
    // Don't send the form.
    return false;
  };
});

// Update the list of contacts.
function refreshContacts() {  
  contactsDB.fetchContacts(function(contacts) {
  
    var contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';

    for (var i = 0; i < contacts.length; i++) {
      // Read the contacts backwards (most recent first).
      var contact = contacts[(contacts.length - 1 - i)];

      var li = document.createElement('li');
      li.id = 'contact-' + contact.timestamp;
      if (i%2 == 0) {
        li.style.background = '#F0F0F0';
      }
      
      var namediv = document.createElement('div');
      namediv.className = 'contact-name';
      namediv.innerHTML = contact.name;

      var addrdiv = document.createElement('div');
      addrdiv.className = 'contact-xmr-addr';
      addrdiv.innerHTML = contact.xmr_address;

      var infodiv = document.createElement('div');
      infodiv.className = 'contact-info';
      infodiv.innerHTML = contact.info;
      
      var removediv = document.createElement('div');
      removediv.className = 'contact-remove';
      
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "contact-checkbox";
      checkbox.setAttribute("data-id", contact.timestamp);
      removediv.appendChild(checkbox);
      
      var removelabel = document.createElement('span');
      removelabel.className = 'contact-remove-label';
      removelabel.innerHTML = 'Remove';
      removediv.appendChild(removelabel);

      li.appendChild(namediv);
      li.appendChild(addrdiv);
      li.appendChild(infodiv);
      li.appendChild(removediv);
      contactList.appendChild(li);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        contactsDB.deleteContact(id, refreshContacts);
      });
    }

  });
}