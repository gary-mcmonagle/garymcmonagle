var express = require('express');
var router = express.Router();
const fs = require('fs');
var SpotifyTokenService = require('spotify_token_service')

let env = process.env.garymcmprod ? 'prod' : 'dev';
let config = JSON.parse(fs.readFileSync('config.json', 'utf8')).spotifyTokenService.credentials[env];


const sts = new SpotifyTokenService(config.clientId, config.clientSecret, config.redirectUri)

/* GET users listing. */
router.get('/add', async (req, res) => {
  console.log(await sts.createAuthUrl())
  res.render('spotifyTokenService/add', { 
  authUrl : await sts.createAuthUrl()
 })
});


router.get('/token', async (req, res) => {

  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');

  //res.send("id is set to " + req.params.id);
  let token = await sts.getAccessToken(login, password)
  res.status(token.code).json(token.message);
});

router.get('/callback', async (req, res) => {
  if(req.query.code && req.query.state){
    const spl = req.query.state.split('&')
    sts.addToken(req.query.code, spl[0].split(':')[1], spl[1].split(':')[1])
    res.send('Token Added');
  }
});


module.exports = router;
