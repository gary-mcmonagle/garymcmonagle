var express = require('express');
var router = express.Router();

var SpotifyTokenService = require('../lib/spotify/SpotifyTokenService')

const sts = new SpotifyTokenService()

/* GET users listing. */
router.get('/add', async (req, res) => {
  const spotConfig = sts.getConfig()
  res.render('spotifyTokenService/add', { 
  clientId: spotConfig.clientId,
  redirectUri: spotConfig.redirectUri
 })
});


router.get('/token/:id', async (req, res) => {
  //res.send("id is set to " + req.params.id);
  let token = await sts.getAccessToken(req.params.id)
  if(!token) res.status(404).send({ error: "boo :(" });
  else{
    res.status(200).json({accessToken: token})
  }
});

router.get('/callback', async (req, res) => {
  if(req.query.code && req.query.state){
    const spl = req.query.state.split('&')
    sts.addToken(req.query.code, spl[0].split(':')[1], spl[1].split(':')[1])
    res.send(spl);
  }
});


module.exports = router;
