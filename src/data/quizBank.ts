import { QuizQuestion } from '../types';

export const sampleQuizzesBank: QuizQuestion[] = [
  // ==================== KHỐI 1 ====================
  {
    id: 't1_1',
    grade: 'Lớp 1',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số thích hợp điền vào dấu hỏi chấm trong dãy số: 1, 2, 3, ?, 5 là:',
    options: ['4', '6', '7', '0'],
    answer: 0,
    explanation: 'Dãy số tự nhiên đếm tăng dần 1 đơn vị: 1, 2, 3, 4, 5.'
  },
  {
    id: 't1_2',
    grade: 'Lớp 1',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Em hãy viết phép tính cộng tương ứng với tình huống: Có 3 con chim trên cành, thêm 2 con chim bay đến.',
    answer: 'Phép tính là: 3 + 2 = 5 (con chim).',
    explanation: 'Có 3 con chim thêm 2 con chim nữa tức là làm phép cộng 3 + 2 = 5.'
  },
  {
    id: 'tv1_1',
    grade: 'Lớp 1',
    semester: 'Học kì I',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Tiếng nào sau đây có chứa âm "c"?',
    options: ['Cá', 'Gà', 'Lá', 'Mẹ'],
    answer: 0,
    explanation: 'Tiếng "cá" gồm âm "c" đứng trước và âm "a" đứng sau cùng dấu sắc.'
  },

  // ==================== KHỐI 2 ====================
  {
    id: 't2_1',
    grade: 'Lớp 2',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Kết quả của phép tính 38 + 25 là:',
    options: ['53', '63', '65', '73'],
    answer: 1,
    explanation: '38 + 25 = (30 + 20) + (8 + 5) = 50 + 13 = 63.'
  },
  {
    id: 't2_2',
    grade: 'Lớp 2',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Một ngày có bao nhiêu giờ? Một giờ có bao nhiêu phút?',
    answer: 'Một ngày có 24 giờ. Một giờ có 60 phút.',
    explanation: 'Đây là quy chuẩn đơn vị đo thời gian chuẩn trong SGK Toán 2 Kết nối tri thức.'
  },
  {
    id: 'tv2_1',
    grade: 'Lớp 2',
    semester: 'Học kì I',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Từ nào sau đây là từ chỉ hoạt động của học sinh?',
    options: ['Cặp sách', 'Đọc bài', 'Xinh đẹp', 'Bảng đen'],
    answer: 1,
    explanation: '"Đọc bài" là từ chỉ hành động, hoạt động học tập của học sinh.'
  },

  // ==================== KHỐI 3 ====================
  {
    id: 't3_1',
    grade: 'Lớp 3',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Một hình vuông có cạnh dài 5 cm. Chu vi của hình vuông đó là:',
    options: ['10 cm', '15 cm', '20 cm', '25 cm'],
    answer: 2,
    explanation: 'Chu vi hình vuông = Cạnh × 4 = 5 × 4 = 20 cm.'
  },
  {
    id: 't3_2',
    grade: 'Lớp 3',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Nêu quy tắc tính giá trị biểu thức chỉ có phép tính cộng, trừ hoặc chỉ có phép tính nhân, chia?',
    answer: 'Nếu biểu thức chỉ có phép tính cộng, trừ (hoặc chỉ có nhân, chia) thì ta thực hiện các phép tính theo thứ tự từ trái sang phải.',
    explanation: 'Quy tắc thứ tự thực hiện phép tính Toán 3 - Sách Kết nối tri thức.'
  },
  {
    id: 'tv3_1',
    grade: 'Lớp 3',
    semester: 'Học kì I',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Câu "Trăng tròn như quả bóng" sử dụng biện pháp nghệ thuật gì?',
    options: ['So sánh', 'Nhân hóa', 'Điệp từ', 'Ẩn dụ'],
    answer: 0,
    explanation: 'Câu sử dụng từ so sánh "như" để so sánh vẻ tròn của "trăng" với "quả bóng".'
  },

  // ==================== KHỐI 4 ====================
  {
    id: 't4_1',
    grade: 'Lớp 4',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số trung bình cộng của ba số 15, 25 và 50 là:',
    options: ['25', '30', '35', '40'],
    answer: 1,
    explanation: 'Trung bình cộng = (15 + 25 + 50) / 3 = 90 / 3 = 30.'
  },
  {
    id: 't4_2',
    grade: 'Lớp 4',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Em hãy nêu dấu hiệu chia hết cho 2 và dấu hiệu chia hết cho 5?',
    answer: '1. Các số có chữ số tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2.\n2. Các số có chữ số tận cùng là 0 hoặc 5 thì chia hết cho 5.',
    explanation: 'Dấu hiệu nhận biết số chia hết lớp 4 Kết nối tri thức.'
  },
  {
    id: 'kh4_1',
    grade: 'Lớp 4',
    semester: 'Học kì I',
    subject: 'Khoa học',
    type: 'mc',
    question: 'Nước tồn tại ở những thể nào trong tự nhiên?',
    options: ['Thể lỏng', 'Thể khí (hơi)', 'Thể rắn', 'Cả 3 thể: lỏng, khí và rắn'],
    answer: 3,
    explanation: 'Nước có thể tồn tại ở cả 3 thể: lỏng (nước sinh hoạt, mưa), khí (hơi nước) và rắn (băng, tuyết).'
  },

  // ==================== KHỐI 5 ====================
  {
    id: 't5_1',
    grade: 'Lớp 5',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Phân số 3/4 viết dưới dạng số thập phân là:',
    options: ['0,34', '0,75', '3,4', '0,43'],
    answer: 1,
    explanation: '3/4 = (3 × 25) / (4 × 25) = 75/100 = 0,75.'
  },
  {
    id: 't5_2',
    grade: 'Lớp 5',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Nêu công thức tính diện tích hình thang có hai đáy a, b và chiều cao h?',
    answer: 'Diện tích hình thang bằng tổng độ dài hai đáy nhân với chiều cao (cùng một đơn vị đo) rồi chia cho 2.\nCông thức: S = (a + b) × h / 2.',
    explanation: 'Công thức diện tích hình thang SGK Toán 5 Kết nối tri thức.'
  },
  {
    id: 'kh5_1',
    grade: 'Lớp 5',
    semester: 'Học kì I',
    subject: 'Khoa học',
    type: 'mc',
    question: 'Chất khí nào trong không khí duy trì sự cháy và sự sống của con người và động vật?',
    options: ['Khí Nitơ', 'Khí Oxy (Oxygen)', 'Khí Cacbonic', 'Khí Hidro'],
    answer: 1,
    explanation: 'Khí Oxy (O2) duy trì sự hô hấp và sự cháy trong tự nhiên.'
  },

  // ==================== KHỐI 6 ====================
  {
    id: 'khtn6_1',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Trong thang đo Celsius, nhiệt độ của nước đá đang tan và nước đang sôi ở áp suất tiêu chuẩn lần lượt là:',
    options: ['0°C và 100°C', '32°F và 212°F', '0°C và 50°C', '-10°C và 110°C'],
    answer: 0,
    explanation: 'Theo SGK KHTN 6 Kết nối tri thức, trong thang Celsius mốc 0°C là nước đá tan và 100°C là nước sôi.'
  },
  {
    id: 'khtn6_2',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'essay',
    question: 'Nêu các bước sử dụng nhiệt kế y tế hoặc nhiệt kế chất lỏng đúng cách khi đo nhiệt độ cơ thể hoặc chất lỏng?',
    answer: '1. Ước lượng nhiệt độ cần đo để chọn nhiệt kế có GHĐ và ĐCNN phù hợp.\n2. Vẩy mạnh nhiệt kế y tế để thủy ngân tụt xuống dưới mức 35°C.\n3. Đặt bầu nhiệt kế vào vị trí đo (nách, miệng hoặc ngâm trong chất lỏng).\n4. Đợi từ 3-5 phút cho nhiệt độ ổn định, sau đó đọc kết quả nhìn vuông góc với thang chia.',
    explanation: 'Học sinh cần nắm vững 4 bước chuẩn thao tác thực hành thí nghiệm và đảm bảo an toàn.'
  },
  {
    id: 'khtn6_3',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Đơn vị đo nhiệt độ chính thức được sử dụng phổ biến trong đời sống và giáo dục tại Việt Nam là:',
    options: ['Độ Fahrenheit (°F)', 'Độ Celsius (°C)', 'Độ Kelvin (K)', 'Joule (J)'],
    answer: 1,
    explanation: 'Độ C (°C) là đơn vị chính thức trong chương trình phổ thông và hệ thống đo lường tại Việt Nam.'
  },
  {
    id: 'khtn6_4',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'essay',
    question: 'Tại sao cảm giác của bàn tay không thể dùng làm chuẩn chính xác để đo độ nóng lạnh của một vật?',
    answer: 'Vì cảm giác của da tay mang tính chủ quan và phụ thuộc vào nhiệt độ ban đầu của bàn tay (nếu tay đang lạnh nhúng vào nước ấm sẽ thấy rất nóng, ngược lại). Do đó bắt buộc phải dùng dụng cụ đo khách quan là nhiệt kế.',
    explanation: 'Hiện tượng đánh lừa cảm giác nhiệt đã được chứng minh qua thí nghiệm ba chậu nước ở Bài 6 KHTN 6.'
  },
  {
    id: 'toan6_1',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Tập hợp các số nguyên Z bao gồm những thành phần nào?',
    options: [
      'Các số nguyên âm, số 0 và các số nguyên dương',
      'Chỉ các số nguyên dương',
      'Các số tự nhiên và phân số',
      'Số thập phân và số nguyên âm'
    ],
    answer: 0,
    explanation: 'Tập hợp Z = {... -3, -2, -1, 0, 1, 2, 3 ...} gồm số nguyên âm, số 0 và số nguyên dương.'
  },

  // ==================== KHỐI 7 ====================
  {
    id: 'toan7_1',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số nào sau đây KHÔNG phải là số hữu tỉ?',
    options: ['-3/4', '0', '√2', '2.5'],
    answer: 2,
    explanation: '√2 là số vô tỉ (số thập phân vô hạn không tuần hoàn), không thể viết dưới dạng phân số a/b với a, b thuộc Z.'
  },
  {
    id: 'toan7_2',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Phát biểu định lý tổng ba góc trong một tam giác và nêu tính chất góc ngoài của tam giác?',
    answer: '1. Định lý: Tổng ba góc trong một tam giác bất kì luôn bằng 180°.\n2. Tính chất: Mỗi góc ngoài của một tam giác có số đo bằng tổng số đo hai góc trong không kề với nó.',
    explanation: 'Kiến thức cốt lõi phần Hình học phẳng Lớp 7 - Sách Kết nối tri thức.'
  },
  {
    id: 'toan7_3',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Kết quả của phép tính (-2/3)^3 là:',
    options: ['-8/27', '8/27', '-6/9', '-8/9'],
    answer: 0,
    explanation: '(-2/3)^3 = (-2)^3 / 3^3 = -8 / 27.'
  },
  {
    id: 'toan7_4',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Nêu ba trường hợp bằng nhau cơ bản của hai tam giác thường?',
    answer: '1. Trường hợp Cạnh - Cạnh - Cạnh (c-c-c)\n2. Trường hợp Cạnh - Góc - Cạnh (c-g-c, góc xen giữa)\n3. Trường hợp Góc - Cạnh - Góc (g-c-g, hai góc kề một cạnh).',
    explanation: 'Các trường hợp bằng nhau của tam giác là cơ sở để chứng minh hình học THCS.'
  },
  {
    id: 'ls7_1',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Lịch sử & Địa lý',
    type: 'mc',
    question: 'Triều đại phong kiến nào ở Việt Nam đã ba lần đánh tan quân xâm lược Mông - Nguyên vào thế kỷ XIII?',
    options: ['Nhà Lý', 'Nhà Trần', 'Nhà Tiền Lê', 'Nhà Hậu Lê'],
    answer: 1,
    explanation: 'Triều đại Nhà Trần dưới sự lãnh đạo kiệt xuất của vua Trần và Quốc công Tiết chế Trần Hưng Đạo đã ba lần chiến thắng oanh liệt quân Mông - Nguyên.'
  },

  // ==================== KHỐI 8 ====================
  {
    id: 'nguvan8_1',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Văn bản "Tôi đi học" của nhà văn Thanh Tịnh thuộc thể loại nào?',
    options: ['Truyện ngắn mang chất trữ tình hồi tưởng', 'Tiểu thuyết chương hồi', 'Kịch nói', 'Thơ tự do'],
    answer: 0,
    explanation: 'Tác phẩm "Tôi đi học" là truyện ngắn giàu chất thơ ghi lại cảm xúc bỡ ngỡ của nhân vật "tôi" trong buổi tựu trường đầu tiên.'
  },
  {
    id: 'nguvan8_2',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Ngữ văn',
    type: 'essay',
    question: 'Nêu ý nghĩa nhân đạo và giá trị hiện thực sâu sắc trong tác phẩm "Lão Hạc" của nhà văn Nam Cao?',
    answer: '1. Giá trị hiện thực: Tái hiện chân thực số phận cùng cực, đói nghèo của người nông dân Việt Nam trước Cách mạng tháng Tám.\n2. Giá trị nhân đạo: Khẳng định và ngợi ca phẩm chất lương thiện, lòng tự trọng cao cả cùng tình phụ tử thiêng liêng, vị tha của người cha dành cho con trai.',
    explanation: 'Tác phẩm tiêu biểu của trào lưu văn học hiện thực phê phán 1930 - 1945.'
  },
  {
    id: 'hoa8_1',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Hóa học',
    type: 'mc',
    question: 'Một mol chất khí bất kì ở điều kiện chuẩn (25°C và 1 bar) chiếm thể tích là bao nhiêu?',
    options: ['22,4 lít', '24,79 lít', '24 lít', '18,5 lít'],
    answer: 1,
    explanation: 'Theo chuẩn chương trình GDPT 2018 (SGK Kết nối tri thức), 1 mol khí ở điều kiện chuẩn (25°C, 1 bar) chiếm thể tích xấp xỉ 24,79 lít.'
  },
  {
    id: 'hoa8_2',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Hóa học',
    type: 'essay',
    question: 'Phát biểu định luật bảo toàn khối lượng và viết biểu thức khối lượng cho phản ứng A + B -> C + D?',
    answer: '1. Định luật: Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng.\n2. Biểu thức: m_A + m_B = m_C + m_D.',
    explanation: 'Định luật Lô-mô-nô-xốp và La-voa-đi-ê là nền tảng tính toán hóa học.'
  },

  // ==================== KHỐI 9 ====================
  {
    id: 'vatly9_1',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Vật lý',
    type: 'mc',
    question: 'Định luật Ôm (Ohm) được biểu diễn bằng hệ thức toán học nào sau đây?',
    options: ['I = U / R', 'I = U * R', 'U = I / R', 'R = I / U'],
    answer: 0,
    explanation: 'Hệ thức I = U / R: Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế U và tỉ lệ nghịch với điện trở R.'
  },
  {
    id: 'vatly9_2',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Vật lý',
    type: 'essay',
    question: 'Phát biểu định luật Jun - Len-xơ (Joule - Lenz) và viết công thức tính nhiệt lượng tỏa ra trên dây dẫn?',
    answer: 'Nhiệt lượng tỏa ra ở một dây dẫn khi có dòng điện chạy qua tỉ lệ thuận với bình phương cường độ dòng điện, với điện trở của dây dẫn và thời gian dòng điện chạy qua.\nCông thức: Q = I² · R · t (trong đó Q tính bằng Jun, I bằng Ampe, R bằng Ôm, t bằng giây).',
    explanation: 'Định luật giải thích tác dụng nhiệt của dòng điện trong các thiết bị điện như ấm đun, bàn ủi.'
  },
  {
    id: 'vatly9_3',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Vật lý',
    type: 'mc',
    question: 'Hiện tượng khúc xạ ánh sáng là hiện tượng tia sáng truyền từ môi trường trong suốt này sang môi trường trong suốt khác bị:',
    options: ['Gãy khúc tại mặt phân cách giữa hai môi trường', 'Dừng lại hoàn toàn', 'Bật ngược trở lại môi trường cũ', 'Tăng tốc độ gấp đôi'],
    answer: 0,
    explanation: 'Khúc xạ ánh sáng là hiện tượng gãy khúc của tia sáng tại mặt phân cách khi truyền xiên góc giữa hai môi trường trong suốt.'
  },
  {
    id: 'vatly9_4',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Vật lý',
    type: 'essay',
    question: 'Phân biệt thấu kính hội tụ và thấu kính phân kì về hình dạng và tính chất ảnh của một vật thật đặt ngoài khoảng tiêu cự?',
    answer: '1. Hình dạng: Thấu kính hội tụ có phần rìa mỏng hơn phần giữa. Thấu kính phân kì có phần rìa dày hơn phần giữa.\n2. Tính chất ảnh ngoài khoảng tiêu cự: Thấu kính hội tụ cho ảnh thật ngược chiều với vật. Thấu kính phân kì luôn luôn cho ảnh ảo cùng chiều và nhỏ hơn vật.',
    explanation: 'Đây là câu hỏi trọng tâm thường xuất hiện trong các bài kiểm tra quang học Lớp 9.'
  },
  {
    id: 'toan9_1',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Điều kiện xác định của biểu thức căn bậc hai √(2x - 6) là:',
    options: ['x ≥ 3', 'x > 3', 'x ≤ 3', 'x < 3'],
    answer: 0,
    explanation: 'Biểu thức dưới dấu căn không âm: 2x - 6 ≥ 0 <=> 2x ≥ 6 <=> x ≥ 3.'
  },
  {
    id: 'toan9_2',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'essay',
    question: 'Phát biểu định lý Vi-ét cho phương trình bậc hai ax² + bx + c = 0 (a ≠ 0) khi có hai nghiệm x1, x2?',
    answer: 'Nếu x1, x2 là hai nghiệm của phương trình ax² + bx + c = 0 (a ≠ 0) thì:\nx1 + x2 = -b / a\nx1 · x2 = c / a.',
    explanation: 'Định lý Vi-ét là công cụ giải và biện luận phương trình bậc hai quan trọng nhất THCS.'
  }
];
