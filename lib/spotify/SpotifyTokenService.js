const SpotifyToken = require('./SpotifyToken');
const fs = require('fs');

class SpotifyTokenService {
  constructor(){
    let env = process.env.garymcmprod ? 'prod' : 'dev';
    let config = JSON.parse(fs.readFileSync('config.json', 'utf8')).spotifyTokenService.credentials[env];
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri
    this.tokens = [];
    this.startTimer();
  }
  getConfig(){
    return {
      clientId: this.clientId,
      clientSecret: this.addToken.clientSecret,
      redirectUri: this.redirectUri
    }
  }

  async addToken(token, username, password){
    this.tokens.push(new SpotifyToken(this.clientId, this.clientSecret, this.redirectUri, token, username, password))
  }

  async refreshTokens(){
    Promise.all(this.tokens.map(async (token) => {
      await token.refreshToken()
      console.log(await token.getAccessToken())
    }))
  }

  async findToken(username){
    for (const token of this.tokens) {
      const tuser = await token.getUsername();
      if(tuser == username) return token;
    }
    return null; 
  }

  async getAccessToken(username){
    const token = await this.findToken(username);
    if(token){
      const at = await token.getAccessToken();
      return at; 
    }
    return null
  }

  async startTimer(){
    setInterval(async () => {
      await this.refreshTokens()
    }, 60  * 1000);
  }
}

module.exports = SpotifyTokenService