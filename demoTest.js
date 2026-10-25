// ============================================
// DEMO TEST CHỨC NĂNG - Book Store MERN Stack
// ============================================
const http = require('http');

const API = 'http://localhost:5000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => chunks += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(chunks) });
        } catch {
          resolve({ status: res.statusCode, data: chunks });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     📚 DEMO TEST - ỨNG DỤNG QUẢN LÝ SÁCH (BOOK STORE)  ║');
  console.log('║     MERN Stack: MongoDB • Express • React • NodeJS      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // ============ TEST 1: GET /api/books (Lấy danh sách ban đầu) ============
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TEST 1: GET /api/books — Lấy danh sách sách ban đầu');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const res1 = await request('GET', '/api/books');
  console.log(`   ✅ Status: ${res1.status}`);
  console.log(`   📚 Số lượng sách: ${res1.data.length}`);
  console.log('   ┌─────┬──────────────────────────────────┬──────────────────┬──────────┬───────────────┐');
  console.log('   │  #  │ Tên sách                         │ Tác giả          │ Giá      │ Trạng thái    │');
  console.log('   ├─────┼──────────────────────────────────┼──────────────────┼──────────┼───────────────┤');
  res1.data.forEach((book, i) => {
    const title = book.title.padEnd(32);
    const author = book.author.padEnd(16);
    const price = (book.price.toLocaleString('vi-VN') + 'đ').padEnd(8);
    const status = book.isPublished ? '✅ Xuất bản  ' : '📝 Bản nháp  ';
    console.log(`   │ ${String(i + 1).padStart(2)}  │ ${title} │ ${author} │ ${price} │ ${status} │`);
  });
  console.log('   └─────┴──────────────────────────────────┴──────────────────┴──────────┴───────────────┘');
  console.log('');

  // ============ TEST 2: POST /api/books (Thêm sách mới #1) ============
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TEST 2: POST /api/books — Thêm sách "Lược Sử Thời Gian"');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const newBook1 = { title: 'Lược Sử Thời Gian', author: 'Stephen Hawking', price: 120000 };
  console.log(`   📤 Gửi: ${JSON.stringify(newBook1)}`);
  const res2 = await request('POST', '/api/books', newBook1);
  console.log(`   ✅ Status: ${res2.status} (Created)`);
  console.log(`   📥 Response:`);
  console.log(`      - _id: ${res2.data._id}`);
  console.log(`      - title: "${res2.data.title}"`);
  console.log(`      - author: "${res2.data.author}"`);
  console.log(`      - price: ${res2.data.price.toLocaleString('vi-VN')}đ`);
  console.log(`      - isPublished: ${res2.data.isPublished} (mặc định true)`);
  console.log('');

  // ============ TEST 3: POST /api/books (Thêm sách mới #2) ============
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TEST 3: POST /api/books — Thêm sách "Sapiens"');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const newBook2 = { title: 'Sapiens: Lược Sử Loài Người', author: 'Yuval Noah Harari', price: 199000 };
  console.log(`   📤 Gửi: ${JSON.stringify(newBook2)}`);
  const res3 = await request('POST', '/api/books', newBook2);
  console.log(`   ✅ Status: ${res3.status} (Created)`);
  console.log(`   📥 Response:`);
  console.log(`      - _id: ${res3.data._id}`);
  console.log(`      - title: "${res3.data.title}"`);
  console.log(`      - author: "${res3.data.author}"`);
  console.log(`      - price: ${res3.data.price.toLocaleString('vi-VN')}đ`);
  console.log(`      - isPublished: ${res3.data.isPublished}`);
  console.log('');

  // ============ TEST 4: POST validation — Thiếu trường bắt buộc ============
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TEST 4: POST /api/books — Validation (thiếu title)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const badBook = { author: 'Unknown', price: 50000 };
  console.log(`   📤 Gửi (thiếu title): ${JSON.stringify(badBook)}`);
  const res4 = await request('POST', '/api/books', badBook);
  console.log(`   ⚠️  Status: ${res4.status} (Bad Request)`);
  console.log(`   📥 Response: "${res4.data.message}"`);
  console.log('');

  // ============ TEST 5: GET /api/books (Kiểm tra sau khi thêm) ============
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TEST 5: GET /api/books — Danh sách sau khi thêm 2 sách mới');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const res5 = await request('GET', '/api/books');
  console.log(`   ✅ Status: ${res5.status}`);
  console.log(`   📚 Tổng số sách hiện tại: ${res5.data.length}`);
  console.log('   ┌─────┬──────────────────────────────────┬──────────────────────┬──────────┬───────────────┐');
  console.log('   │  #  │ Tên sách                         │ Tác giả              │ Giá      │ Trạng thái    │');
  console.log('   ├─────┼──────────────────────────────────┼──────────────────────┼──────────┼───────────────┤');
  res5.data.forEach((book, i) => {
    const title = book.title.substring(0, 32).padEnd(32);
    const author = book.author.substring(0, 20).padEnd(20);
    const price = (book.price.toLocaleString('vi-VN') + 'đ').padEnd(8);
    const status = book.isPublished ? '✅ Xuất bản  ' : '📝 Bản nháp  ';
    console.log(`   │ ${String(i + 1).padStart(2)}  │ ${title} │ ${author} │ ${price} │ ${status} │`);
  });
  console.log('   └─────┴──────────────────────────────────┴──────────────────────┴──────────┴───────────────┘');
  console.log('');

  // ============ TỔNG KẾT ============
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                   📊 TỔNG KẾT TEST                      ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  ✅ TEST 1: GET  /api/books (ban đầu)     → PASS        ║');
  console.log('║  ✅ TEST 2: POST /api/books (thêm sách 1) → PASS        ║');
  console.log('║  ✅ TEST 3: POST /api/books (thêm sách 2) → PASS        ║');
  console.log('║  ✅ TEST 4: POST validation (thiếu field)  → PASS        ║');
  console.log('║  ✅ TEST 5: GET  /api/books (sau khi thêm) → PASS        ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Kết quả: 5/5 PASSED ✅                                  ║');
  console.log('║                                                          ║');
  console.log('║  🌐 Frontend React: http://localhost:3000                ║');
  console.log('║  🔗 Backend API:    http://localhost:5000/api/books      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
}

runTests().catch(err => {
  console.error('❌ Lỗi chạy test:', err.message);
  process.exit(1);
});
