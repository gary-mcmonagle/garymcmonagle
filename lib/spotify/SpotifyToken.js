const axios = require('axios');
const qs = require('qs')
var request = require('sync-request');

module.exports = class SpotifyToken {

  
  constructor(clientId, clientSecret, redirectUri, token, username, password){
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri =  redirectUri
    this.username = username; 
    this.password = password;
    this.tokens = this.tokenInit(token)
  }

  async tokenInit(token){
    const auth = `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: qs.stringify({
        grant_type: "authorization_code",
        code: token,
        redirect_uri: this.redirectUri
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': auth
      }
    })
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token
    }
  }

  async getUsername(){
    return this.username
  }

  async getPassword(){
    return this.password;
  }

  async updateAccessToken(newToken){
    const t = await this.tokens; 
    this.tokens =  new Promise((resolve) => {
      resolve({accessToken: newToken, refreshToken:t.refreshToken})
    })
  }

  async getAccessToken(){
    const t = await this.tokens;
    return await t.accessToken;
  }

  async getRefreshToken(){
    const t = await this.tokens;
    return await t.refreshToken;
  }

  async refreshToken(){
    const refreshToken = await this.getRefreshToken()
    const auth = `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': auth
      }
    })
    await this.updateAccessToken(response.data.access_token)
  };
};