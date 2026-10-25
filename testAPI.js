// Script test API POST /api/books
const http = require('http');

const data = JSON.stringify({
  title: 'Cà Phê Cùng Tony',
  author: 'Tony Buổi Sáng',
  price: 72000
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/books',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(body));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
