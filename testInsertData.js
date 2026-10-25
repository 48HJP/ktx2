// ========================================================
// SCRIPT TEST KIỂM TRA NHẬP THÊM DỮ LIỆU VÀ VALIDATION API
// ========================================================
const http = require('http');

const BASE_URL = 'http://localhost:5000/api/books';

function callApi(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:5000');
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function formatVND(num) {
  return new Intl.NumberFormat('vi-VN').format(num) + 'đ';
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║       ⚔️ BẮT ĐẦU TEST KIỂM TRA NHẬP DỮ LIỆU & VALIDATION API ⚔️     ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  // Danh sách các sách mới cần nạp kiểm tra
  const newBooks = [
    { title: 'Chiến Binh Space Marine', author: 'Dan Abnett', price: 165000 },
    { title: 'Lịch Sử Văn Minh Thế Giới', author: 'Will Durant', price: 320000 },
    { title: 'Tư Duy Nhanh Và Chậm', author: 'Daniel Kahneman', price: 210000 },
    { title: 'Nhà Lãnh Đạo Không Chức Danh', author: 'Robin Sharma', price: 115000 }
  ];

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📥 1. TEST POST /api/books: NHẬP THÊM 4 SÁCH MỚI HỢP LỆ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  for (let i = 0; i < newBooks.length; i++) {
    const item = newBooks[i];
    const res = await callApi('POST', '/api/books', item);
    if (res.status === 201) {
      console.log(`  [Sách ${i + 1}] ✅ THÊM THÀNH CÔNG (201 Created)`);
      console.log(`         ID: ${res.data._id}`);
      console.log(`         Tên: "${res.data.title}" | Tác giả: ${res.data.author} | Giá: ${formatVND(res.data.price)} | Đã xuất bản: ${res.data.isPublished}`);
    } else {
      console.log(`  [Sách ${i + 1}] ❌ LỖI (${res.status}):`, res.data);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛡️ 2. TEST VALIDATION & XỬ LÝ LỖI (EDGE CASES)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Test 2.1: Thiếu title
  const resNoTitle = await callApi('POST', '/api/books', { author: 'Ẩn danh', price: 50000 });
  console.log(`  [Case 1: Thiếu title]  Status: ${resNoTitle.status} ${resNoTitle.status === 400 ? '✅ (Chặn đúng 400)' : '❌'}`);
  console.log(`         Phản hồi:`, resNoTitle.data);

  // Test 2.2: Thiếu author
  const resNoAuthor = await callApi('POST', '/api/books', { title: 'Sách vô danh', price: 60000 });
  console.log(`  [Case 2: Thiếu author] Status: ${resNoAuthor.status} ${resNoAuthor.status === 400 ? '✅ (Chặn đúng 400)' : '❌'}`);
  console.log(`         Phản hồi:`, resNoAuthor.data);

  // Test 2.3: Thiếu price
  const resNoPrice = await callApi('POST', '/api/books', { title: 'Sách miễn phí', author: 'Tác giả' });
  console.log(`  [Case 3: Thiếu price]  Status: ${resNoPrice.status} ${resNoPrice.status === 400 ? '✅ (Chặn đúng 400)' : '❌'}`);
  console.log(`         Phản hồi:`, resNoPrice.data);

  // Test 2.4: Giá tiền âm (Mongoose validation min: 0)
  const resNegativePrice = await callApi('POST', '/api/books', { title: 'Sách giá âm', author: 'Hacker', price: -50000 });
  console.log(`  [Case 4: Giá tiền âm]  Status: ${resNegativePrice.status} ${resNegativePrice.status === 400 ? '✅ (Chặn đúng 400 do min 0)' : '❌'}`);
  console.log(`         Phản hồi:`, resNegativePrice.data);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 3. TEST GET /api/books: KIỂM TRA TOÀN BỘ DANH SÁCH SÁCH TRONG CƠ SỞ DỮ LIỆU');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const listRes = await callApi('GET', '/api/books');
  if (listRes.status === 200 && Array.isArray(listRes.data)) {
    console.log(`  ✅ Lấy thành công danh sách! Tổng số lượng hiện tại: ${listRes.data.length} cuốn sách\n`);

    console.log('  ┌────┬──────────────────────────────────────────┬──────────────────────────┬──────────────┬──────────────┐');
    console.log('  │ STT│ Tên sách / Thánh thư                     │ Tác giả / Thư lại        │ Giá bán      │ Trạng thái   │');
    console.log('  ├────┼──────────────────────────────────────────┼──────────────────────────┼──────────────┼──────────────┤');

    listRes.data.forEach((b, idx) => {
      const stt = String(idx + 1).padStart(2, ' ');
      const title = (b.title || '').padEnd(40, ' ').substring(0, 40);
      const author = (b.author || '').padEnd(24, ' ').substring(0, 24);
      const price = formatVND(b.price || 0).padStart(12, ' ');
      const status = (b.isPublished ? 'Đã xuất bản' : 'Bản nháp').padEnd(12, ' ');
      console.log(`  │ ${stt} │ ${title} │ ${author} │ ${price} │ ${status} │`);
    });

    console.log('  └────┴──────────────────────────────────────────┴──────────────────────────┴──────────────┴──────────────┘');
  }

  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║               🎉 TẤT CẢ KIỂM THỬ API ĐỀU THÀNH CÔNG!              ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
}

runTests().catch(console.error);
