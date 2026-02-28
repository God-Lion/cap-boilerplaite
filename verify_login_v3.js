
async function verifyLogin() {
  try {
    console.log('Checking backend connectivity at http://127.0.0.1:3333/api/health/live...');
    try {
        const health = await fetch('http://127.0.0.1:3333/api/health/live');
        console.log('Health Check Status:', health.status);
    } catch (e) {
        console.log('Health check failed:', e.message);
    }

    console.log('Attempting login to http://127.0.0.1:3333/api/auth/login...');
    const response = await fetch('http://127.0.0.1:3333/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password',
      }),
    });

    console.log('Login Status:', response.status);
    
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

  } catch (error) {
    console.error('Request failed:', error);
  }
}

verifyLogin();
