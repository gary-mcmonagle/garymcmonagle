function redirect(){
  var scopes = [
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-read-currently-playing',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-follow-read',
    'user-follow-modify',
    'user-read-email',
    'user-read-private',
    'user-read-birthdate',
    'user-library-read',
    'user-library-modify',
    'app-remote-control',
    'streaming',
    'user-top-read',
    'user-read-recently-played',
    ] 
  var authorizeURL = 'https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + clientId +
  (scopes ? '&scope=' + encodeURIComponent(scopes.join(' ')) : '') +
  '&redirect_uri=' + encodeURIComponent(redirectUri);
  state = 'username:' + document.getElementById('tokenUser').value
  state += '&password:' + document.getElementById('tokenPassword').value
  authorizeURL += '&state=' + encodeURIComponent(state);
  window.location = authorizeURL
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