import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const {
    text,
    subject,
    imageBase64,
    mimeType,
  } = req.body || {};

  // =========================================================
  // 1. CHECK GEMINI API KEY
  // =========================================================
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");

    return res.status(500).json({
      success: false,
      fallback: true,
      error: "GEMINI_API_KEY chưa được cấu hình trên Vercel.",
    });
  }

  try {
    // =========================================================
    // 2. INIT GEMINI
    // =========================================================
    const ai = new GoogleGenAI({
      apiKey,
    });

    // =========================================================
    // 3. PROMPT
    // =========================================================
    const prompt = `
Bạn là hệ thống AI hỗ trợ phân tích ghi chép học tập dành cho học sinh
Tiểu học và THCS Việt Nam.

Môn học:
${subject || "Chưa xác định"}

${
  text
    ? `Văn bản ghi chép của học sinh:
${text}`
    : `Nội dung ghi chép nằm trong hình ảnh được cung cấp.
Hãy đọc kỹ toàn bộ chữ viết trong ảnh trước khi phân tích.`
}

YÊU CẦU QUAN TRỌNG:

1. Đọc và nhận diện chính xác nội dung có trong ảnh hoặc văn bản.

2. Không được tự bịa nội dung không xuất hiện trong ghi chép.

3. Nếu nhận diện được tên bài học thì ghi tên bài.
Nếu không chắc chắn, không được tự khẳng định một tên bài cụ thể.

4. Xác định môn học và khối lớp nếu có đủ thông tin.
Nếu không xác định được thì ghi "Không xác định".

5. Trích xuất nội dung quan trọng của bài ghi chép.

6. Tóm tắt từ 3 đến 5 ý chính, ngắn gọn và dễ hiểu.

7. Tạo sơ đồ tư duy gồm:
- 3 đến 4 nhánh chính
- mỗi nhánh có các ý phụ

8. Kiểm tra ghi chép:
- lỗi kiến thức
- lỗi công thức
- sai đơn vị
- nhầm khái niệm
- nội dung chưa rõ

Chỉ báo lỗi khi có cơ sở từ nội dung trong ảnh.
Không tự tạo lỗi.

9. Tạo 2 đến 5 flashcard để học sinh ôn tập.

10. academicSources:
CHỈ thêm nguồn nếu trong ghi chép có thông tin đủ rõ để xác định nguồn.
Nếu không có thì trả về [].
Không tự bịa tên sách, trang sách hoặc đường link.

11. illustrationImages:
Chỉ đưa ra mô tả hình minh họa có thể giúp học sinh hiểu bài.
Không được khẳng định hình đó nằm trong SGK nếu không có bằng chứng.

12. Phản hồi DUY NHẤT bằng JSON hợp lệ.
Không thêm markdown.
Không thêm dấu \`\`\`.

JSON bắt buộc có dạng:

{
  "title": "Tên bài học hoặc Không xác định",
  "grade": "Khối lớp hoặc Không xác định",
  "subject": "Môn học",
  "extractedText": "Nội dung đọc được từ ảnh/văn bản",
  "summary": "Tóm tắt bài học",
  "keyPoints": [
    "Ý chính 1",
    "Ý chính 2",
    "Ý chính 3"
  ],
  "structuredSections": [
    {
      "type": "concept",
      "heading": "Khái niệm",
      "content": "Nội dung"
    },
    {
      "type": "formula",
      "heading": "Công thức / Quy tắc",
      "content": "Nội dung"
    },
    {
      "type": "note",
      "heading": "Ghi nhớ",
      "content": "Nội dung"
    }
  ],
  "mindmap": [
    {
      "node": "Nhánh chính",
      "children": [
        "Ý phụ 1",
        "Ý phụ 2"
      ]
    }
  ],
  "auditChecks": [
    {
      "status": "verified",
      "issue": "Nội dung kiểm tra",
      "suggestion": "Gợi ý"
    }
  ],
  "illustrationImages": [
    {
      "caption": "Mô tả hình minh họa",
      "keyword": "Từ khóa"
    }
  ],
  "academicSources": [],
  "flashcards": [
    {
      "q": "Câu hỏi?",
      "a": "Đáp án"
    }
  ]
}
`;

    // =========================================================
    // 4. BUILD MULTIMODAL INPUT
    // =========================================================
    const parts: any[] = [];

    if (imageBase64) {
      let cleanBase64 = imageBase64;
      let detectedMimeType = mimeType || "image/jpeg";

      // Nếu frontend gửi:
      // data:image/jpeg;base64,xxxxx
      const dataUriMatch = imageBase64.match(
        /^data:([^;]+);base64,(.+)$/s
      );

      if (dataUriMatch) {
        detectedMimeType = dataUriMatch[1];
        cleanBase64 = dataUriMatch[2];
      }

      parts.push({
        inlineData: {
          mimeType: detectedMimeType,
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    // =========================================================
    // 5. GEMINI 2.5 MODELS
    // =========================================================
    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await ai.models.generateContent({
          model,

          contents: [
            {
              role: "user",
              parts,
            },
          ],

          config: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });

        const rawText = response.text || "";

        if (!rawText.trim()) {
          throw new Error("Gemini returned empty response");
        }

        // =====================================================
        // 6. PARSE JSON
        // =====================================================
        let parsedData: any;

        try {
          parsedData = JSON.parse(rawText);
        } catch {
          console.error("Gemini invalid JSON:", rawText);

          throw new Error(
            "Gemini trả về dữ liệu JSON không hợp lệ."
          );
        }

        // =====================================================
        // 7. RETURN SUCCESS
        // =====================================================
        return res.status(200).json({
          success: true,

          modelUsed: model,

          data: parsedData,
        });
      } catch (modelError: any) {
        lastError = modelError;

        console.error(
          `Gemini model ${model} failed:`,
          modelError?.message || modelError
        );
      }
    }

    // Nếu cả Flash và Flash Lite đều lỗi
    throw lastError || new Error("Gemini API failed");
  } catch (err: any) {
    console.error(
      "Gemini analysis error:",
      err?.message || err
    );

    return res.status(500).json({
      success: false,

      fallback: true,

      error:
        err?.message ||
        "Không thể kết nối Gemini AI.",
    });
  }
}
