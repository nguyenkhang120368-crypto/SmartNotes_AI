import { AnalysisResult } from '../types';

export const curriculumPresets: Record<string, AnalysisResult> = {
  // === LỚP 6: KHOA HỌC TỰ NHIÊN ===
  "KHTN 6 (Kết nối tri thức)": {
    title: "Bài 6: Đo nhiệt độ - Thang nhiệt độ Celsius & Fahrenheit",
    grade: "Lớp 6",
    subject: "Khoa học tự nhiên",
    semester: "Học kì I",
    summary: "Hệ thống ghi chép đã được số hóa thành công. Nội dung cốt lõi: 1. Khái niệm nhiệt độ là số đo độ nóng, lạnh của vật; 2. Cảm giác của tay chỉ mang tính tương đối; 3. Thang nhiệt độ Celsius (°C) lấy mốc 0°C là nhiệt độ nước đá đang tan và 100°C là nhiệt độ nước sôi; 4. Các bước thao tác đo nhiệt độ bằng nhiệt kế chất lỏng và y tế an toàn.",
    structuredSections: [
      {
        type: "concept",
        heading: "1. Khái niệm Nhiệt độ",
        content: "Nhiệt độ là số đo độ nóng, lạnh của vật. Vật càng nóng thì nhiệt độ càng cao. Dụng cụ đo nhiệt độ là nhiệt kế."
      },
      {
        type: "formula",
        heading: "2. Chuyển đổi Thang đo Nhiệt độ",
        content: "Công thức chuyển đổi Celsius sang Fahrenheit: t(°F) = (t(°C) × 1.8) + 32. Ngược lại: t(°C) = (t(°F) - 32) / 1.8."
      },
      {
        type: "note",
        heading: "3. Quy tắc an toàn khi dùng nhiệt kế thủy ngân",
        content: "Thủy ngân là kim loại lỏng rất độc hại khi bay hơi. Nếu làm vỡ nhiệt kế, tuyệt đối không dùng chổi quét hay máy hút bụi, dùng bột lưu huỳnh rắc lên nếu có và báo ngay cho giáo viên/phụ huynh."
      }
    ],
    mindmap: [
      {
        node: "Khái niệm Nhiệt độ",
        children: ["Số đo độ nóng lạnh của vật", "Cảm giác xúc giác mang tính chủ quan", "Nhiệt kế là dụng cụ đo khách quan"]
      },
      {
        node: "Thang đo Nhiệt độ",
        children: ["Thang Celsius (°C): 0°C đá tan, 100°C nước sôi", "Thang Fahrenheit (°F): 32°F và 212°F", "Thang Kelvin (K): Không tuyệt đối 0 K (-273.15°C)"]
      },
      {
        node: "Nhiệt kế & Thao tác đo",
        children: ["Hiện tượng giãn nở vì nhiệt của chất lỏng", "Chọn GHĐ và ĐCNN phù hợp", "Mắt nhìn vuông góc thang chia độ"]
      }
    ],
    auditChecks: [
      {
        status: "warning",
        issue: "Học sinh thường ghi nhầm: 'Nước sôi ở 100°C trong mọi điều kiện áp suất'.",
        suggestion: "Đính chính chuẩn SGK: Nước sôi ở 100°C chỉ ở 'áp suất khí quyển tiêu chuẩn' (1 atm). Trên đỉnh núi cao áp suất thấp, nước sôi ở nhiệt độ dưới 100°C."
      },
      {
        status: "verified",
        issue: "Thao tác vẩy nhiệt kế y tế: Cần vẩy mạnh xuống dưới mức 35°C trước khi kẹp nách.",
        suggestion: "Ghi chép của học sinh đã nêu đúng bước này."
      }
    ],
    illustrationImages: [
      {
        caption: "Hình 6.1: Cấu tạo các loại nhiệt kế thông dụng (Nhiệt kế thủy ngân, nhiệt kế rượu, nhiệt kế điện tử)",
        source: "Trích từ SGK Khoa học tự nhiên 6, Trang 24 - Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)",
        url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=60"
      },
      {
        caption: "Hình 6.2: Thí nghiệm cảm giác nhiệt với ba chậu nước (Nước lạnh, nước nguội, nước ấm)",
        source: "Trích từ SGK Khoa học tự nhiên 6, Trang 23 - NXB Giáo dục Việt Nam",
        url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60"
      }
    ],
    academicSources: [
      {
        title: "Sách giáo khoa Khoa học Tự nhiên 6 (Bài 6 - Đo nhiệt độ) - Bộ Kết nối tri thức với cuộc sống",
        link: "https://www.nxbgd.vn"
      },
      {
        title: "Học liệu số Thí nghiệm an toàn KHTN 6 - Bộ Giáo dục và Đào tạo",
        link: "https://moet.gov.vn"
      }
    ],
    flashcards: [
      { q: "Trong thang Celsius, nhiệt độ của nước đá đang tan và nước sôi lần lượt là bao nhiêu?", a: "0°C và 100°C (ở áp suất khí quyển tiêu chuẩn)" },
      { q: "Nhiệt kế rượu và nhiệt kế thủy ngân hoạt động dựa trên hiện tượng vật lý nào?", a: "Sự nở vì nhiệt của chất lỏng (nở ra khi nóng lên, co lại khi lạnh đi)" }
    ]
  },

  // === LỚP 7: TOÁN HỌC ===
  "Toán 7 (Kết nối tri thức)": {
    title: "Chương I: Tập hợp các số hữu tỉ - Các phép tính trong tập hợp Q",
    grade: "Lớp 7",
    subject: "Toán học",
    semester: "Học kì I",
    summary: "Nội dung ghi chép tập trung vào: 1. Định nghĩa số hữu tỉ là số viết được dưới dạng phân số a/b (a, b ∈ Z, b ≠ 0); 2. Biểu diễn số hữu tỉ trên trục số và xác định số đối; 3. Quy tắc cộng, trừ, nhân, chia, lũy thừa với số mũ tự nhiên; 4. Quy tắc chuyển vế trong giải phương trình.",
    structuredSections: [
      {
        type: "concept",
        heading: "1. Định nghĩa Số hữu tỉ",
        content: "Số hữu tỉ là số viết được dưới dạng phân số a/b với a, b thuộc Z, b khác 0. Tập hợp các số hữu tỉ kí hiệu là Q."
      },
      {
        type: "formula",
        heading: "2. Quy tắc Lũy thừa của số hữu tỉ",
        content: "(x · y)ⁿ = xⁿ · yⁿ; (x / y)ⁿ = xⁿ / yⁿ (y ≠ 0); (xᵐ)ⁿ = x^(m · n); xᵐ · xⁿ = x^(m + n)."
      },
      {
        type: "rule",
        heading: "3. Quy tắc Chuyển vế",
        content: "Khi chuyển một số hạng từ vế này sang vế kia của một đẳng thức, ta phải đổi dấu số hạng đó: '+' thành '-' và '-' thành '+'."
      }
    ],
    mindmap: [
      {
        node: "Tập hợp Số hữu tỉ Q",
        children: ["Dạng a/b (a, b ∈ Z, b ≠ 0)", "Mỗi số hữu tỉ biểu diễn bởi 1 điểm trên trục số", "Số đối của x là -x sao cho x + (-x) = 0"]
      },
      {
        node: "Các phép tính cơ bản",
        children: ["Quy đồng mẫu số khi cộng/trừ", "Nhân/Chia: Phép nhân phân số và nghịch đảo", "Lũy thừa với số mũ tự nhiên"]
      },
      {
        node: "Thứ tự & Quy tắc tính",
        children: ["Thực hiện trong ngoặc trước (tròn -> vuông -> nhọn)", "Nhân chia trước, cộng trừ sau", "Quy tắc bỏ dấu ngoặc và chuyển vế"]
      }
    ],
    auditChecks: [
      {
        status: "warning",
        issue: "Học sinh quên điều kiện mẫu số b ≠ 0 trong định nghĩa số hữu tỉ.",
        suggestion: "Cần bổ sung điều kiện 'b ≠ 0' vì phép chia cho 0 không có nghĩa trong toán học."
      },
      {
        status: "warning",
        issue: "Ghi chép ghi sai: (-2/3)² = -4/9.",
        suggestion: "Đính chính: Bình phương của một số luôn không âm, (-2/3)² = (-2)² / 3² = 4/9."
      }
    ],
    illustrationImages: [
      {
        caption: "Hình 1.3: Trục số biểu diễn vị trí các số hữu tỉ dương và số hữu tỉ âm",
        source: "Trích SGK Toán 7 tập 1, Trang 7 - Bộ Kết nối tri thức với cuộc sống (NXBGD)",
        url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60"
      },
      {
        caption: "Hình 1.5: Sơ đồ bao hàm giữa các tập hợp số tự nhiên N ⊂ Z ⊂ Q",
        source: "Trích SGK Toán 7 tập 1, Trang 9 - NXB Giáo dục Việt Nam",
        url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60"
      }
    ],
    academicSources: [
      {
        title: "SGK Toán 7 - Tập 1 (Bộ Kết nối tri thức với cuộc sống) - NXB Giáo dục Việt Nam",
        link: "https://www.nxbgd.vn"
      },
      {
        title: "Chuyên đề số học THCS - Cổng học liệu số Bộ GD&ĐT",
        link: "https://moet.gov.vn"
      }
    ],
    flashcards: [
      { q: "Số hữu tỉ được định nghĩa như thế nào?", a: "Là số viết được dưới dạng phân số a/b (a, b ∈ Z, b ≠ 0)" },
      { q: "Quy tắc chuyển vế trong đẳng thức là gì?", a: "Chuyển một số hạng sang vế đối diện phải đổi dấu số hạng đó (+ đổi thành -, - đổi thành +)" }
    ]
  },

  // === LỚP 9: VẬT LÝ ===
  "Vật lý 9 (Kết nối tri thức)": {
    title: "Bài 1: Định luật Ôm - Đoạn mạch nối tiếp và song song",
    grade: "Lớp 9",
    subject: "Vật lý",
    semester: "Học kì I",
    summary: "Số hóa kiến thức trọng tâm Điện học: 1. Cường độ dòng điện I tỉ lệ thuận với hiệu điện thế U và tỉ lệ nghịch với điện trở R (I = U / R); 2. Đơn vị điện trở là Ôm (Ω); 3. Đoạn mạch nối tiếp: I chung, U cộng, Rtd = R1 + R2; 4. Đoạn mạch song song: U chung, I cộng, 1/Rtd = 1/R1 + 1/R2.",
    structuredSections: [
      {
        type: "formula",
        heading: "1. Định luật Ôm",
        content: "I = U / R (Trong đó I là cường độ dòng điện tính bằng A, U là hiệu điện thế tính bằng V, R là điện trở tính bằng Ω)."
      },
      {
        type: "rule",
        heading: "2. Quy tắc đoạn mạch nối tiếp",
        content: "I = I₁ = I₂; U = U₁ + U₂; R_td = R₁ + R₂; U₁ / U₂ = R₁ / R₂."
      },
      {
        type: "rule",
        heading: "3. Quy tắc đoạn mạch song song",
        content: "U = U₁ = U₂; I = I₁ + I₂; 1 / R_td = 1 / R₁ + 1 / R₂ (hoặc R_td = (R₁ · R₂) / (R₁ + R₂))."
      }
    ],
    mindmap: [
      {
        node: "Định luật Ôm",
        children: ["Công thức I = U / R", "Đồ thị biểu diễn U theo I là đường thẳng qua gốc tọa độ O", "Điện trở R đặc trưng cho mức độ cản trở dòng điện"]
      },
      {
        node: "Đoạn mạch nối tiếp",
        children: ["Cường độ dòng điện như nhau tại mọi điểm", "Hiệu điện thế bằng tổng các hiệu điện thế thành phần", "Điện trở tương đương lớn hơn từng điện trở thành phần"]
      },
      {
        node: "Đoạn mạch song song",
        children: ["Hiệu điện thế như nhau ở hai đầu các nhánh", "Cường độ dòng điện mạch chính bằng tổng các mạch rẽ", "Điện trở tương đương nhỏ hơn mỗi điện trở thành phần"]
      }
    ],
    auditChecks: [
      {
        status: "warning",
        issue: "Học sinh viết công thức mạch song song: R_td = R1 + R2.",
        suggestion: "Sai hoàn toàn! Đây là công thức của mạch nối tiếp. Mạch song song phải là: 1/R_td = 1/R1 + 1/R2."
      },
      {
        status: "verified",
        issue: "Mắc Ampe kế: Nối tiếp vào mạch điện, cực dương về phía cực dương nguồn điện.",
        suggestion: "Ghi chép chính xác theo nguyên tắc thực hành phòng thí nghiệm."
      }
    ],
    illustrationImages: [
      {
        caption: "Hình 1.1: Sơ đồ mạch điện thí nghiệm khảo sát sự phụ thuộc của I vào U",
        source: "Trích SGK Vật lý 9, Trang 4 - NXB Giáo dục Việt Nam",
        url: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=60"
      },
      {
        caption: "Hình 2.2: Sơ đồ đoạn mạch gồm hai điện trở mắc song song có công tắc K",
        source: "Trích SGK Vật lý 9, Trang 11 - NXB Giáo dục Việt Nam",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60"
      }
    ],
    academicSources: [
      {
        title: "SGK Vật lý 9 - Chương I Điện học - NXB Giáo dục Việt Nam",
        link: "https://www.nxbgd.vn"
      },
      {
        title: "Hướng dẫn thực hành thí nghiệm Điện học - Bộ GD&ĐT",
        link: "https://moet.gov.vn"
      }
    ],
    flashcards: [
      { q: "Phát biểu định luật Ôm cho đoạn mạch?", a: "Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây" },
      { q: "Khi hai điện trở giống nhau R1 = R2 = 10Ω mắc song song thì Rtd bằng bao nhiêu?", a: "Rtd = 10 / 2 = 5Ω (nhỏ hơn từng điện trở thành phần)" }
    ]
  },

  // === LỚP 8: NGỮ VĂN ===
  "Ngữ văn 8 (Kết nối tri thức)": {
    title: "Bài 1: Vẻ đẹp cổ điển - Văn học hiện thực và hồi ký trữ tình",
    grade: "Lớp 8",
    subject: "Ngữ văn",
    semester: "Học kì I",
    summary: "Nội dung phân tích: 1. Đặc trưng thể loại truyện ngắn và hồi ký giàu chất thơ; 2. Nghệ thuật miêu tả diễn biến tâm trạng nhân vật qua chi tiết cử chỉ, ánh mắt và độc thoại nội tâm; 3. Các biện pháp tu từ tiêu biểu (so sánh, nhân hóa, ẩn dụ chuyển đổi cảm giác); 4. Giá trị nhân đạo sâu sắc ca ngợi tình cảm gia đình, lòng tự trọng của con người.",
    structuredSections: [
      {
        type: "concept",
        heading: "1. Thể loại Truyện ngắn trữ tình",
        content: "Là thể loại tự sự cỡ nhỏ, cốt truyện cô đọng, giàu cảm xúc, chú trọng khai thác chiều sâu tâm tư, tình cảm và khoảnh khắc rung động của con người trước cuộc đời."
      },
      {
        type: "rule",
        heading: "2. Nghệ thuật miêu tả nội tâm",
        content: "Miêu tả trực tiếp qua dòng suy nghĩ, độc thoại nội tâm hoặc gián tiếp qua cảnh vật thiên nhiên nhuốm màu tâm trạng (nghệ thuật tả cảnh ngụ tình)."
      }
    ],
    mindmap: [
      {
        node: "Đặc trưng Thể loại",
        children: ["Cốt truyện ngắn gọn, tập trung", "Nhân vật được khắc họa qua tâm lý sâu sắc", "Kết hợp nhuần nhuyễn tự sự với trữ tình"]
      },
      {
        node: "Nghệ thuật Ngôn từ",
        children: ["Ngôn ngữ trong sáng, giàu nhạc điệu", "Biện pháp tu từ so sánh, ẩn dụ", "Hình ảnh biểu tượng giàu sức gợi"]
      },
      {
        node: "Giá trị Nhân văn",
        children: ["Tình mẫu tử, tình thầy trò thiêng liêng", "Tôn vinh phẩm giá và lòng tự trọng", "Bồi dưỡng lòng nhân ái, sự sẻ chia"]
      }
    ],
    auditChecks: [
      {
        status: "warning",
        issue: "Học sinh nhầm lẫn giữa 'Độc thoại' và 'Độc thoại nội tâm'.",
        suggestion: "Đính chính: 'Độc thoại' là nói to thành lời với chính mình; còn 'Độc thoại nội tâm' là suy nghĩ thầm kín trong tâm trí, không phát ra thành âm thanh."
      }
    ],
    illustrationImages: [
      {
        caption: "Hình minh họa: Khung cảnh buổi sớm mùa thu ngày đầu tiên tới trường làng",
        source: "Trích từ SGK Ngữ văn 8 tập 1, Trang 12 - Bộ Kết nối tri thức với cuộc sống (NXBGD)",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60"
      }
    ],
    academicSources: [
      {
        title: "SGK Ngữ văn 8 Tập 1 - Bộ Kết nối tri thức với cuộc sống - NXBGD",
        link: "https://www.nxbgd.vn"
      }
    ],
    flashcards: [
      { q: "Thế nào là biện pháp nghệ thuật tả cảnh ngụ tình?", a: "Là cách mượn việc miêu tả cảnh vật thiên nhiên để gián tiếp bộc lộ tâm trạng, cảm xúc của nhân vật hoặc tác giả" },
      { q: "Ngôi kể thứ nhất ('tôi') mang lại tác dụng gì cho tác phẩm tự sự?", a: "Tạo cảm giác chân thực, gần gũi và trực tiếp giãi bày thế giới nội tâm nhân vật" }
    ]
  },

  // === LỚP 5: TIỂU HỌC - TOÁN 5 ===
  "Toán 5 (Kết nối tri thức)": {
    title: "Chủ đề 3: Số thập phân và các phép tính với số thập phân",
    grade: "Lớp 5",
    subject: "Toán học",
    semester: "Học kì I",
    summary: "Số hóa kiến thức trọng tâm Toán lớp 5: 1. Khái niệm phân số thập phân và số thập phân gồm phần nguyên và phần thập phân ngăn cách bởi dấu phẩy; 2. So sánh số thập phân; 3. Quy tắc cộng, trừ, nhân, chia số thập phân; 4. Vận dụng tính diện tích hình thang, hình tròn và giải toán tỉ số phần trăm.",
    structuredSections: [
      {
        type: "concept",
        heading: "1. Cấu tạo Số thập phân",
        content: "Mỗi số thập phân gồm hai phần: phần nguyên (bên trái dấu phẩy) và phần thập phân (bên phải dấu phẩy). Ví dụ: 24,56 có phần nguyên là 24, phần thập phân là 56 phần trăm."
      },
      {
        type: "rule",
        heading: "2. Quy tắc Đặt tính và Tính",
        content: "Cộng, trừ số thập phân: Viết các chữ số ở cùng một hàng đặt thẳng cột với nhau, dấu phẩy thẳng cột với dấu phẩy. Thực hiện tính như số tự nhiên rồi đặt dấu phẩy ở kết quả thẳng cột."
      }
    ],
    mindmap: [
      {
        node: "Khái niệm Số thập phân",
        children: ["Hàng phần mười, hàng phần trăm, hàng phần nghìn", "Đọc và viết số thập phân", "Số thập phân bằng nhau (viết thêm/bỏ bớt chữ số 0 tận cùng)"]
      },
      {
        node: "Phép tính với số thập phân",
        children: ["Cộng và trừ đặt thẳng cột dấu phẩy", "Nhân với 10, 100, 1000 chuyển dấu phẩy sang phải", "Chia cho 10, 100, 1000 chuyển dấu phẩy sang trái"]
      }
    ],
    auditChecks: [
      {
        status: "warning",
        issue: "Học sinh thường quên đếm tổng số chữ số ở phần thập phân của cả hai thừa số khi thực hiện phép nhân.",
        suggestion: "Nhớ quy tắc: Tích có bao nhiêu chữ số ở phần thập phân thì dùng dấu phẩy tách ở tích ra bấy nhiêu chữ số kể từ phải sang trái."
      }
    ],
    illustrationImages: [
      {
        caption: "Bảng cấu tạo hàng của số thập phân chuẩn Tiểu học",
        source: "Trích từ SGK Toán 5, Trang 38 - Bộ sách Kết nối tri thức với cuộc sống (NXBGD)",
        url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&auto=format&fit=crop&q=60"
      }
    ],
    academicSources: [
      {
        title: "SGK Toán 5 - Bộ sách Kết nối tri thức với cuộc sống - NXB Giáo dục Việt Nam",
        link: "https://www.nxbgd.vn"
      }
    ],
    flashcards: [
      { q: "Muốn nhân một số thập phân với 10, 100, 1000 ta làm thế nào?", a: "Chuyển dấu phẩy của số đó lần lượt sang bên phải một, hai, ba,... chữ số" },
      { q: "Số 0,75 viết dưới dạng phân số thập phân là gì?", a: "75/100 (rút gọn thành 3/4)" }
    ]
  },

  // === LỚP 3: TIỂU HỌC - TIẾNG VIỆT 3 ===
  "Tiếng Việt 3 (Kết nối tri thức)": {
    title: "Tuần 4: Mái trường mến yêu - Từ ngữ chỉ sự vật và câu Ai là gì?",
    grade: "Lớp 3",
    subject: "Tiếng Việt",
    semester: "Học kì I",
    summary: "Nội dung ghi chép của học sinh lớp 3: 1. Mở rộng vốn từ về trường học, thầy cô, bạn bè, đồ dùng học tập; 2. Nhận biết và đặt câu theo mẫu 'Ai (cái gì, con gì) là gì?' dùng để giới thiệu, nhận định; 3. Quy tắc viết hoa tên người, tên địa lí Việt Nam.",
    structuredSections: [
      {
        type: "rule",
        heading: "1. Kiểu câu 'Ai là gì?'",
        content: "Gồm hai bộ phận chính: Bộ phận 1 trả lời cho câu hỏi 'Ai? (Cái gì?, Con gì?)'; Bộ phận 2 trả lời cho câu hỏi 'Là gì?' (thường bắt đầu bằng từ 'là'). Ví dụ: 'Trường học là ngôi nhà thứ hai của em'."
      },
      {
        type: "rule",
        heading: "2. Viết hoa tên riêng",
        content: "Khi viết tên người, tên địa lý Việt Nam, cần viết hoa chữ cái đầu của mỗi tiếng tạo thành tên đó. Ví dụ: Nguyễn Du, Hà Nội, Đà Nẵng."
      }
    ],
    mindmap: [
      {
        node: "Từ ngữ Trường học",
        children: ["Người: Thầy giáo, cô giáo, hiệu trưởng, bạn học", "Đồ vật: Bảng đen, phấn trắng, cặp sách, vở ghi", "Hoạt động: Học bài, múa hát, tập thể dục"]
      },
      {
        node: "Kiểu câu Ai là gì?",
        children: ["Bộ phận 1: Ai / Cái gì / Con gì", "Từ nối: là", "Bộ phận 2: Là gì (giới thiệu hoặc nhận định)"]
      }
    ],
    auditChecks: [
      {
        status: "warning",
        issue: "Học sinh viết không viết hoa tên riêng: 'hà nội', 'nguyễn văn a'.",
        suggestion: "Sửa lại: 'Hà Nội', 'Nguyễn Văn A' theo đúng quy tắc chính tả SGK Tiếng Việt 3."
      }
    ],
    illustrationImages: [
      {
        caption: "Hình vẽ minh họa: Giờ ra chơi rộn ràng dưới sân trường xanh mát",
        source: "Trích từ SGK Tiếng Việt 3 tập 1, Trang 26 - Bộ Kết nối tri thức (NXBGD)",
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60"
      }
    ],
    academicSources: [
      {
        title: "SGK Tiếng Việt 3 - Tập 1 (Bộ Kết nối tri thức với cuộc sống) - NXBGD",
        link: "https://www.nxbgd.vn"
      }
    ],
    flashcards: [
      { q: "Câu 'Sách là người bạn tốt của em' thuộc kiểu câu nào?", a: "Kiểu câu 'Ai (cái gì) là gì?' dùng để nhận định" }
    ]
  }
};
