import { QuizQuestion } from '../types';

export const sampleQuizzesBank: QuizQuestion[] = [
  // ==================== KHỐI 1 (SGK Kết nối tri thức) ====================
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
    id: 't1_3',
    grade: 'Lớp 1',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Hình nào dưới đây có 3 cạnh và 3 đỉnh?',
    options: ['Hình tam giác', 'Hình tròn', 'Hình vuông', 'Hình chữ nhật'],
    answer: 0,
    explanation: 'Hình tam giác là hình học phẳng có 3 cạnh và 3 góc (3 đỉnh).'
  },
  {
    id: 't1_4',
    grade: 'Lớp 1',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số 45 gồm mấy chục và mấy đơn vị?',
    options: ['4 chục và 5 đơn vị', '5 chục và 4 đơn vị', '40 chục và 5 đơn vị', '4 đơn vị và 5 chục'],
    answer: 0,
    explanation: 'Số có hai chữ số 45 có chữ số 4 ở hàng chục (4 chục) và chữ số 5 ở hàng đơn vị (5 đơn vị).'
  },
  {
    id: 't1_5',
    grade: 'Lớp 1',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Phép tính 20 + 30 có kết quả bằng:',
    options: ['50', '60', '40', '70'],
    answer: 0,
    explanation: '2 chục + 3 chục = 5 chục = 50.'
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
  {
    id: 'tv1_2',
    grade: 'Lớp 1',
    semester: 'Học kì I',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Dấu thanh nào được dùng trong tiếng "Bàn"?',
    options: ['Thanh huyền', 'Thanh sắc', 'Thanh hỏi', 'Thanh ngã'],
    answer: 0,
    explanation: 'Tiếng "bàn" mang thanh huyền trên con chữ a.'
  },
  {
    id: 'tv1_3',
    grade: 'Lớp 1',
    semester: 'Học kì II',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Từ nào sau đây viết đúng chính tả?',
    options: ['Cây bàng', 'Cây bàn', 'Cây bàngh', 'Kây bàng'],
    answer: 0,
    explanation: 'Từ chỉ loài cây bóng mát quen thuộc ở sân trường là "cây bàng".'
  },
  {
    id: 'tv1_4',
    grade: 'Lớp 1',
    semester: 'Học kì II',
    subject: 'Tiếng Việt',
    type: 'essay',
    question: 'Em hãy viết một câu ngắn (từ 3-5 từ) giới thiệu về một người bạn cùng lớp của em.',
    answer: 'Ví dụ: Bạn Nam rất ngoan ngoãn. / Lan là bạn thân của em.',
    explanation: 'Câu trọn vẹn bắt đầu bằng chữ hoa và kết thúc bằng dấu chấm.'
  },
  {
    id: 'tnxh1_1',
    grade: 'Lớp 1',
    semester: 'Học kì I',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Các thành viên trong gia đình em gồm có những ai?',
    options: ['Bố, mẹ, anh chị em', 'Cô giáo và bạn bè', 'Bác bảo vệ trường', 'Bác sĩ'],
    answer: 0,
    explanation: 'Gia đình thường gồm ông bà, bố mẹ và con cái sống chung một mái nhà.'
  },
  {
    id: 'tnxh1_2',
    grade: 'Lớp 1',
    semester: 'Học kì II',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Để giữ gìn vệ sinh cơ thể, em nên đánh răng khi nào?',
    options: ['Buổi sáng sau khi thức dậy và buổi tối trước khi đi ngủ', 'Chỉ đánh răng 1 tuần 1 lần', 'Không cần đánh răng', 'Chỉ đánh răng khi ăn kẹo'],
    answer: 0,
    explanation: 'Đánh răng đều đặn ít nhất 2 lần/ngày để bảo vệ răng miệng khỏi sâu răng.'
  },
  {
    id: 'tnxh1_3',
    grade: 'Lớp 1',
    semester: 'Học kì II',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Cây xanh cần những yếu tố nào sau đây để sống và phát triển?',
    options: ['Ánh sáng, nước, không khí và chất dinh dưỡng', 'Chỉ cần bóng tối', 'Chỉ cần đồ chơi', 'Không cần gì cả'],
    answer: 0,
    explanation: 'Cây xanh cần nước, ánh sáng mặt trời, đất màu mỡ và không khí để lớn nhanh.'
  },

  // ==================== KHỐI 2 (SGK Kết nối tri thức) ====================
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
    id: 't2_3',
    grade: 'Lớp 2',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Trong phép trừ 72 - 28 = 44, số 72 được gọi là:',
    options: ['Số bị trừ', 'Số trừ', 'Hiệu', 'Tổng'],
    answer: 0,
    explanation: 'Trong phép trừ: Số bị trừ - Số trừ = Hiệu. Do đó 72 là Số bị trừ.'
  },
  {
    id: 't2_4',
    grade: 'Lớp 2',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Phép nhân 5 × 6 có kết quả bằng:',
    options: ['25', '30', '35', '40'],
    answer: 1,
    explanation: 'Theo bảng nhân 5: 5 × 6 = 30.'
  },
  {
    id: 't2_5',
    grade: 'Lớp 2',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số liền sau của số 99 là số nào?',
    options: ['98', '100', '101', '90'],
    answer: 1,
    explanation: 'Muốn tìm số liền sau của một số, ta lấy số đó cộng thêm 1 đơn vị: 99 + 1 = 100.'
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
  {
    id: 'tv2_2',
    grade: 'Lớp 2',
    semester: 'Học kì I',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Bộ phận in đậm trong câu "Bạn Lan **là học sinh giỏi**" trả lời cho câu hỏi nào?',
    options: ['Là gì?', 'Làm gì?', 'Thế nào?', 'Ở đâu?'],
    answer: 0,
    explanation: 'Mẫu câu "Ai là gì?" dùng từ "là" để giới thiệu hoặc nhận định về sự vật.'
  },
  {
    id: 'tv2_3',
    grade: 'Lớp 2',
    semester: 'Học kì II',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Dấu câu nào dùng để kết thúc câu kể?',
    options: ['Dấu chấm', 'Dấu chấm hỏi', 'Dấu chấm than', 'Dấu phẩy'],
    answer: 0,
    explanation: 'Dấu chấm dùng để kết thúc câu kể, khi câu diễn đạt một ý trọn vẹn.'
  },
  {
    id: 'tv2_4',
    grade: 'Lớp 2',
    semester: 'Học kì II',
    subject: 'Tiếng Việt',
    type: 'essay',
    question: 'Nêu ý nghĩa của việc trồng và bảo vệ cây xanh xung quanh trường học?',
    answer: 'Cây xanh cho bóng mát, cung cấp không khí trong lành, làm cho sân trường thêm xanh - sạch - đẹp và giúp học sinh có nơi vui chơi thoáng mát.',
    explanation: 'Giúp học sinh nâng cao ý thức bảo vệ môi trường theo SGK Tiếng Việt 2.'
  },
  {
    id: 'tnxh2_1',
    grade: 'Lớp 2',
    semester: 'Học kì I',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Cơ quan vận động của cơ thể người bao gồm các bộ phận nào?',
    options: ['Bộ xương và hệ cơ', 'Tim và phổi', 'Dạ dày và ruột', 'Mắt và tai'],
    answer: 0,
    explanation: 'Cơ quan vận động gồm có xương và cơ kết hợp giúp cơ thể cử động, đi lại.'
  },
  {
    id: 'tnxh2_2',
    grade: 'Lớp 2',
    semester: 'Học kì II',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Mặt Trời mọc ở hướng nào và lặn ở hướng nào?',
    options: ['Mọc ở hướng Đông, lặn ở hướng Tây', 'Mọc ở hướng Tây, lặn ở hướng Đông', 'Mọc ở hướng Bắc, lặn ở hướng Nam', 'Mọc ở hướng Nam, lặn ở hướng Bắc'],
    answer: 0,
    explanation: 'Quy luật tự nhiên: Mặt Trời mọc ở hướng Đông vào buổi sáng và lặn ở hướng Tây vào buổi chiều.'
  },

  // ==================== KHỐI 3 (SGK Kết nối tri thức) ====================
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
    id: 't3_3',
    grade: 'Lớp 3',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số lớn nhất có ba chữ số khác nhau là số nào?',
    options: ['999', '987', '978', '998'],
    answer: 1,
    explanation: 'Số có ba chữ số khác nhau lớn nhất thì hàng trăm lớn nhất (9), hàng chục lớn thứ hai (8), hàng đơn vị lớn thứ ba (7) -> 987.'
  },
  {
    id: 't3_4',
    grade: 'Lớp 3',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm. Diện tích hình chữ nhật đó là:',
    options: ['13 cm²', '26 cm²', '40 cm²', '45 cm²'],
    answer: 2,
    explanation: 'Diện tích hình chữ nhật = Chiều dài × Chiều rộng = 8 × 5 = 40 cm².'
  },
  {
    id: 't3_5',
    grade: 'Lớp 3',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: '1 kg bằng bao nhiêu gam?',
    options: ['10 g', '100 g', '1000 g', '10000 g'],
    answer: 2,
    explanation: '1 kilôgam = 1000 gam.'
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
  {
    id: 'tv3_2',
    grade: 'Lớp 3',
    semester: 'Học kì I',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Trong câu "Bác kim giờ thận trọng, nhích từng li từng li", sự vật nào đã được nhân hóa?',
    options: ['Bác kim giờ', 'Từng li', 'Thận trọng', 'Thời gian'],
    answer: 0,
    explanation: 'Kim giờ được gọi bằng "Bác" và có tính nết "thận trọng" giống như một con người.'
  },
  {
    id: 'tv3_3',
    grade: 'Lớp 3',
    semester: 'Học kì II',
    subject: 'Tiếng Việt',
    type: 'mc',
    question: 'Từ ngữ nào sau đây là từ ngữ chỉ vẻ đẹp của thiên nhiên?',
    options: ['Hùng vĩ, tươi đẹp, tráng lệ', 'Cần cù, siêng năng', 'Thông minh, sáng dạ', 'Kính trọng, lễ phép'],
    answer: 0,
    explanation: '"Hùng vĩ", "tươi đẹp" là tính từ miêu tả cảnh quan thiên nhiên non nước.'
  },
  {
    id: 'tnxh3_1',
    grade: 'Lớp 3',
    semester: 'Học kì I',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Cơ quan hô hấp của con người gồm những bộ phận nào?',
    options: ['Mũi, khí quản, phế quản và hai lá phổi', 'Tim và mạch máu', 'Não bộ và tủy sống', 'Dạ dày và gan'],
    answer: 0,
    explanation: 'Đường dẫn khí gồm mũi, khí quản, phế quản và cơ quan trao đổi khí là hai lá phổi.'
  },
  {
    id: 'tnxh3_2',
    grade: 'Lớp 3',
    semester: 'Học kì II',
    subject: 'Tự nhiên và Xã hội',
    type: 'mc',
    question: 'Trái Đất là hành tinh thứ mấy tính từ Mặt Trời trở ra trong Hệ Mặt Trời?',
    options: ['Hành tinh thứ 1', 'Hành tinh thứ 2', 'Hành tinh thứ 3', 'Hành tinh thứ 4'],
    answer: 2,
    explanation: 'Thứ tự các hành tinh từ Mặt Trời: Sao Thủy, Sao Kim, Trái Đất (vị trí thứ 3).'
  },

  // ==================== KHỐI 4 (SGK Kết nối tri thức) ====================
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
    id: 't4_3',
    grade: 'Lớp 4',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Hai góc đối đỉnh thì có số đo như thế nào với nhau?',
    options: ['Bằng nhau', 'Bù nhau', 'Gấp đôi nhau', 'Không liên quan'],
    answer: 0,
    explanation: 'Kiến thức góc: Hai góc đối đỉnh luôn có số đo bằng nhau.'
  },
  {
    id: 't4_4',
    grade: 'Lớp 4',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Rút gọn phân số 18/24 về phân số tối giản ta được:',
    options: ['9/12', '6/8', '3/4', '2/3'],
    answer: 2,
    explanation: 'Chia cả tử và mẫu cho ƯCLN là 6: 18:6 / 24:6 = 3/4.'
  },
  {
    id: 't4_5',
    grade: 'Lớp 4',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Một hình bình hành có độ dài đáy 12 cm và chiều cao 7 cm. Diện tích của hình bình hành là:',
    options: ['84 cm²', '42 cm²', '19 cm²', '96 cm²'],
    answer: 0,
    explanation: 'Diện tích hình bình hành = Đáy × Chiều cao = 12 × 7 = 84 cm².'
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
  {
    id: 'kh4_2',
    grade: 'Lớp 4',
    semester: 'Học kì I',
    subject: 'Khoa học',
    type: 'essay',
    question: 'Nêu vai trò của không khí đối với sự cháy và đời sống sinh vật?',
    answer: 'Không khí chứa oxy (chiếm khoảng 21%) duy trì sự hô hấp của con người, động thực vật và duy trì sự cháy. Nếu không có oxy, ngọn lửa sẽ tắt và sinh vật không thể hô hấp.',
    explanation: 'Thí nghiệm úp cốc thủy tinh lên ngọn nến đang cháy trong SGK Khoa học 4.'
  },
  {
    id: 'kh4_3',
    grade: 'Lớp 4',
    semester: 'Học kì II',
    subject: 'Khoa học',
    type: 'mc',
    question: 'Âm thanh lan truyền được qua những môi trường nào?',
    options: ['Chất rắn, chất lỏng và chất khí', 'Chỉ chất khí', 'Chỉ chất lỏng', 'Môi trường chân không'],
    answer: 0,
    explanation: 'Âm thanh truyền được qua chất rắn, lỏng, khí nhưng không truyền được trong chân không.'
  },
  {
    id: 'ls4_1',
    grade: 'Lớp 4',
    semester: 'Học kì I',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Kinh đô đầu tiên của nhà nước Văn Lang đóng tại đâu?',
    options: ['Phong Châu (Phú Thọ)', 'Cổ Loa (Đông Anh, Hà Nội)', 'Hoa Lư (Ninh Bình)', 'Thăng Long (Hà Nội)'],
    answer: 0,
    explanation: 'Thời các vua Hùng, kinh đô nước Văn Lang đặt tại Phong Châu (nay thuộc tỉnh Phú Thọ).'
  },
  {
    id: 'ls4_2',
    grade: 'Lớp 4',
    semester: 'Học kì II',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Dãy núi nào được mệnh danh là nóc nhà của Đông Dương với đỉnh Fansipan?',
    options: ['Dãy Hoàng Liên Sơn', 'Dãy Trường Sơn Bắc', 'Dãy Bạch Mã', 'Dãy Đông Triều'],
    answer: 0,
    explanation: 'Dãy Hoàng Liên Sơn có đỉnh Fansipan cao 3.143m, là đỉnh núi cao nhất 3 nước Đông Dương.'
  },

  // ==================== KHỐI 5 (SGK Kết nối tri thức) ====================
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
    id: 't5_3',
    grade: 'Lớp 5',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Tìm 20% của 350 kg?',
    options: ['70 kg', '60 kg', '80 kg', '35 kg'],
    answer: 0,
    explanation: '20% của 350 = 350 × 20 / 100 = 70 kg.'
  },
  {
    id: 't5_4',
    grade: 'Lớp 5',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Một ô tô đi với vận tốc 54 km/h trong thời gian 2,5 giờ. Quãng đường ô tô đi được là:',
    options: ['135 km', '125 km', '108 km', '140 km'],
    answer: 0,
    explanation: 'Quãng đường s = v × t = 54 × 2,5 = 135 km.'
  },
  {
    id: 't5_5',
    grade: 'Lớp 5',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Thể tích hình lập phương có cạnh dài 4 cm là:',
    options: ['16 cm³', '64 cm³', '32 cm³', '48 cm³'],
    answer: 1,
    explanation: 'Thể tích hình lập phương = Cạnh × Cạnh × Cạnh = 4 × 4 × 4 = 64 cm³.'
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
  {
    id: 'kh5_2',
    grade: 'Lớp 5',
    semester: 'Học kì II',
    subject: 'Khoa học',
    type: 'mc',
    question: 'Các nguồn năng lượng sạch, tái tạo được con người ngày càng tận dụng phổ biến là:',
    options: ['Năng lượng mặt trời, gió và sức nước', 'Than đá và dầu mỏ', 'Khí đốt tự nhiên', 'Khí ga hóa lỏng'],
    answer: 0,
    explanation: 'Mặt trời, gió, thủy triều là nguồn năng lượng tái tạo thân thiện với môi trường.'
  },
  {
    id: 'ls5_1',
    grade: 'Lớp 5',
    semester: 'Học kì I',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào ngày nào?',
    options: ['19/8/1945', '2/9/1945', '30/4/1975', '7/5/1954'],
    answer: 1,
    explanation: 'Ngày 2/9/1945 tại Quảng trường Ba Đình lịch sử, Bác Hồ đã đọc bản Tuyên ngôn Độc lập.'
  },
  {
    id: 'ls5_2',
    grade: 'Lớp 5',
    semester: 'Học kì II',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Chiến thắng lịch sử Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?',
    options: ['1945', '1954', '1968', '1975'],
    answer: 1,
    explanation: 'Chiến thắng Điện Biên Phủ kết thúc vào ngày 7/5/1954.'
  },

  // ==================== KHỐI 6 (SGK Kết nối tri thức) ====================
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
    id: 'khtn6_5',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Vật thể nào sau đây là vật thể tự nhiên?',
    options: ['Cây bàng', 'Bàn gỗ', 'Xe đạp', 'Bình thủy tinh'],
    answer: 0,
    explanation: 'Vật thể tự nhiên là những vật thể có sẵn trong tự nhiên, ví dụ như sinh vật sống, cây cỏ, khoáng sản.'
  },
  {
    id: 'khtn6_6',
    grade: 'Lớp 6',
    semester: 'Học kì II',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Tế bào là đơn vị cơ bản cấu tạo nên sinh vật. Bào quan nào là trung tâm điều khiển mọi hoạt động sống của tế bào?',
    options: ['Nhân tế bào', 'Màng tế bào', 'Chất tế bào', 'Lục lạp'],
    answer: 0,
    explanation: 'Nhân tế bào (hoặc vùng nhân) chứa vật chất di truyền và điều khiển toàn bộ quá trình trao đổi chất.'
  },
  {
    id: 'khtn6_7',
    grade: 'Lớp 6',
    semester: 'Học kì II',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Năng lượng hao phí khi một bóng đèn dây tóc phát sáng chủ yếu chuyển hóa thành dạng năng lượng nào?',
    options: ['Nhiệt năng', 'Cơ năng', 'Hóa năng', 'Thế năng'],
    answer: 0,
    explanation: 'Bóng đèn dây tóc tỏa nhiệt rất lớn ra môi trường xung quanh dưới dạng nhiệt năng hao phí.'
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
  {
    id: 'toan6_2',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số đối của số nguyên -15 là:',
    options: ['15', '-15', '0', '1/15'],
    answer: 0,
    explanation: 'Hai số đối nhau nằm ở hai phía đối xứng qua gốc 0 trên trục số. Số đối của -15 là 15.'
  },
  {
    id: 'toan6_3',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'ƯCLN(12, 18) bằng bao nhiêu?',
    options: ['6', '3', '2', '36'],
    answer: 0,
    explanation: '12 = 2² × 3; 18 = 2 × 3² => ƯCLN = 2 × 3 = 6.'
  },
  {
    id: 'toan6_4',
    grade: 'Lớp 6',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Phân số nghịch đảo của phân số -3/5 là:',
    options: ['-5/3', '5/3', '3/5', '-3/5'],
    answer: 0,
    explanation: 'Phân số nghịch đảo của a/b là b/a (với a, b khác 0). Phân số nghịch đảo của -3/5 là -5/3.'
  },
  {
    id: 'toan6_5',
    grade: 'Lớp 6',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'essay',
    question: 'Nêu định nghĩa góc và phân biệt góc nhọn, góc vuông, góc tù, góc bẹt?',
    answer: '1. Góc là hình gồm hai tia chung gốc.\n2. Góc nhọn: số đo > 0° và < 90°.\n3. Góc vuông: số đo = 90°.\n4. Góc tù: số đo > 90° và < 180°.\n5. Góc bẹt: số đo = 180°.',
    explanation: 'Kiến thức nền tảng hình học trực quan Lớp 6 SGK Kết nối tri thức.'
  },
  {
    id: 'van6_1',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Truyền thuyết "Thánh Gióng" phản ánh ước mơ gì của nhân dân ta thời cổ xưa?',
    options: [
      'Ước mơ về người anh hùng khổng lồ có sức mạnh đánh thắng giặc ngoại xâm bảo vệ non sông',
      'Ước mơ làm giàu nhanh chóng',
      'Ước mơ chế ngự bão lũ thiên tai',
      'Ước mơ có mùa màng bội thu'
    ],
    answer: 0,
    explanation: 'Hình tượng Thánh Gióng là biểu tượng bất diệt cho lòng yêu nước và sức mạnh quật cường chống giặc ngoại xâm.'
  },
  {
    id: 'van6_2',
    grade: 'Lớp 6',
    semester: 'Học kì II',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Bài thơ "Lượm" của tác giả Tố Hữu viết về hình ảnh một chú bé:',
    options: ['Chú bé liên lạc dũng cảm, hồn nhiên', 'Chú bé chăn trâu chăm chỉ', 'Chú bé học trò nghèo hiếu học', 'Chú bé đánh giày trên phố'],
    answer: 0,
    explanation: 'Lượm là chú bé liên lạc nhỏ bé, thoăn thoắt, can đảm hy sinh trên chiến trường chống Pháp.'
  },
  {
    id: 'lsdl6_1',
    grade: 'Lớp 6',
    semester: 'Học kì I',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Kinh tuyến gốc là đường kinh tuyến mang số độ nào?',
    options: ['Kinh tuyến 0°', 'Kinh tuyến 90°', 'Kinh tuyến 180°', 'Đường Xích đạo'],
    answer: 0,
    explanation: 'Kinh tuyến 0° đi qua đài thiên văn Greenwich (Luân Đôn, Anh) được chọn làm kinh tuyến gốc.'
  },
  {
    id: 'lsdl6_2',
    grade: 'Lớp 6',
    semester: 'Học kì II',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Khởi nghĩa Hai Bà Trưng bùng nổ vào mùa xuân năm nào?',
    options: ['Năm 40 sau Công nguyên', 'Năm 248', 'Năm 542', 'Năm 938'],
    answer: 0,
    explanation: 'Hai Bà Trưng phất cờ khởi nghĩa ở Hát Môn vào mùa xuân năm 40 chống ách đô hộ nhà Đông Hán.'
  },

  // ==================== KHỐI 7 (SGK Kết nối tri thức) ====================
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
    question: 'Trong tam giác ABC, nếu góc A = 60° và góc B = 70° thì góc C có số đo bằng:',
    options: ['50°', '60°', '70°', '90°'],
    answer: 0,
    explanation: 'Áp dụng định lý tổng ba góc: C = 180° - (60° + 70°) = 50°.'
  },
  {
    id: 'toan7_4',
    grade: 'Lớp 7',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Đơn thức nào sau đây đồng dạng với đơn thức 3x²y³?',
    options: ['-5x²y³', '3x³y²', '2x²y', '7xy³'],
    answer: 0,
    explanation: 'Hai đơn thức đồng dạng có hệ số khác 0 và có cùng phần biến (x²y³).'
  },
  {
    id: 'toan7_5',
    grade: 'Lớp 7',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Trong một tam giác, giao điểm của ba đường trung tuyến được gọi là gì?',
    options: ['Trọng tâm của tam giác', 'Trực tâm của tam giác', 'Tâm đường tròn ngoại tiếp', 'Tâm đường tròn nội tiếp'],
    answer: 0,
    explanation: 'Giao điểm ba đường trung tuyến là Trọng tâm và cách mỗi đỉnh một khoảng bằng 2/3 độ dài đường trung tuyến đi qua đỉnh đó.'
  },
  {
    id: 'khtn7_1',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Nguyên tử trung hòa về điện vì có số hạt nào bằng nhau?',
    options: ['Số proton (p) = Số electron (e)', 'Số proton (p) = Số neutron (n)', 'Số electron (e) = Số neutron (n)', 'Tổng proton và neutron bằng electron'],
    answer: 0,
    explanation: 'Mỗi proton mang điện tích +1, mỗi electron mang điện tích -1. Vì số p = số e nên nguyên tử trung hòa về điện.'
  },
  {
    id: 'khtn7_2',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Kí hiệu hóa học của nguyên tố Sắt (Iron) là:',
    options: ['Fe', 'Cu', 'Al', 'Zn'],
    answer: 0,
    explanation: 'Fe là kí hiệu quốc tế của nguyên tố Iron (Sắt), bắt nguồn từ tiếng Latin Ferrum.'
  },
  {
    id: 'khtn7_3',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'essay',
    question: 'Nêu công thức tính tốc độ chuyển động và nêu ý nghĩa vật lý của tốc độ?',
    answer: '1. Công thức: v = s / t (trong đó s là quãng đường đi được, t là thời gian đi hết quãng đường đó).\n2. Ý nghĩa: Tốc độ đặc trưng cho sự nhanh hay chậm của chuyển động. Trong cùng một khoảng thời gian, vật nào đi được quãng đường dài hơn thì chuyển động nhanh hơn.',
    explanation: 'Chương Tốc độ trong KHTN 7 SGK Kết nối tri thức.'
  },
  {
    id: 'khtn7_4',
    grade: 'Lớp 7',
    semester: 'Học kì II',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Quá trình quang hợp ở thực vật diễn ra chủ yếu ở bào quan nào của tế bào lá cây?',
    options: ['Lục lạp', 'Ti thể', 'Không bào', 'Nhân tế bào'],
    answer: 0,
    explanation: 'Lục lạp chứa chất diệp lục có khả năng hấp thụ năng lượng ánh sáng mặt trời để thực hiện quang hợp.'
  },
  {
    id: 'khtn7_5',
    grade: 'Lớp 7',
    semester: 'Học kì II',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Vật nào sau đây là nguồn sáng tự nhiên?',
    options: ['Mặt Trời', 'Mặt Trăng', 'Bóng đèn điện bật sáng', 'Màn hình tivi'],
    answer: 0,
    explanation: 'Mặt Trời tự phát ra ánh sáng nhờ phản ứng nhiệt hạch; Mặt Trăng chỉ phản xạ ánh sáng Mặt Trời.'
  },
  {
    id: 'van7_1',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Bài thơ "Nam quốc sơn hà" (Sông núi nước Nam) thường được xem là bản tuyên ngôn độc lập thứ mấy của dân tộc ta?',
    options: ['Bản thứ nhất', 'Bản thứ hai', 'Bản thứ ba', 'Bản thứ tư'],
    answer: 0,
    explanation: '"Nam quốc sơn hà" gắn liền với cuộc kháng chiến chống quân Tống của Lý Thường Kiệt, là bản Tuyên ngôn Độc lập đầu tiên.'
  },
  {
    id: 'lsdl7_1',
    grade: 'Lớp 7',
    semester: 'Học kì I',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Năm 1010, vua Lý Thái Tổ đã ban Chiếu dời đô từ Hoa Lư về đâu?',
    options: ['Đại La (Thăng Long - Hà Nội ngày nay)', 'Cổ Loa', 'Lam Sơn', 'Huế'],
    answer: 0,
    explanation: 'Vua Lý Thái Tổ nhận thấy thành Đại La là chốn tụ hội trọng yếu của bốn phương đất nước nên đã dời đô và đổi tên thành Thăng Long.'
  },

  // ==================== KHỐI 8 (SGK Kết nối tri thức) ====================
  {
    id: 'khtn8_1',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Công thức hóa học của axit clohidric (hydrochloric acid) là:',
    options: ['HCl', 'H2SO4', 'HNO3', 'NaOH'],
    answer: 0,
    explanation: 'HCl là axit đơn chức mạnh, có mặt trong dịch vị dạ dày giúp tiêu hóa thức ăn.'
  },
  {
    id: 'khtn8_2',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'essay',
    question: 'Phát biểu định luật bảo toàn khối lượng trong phản ứng hóa học và viết biểu thức cho phản ứng A + B -> C + D?',
    answer: 'Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng.\nBiểu thức: m_A + m_B = m_C + m_D.',
    explanation: 'Định luật được Lomonosov và Lavoisier chứng minh, nền tảng của hóa học định lượng Lớp 8.'
  },
  {
    id: 'khtn8_3',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Dung dịch làm quỳ tím chuyển sang màu đỏ là dung dịch nào sau đây?',
    options: ['Dung dịch Axit (pH < 7)', 'Dung dịch Bazơ (pH > 7)', 'Nước cất tinh khiết (pH = 7)', 'Dung dịch muối ăn NaCl'],
    answer: 0,
    explanation: 'Axit làm quỳ tím chuyển sang màu đỏ; Bazơ làm quỳ tím chuyển sang màu xanh.'
  },
  {
    id: 'khtn8_4',
    grade: 'Lớp 8',
    semester: 'Học kì II',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Áp suất chất lỏng tác dụng lên đáy bình phụ thuộc vào những yếu tố nào?',
    options: [
      'Trọng lượng riêng của chất lỏng (d) và độ sâu tính từ mặt thoáng (h)',
      'Diện tích đáy bình chứa',
      'Khối lượng toàn bộ bình chứa',
      'Hình dạng của bình chứa'
    ],
    answer: 0,
    explanation: 'Công thức áp suất chất lỏng: p = d · h (chỉ phụ thuộc vào trọng lượng riêng d và độ sâu h).'
  },
  {
    id: 'khtn8_5',
    grade: 'Lớp 8',
    semester: 'Học kì II',
    subject: 'Khoa học tự nhiên',
    type: 'mc',
    question: 'Lực đẩy Ác-si-mét (Archimedes) tác dụng lên một vật nhúng chìm trong chất lỏng có hướng như thế nào?',
    options: [
      'Thẳng đứng, hướng từ dưới lên trên',
      'Thẳng đứng, hướng từ trên xuống dưới',
      'Nằm ngang sang trái',
      'Xiên một góc 45 độ'
    ],
    answer: 0,
    explanation: 'Lực đẩy Archimedes có phương thẳng đứng, chiều từ dưới lên trên, độ lớn F_A = d · V.'
  },
  {
    id: 'toan8_1',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Khai triển hằng đẳng thức hiệu hai bình phương a² - b² ta được:',
    options: ['(a - b)(a + b)', '(a - b)²', '(a + b)²', 'a² - 2ab + b²'],
    answer: 0,
    explanation: 'Hằng đẳng thức đáng nhớ số 3: a² - b² = (a - b)(a + b).'
  },
  {
    id: 'toan8_2',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Tứ giác có 4 cạnh bằng nhau và 4 góc vuông là hình gì?',
    options: ['Hình vuông', 'Hình chữ nhật', 'Hình thoi', 'Hình thang cân'],
    answer: 0,
    explanation: 'Hình vuông vừa là hình chữ nhật đặc biệt vừa là hình thoi đặc biệt.'
  },
  {
    id: 'toan8_3',
    grade: 'Lớp 8',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Tam giác vuông có hai cạnh góc vuông là 6 cm và 8 cm. Độ dài cạnh huyền theo định lý Pythagore là:',
    options: ['10 cm', '12 cm', '14 cm', '100 cm'],
    answer: 0,
    explanation: 'Theo định lý Pythagore: c² = a² + b² = 6² + 8² = 36 + 64 = 100 => c = 10 cm.'
  },
  {
    id: 'toan8_4',
    grade: 'Lớp 8',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'essay',
    question: 'Nêu định nghĩa hai tam giác đồng dạng và phát biểu 3 trường hợp đồng dạng của hai tam giác thường?',
    answer: '1. Hai tam giác đồng dạng nếu các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ.\n2. Ba trường hợp đồng dạng:\n - Cạnh - cạnh - cạnh (c.c.c): Ba cạnh tương ứng tỉ lệ.\n - Cạnh - góc - cạnh (c.g.c): Hai cạnh tỉ lệ và góc xen giữa bằng nhau.\n - Góc - góc (g.g): Hai cặp góc tương ứng bằng nhau.',
    explanation: 'Chủ đề tam giác đồng dạng là trọng tâm hình học Lớp 8 Kết nối tri thức.'
  },
  {
    id: 'van8_1',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Tác giả của đoạn trích "Tức nước vỡ bờ" (trích tiểu thuyết Tắt đèn) là ai?',
    options: ['Ngô Tất Tố', 'Nam Cao', 'Nguyên Hồng', 'Vũ Trọng Phụng'],
    answer: 0,
    explanation: 'Ngô Tất Tố là nhà văn hiện thực xuất sắc với tác phẩm tiêu biểu "Tắt đèn" ngợi ca vẻ đẹp của chị Dậu.'
  },
  {
    id: 'lsdl8_1',
    grade: 'Lớp 8',
    semester: 'Học kì I',
    subject: 'Lịch sử và Địa lý',
    type: 'mc',
    question: 'Cuộc Cách mạng công nghiệp lần thứ nhất khởi đầu ở nước nào vào giữa thế kỉ XVIII?',
    options: ['Nước Anh', 'Nước Pháp', 'Nước Đức', 'Nước Mỹ'],
    answer: 0,
    explanation: 'Cách mạng công nghiệp bắt đầu từ nước Anh trong ngành dệt và sự phát minh máy hơi nước của James Watt.'
  },

  // ==================== KHỐI 9 (SGK Kết nối tri thức) ====================
  {
    id: 'vatly9_1',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Vật lý',
    type: 'mc',
    question: 'Hệ thức đúng của định luật Ôm (Ohm) cho đoạn mạch có điện trở R là:',
    options: ['I = U / R', 'I = U · R', 'R = U · I', 'U = I / R'],
    answer: 0,
    explanation: 'Cường độ dòng điện I tỉ lệ thuận với hiệu điện thế U và tỉ lệ nghịch với điện trở R: I = U/R.'
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
    id: 'vatly9_5',
    grade: 'Lớp 9',
    semester: 'Học kì II',
    subject: 'Vật lý',
    type: 'mc',
    question: 'Dòng điện xoay chiều trong lưới điện sinh hoạt tại Việt Nam có tần số chuẩn là bao nhiêu?',
    options: ['50 Hz', '60 Hz', '100 Hz', '220 Hz'],
    answer: 0,
    explanation: 'Điện áp xoay chiều sinh hoạt tại Việt Nam là 220V - 50Hz.'
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
  },
  {
    id: 'toan9_3',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Toán học',
    type: 'mc',
    question: 'Trong mặt phẳng tọa độ Oxy, đồ thị hàm số y = 2x + 3 là một đường thẳng đi qua điểm nào?',
    options: ['(0; 3)', '(3; 0)', '(1; 4)', '(2; 3)'],
    answer: 0,
    explanation: 'Khi x = 0 thì y = 2(0) + 3 = 3, vậy đồ thị cắt trục tung tại điểm (0; 3).'
  },
  {
    id: 'toan9_4',
    grade: 'Lớp 9',
    semester: 'Học kì II',
    subject: 'Toán học',
    type: 'mc',
    question: 'Số đo của góc nội tiếp chắn nửa đường tròn bằng bao nhiêu?',
    options: ['90°', '180°', '45°', '60°'],
    answer: 0,
    explanation: 'Góc nội tiếp chắn nửa đường tròn luôn là góc vuông (90°).'
  },
  {
    id: 'hoa9_1',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Hóa học',
    type: 'mc',
    question: 'Kim loại nào sau đây dẫn điện và dẫn nhiệt tốt nhất trong tất cả các kim loại?',
    options: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'],
    answer: 0,
    explanation: 'Thứ tự dẫn điện giảm dần: Bạc (Ag) > Đồng (Cu) > Vàng (Au) > Nhôm (Al) > Sắt (Fe).'
  },
  {
    id: 'hoa9_2',
    grade: 'Lớp 9',
    semester: 'Học kì II',
    subject: 'Hóa học',
    type: 'mc',
    question: 'Chất nào sau đây là hidrocacbon (hydrocarbon) có trong khí mỏ dầu và khí thiên nhiên?',
    options: ['Metan (CH4)', 'Rượu etylic (C2H5OH)', 'Axit axetic (CH3COOH)', 'Glucozơ (C6H12O6)'],
    answer: 0,
    explanation: 'Metan (CH4) là hidrocacbon no đơn giản nhất, chiếm tới 95% thành phần của khí thiên nhiên.'
  },
  {
    id: 'van9_1',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Tác phẩm "Truyện Kiều" bất hủ của đại thi hào Nguyễn Du được viết bằng thể thơ nào?',
    options: ['Thơ lục bát', 'Thơ song thất lục bát', 'Thơ thất ngôn bát cú Đường luật', 'Thơ tự do'],
    answer: 0,
    explanation: 'Truyện Kiều gồm 3254 câu thơ lục bát truyền thống đỉnh cao của văn học Việt Nam.'
  },
  {
    id: 'van9_2',
    grade: 'Lớp 9',
    semester: 'Học kì II',
    subject: 'Ngữ văn',
    type: 'mc',
    question: 'Bài thơ "Mùa xuân nho nhỏ" của nhà thơ Thanh Hải thể hiện ước nguyện gì?',
    options: [
      'Ước nguyện được làm một mùa xuân nho nhỏ cống hiến âm thầm cho cuộc đời, cho đất nước',
      'Ước nguyện trở thành vị tướng đánh giặc',
      'Ước nguyện đi du ngoạn bốn phương trời',
      'Ước nguyện có cuộc sống giàu sang'
    ],
    answer: 0,
    explanation: '"Mùa xuân nho nhỏ" là khúc ca tha thiết dâng hiến cuộc đời cho mùa xuân lớn của đất nước.'
  },
  {
    id: 'ls9_1',
    grade: 'Lớp 9',
    semester: 'Học kì I',
    subject: 'Lịch sử',
    type: 'mc',
    question: 'Hiệp hội các quốc gia Đông Nam Á (ASEAN) được thành lập vào năm nào?',
    options: ['1967', '1945', '1975', '1995'],
    answer: 0,
    explanation: 'ASEAN được thành lập ngày 8/8/1967 tại Bangkok (Thái Lan) với 5 nước thành viên ban đầu.'
  },
  {
    id: 'ls9_2',
    grade: 'Lớp 9',
    semester: 'Học kì II',
    subject: 'Lịch sử',
    type: 'mc',
    question: 'Chiến dịch lịch sử nào đã giải phóng hoàn toàn miền Nam, thống nhất non sông vào ngày 30/4/1975?',
    options: ['Chiến dịch Hồ Chí Minh', 'Chiến dịch Tây Nguyên', 'Chiến dịch Huế - Đà Nẵng', 'Chiến dịch Điện Biên Phủ'],
    answer: 0,
    explanation: 'Đại thắng mùa xuân 1975 với đỉnh cao là Chiến dịch Hồ Chí Minh lịch sử đã kết thúc trọn vẹn cuộc kháng chiến chống Mỹ cứu nước.'
  }
];
