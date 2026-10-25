const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} = require('docx');

const FONT_BODY = 'Times New Roman';
const FONT_CODE = 'Consolas';
const PRIMARY_COLOR = '1F4E79';
const SECONDARY_COLOR = '2E75B6';
const TEXT_COLOR = '262626';

function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 32, // 16pt
        font: FONT_BODY,
        color: PRIMARY_COLOR
      })
    ]
  });
}

function createSubtitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 300 },
    children: [
      new TextRun({
        text: text,
        italics: true,
        size: 24, // 12pt
        font: FONT_BODY,
        color: '595959'
      })
    ]
  });
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 28, // 14pt
        font: FONT_BODY,
        color: PRIMARY_COLOR
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 26, // 13pt
        font: FONT_BODY,
        color: SECONDARY_COLOR
      })
    ]
  });
}

function createHeading3(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 24, // 12pt
        font: FONT_BODY,
        color: '333333'
      })
    ]
  });
}

function createParagraph(runs, spacing = { before: 60, after: 80 }) {
  const children = Array.isArray(runs)
    ? runs.map(r => (typeof r === 'string' ? new TextRun({ text: r, font: FONT_BODY, size: 24, color: TEXT_COLOR }) : r))
    : [new TextRun({ text: runs, font: FONT_BODY, size: 24, color: TEXT_COLOR })];

  return new Paragraph({
    spacing,
    lineSpacing: 276, // 1.15 line height
    children
  });
}

function createBullet(runs) {
  const children = Array.isArray(runs)
    ? runs.map(r => (typeof r === 'string' ? new TextRun({ text: r, font: FONT_BODY, size: 24, color: TEXT_COLOR }) : r))
    : [new TextRun({ text: runs, font: FONT_BODY, size: 24, color: TEXT_COLOR })];

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    lineSpacing: 276,
    children
  });
}

function createCodeBlock(codeString) {
  const lines = codeString.trim().split('\n');
  return lines.map((line, idx) => {
    return new Paragraph({
      spacing: {
        before: idx === 0 ? 100 : 0,
        after: idx === lines.length - 1 ? 100 : 0
      },
      shading: {
        type: ShadingType.CLEAR,
        fill: 'F2F4F7'
      },
      children: [
        new TextRun({
          text: line,
          font: FONT_CODE,
          size: 19, // 9.5pt
          color: '1E1E1E'
        })
      ]
    });
  });
}

function createStyledTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: '1F4E79' },
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: h.text,
              bold: true,
              font: FONT_BODY,
              size: 22,
              color: 'FFFFFF'
            })
          ]
        })
      ],
      width: { size: h.width, type: WidthType.DXA }
    }))
  });

  const bodyRows = rows.map((row, rIdx) => {
    const bgColor = rIdx % 2 === 0 ? 'FFFFFF' : 'F9FAFB';
    return new TableRow({
      children: row.map((cellText, cIdx) => new TableCell({
        shading: { type: ShadingType.CLEAR, fill: bgColor },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        children: [
          new Paragraph({
            lineSpacing: 260,
            children: [
              new TextRun({
                text: cellText,
                font: FONT_BODY,
                size: 22,
                color: TEXT_COLOR,
                bold: cIdx === 0
              })
            ]
          })
        ],
        width: { size: headers[cIdx].width, type: WidthType.DXA }
      }))
    });
  });

  return new Table({
    width: { size: 9600, type: WidthType.DXA },
    rows: [headerRow, ...bodyRows],
    alignment: AlignmentType.CENTER
  });
}

