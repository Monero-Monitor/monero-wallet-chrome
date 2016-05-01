
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('show-getting-started').addEventListener('click', function () {
    document.getElementById('pick-os').style.display = 'block';
    document.getElementById('getting-started-greeting').style.display = 'none';
  });

  // Pick Operating System Buttons:
  document.getElementById('pick-windows').addEventListener('click', function () {
    document.getElementById('pick-os').style.display = 'none';
    document.getElementById('os-windows').style.display = 'block';
  });
  document.getElementById('pick-osx').addEventListener('click', function () {
    document.getElementById('pick-os').style.display = 'none';
    document.getElementById('os-osx').style.display = 'block';
  });
  document.getElementById('pick-linux').addEventListener('click', function () {
    document.getElementById('pick-os').style.display = 'none';
    document.getElementById('os-linux').style.display = 'block';
  });
  
  // DIY or Script:
  document.getElementById('osx-setup-script').addEventListener('click', function () {
    document.getElementById('os-osx').style.display = 'none';
    document.getElementById('osx-script').style.display = 'block';
  });
  document.getElementById('linux-setup-script').addEventListener('click', function () {
    document.getElementById('os-linux').style.display = 'none';
    document.getElementById('linux-script').style.display = 'block';
  });
  document.getElementById('linux-setup-diy').addEventListener('click', function () {
    document.getElementById('os-linux').style.display = 'none';
    document.getElementById('unix-diy').style.display = 'block';
  });
  document.getElementById('osx-setup-diy').addEventListener('click', function () {
    document.getElementById('os-osx').style.display = 'none';
    document.getElementById('unix-diy').style.display = 'block';
  });
  document.getElementById('launcher-script-refer').addEventListener('click', function () {
    document.getElementById('unix-diy').style.display = 'none';
    document.getElementById('pick-os').style.display = 'block';
  });
  
});