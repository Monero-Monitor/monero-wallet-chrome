document.addEventListener('DOMContentLoaded', function () {
  // Get mnemonic key:
  queryKey(18082, 'mnemonic',
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
  queryKey(18082, 'view_key',
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