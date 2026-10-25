// Script seed dữ liệu mẫu — Thêm 3 cuốn sách vào collection "books"
// Chạy: node seed.js
const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');

const sampleBooks = [
  {
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    price: 86000,
    isPublished: true
  },
  {
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 79000,
    isPublished: true
  },
  {
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    author: 'Rosie Nguyễn',
    price: 95000,
    isPublished: true
  }
];

async function seedData() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Kết nối MongoDB thành công');

    // Xóa dữ liệu cũ (nếu có) rồi thêm dữ liệu mẫu
    await Book.deleteMany({});
    console.log('🗑️ Đã xóa dữ liệu cũ trong collection books');

    const inserted = await Book.insertMany(sampleBooks);
    console.log(`📚 Đã thêm ${inserted.length} cuốn sách mẫu:`);
    inserted.forEach((book, i) => {
      console.log(`   ${i + 1}. "${book.title}" - ${book.author} - ${book.price}đ`);
    });

    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error.message);
    process.exit(1);
  }
}

seedData();
