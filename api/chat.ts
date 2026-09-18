import {
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODEL = "openai/gpt-oss-20b";

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_CONTEXT_LABEL_LENGTH = 100;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKeyRaw =
    process.env.FIREBASE_PRIVATE_KEY;

  if (
    !projectId ||
    !clientEmail ||
    !privateKeyRaw
  ) {
    throw new Error(
      "FIREBASE_ADMIN_NOT_CONFIGURED"
    );
  }

  const privateKey = privateKeyRaw.replace(
    /\\n/g,
    "\n"
  );

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

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

  const token = authorization
    .slice(7)
    .trim();

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

function sanitizeContextLabel(
  value: unknown,
  fallback: string
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return fallback;
  }

  return cleaned.slice(
    0,
    MAX_CONTEXT_LABEL_LENGTH
  );
}

function sanitizeMessages(
  value: unknown
): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(-MAX_MESSAGES)
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.role === "user" ||
          item.role === "assistant") &&
        typeof item.content === "string"
    )
    .map((item) => ({
      role: item.role as
        | "user"
        | "assistant",
      content: item.content
        .trim()
        .slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter(
      (item) => item.content.length > 0
    );
}

function buildSystemPrompt(
  subject: string,
  grade: string
): string {
  return [
    "Bạn là SmartNotes Tutor, trợ lý học tập dành cho học sinh Tiểu học và THCS Việt Nam.",
    "",
    "PHẠM VI:",
    "- Chỉ hỗ trợ nội dung học tập, kiến thức phổ thông, bài tập, kỹ năng học và ôn tập.",
    "- Có thể giải bài nhưng phải giải thích cách làm rõ ràng, phù hợp trình độ học sinh.",
    "- Nếu câu hỏi không liên quan đến học tập, hãy trả lời ngắn gọn rằng bạn chỉ hỗ trợ chủ đề học tập và mời người dùng đặt câu hỏi khác.",
    "",
    "CÁCH TRẢ LỜI:",
    "- Ưu tiên tiếng Việt, trừ khi người dùng yêu cầu ngôn ngữ khác.",
    "- Giải thích dễ hiểu, từng bước khi cần.",
    "- Không bịa nguồn, số liệu, trang sách hoặc nội dung không chắc chắn.",
    "- Nếu thiếu dữ kiện, hãy nói rõ cần thêm thông tin nào.",
    "- Không cần nhắc lại toàn bộ đề bài nếu không cần thiết.",
    "",
    "BỐI CẢNH HIỆN TẠI:",
    "Môn học: " + subject,
    "Khối lớp: " + grade,
  ].join("\n");
}

function friendlyGroqError(
  status: number,
  data: any
): string {
  if (status === 401 || status === 403) {
    return "Groq API key chưa hợp lệ hoặc chưa có quyền sử dụng model.";
  }

  if (status === 429) {
    return "Groq Free đang chạm giới hạn sử dụng. Vui lòng chờ một lúc rồi thử lại.";
  }

  if (
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return "Groq đang tạm thời gặp sự cố. Vui lòng thử lại sau.";
  }

  const rawMessage =
    data?.error?.message ||
    data?.message;

  return typeof rawMessage === "string" &&
    rawMessage.trim()
    ? "Groq API lỗi: " +
        rawMessage.trim()
    : "Không thể kết nối Groq AI.";
}

export default async function handler(
  req: any,
  res: any
) {
  res.setHeader(
    "Cache-Control",
    "no-store"
  );

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error:
        "Chỉ hỗ trợ phương thức POST.",
    });
  }

  try {
    const bearerToken =
      getBearerToken(req);

    if (!bearerToken) {
      return res.status(401).json({
        error:
          "Bạn cần đăng nhập để sử dụng trợ lý AI.",
      });
    }

    const adminApp =
      getFirebaseAdminApp();

    const decodedToken =
      await getAuth(
        adminApp
      ).verifyIdToken(bearerToken);

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        error:
          "Email cần được xác minh trước khi sử dụng trợ lý AI.",
      });
    }

    const apiKey =
      process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        error:
          "Máy chủ chưa cấu hình GROQ_API_KEY.",
      });
    }

    const body = normalizeBody(req.body);

    const subject =
      sanitizeContextLabel(
        body.subject,
        "Chưa xác định"
      );

    const grade =
      sanitizeContextLabel(
        body.grade,
        "Chưa xác định"
      );

    const messages =
      sanitizeMessages(body.messages);

    if (
      messages.length === 0 ||
      messages[
        messages.length - 1
      ].role !== "user"
    ) {
      return res.status(400).json({
        error:
          "Vui lòng nhập câu hỏi học tập.",
      });
    }

    const groqResponse = await fetch(
      GROQ_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                buildSystemPrompt(
                  subject,
                  grade
                ),
            },
            ...messages,
          ],
          temperature: 0.35,
          max_completion_tokens: 900,
          stream: false,
        }),
      }
    );

    const responseText =
      await groqResponse.text();

    let groqData: any = {};

    try {
      groqData = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      groqData = {};
    }

    if (!groqResponse.ok) {
      return res
        .status(groqResponse.status)
        .json({
          error: friendlyGroqError(
            groqResponse.status,
            groqData
          ),
        });
    }

    const reply =
      groqData?.choices?.[0]?.message
        ?.content;

    if (
      typeof reply !== "string" ||
      !reply.trim()
    ) {
      return res.status(502).json({
        error:
          "Groq không trả về nội dung hợp lệ.",
      });
    }

    return res.status(200).json({
      reply: reply.trim(),
      model: GROQ_MODEL,
    });
  } catch (error: any) {
    console.error(
      "SmartNotes Groq chat error:",
      error
    );

    if (
      error?.message ===
      "FIREBASE_ADMIN_NOT_CONFIGURED"
    ) {
      return res.status(500).json({
        error:
          "Máy chủ chưa cấu hình Firebase Admin.",
      });
    }

    const authCode =
      String(error?.code || "");

    if (
      authCode.includes(
        "auth/id-token-expired"
      ) ||
      authCode.includes(
        "auth/argument-error"
      )
    ) {
      return res.status(401).json({
        error:
          "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
      });
    }

    return res.status(500).json({
      error:
        "Không thể xử lý yêu cầu chat lúc này.",
    });
  }
}
