import { GoogleGenAI } from "@google/genai";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// =========================================================
// CONFIG
// =========================================================

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
] as const;

const MAX_TEXT_LENGTH = 50_000;
const MAX_BASE64_LENGTH = 6_000_000;

// =========================================================
// FIREBASE ADMIN
// =========================================================

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "FIREBASE_ADMIN_NOT_CONFIGURED"
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// =========================================================
// HELPERS
// =========================================================

function getBearerToken(req: any): string | null {
  const authorization =
    req.headers?.authorization ||
    req.headers?.Authorization ||
    "";

  if (
    typeof authorization !== "string" ||
    !authorization.startsWith("Bearer ")
  ) {
    return null;
  }

  const token = authorization.slice(7).trim();

  return token || null;
}

function normalizeBody(body: any) {
  if (!body) return {};

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

function prepareImage(
  imageBase64?: string,
  mimeType?: string
): {
  data: string;
  mimeType: string;
} | null {
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return null;
  }

  let cleanBase64 = imageBase64.trim();
  let detectedMimeType =
    typeof mimeType === "string" && mimeType.trim()
      ? mimeType.trim()
      : "image/jpeg";

  // Frontend thường gửi:
  // data:image/jpeg;base64,AAAA...
  const dataUriMatch = cleanBase64.match(
    /^data:([^;]+);base64,(.+)$/s
  );

  if (dataUriMatch) {
    detectedMimeType = dataUriMatch[1];
    cleanBase64 = dataUriMatch[2];
  }

  if (!detectedMimeType.startsWith("image/")) {
    throw new Error("INVALID_IMAGE_MIME_TYPE");
  }

  cleanBase64 = cleanBase64.replace(/\s/g, "");

  if (!cleanBase64) {
    return null;
  }

  if (cleanBase64.length > MAX_BASE64_LENGTH) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  return {
    data: cleanBase64,
    mimeType: detectedMimeType,
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeGeminiData(
  input: any,
  fallbackSubject: string
) {
  const data =
    input && typeof input === "object"
      ? input
      : {};

  const structuredSections = Array.isArray(
    data.structuredSections
  )
    ? data.structuredSections
        .filter(
          (item: any) =>
            item &&
            typeof item === "object"
        )
        .map((item: any) => ({
          type:
            typeof item.type === "string"
              ? item.type
              : "note",
          heading:
            typeof item.heading === "string"
              ? item.heading
              : "",
          content:
            typeof item.content === "string"
              ? item.content
              : "",
        }))
        .filter(
          (item: any) =>
            item.heading || item.content
        )
    : [];

  const mindmap = Array.isArray(data.mindmap)
    ? data.mindmap
        .filter(
          (item: any) =>
            item &&
            typeof item === "object"
        )
        .map((item: any) => ({
          node:
            typeof item.node === "string"
              ? item.node
              : "",
          children: normalizeStringArray(
            item.children
          ),
        }))
        .filter(
          (item: any) =>
            item.node || item.children.length
        )
    : [];

  const auditChecks = Array.isArray(
    data.auditChecks
  )
    ? data.auditChecks
        .filter(
          (item: any) =>
            item &&
            typeof item === "object"
        )
        .map((item: any) => {
          const status =
            item.status === "warning" ||
            item.status === "error" ||
            item.status === "verified"
              ? item.status
              : "warning";

          return {
            status,
            issue:
              typeof item.issue === "string"
                ? item.issue
                : "",
            suggestion:
              typeof item.suggestion === "string"
                ? item.suggestion
                : "",
          };
        })
        .filter(
          (item: any) =>
            item.issue || item.suggestion
        )
    : [];

  const illustrationImages = Array.isArray(
    data.illustrationImages
  )
    ? data.illustrationImages
        .filter(
          (item: any) =>
            item &&
            typeof item === "object"
        )
        .map((item: any) => ({
          caption:
            typeof item.caption === "string"
              ? item.caption
              : "",
          source:
            typeof item.source === "string"
              ? item.source
              : "",
          ...(typeof item.url === "string" &&
          item.url
            ? { url: item.url }
            : {}),
        }))
        .filter(
          (item: any) => item.caption
        )
    : [];

  const academicSources = Array.isArray(
    data.academicSources
  )
    ? data.academicSources
        .filter(
          (item: any) =>
            item &&
            typeof item === "object"
        )
        .map((item: any) => ({
          title:
            typeof item.title === "string"
              ? item.title
              : "",
          link:
            typeof item.link === "string"
              ? item.link
              : "",
        }))
        .filter(
          (item: any) => item.title
        )
    : [];

  const flashcards = Array.isArray(
    data.flashcards
  )
    ? data.flashcards
        .filter(
          (item: any) =>
            item &&
            typeof item === "object"
        )
        .map((item: any) => ({
          q:
            typeof item.q === "string"
              ? item.q
              : "",
          a:
            typeof item.a === "string"
              ? item.a
              : "",
        }))
        .filter(
          (item: any) =>
            item.q && item.a
        )
    : [];

  return {
    title:
      typeof data.title === "string" &&
      data.title.trim()
        ? data.title.trim()
        : "Không xác định",

    grade:
      typeof data.grade === "string" &&
      data.grade.trim()
        ? data.grade.trim()
        : "Không xác định",

    subject:
      typeof data.subject === "string" &&
      data.subject.trim()
        ? data.subject.trim()
        : fallbackSubject ||
          "Không xác định",

    extractedText:
      typeof data.extractedText === "string"
        ? data.extractedText
        : "",

    summary:
      typeof data.summary === "string"
        ? data.summary
        : "",

    datesFound: normalizeStringArray(
      data.datesFound
    ),

    keyPoints: normalizeStringArray(
      data.keyPoints
    ),

    structuredSections,

    mindmap,

    auditChecks,

    illustrationImages,

    academicSources,

    flashcards,
  };
}

function cleanJsonText(text: string): string {
  let output = text.trim();

  // Phòng trường hợp model vẫn bọc JSON trong markdown fence.
  output = output.replace(
    /^```(?:json)?\s*/i,
    ""
  );
  output = output.replace(
    /\s*```$/,
    ""
  );

  return output.trim();
}

function extractErrorStatus(error: any): number | null {
  const candidates = [
    error?.status,
    error?.code,
    error?.response?.status,
    error?.error?.code,
  ];

  for (const value of candidates) {
    const numeric = Number(value);

    if (
      Number.isFinite(numeric) &&
      numeric >= 100 &&
      numeric <= 599
    ) {
      return numeric;
    }
  }

  const message = String(
    error?.message || ""
  );

  const match = message.match(
    /\b(400|401|403|404|408|409|429|500|502|503|504)\b/
  );

  return match
    ? Number(match[1])
    : null;
}

function friendlyGeminiError(
  error: any,
  model?: string
): string {
  const status = extractErrorStatus(error);
  const rawMessage = String(
    error?.message || ""
  );

  if (status === 401) {
    return "Gemini API từ chối thông tin xác thực. Hãy kiểm tra GEMINI_API_KEY.";
  }

  if (status === 403) {
    return "Gemini API key không có quyền sử dụng API hoặc model này.";
  }

  if (status === 404) {
    return model
      ? `Model ${model} không khả dụng cho project hiện tại.`
      : "Model Gemini không khả dụng.";
  }

  if (status === 429) {
    return "Gemini API đang vượt giới hạn quota/rate limit. Vui lòng thử lại sau.";
  }

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return "Dịch vụ Gemini đang tạm thời gặp sự cố. Vui lòng thử lại.";
  }

  if (
    rawMessage.includes(
      "ACCESS_TOKEN_TYPE_UNSUPPORTED"
    )
  ) {
    return "Gemini API key hiện không được Google chấp nhận cho kiểu xác thực này.";
  }

  return rawMessage
    ? `Gemini API lỗi: ${rawMessage}`
    : "Không thể kết nối Gemini AI.";
}

function shouldStopModelFallback(
  error: any
): boolean {
  const status = extractErrorStatus(error);

  // Đổi model không sửa được lỗi authentication / permission.
  return status === 401 || status === 403;
}

// =========================================================
// PROMPT
// =========================================================

function buildPrompt(
  subject: string,
  text: string
) {
  return `
Bạn là hệ thống AI hỗ trợ phân tích ghi chép học tập dành cho học sinh
Tiểu học và THCS Việt Nam.

MÔN HỌC DO NGƯỜI DÙNG CHỌN:
${subject || "Chưa xác định"}

${
  text
    ? `VĂN BẢN NGƯỜI DÙNG CUNG CẤP:
${text}`
    : `Nội dung ghi chép nằm trong hình ảnh được đính kèm.
Hãy đọc kỹ toàn bộ chữ viết nhìn thấy trong ảnh trước khi phân tích.`
}

NGUYÊN TẮC BẮT BUỘC:

1. Chỉ sử dụng thông tin có thể đọc được hoặc suy ra trực tiếp từ nội dung người dùng cung cấp.

2. Không tự bịa:
- tên bài
- khối lớp
- công thức
- lỗi sai
- nguồn SGK
- số trang sách
- đường link
- hình ảnh

3. Nếu không chắc chắn về tên bài hoặc khối lớp, ghi "Không xác định".

4. extractedText:
- Chép lại nội dung đọc được.
- Giữ nguyên ý nghĩa.
- Nếu một đoạn không đọc rõ, có thể ghi "[không đọc rõ]".
- Không tự hoàn thiện câu bằng kiến thức bên ngoài nếu chữ trong ảnh không đủ rõ.

5. summary:
Tóm tắt ngắn gọn nội dung thực tế trong ghi chép.

6. keyPoints:
Tạo tối đa 5 ý chính.
Nếu nội dung quá ngắn thì có thể ít hơn 3 ý.

7. structuredSections:
Chỉ tạo các phần thực sự tồn tại:
- concept
- formula
- rule
- note
- example

Không có công thức thì không tạo công thức giả.

8. mindmap:
Tạo tối đa 4 nhánh chính.
Mỗi nhánh có các ý phụ ngắn gọn.
Nếu nội dung không đủ thì tạo ít nhánh hơn.

9. auditChecks:
Chỉ báo lỗi khi có căn cứ rõ ràng từ nội dung:
- sai kiến thức
- sai công thức
- sai đơn vị
- nhầm khái niệm
- ghi chép mơ hồ hoặc thiếu điều kiện quan trọng

Nếu không có lỗi có căn cứ, trả về [].
Không tạo lỗi chỉ để đủ số lượng.

10. illustrationImages:
Chỉ mô tả loại hình minh họa hữu ích.
Không khẳng định hình đó nằm trong SGK.
"source" để chuỗi rỗng nếu không có nguồn trực tiếp trong ghi chép.
Không tự tạo URL.

11. academicSources:
Chỉ thêm nguồn khi nguồn đó xuất hiện rõ trong nội dung người dùng cung cấp.
Nếu không có bằng chứng, trả về [].
Không tự bịa link.

12. datesFound:
Trích các ngày/tháng/năm xuất hiện rõ trong nội dung.
Chuẩn hóa thành dd/mm/yyyy khi có đủ ngày, tháng, năm.
Nếu không có thì [].

13. flashcards:
Tạo tối đa 5 flashcard chỉ từ nội dung đã đọc được.

14. Phản hồi DUY NHẤT bằng JSON hợp lệ.
Không markdown.
Không dấu \`\`\`.
Không giải thích ngoài JSON.

CẤU TRÚC JSON:

{
  "title": "Tên bài học hoặc Không xác định",
  "grade": "Khối lớp hoặc Không xác định",
  "subject": "Môn học hoặc Không xác định",
  "extractedText": "Nội dung đọc được",
  "summary": "Tóm tắt nội dung",
  "datesFound": [],
  "keyPoints": [
    "Ý chính"
  ],
  "structuredSections": [
    {
      "type": "concept",
      "heading": "Tiêu đề",
      "content": "Nội dung"
    }
  ],
  "mindmap": [
    {
      "node": "Nhánh chính",
      "children": [
        "Ý phụ"
      ]
    }
  ],
  "auditChecks": [
    {
      "status": "warning",
      "issue": "Nội dung cần kiểm tra",
      "suggestion": "Gợi ý sửa"
    }
  ],
  "illustrationImages": [
    {
      "caption": "Mô tả hình minh họa",
      "source": ""
    }
  ],
  "academicSources": [
    {
      "title": "Tên nguồn xuất hiện trong ghi chép",
      "link": ""
    }
  ],
  "flashcards": [
    {
      "q": "Câu hỏi",
      "a": "Đáp án"
    }
  ]
}
`;
}

// =========================================================
// API HANDLER
// =========================================================

export default async function handler(
  req: any,
  res: any
) {
  // ---------------------------------------------------------
  // 1. METHOD
  // ---------------------------------------------------------
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }

  // ---------------------------------------------------------
  // 2. VERIFY FIREBASE USER
  // ---------------------------------------------------------
  const idToken = getBearerToken(req);

  if (!idToken) {
    return res.status(401).json({
      success: false,
      error:
        "Bạn chưa đăng nhập hoặc request không có Firebase ID token.",
    });
  }

  let decodedToken: any;

  try {
    const adminApp =
      getFirebaseAdminApp();

    decodedToken = await getAuth(
      adminApp
    ).verifyIdToken(idToken);

    if (!decodedToken?.uid) {
      return res.status(401).json({
        success: false,
        error:
          "Firebase ID token không hợp lệ.",
      });
    }

    if (
      decodedToken.email &&
      decodedToken.email_verified !== true
    ) {
      return res.status(403).json({
        success: false,
        error:
          "Email của tài khoản chưa được xác minh.",
      });
    }

    console.log(
      "SmartNotes authenticated request:",
      {
        uid: decodedToken.uid,
        emailVerified:
          decodedToken.email_verified === true,
      }
    );
  } catch (error: any) {
    console.error(
      "Firebase verification error:",
      error?.code ||
        error?.message ||
        error
    );

    if (
      error?.message ===
      "FIREBASE_ADMIN_NOT_CONFIGURED"
    ) {
      return res.status(500).json({
        success: false,
        error:
          "Firebase Admin chưa được cấu hình trên Vercel.",
      });
    }

    return res.status(401).json({
      success: false,
      error:
        "Phiên đăng nhập Firebase không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
    });
  }

  // ---------------------------------------------------------
  // 3. CHECK GEMINI KEY
  // ---------------------------------------------------------
  const geminiApiKey =
    process.env.GEMINI_API_KEY?.trim();

  if (!geminiApiKey) {
    console.error(
      "GEMINI_API_KEY is missing"
    );

    return res.status(500).json({
      success: false,
      error:
        "GEMINI_API_KEY chưa được cấu hình trên Vercel.",
    });
  }

  // ---------------------------------------------------------
  // 4. BODY VALIDATION
  // ---------------------------------------------------------
  const body = normalizeBody(req.body);

  const text =
    typeof body.text === "string"
      ? body.text.trim()
      : "";

  const subject =
    typeof body.subject === "string"
      ? body.subject.trim()
      : "";

  const imageBase64 =
    typeof body.imageBase64 === "string"
      ? body.imageBase64
      : "";

  const mimeType =
    typeof body.mimeType === "string"
      ? body.mimeType
      : "";

  if (!text && !imageBase64) {
    return res.status(400).json({
      success: false,
      error:
        "Cần cung cấp ảnh trang vở hoặc nội dung văn bản để phân tích.",
    });
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(413).json({
      success: false,
      error:
        "Nội dung văn bản quá dài. Vui lòng rút gọn rồi thử lại.",
    });
  }

  let image:
    | {
        data: string;
        mimeType: string;
      }
    | null = null;

  try {
    image = prepareImage(
      imageBase64,
      mimeType
    );
  } catch (error: any) {
    if (
      error?.message ===
      "INVALID_IMAGE_MIME_TYPE"
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Tệp gửi lên không phải định dạng hình ảnh hợp lệ.",
      });
    }

    if (
      error?.message ===
      "IMAGE_TOO_LARGE"
    ) {
      return res.status(413).json({
        success: false,
        error:
          "Ảnh quá lớn. Vui lòng giảm kích thước ảnh rồi thử lại.",
      });
    }

    throw error;
  }

  // ---------------------------------------------------------
  // 5. BUILD GEMINI INPUT
  // ---------------------------------------------------------
  const prompt = buildPrompt(
    subject,
    text
  );

  const parts: any[] = [];

  if (image) {
    parts.push({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    });
  }

  parts.push({
    text: prompt,
  });

  const ai = new GoogleGenAI({
    apiKey: geminiApiKey,
  });

  // ---------------------------------------------------------
  // 6. TRY MODELS
  // ---------------------------------------------------------
  let lastError: any = null;
  let lastModel = "";

  for (const model of GEMINI_MODELS) {
    lastModel = model;

    try {
      console.log(
        `Trying Gemini model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,

          contents: [
            {
              role: "user",
              parts,
            },
          ],

          config: {
            responseMimeType:
              "application/json",
            temperature: 0.1,
          },
        });

      const rawText =
        response.text || "";

      if (!rawText.trim()) {
        throw new Error(
          "Gemini returned empty response."
        );
      }

      const cleanedText =
        cleanJsonText(rawText);

      let parsed: any;

      try {
        parsed = JSON.parse(
          cleanedText
        );
      } catch {
        console.error(
          `Gemini ${model} returned invalid JSON.`
        );

        throw new Error(
          "Gemini trả về JSON không hợp lệ."
        );
      }

      const normalized =
        normalizeGeminiData(
          parsed,
          subject
        );

      console.log(
        `Gemini success: ${model}`,
        {
          uid: decodedToken.uid,
          hasImage: Boolean(image),
          hasText: Boolean(text),
        }
      );

      return res.status(200).json({
        success: true,
        modelUsed: model,
        data: normalized,
      });
    } catch (error: any) {
      lastError = error;

      console.error(
        `Gemini model ${model} failed:`,
        error?.message || error
      );

      if (
        shouldStopModelFallback(error)
      ) {
        break;
      }
    }
  }

  // ---------------------------------------------------------
  // 7. GEMINI FAILED
  // ---------------------------------------------------------
  const friendlyError =
    friendlyGeminiError(
      lastError,
      lastModel
    );

  return res.status(502).json({
    success: false,
    error: friendlyError,
  });
}
