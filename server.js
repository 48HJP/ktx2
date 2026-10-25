const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes cho sách
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// cors(): Cho phép frontend (React chạy port 3000) gọi API backend (port 5000)
// express.json(): Parse body JSON từ request POST
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// API Routes — Gắn bookRoutes vào đường dẫn /api/books
app.use('/api/books', bookRoutes);

// Serve React app for any non-API route
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Kết nối tới MongoDB và khởi động server
async function startServer() {
  try {
    let mongoUri = process.env.MONGODB_URI;
    let isMemoryServer = false;

    // Sử dụng MongoDB Memory Server nếu không có MongoDB cài sẵn
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      isMemoryServer = true;
      console.log('📦 Sử dụng MongoDB Memory Server (in-memory)');
    } catch (e) {
      console.log('🔗 Kết nối tới MongoDB:', mongoUri);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Kết nối MongoDB thành công');

    // Seed dữ liệu mẫu sau khi đã kết nối DB
    if (isMemoryServer) {
      const Book = require('./models/Book');
      const count = await Book.countDocuments();
      if (count === 0) {
        await Book.insertMany([
          { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', price: 86000, isPublished: true },
          { title: 'Nhà Giả Kim', author: 'Paulo Coelho', price: 79000, isPublished: true },
          { title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', price: 95000, isPublished: true }
        ]);
        console.log('📚 Đã thêm 3 cuốn sách mẫu vào database');
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error.message);
    process.exit(1);
  }
}

startServer();
