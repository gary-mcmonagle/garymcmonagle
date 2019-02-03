function redirect(){
  var state = 'username:' + document.getElementById('tokenUser').value;
  state += '&password:' + document.getElementById('tokenPassword').value;
  window.location = authUrl + '&state=' + encodeURIComponent(state);
}

function spotSubmit(){
  let user = document.getElementById('tokenUser').value;
  let pass = document.getElementById('tokenPassword').value;
  if (user && pass){
    redirect()

  }
  else{
    if(!user) alert('Please enter username');
    if(!pass) alert('Please enter password');
  }
}