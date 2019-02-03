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

  

  async getAccessToken(username, password){
    const token = await this.findToken(username);
    if(token){
      if(password == await token.getPassword()){
        return {
          message: {
            accessToken: await token.getAccessToken()
          },
          code: 200
        }
      }
      else{
        return {
          message: {
            info: 'Bad password'
          },
          code: 401
        }
      }
    }
    return {
      message: {
        info: 'User Not Found'
      },
      code: 404
    }
  }

  async startTimer(){
    setInterval(async () => {
      await this.refreshTokens()
    }, 60  * 1000);
  }
}

module.exports = SpotifyTokenService