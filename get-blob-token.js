const https = require('https')

// Get the token from Vercel API
const options = {
  hostname: 'api.vercel.com',
  path: '/v1/storage/stores/store_tNU7HineOR8mCouU/tokens',
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + process.env.VERCEL_TOKEN,
    'Content-Type': 'application/json',
  },
}

const req = https.request(options, (res) => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  res.on('end', () => {
    console.log('Response:', data)
  })
})

req.on('error', (e) => {
  console.error('Error:', e)
})

req.end()
