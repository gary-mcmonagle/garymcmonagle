const path   = require("path");
const utils = require('./utils');
const fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'))


const garyMcM = process.env.garymcmprod ? 'prod' : 'dev'
const credentials = config.spotifyTokenService.credentials[garyMcM]
console.log(credentials)

exports.clientId = credentials.clientId
exports.redirectUri = credentials.redirectUri
exports.tokens = []

exports.refreshTokens =  async (tokensToRefresh) => {
  console.log('refreshing tokens')
  const toks =  await Promise.all(tokensToRefresh.map(async (tokenToRefresh) => {
    if(!tokenToRefresh.refreshToken){
      const tokens = await utils.getRefreshToken(tokenToRefresh.accessToken, credentials.clientId, credentials.clientSecret, credentials.redirectUri);
      tokenToRefresh.accessToken = tokens.accessToken
      tokenToRefresh.refreshToken = tokens.refreshToken
    }
    else{
      utils.refreshAccessToken(tokenToRefresh.refreshToken, credentials.clientId, credentials.clientSecret)
    }
    return tokenToRefresh
  }))
  console.log(toks)
  return toks
}




