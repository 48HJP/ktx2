# 📚 Book Store — Warhammer 40K Edition (MERN Stack)

> **Bài Kiểm Tra Thực Hành MERN Stack (Mini Project) — Ứng Dụng Quản Lý Sách**  
> *Chủ đề thiết kế: Librarium Imperialis (Warhammer 40,000 Imperial Gothic)*

---

## 🌟 Giới thiệu Dự án

Ứng dụng Quản lý Sách được xây dựng hoàn chỉnh theo kiến trúc **MERN Stack** (MongoDB, ExpressJS, ReactJS, NodeJS) đáp ứng trọn vẹn các yêu cầu:
- **MongoDB**: Quản lý cơ sở dữ liệu `BookStoreDB`, collection `books` với Schema định nghĩa đầy đủ `title`, `author`, `price`, `isPublished`.
- **Backend (ExpressJS)**:
  - `GET /api/books`: Truy xuất danh sách toàn bộ sách có trong hệ thống.
  - `POST /api/books`: Thêm mới sách với cơ chế validation đầy đủ các trường bắt buộc và chặn giá tiền âm.
- **Frontend (ReactJS)**: Giao diện độc đáo lấy cảm hứng từ Warhammer 40K (*Librarium Imperialis*), hỗ trợ form thêm sách tức thì không cần tải lại trang và danh mục cổ thư / thẻ bài Relic Gothic.

---

## 📁 Cấu trúc Thư mục

```
10_8/
├── server.js               # Khởi chạy Express server (Port 5000) & kết nối MongoDB
├── package.json            # Cấu hình & thư viện backend
├── .env                    # Cấu hình biến môi trường
├── seed.js                 # Script nạp dữ liệu sách mẫu ban đầu
├── demoTest.js             # Script tự động kiểm thử 5 kịch bản API
├── testInsertData.js       # Script kiểm tra nhập dữ liệu mới & validation
├── models/
│   └── Book.js             # Mongoose Schema & Model cho Book
├── routes/
│   └── bookRoutes.js       # Express Router định nghĩa API GET & POST /api/books
└── client/                 # Ứng dụng ReactJS Frontend (Port 3000)
    ├── package.json
    ├── public/
    │   └── index.html      # HTML root, Google Fonts (Cinzel, MedievalSharp)
    └── src/
        ├── index.js
        ├── App.js          # Component chính: State, API fetch, form, table
        └── App.css         # Theme Warhammer 40K Imperial Gothic
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Khởi chạy Backend (Node.js & Express)
```bash
# Cài đặt thư viện backend
npm install

# (Tùy chọn) Nạp dữ liệu sách mẫu
node seed.js

# Khởi động server
node server.js
```
*Backend lắng nghe tại: `http://localhost:5000`*

### 2. Khởi chạy Frontend (ReactJS)
```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt thư viện frontend
npm install

# Chạy ứng dụng React
npm start
```
*Giao diện mở tự động tại: `http://localhost:3000`*

---

## 📋 Danh sách API Endpoints

| Phương thức | Endpoint | Mô tả | Trạng thái thành công |
|:---:|:---:|---|:---:|
| **GET** | `/api/books` | Lấy danh sách toàn bộ sách trong database | `200 OK` |
| **POST** | `/api/books` | Thêm một cuốn sách mới vào database | `201 Created` |

---

## 🧪 Chạy Kiểm Thử Tự Động (Automated Testing)

```bash
# Kiểm thử 5 kịch bản cơ bản
node demoTest.js

# Kiểm thử nạp dữ liệu nâng cao & validation lỗi
node testInsertData.js
```

---
*⚔️ FOR THE EMPEROR — MERN STACK MINI PROJECT ⚔️*
