var express = require('express');
var spotifyTokenRefresher = require('../lib/spotifyTokenRefresher')
var router = express.Router();

router.get('/spotifyTokenService/add', async (req, res) => {
  res.render('spotifyTokenService/add', { 
  clientId: spotifyTokenRefresher.clientId,
  redirectUri: spotifyTokenRefresher.redirectUri
 })
});

router.get('/spotifyTokenService/token/:id', async (req, res) => {
  //res.send("id is set to " + req.params.id);
  let target = spotifyTokenRefresher.tokens.filter(token => token.username == req.params.id)
  if(target.length == 0) res.status(404).send({ error: "boo :(" });
  else{
    res.status(200).json({accessToken: target[0].accessToken})
  }
})

router.get('/spotifyTokenService/callback', async (req, res) => {
  if(req.query.code && req.query.state){
    const spl = req.query.state.split('&')
    spotifyTokenRefresher.tokens.push({
      username: spl[0].split(':')[1],
      password: spl[1].split(':')[1],
      accessToken: req.query.code
    });
    res.send(spl);
  }
  else{
    res.send('Something Terrible Has happened! :(')
  }
  try{
    spotifyTokenRefresher.tokens = await spotifyTokenRefresher.refreshTokens(spotifyTokenRefresher.tokens);
  }
  catch(e){
    console.log(e)
  }
});

module.exports = router;
