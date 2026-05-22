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

    // 返回一个 HTML 页面，用于处理 OAuth 回调
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>OAuth Callback</title>
  <script>
    window.opener.postMessage({
      type: 'GITHUB_OAUTH_SUCCESS',
      token: '${accessToken}',
      user: ${JSON.stringify(userData)}
    }, '*');
    window.close();
  </script>
</head>
<body>
  <p>授权成功，请关闭此窗口...</p>
</body>
</html>
`

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: html
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to exchange code for token' })
    }
  }
}
