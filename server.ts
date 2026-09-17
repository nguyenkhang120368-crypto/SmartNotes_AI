import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API Route: Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Route: AI Note Analysis using Gemini API with intelligent fallback
  app.post("/api/analyze-notes", async (req, res) => {
    const { text, subject, imageBase64, mimeType } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        message: "GEMINI_API_KEY chưa được cấu hình trên hệ thống."
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `Bạn là trợ lý AI chuyên gia phân tích và tóm tắt vở ghi học sinh bằng Gemini AI.
QUY TẮC BẮT BUỘC TUYỆT ĐỐI (VI PHẠM LÀ LỖI NGHIÊM TRỌNG):
1. CHỈ LẤY NỘI DUNG Ở TRONG BÀI ĐÃ ĐƯỢC CHỤP (hoặc văn bản được cung cấp).
2. CẤM BỊA THÔNG TIN: Tuyệt đối không được thêm bớt kiến thức, sự kiện, công thức hoặc giả định ngoài nội dung thực tế có trong bài chụp.
3. CẤM BỊA NGUỒN: Mảng "academicSources" CHỈ ĐƯỢC CÓ PHẦN TỬ nếu trong bài chụp học sinh CÓ GHI RÕ NGUỒN SÁCH/TRANG CỤ THỂ. Nếu bài chụp không có ghi nguồn, mảng "academicSources" PHẢI LÀ RỖNG []. Tuyệt đối không tự bịa tên SGK, NXB hay đường link!
4. ĐỊNH DẠNG NGÀY THÁNG / NGÀY SINH: Mọi ngày sinh hoặc ngày tháng năm xuất hiện trong bài BẮT BUỘC PHẢI THEO ĐỊNH DẠNG dd/mm/yyyy (ví dụ: ngày 15 tháng 5 năm 2012 phải ghi là 15/05/2012, ngày 19 tháng 5 năm 1890 phải ghi là 19/05/1890).
5. TRÍCH XUẤT NGUYÊN VĂN (extractedText): Đọc và chép lại đầy đủ, chính xác mọi câu chữ/nội dung có trong bài chụp.
6. TÓM TẮT TRỌNG TÂM (summary): Tóm tắt ngắn gọn, dễ hiểu chỉ dựa trên những gì bài chụp đã viết.

${text ? `Văn bản ghi chép của học sinh:\n${text}` : "Nội dung ghi chép nằm trong hình ảnh bài vở đính kèm. Hãy đọc kỹ từng dòng chữ trong ảnh."}

Hãy phản hồi DUY NHẤT dưới dạng JSON hợp lệ với cấu trúc sau:
{
  "title": "Tên bài hoặc tiêu đề nhận diện được từ bài chụp",
  "grade": "Khối lớp nếu có đề cập trong bài, hoặc ước lượng phù hợp",
  "subject": "${subject || "Ghi chép bài học"}",
  "extractedText": "Toàn bộ nội dung chữ viết nhận diện được từ bài chụp (trung thực 100%, không bịa đặt)",
  "summary": "Tóm tắt ngắn gọn, súc tích trọng tâm của bài đã chụp (chỉ lấy thông tin từ bài)",
  "keyPoints": [
    "Ý chính 1 rút ra từ bài chụp",
    "Ý chính 2 rút ra từ bài chụp"
  ],
  "datesFound": [
    "Các ngày tháng hoặc ngày sinh có trong bài theo định dạng dd/mm/yyyy (ví dụ: 15/05/2012)"
  ],
  "structuredSections": [
    { "type": "concept", "heading": "Khái niệm / Nội dung trong bài", "content": "Chi tiết theo bài chụp..." }
  ],
  "mindmap": [
    {
      "node": "Tên nhánh chính",
      "children": ["Ý phụ 1", "Ý phụ 2"]
    }
  ],
  "auditChecks": [
    {
      "status": "verified",
      "issue": "Nhận xét về chữ viết hoặc số liệu trong bài",
      "suggestion": "Góp ý cải thiện nếu bài chụp có chỗ chưa rõ"
    }
  ],
  "academicSources": [],
  "flashcards": [
    { "q": "Câu hỏi ôn tập bám sát bài chụp?", "a": "Đáp án từ bài chụp" }
  ]
}`;

      // Build multimodal parts array
      const parts: any[] = [];
      if (imageBase64) {
        let cleanBase64 = imageBase64;
        let detectedMime = mimeType || "image/jpeg";
        const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/s);
        if (match) {
          detectedMime = match[1] || detectedMime;
          cleanBase64 = match[2];
        } else {
          cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        }

        parts.push({
          inlineData: {
            mimeType: detectedMime,
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: prompt });

      // Resilience cascade: Try gemini-3.8-flash first, fallback to gemini-3.1-flash-lite if 503/error
      const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      let lastError: any = null;
      let parsedData: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: parts,
            config: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          });

          const rawText = response.text || "";
          if (rawText.trim()) {
            parsedData = JSON.parse(rawText);
            // Ensure dates format in datesFound is strictly dd/mm/yyyy
            if (Array.isArray(parsedData.datesFound)) {
              parsedData.datesFound = parsedData.datesFound.map((d: string) => {
                const match4 = d.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
                if (match4) return `${match4[1].padStart(2, "0")}/${match4[2].padStart(2, "0")}/${match4[3]}`;
                const match2 = d.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})$/);
                if (match2) {
                  const yy = parseInt(match2[3], 10);
                  const fullYear = yy <= 40 ? `20${match2[3]}` : `19${match2[3]}`;
                  return `${match2[1].padStart(2, "0")}/${match2[2].padStart(2, "0")}/${fullYear}`;
                }
                const matchIso = d.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
                if (matchIso) return `${matchIso[3].padStart(2, "0")}/${matchIso[2].padStart(2, "0")}/${matchIso[1]}`;
                return d;
              });
            }
            parsedData.isRealGeminiAnalysis = true;
            return res.json({ success: true, data: parsedData });
          }
        } catch (modelErr: any) {
          console.warn(`Model ${model} attempt failed:`, modelErr?.message || modelErr);
          lastError = modelErr;
        }
      }

      throw lastError || new Error("Không thể phân tích nội dung từ các mô hình Gemini AI.");
    } catch (err: any) {
      console.error("Gemini analysis error:", err?.message || err);
      return res.status(200).json({
        fallback: true,
        error: err?.message || "Lỗi khi gọi Gemini AI",
      });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
