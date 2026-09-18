import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // =========================================================
  // 1. METHOD CHECK
  // =========================================================
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
  // 2. CHECK API KEY
  // =========================================================
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");

    return res.status(500).json({
      success: false,
      fallback: true,
      error: "GEMINI_API_KEY chưa được cấu hình trên Vercel.",
    });
  }

  console.log("Gemini ENV CHECK:", {
    hasKey: true,
    keyPrefix: apiKey.slice(0, 3),
    keyLength: apiKey.length,
    vercelEnv: process.env.VERCEL_ENV,
  });

  try {
    // =========================================================
    // 3. INIT GEMINI
    // =========================================================
    const ai = new GoogleGenAI({
      apiKey,
    });

    // =========================================================
    // 4. PROMPT
    // =========================================================
    const prompt = `
Bạn là hệ thống AI hỗ trợ phân tích ghi chép học tập dành cho
học sinh Tiểu học và THCS Việt Nam.

Môn học:
${subject || "Chưa xác định"}

${
  text
    ? `Văn bản ghi chép của học sinh:
${text}`
    : `Nội dung ghi chép nằm trong hình ảnh được cung cấp.
Hãy đọc kỹ toàn bộ chữ viết trong ảnh trước khi phân tích.`
}

YÊU CẦU BẮT BUỘC:

1. Đọc và nhận diện chính xác nội dung xuất hiện trong ảnh hoặc văn bản.

2. Không được tự bịa thêm nội dung không xuất hiện trong ghi chép.

3. Nếu nhận diện rõ tên bài học thì ghi tên bài.
Nếu không chắc chắn, ghi "Không xác định".

4. Xác định môn học và khối lớp nếu có đủ dữ liệu.
Nếu không chắc chắn, ghi "Không xác định".

5. extractedText:
Chép lại nội dung đọc được từ ảnh càng chính xác càng tốt.

6. summary:
Tóm tắt ngắn gọn từ nội dung ghi chép.

7. keyPoints:
Tạo từ 3 đến 5 ý chính.

8. structuredSections:
Phân loại nội dung thành:
- concept
- formula
- note

Chỉ tạo mục phù hợp với nội dung thực tế.
Nếu không có công thức thì không được tự tạo công thức.

9. mindmap:
Tạo 3 đến 4 nhánh chính nếu nội dung đủ thông tin.
Mỗi nhánh có các ý phụ ngắn gọn.

10. auditChecks:
Kiểm tra:
- lỗi kiến thức
- sai công thức
- sai đơn vị
- nhầm khái niệm
- nội dung chưa rõ

Chỉ báo lỗi khi có cơ sở rõ ràng.
Không được tự tạo lỗi để đủ số lượng.

11. illustrationImages:
Chỉ mô tả hình minh họa có thể giúp học sinh hiểu bài.
Không khẳng định hình nằm trong SGK nếu không có bằng chứng.

12. academicSources:
CHỈ thêm nguồn nếu nội dung ghi chép có nguồn rõ ràng.
Nếu không có thì trả về [].
Không tự bịa sách, trang sách hoặc đường link.

13. flashcards:
Tạo từ 2 đến 5 câu hỏi ôn tập dựa trực tiếp trên nội dung ghi chép.

14. Phản hồi DUY NHẤT bằng JSON hợp lệ.
Không thêm Markdown.
Không thêm \`\`\`.
Không giải thích ngoài JSON.

JSON phải có cấu trúc:

{
  "title": "Tên bài học hoặc Không xác định",
  "grade": "Khối lớp hoặc Không xác định",
  "subject": "Môn học hoặc Không xác định",

  "extractedText": "Toàn bộ nội dung đọc được",

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
    // 5. BUILD MULTIMODAL PARTS
    // =========================================================
    const parts: any[] = [];

    if (imageBase64) {
      let cleanBase64 = imageBase64;
      let detectedMimeType = mimeType || "image/jpeg";

      const dataUriMatch = imageBase64.match(
        /^data:([^;]+);base64,(.+)$/s
      );

      if (dataUriMatch) {
        detectedMimeType = dataUriMatch[1];
        cleanBase64 = dataUriMatch[2];
      }

      // Remove whitespace/newlines if any
      cleanBase64 = cleanBase64.replace(/\s/g, "");

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
    // 6. CURRENT GEMINI MODELS
    // =========================================================
    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
    ];

    let lastError: any = null;

    // =========================================================
    // 7. TRY MODELS
    // =========================================================
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
          throw new Error(
            `Gemini model ${model} returned empty response`
          );
        }

        // =====================================================
        // 8. PARSE JSON
        // =====================================================
        let parsedData: any;

        try {
          parsedData = JSON.parse(rawText);
        } catch (parseError) {
          console.error(
            `Invalid JSON from ${model}:`,
            rawText
          );

          throw new Error(
            `Gemini ${model} trả về JSON không hợp lệ.`
          );
        }

        // =====================================================
        // 9. BASIC NORMALIZATION
        // =====================================================
        parsedData.title =
          parsedData.title || "Không xác định";

        parsedData.grade =
          parsedData.grade || "Không xác định";

        parsedData.subject =
          parsedData.subject ||
          subject ||
          "Không xác định";

        parsedData.extractedText =
          parsedData.extractedText || "";

        parsedData.summary =
          parsedData.summary || "";

        parsedData.keyPoints =
          Array.isArray(parsedData.keyPoints)
            ? parsedData.keyPoints
            : [];

        parsedData.structuredSections =
          Array.isArray(parsedData.structuredSections)
            ? parsedData.structuredSections
            : [];

        parsedData.mindmap =
          Array.isArray(parsedData.mindmap)
            ? parsedData.mindmap
            : [];

        parsedData.auditChecks =
          Array.isArray(parsedData.auditChecks)
            ? parsedData.auditChecks
            : [];

        parsedData.illustrationImages =
          Array.isArray(parsedData.illustrationImages)
            ? parsedData.illustrationImages
            : [];

        parsedData.academicSources =
          Array.isArray(parsedData.academicSources)
            ? parsedData.academicSources
            : [];

        parsedData.flashcards =
          Array.isArray(parsedData.flashcards)
            ? parsedData.flashcards
            : [];

        // =====================================================
        // 10. SUCCESS
        // =====================================================
        console.log(`Gemini success with model: ${model}`);

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

    // =========================================================
    // 11. ALL MODELS FAILED
    // =========================================================
    throw (
      lastError ||
      new Error("Không có Gemini model nào hoạt động.")
    );

  } catch (err: any) {
    console.error(
      "Gemini analysis final error:",
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
