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
        message: "GEMINI_API_KEY not configured, using curriculum knowledge base."
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

      const prompt = `Bạn là hệ thống AI phân tích học tập thông minh TH & THCS theo bộ sách "Kết nối tri thức với cuộc sống" của Bộ GD&ĐT Việt Nam.
Nhiệm vụ của bạn là nhận diện, hiểu sâu và xử lý nội dung trang vở ghi chép của học sinh môn: ${subject || "Khoa học tự nhiên"}.
${text ? `Văn bản ghi chép của học sinh:\n${text}` : "Nội dung ghi chép được cung cấp trong hình ảnh trang vở đính kèm."}

Hãy thực hiện:
1. Xác định chính xác tên bài học theo SGK Kết nối tri thức.
2. Tóm tắt 3-5 ý cốt lõi quan trọng nhất.
3. Tạo Sơ đồ tư duy (Mindmap) phân nhánh logic (3-4 nhánh chính, mỗi nhánh có các ý chi tiết).
4. QUAN TRỌNG: Phát hiện các lỗi sai hoặc phần ghi chép chưa chính xác/chưa đầy đủ (Audit & Error check) mà học sinh hay mắc phải (sai đơn vị, nhầm lẫn khái niệm, thiếu điều kiện công thức) và đưa ra lời khuyên sửa chữa chuẩn xác.
5. Gợi ý các hình ảnh minh họa khoa học/sơ đồ trực quan phù hợp với bài học kèm trích nguồn sách rõ ràng.
6. Trích nguồn tài liệu học thuật chuẩn từ SGK Kết nối tri thức (NXB Giáo dục Việt Nam).
7. Bộ câu hỏi Flashcard ôn nhanh 2-3 câu.

Hãy phản hồi DUY NHẤT dưới dạng JSON hợp lệ với cấu trúc sau:
{
  "title": "Tên bài học chuẩn theo SGK Kết nối tri thức",
  "grade": "Khối lớp tương ứng",
  "subject": "Môn học",
  "summary": "Tóm tắt súc tích bài học",
  "structuredSections": [
    { "type": "concept", "heading": "Khái niệm cốt lõi", "content": "Chi tiết khái niệm..." },
    { "type": "formula", "heading": "Công thức / Quy tắc", "content": "Chi tiết công thức..." },
    { "type": "note", "heading": "Điểm cần ghi nhớ", "content": "Lưu ý quan trọng..." }
  ],
  "mindmap": [
    {
      "node": "Tên nhánh chính 1",
      "children": ["Ý phụ 1.1", "Ý phụ 1.2"]
    },
    {
      "node": "Tên nhánh chính 2",
      "children": ["Ý phụ 2.1", "Ý phụ 2.2"]
    }
  ],
  "auditChecks": [
    {
      "status": "warning",
      "issue": "Nội dung hoặc công thức có nguy cơ nhầm lẫn",
      "suggestion": "Cách ghi chính xác chuẩn SGK Kết nối tri thức"
    }
  ],
  "illustrationImages": [
    {
      "caption": "Mô tả hình vẽ sơ đồ / thí nghiệm / hình học",
      "source": "Trích từ SGK Kết nối tri thức với cuộc sống - NXB Giáo dục Việt Nam",
      "keyword": "từ khóa tìm kiếm hoặc minh họa"
    }
  ],
  "academicSources": [
    {
      "title": "Tên bài và tập SGK Kết nối tri thức",
      "link": "https://nxbgd.vn"
    },
    {
      "title": "Cổng thông tin học liệu điện tử Bộ Giáo dục và Đào tạo",
      "link": "https://moet.gov.vn"
    }
  ],
  "flashcards": [
    { "q": "Câu hỏi ôn tập?", "a": "Đáp án chuẩn xác" }
  ]
}`;

      const contents: any[] = [];
      if (imageBase64) {
        contents.push({
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ""),
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const rawText = response.text || "";
      const parsedData = JSON.parse(rawText);
      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("Gemini analysis error:", err?.message || err);
      return res.status(200).json({
        fallback: true,
        error: err?.message,
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
