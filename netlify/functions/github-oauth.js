const GITHUB_CLIENT_ID = 'Ov23lirIxz2Dsxcw3QzI'
const GITHUB_CLIENT_SECRET = 'a97737533ab01dccb4a0fa3267c95e7f0ef9c4c2'

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No code provided' })
    }
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      })
    })

    const data = await response.json()

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error })
      }
    }

    const accessToken = data.access_token

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    const userData = await userResponse.json()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        token: accessToken,
        user: userData
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to exchange code for token' })
    }
  }
}
