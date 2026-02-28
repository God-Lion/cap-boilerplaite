
async function verifyLogin() {
  try {
    console.log('Attempting login to http://localhost:3333/api/auth/login...');
    const response = await fetch('http://localhost:3333/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password',
      }),
    });

    console.log('Status:', response.status);
    
    // Check Set-Cookie headers
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      console.log('Set-Cookie Header Found:', setCookie);
      if (setCookie.includes('refresh_token') && setCookie.includes('HttpOnly')) {
        console.log('SUCCESS: refresh_token cookie is present and HttpOnly.');
      } else {
        console.log('WARNING: Set-Cookie found but might be missing refresh_token or HttpOnly flag.');
      }
    } else {
      console.log('ERROR: No Set-Cookie header received.');
    }

    const data = await response.json();
    console.log('Body:', JSON.stringify(data, null, 2));
    
    if (data.token) {
        console.log('SUCCESS: access_token received in body.');
    } else {
        console.log('ERROR: access_token missing from body.');
    }

  } catch (error) {
    console.error('Login request failed:', error);
  }
}

verifyLogin();
