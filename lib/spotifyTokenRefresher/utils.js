const axios = require('axios');
const qs = require('qs')

const retries = 3;
const timeOut = {
  low: 3,
  high: 8
}


exports.refreshAccessToken = async (refreshToken, clientId, clientSecret) => {

  const auth = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
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
  return response.data.access_token
};

exports.getRefreshToken = async (authCode, clientId, clientSecret, redirectUri) => {
  const auth = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  const response = await axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: qs.stringify({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUri
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