async function buildDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // Header info
          createTitle('BÀI LÀM KIỂM TRA PHÁT TRIỂN ỨNG DỤNG WEB'),
          createSubtitle('Môn học: Phát triển Ứng dụng Web — Thời gian làm bài: 75 phút'),

          createParagraph([
            new TextRun({ text: 'Họ và tên sinh viên: ', bold: true }),
            new TextRun({ text: '..........................................................     ' }),
            new TextRun({ text: 'Mã số sinh viên: ', bold: true }),
            new TextRun({ text: '....................................' })
          ]),
          createParagraph([
            new TextRun({ text: 'Lớp học phần: ', bold: true }),
            new TextRun({ text: '................................................................     ' }),
            new TextRun({ text: 'Ngày kiểm tra: ', bold: true }),
            new TextRun({ text: '....................................' })
          ], { before: 0, after: 200 }),

          // PHẦN 1
          createHeading1('PHẦN 1: TỰ LUẬN LÝ THUYẾT (3 Điểm)'),

          createHeading2('Câu 1 (Node.js - 1.0 điểm): Kiến trúc Single-threaded Non-blocking I/O trong Node.js'),
          createHeading3('1. Khái niệm và bản chất kiến trúc:'),
          createBullet([
            new TextRun({ text: 'Single-threaded (Đơn luồng): ', bold: true }),
            'Toàn bộ mã nguồn JavaScript của ứng dụng chạy trên một luồng chính duy nhất (Main Thread) với một Call Stack duy nhất.'
          ]),
          createBullet([
            new TextRun({ text: 'Non-blocking I/O (I/O không chặn): ', bold: true }),
            'Khi gặp các thao tác vào/ra tốn thời gian (truy vấn cơ sở dữ liệu, đọc/ghi tệp tin trên ổ cứng, gửi/nhận yêu cầu mạng HTTP), Node.js không dừng luồng chính để chờ kết quả mà chuyển giao (offload) tác vụ đó xuống tầng hệ thống nền tảng xử lý bất đồng bộ.'
          ]),

          createHeading3('2. Cơ chế phối hợp xử lý hàng ngàn yêu cầu đồng thời:'),
          createParagraph('Node.js sử dụng mô hình Event-Driven Architecture với 3 thành phần cốt lõi:'),
          createBullet([
            new TextRun({ text: 'Call Stack: ', bold: true }),
            'Nơi thực thi trực tiếp các đoạn mã JavaScript đồng bộ trên luồng chính.'
          ]),
          createBullet([
            new TextRun({ text: 'libuv & OS Kernel: ', bold: true }),
            'Thư viện tầng C++ cung cấp Thread Pool (mặc định 4 worker threads) và tận dụng cơ chế I/O bất đồng bộ của nhân hệ điều hành (như epoll trên Linux, kqueue trên macOS, IOCP trên Windows). Các thao tác I/O nặng được xử lý ngầm ở tầng này mà không chiếm dụng luồng chính.'
          ]),
          createBullet([
            new TextRun({ text: 'Event Loop & Callback Queue: ', bold: true }),
            'Khi một tác vụ I/O ngầm hoàn thành, callback tương ứng được đẩy vào Callback Queue. Event Loop liên tục giám sát: ngay khi Call Stack trống rỗng, nó sẽ lấy callback từ Queue đưa lên Call Stack để thực thi và gửi phản hồi cho client.'
          ]),

          createHeading3('3. So sánh mô hình xử lý:'),
          createParagraph('Khác với mô hình Multi-threaded truyền thống (mỗi request cấp 1 thread riêng, dễ gây cạn kiệt bộ nhớ RAM và tiêu tốn CPU do chi phí Context-Switching), Node.js chỉ cần 1 luồng chính điều phối liên tục. Do đó, Node.js cực kỳ vượt trội trong các ứng dụng I/O-intensive (API server, chat realtime, streaming). Lưu ý: Node.js không tối ưu cho các tác vụ CPU-intensive (mã hóa nặng, xử lý video) vì sẽ block Call Stack.'),

          createHeading2('Câu 2 (React - 1.0 điểm): Cơ chế hoạt động của useEffect Hook trong React'),
          createHeading3('1. Khái niệm:'),
          createParagraph('useEffect là Hook quản lý các Side Effects (tác dụng phụ) trong React Functional Component (gọi API lấy dữ liệu, đăng ký sự kiện, thao tác trực tiếp với DOM, thiết lập timer). Effect function được thực thi sau khi component đã render và cập nhật DOM, tránh làm nghẽn quá trình hiển thị giao diện.'),

          createHeading3('2. Ý nghĩa của Dependency Array (Mảng phụ thuộc):'),
          createStyledTable(
            [
              { text: 'Cú pháp mảng phụ thuộc', width: 3600 },
              { text: 'Hành vi và thời điểm thực thi', width: 6000 }
            ],
            [
              [
                'useEffect(() => {...}) \n(Không truyền mảng)',
                'Effect chạy lại sau MỌI LẦN component render hoặc re-render.'
              ],
              [
                'useEffect(() => {...}, []) \n(Mảng rỗng)',
                'Effect chỉ chạy DUY NHẤT 1 LẦN sau lần render đầu tiên (tương đương componentDidMount).'
              ],
              [
                'useEffect(() => {...}, [a, b]) \n(Có phần tử phụ thuộc)',
                'Effect chạy sau lần đầu và CHỈ CHẠY LẠI khi có ít nhất một giá trị (a hoặc b) thay đổi qua phép so sánh Object.is.'
              ]
            ]
          ),

          createHeading3('3. Ví dụ bắt buộc sử dụng Cleanup Function để tránh Memory Leak:'),
          createParagraph('Trường hợp điển hình là đăng ký sự kiện toàn cục (window event listener) hoặc bộ đếm thời gian (setInterval):'),
          ...createCodeBlock(`function WindowTracker() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 1. Side effect: Đăng ký lắng nghe sự kiện resize của window
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // 2. Cleanup Function: Hủy đăng ký khi component bị gỡ bỏ (unmount)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // [] đảm bảo chỉ đăng ký một lần khi mount

  return <p>Chiều rộng màn hình: {width}px</p>;
}`),
          createParagraph([
            new TextRun({ text: 'Giải thích cơ chế: ', bold: true }),
            'Nếu không có hàm cleanup (removeEventListener), mỗi khi component bị unmount rồi mount lại, một event listener mới tiếp tục được tạo thêm trong khi listener cũ vẫn nằm trong bộ nhớ. Điều này dẫn đến hiện tượng tích lũy listener dư thừa, rò rỉ bộ nhớ (memory leak) và gây ra lỗi cập nhật state trên component đã bị hủy.'
          ]),

          createHeading2('Câu 3 (MongoDB - 1.0 điểm): So sánh NoSQL (MongoDB) vs RDBMS và Kịch bản lựa chọn'),
          createHeading3('1. Bảng so sánh khác biệt cốt lõi:'),
          createStyledTable(
            [
              { text: 'Tiêu chí', width: 2200 },
              { text: 'RDBMS (MySQL, PostgreSQL)', width: 3700 },
              { text: 'NoSQL (MongoDB)', width: 3700 }
            ],
            [
              [
                'Mô hình dữ liệu',
                'Bảng (Table) gồm các hàng (Row) và cột (Column) cố định.',
                'Tài liệu (Document) dạng BSON/JSON linh hoạt.'
              ],
              [
                'Lược đồ (Schema)',
                'Cố định (Rigid Schema): Phải khai báo cấu trúc bảng trước, thay đổi cần migration.',
                'Linh hoạt (Dynamic Schema): Các document trong cùng collection có thể có cấu trúc khác nhau.'
              ],
              [
                'Mối quan hệ dữ liệu',
                'Dùng Khóa ngoại (Foreign Key) và phép kết nối bảng (JOIN).',
                'Dữ liệu nhúng (Embedded Document) hoặc tham chiếu (Reference), hạn chế JOIN.'
              ],
              [
                'Khả năng mở rộng',
                'Scale dọc (Vertical Scaling): Nâng cấp phần cứng máy chủ (CPU, RAM).',
                'Scale ngang (Horizontal Scaling): Phân mảnh dữ liệu (Sharding) qua nhiều node dễ dàng.'
              ],
              [
                'Tính toàn vẹn (ACID)',
                'Tuân thủ nghiêm ngặt chuẩn ACID cho mọi giao dịch phức tạp.',
                'Mặc định đảm bảo ACID ở cấp độ document. Từ v4.0, MongoDB đã hỗ trợ Multi-Document Transactions, nhưng đây không phải thế mạnh cốt lõi và có chi phí hiệu năng cao hơn RDBMS.'
              ]
            ]
          ),

          createHeading3('2. Các kịch bản dự án MongoDB mang lại lợi thế vượt trội:'),
          createBullet([
            new TextRun({ text: 'Dữ liệu có cấu trúc thay đổi liên tục / không đồng nhất: ', bold: true }),
            'Hệ thống danh mục sản phẩm (E-commerce Catalog) nơi mỗi ngành hàng có thuộc tính riêng biệt (quần áo cần size/color, điện tử cần RAM/chip).'
          ]),
          createBullet([
            new TextRun({ text: 'Phát triển nhanh (Agile / MVP): ', bold: true }),
            'Ứng dụng giai đoạn đầu cần liên tục cải tiến cấu trúc dữ liệu mà không tốn công chạy migration bảng gây downtime hệ thống.'
          ]),
          createBullet([
            new TextRun({ text: 'Hệ thống Big Data & Ghi dữ liệu tần suất cao: ', bold: true }),
            'Hệ thống thu thập log sự kiện, dữ liệu thiết bị IoT, phân tích người dùng theo thời gian thực cần khả năng scale-out nhiều máy chủ.'
          ]),
          createBullet([
            new TextRun({ text: 'Dữ liệu dạng phân cấp tự nhiên: ', bold: true }),
            'Bài viết mạng xã hội chứa bình luận lồng nhau (nested comments) cho phép nhúng trực tiếp trong 1 document, truy vấn trọn vẹn chỉ trong 1 lần đọc.'
          ]),

          // PHẦN 2
          createHeading1('PHẦN 2: THỰC HÀNH VIẾT MÃ (7 Điểm)'),

          createHeading2('Câu 4: Backend - Thiết kế Cơ sở dữ liệu và API (3.5 Điểm)'),
          createHeading3('1. Thiết kế Schema Mongoose (models/Note.js - 1.5 điểm):'),
          ...createCodeBlock(`const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề ghi chú là bắt buộc'] // Bắt buộc
  },
  content: {
    type: String                                    // Nội dung
  },
  isPinned: {
    type: Boolean,
    default: false                                  // Mặc định là false
  },
  createdAt: {
    type: Date,
    default: Date.now                               // Tự động lưu thời gian tạo
  }
});

module.exports = mongoose.model('Note', noteSchema);`),

          createHeading3('2. Viết RESTful APIs (routes/noteRoutes.js - 2.0 điểm):'),
          ...createCodeBlock(`const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// [GET] /api/notes - Lấy toàn bộ ghi chú, sắp xếp mới nhất lên đầu
router.get('/', async (req, res) => {
  try {
    // Sắp xếp theo createdAt giảm dần (-1)
    const notes = await Note.find().sort({ createdAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Lỗi server khi lấy danh sách ghi chú', 
      error: error.message 
    });
  }
});

// [POST] /api/notes - Tạo một ghi chú mới dựa trên dữ liệu gửi lên từ req.body
router.post('/', async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;

    const newNote = new Note({
      title,
      content,
      isPinned
    });

    const savedNote = await newNote.save();
    return res.status(201).json(savedNote);
  } catch (error) {
    // Xử lý lỗi validation (ví dụ thiếu title bắt buộc)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ', 
        error: error.message 
      });
    }
    return res.status(500).json({ 
      message: 'Lỗi server khi tạo ghi chú', 
      error: error.message 
    });
  }
});

module.exports = router;`),

          createHeading2('Câu 5: Frontend - Giao diện người dùng NoteApp (3.5 Điểm)'),
          createParagraph('Component React hoàn chỉnh đáp ứng đầy đủ: kiểm tra response.ok, quản lý loading & error state, cleanup function bằng AbortController, form nhập liệu controlled, và cập nhật giao diện tức thì:'),
          ...createCodeBlock(`import React, { useState, useEffect } from 'react';

function NoteApp() {
  // 1. Quản lý State
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Hiển thị dữ liệu: Gọi GET /api/notes khi render lần đầu
  useEffect(() => {
    // Sử dụng AbortController làm cleanup function tránh memory leak
    const controller = new AbortController();

    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/notes', { signal: controller.signal });

        // Bắt buộc kiểm tra response.ok vì fetch không reject khi gặp lỗi 4xx/5xx
        if (!response.ok) {
          throw new Error(\`Lỗi server (\${response.status})\`);
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Không thể tải danh sách ghi chú');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Cleanup: Hủy request nếu component unmount trước khi nhận kết quả
    return () => controller.abort();
  }, []); // [] đảm bảo chỉ gọi 1 lần duy nhất khi mount

  // 3. Thêm mới dữ liệu: Xử lý submit form gọi POST /api/notes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề ghi chú');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });

      // Kiểm tra response.ok để không chèn object thông báo lỗi vào state notes
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Thêm ghi chú thất bại');
      }

      const newNote = await response.json();

      // 4. Cập nhật giao diện: Thêm ghi chú mới vào ĐẦU danh sách không reload trang
      setNotes((prevNotes) => [newNote, ...prevNotes]);

      // Reset form sau khi thêm thành công
      setTitle('');
      setContent('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Quản lý Ghi Chú</h1>

      {/* Form thêm mới */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Tiêu đề ghi chú..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Nội dung ghi chú..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit">Thêm Ghi Chú</button>
      </form>

      {/* Thông báo trạng thái */}
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {/* Danh sách ghi chú */}
      <div>
        {!loading && notes.length === 0 ? (
          <p>Chưa có ghi chú nào.</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }}>
              <h3>
                {note.title} {note.isPinned && '📌'}
              </h3>
              <p>{note.content}</p>
              <small>
                Tạo lúc: {new Date(note.createdAt).toLocaleString('vi-VN')}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoteApp;`),

          createParagraph([
            new TextRun({ text: '-- HẾT BÀI LÀM --', bold: true, italics: true })
          ], { before: 240, after: 120 })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, 'Bai_Kiem_Tra_Phat_Trien_Ung_Dung_Web.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ Đã tạo thành công file Word tại:', outputPath);
}

buildDocx().catch(err => {
  console.error('Lỗi tạo file Word:', err);
  process.exit(1);
});
