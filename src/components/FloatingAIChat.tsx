import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  LoaderCircle,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";

import { auth } from "../firebase";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type FloatingAIChatProps = {
  subject: string;
  grade: string;
  accentColor: string;
  isDark: boolean;
};

const WELCOME_MESSAGE =
  "Chào bạn! Mình là trợ lý học tập SmartNotes. Hãy hỏi mình về bài học, bài tập hoặc kiến thức bạn chưa hiểu nhé.";

const MAX_INPUT_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 10;

export function FloatingAIChat({
  subject,
  grade,
  accentColor,
  isDark,
}: FloatingAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: WELCOME_MESSAGE,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      const container = scrollRef.current;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }

      inputRef.current?.focus();
    });
  }, [isOpen, messages, isSending]);

  const resetChat = () => {
    if (isSending) return;

    setMessages([
      {
        role: "assistant",
        content: WELCOME_MESSAGE,
      },
    ]);
    setInput("");
    setError("");
  };

  const sendMessage = async () => {
    const question = input.trim();

    if (!question || isSending) return;

    if (question.length > MAX_INPUT_LENGTH) {
      setError(
        "Câu hỏi hơi dài. Hãy rút gọn còn tối đa 2.000 ký tự nhé."
      );
      return;
    }

    setError("");
    setInput("");

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: question,
      },
    ].slice(-(MAX_HISTORY_MESSAGES + 1));

    setMessages(nextMessages);
    setIsSending(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error(
          "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại."
        );
      }

      const idToken = await currentUser.getIdToken();

      const historyForApi = nextMessages
        .filter(
          (message) =>
            !(
              message.role === "assistant" &&
              message.content === WELCOME_MESSAGE
            )
        )
        .slice(-MAX_HISTORY_MESSAGES);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
        body: JSON.stringify({
          messages: historyForApi,
          subject,
          grade,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Không thể kết nối trợ lý AI."
        );
      }

      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Mình chưa tạo được câu trả lời. Bạn thử hỏi lại nhé.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (requestError: any) {
      setError(
        requestError?.message ||
          "Không thể kết nối trợ lý AI. Vui lòng thử lại."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300/40"
        style={{ backgroundColor: accentColor }}
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        title="Trợ lý học tập AI"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <section
          className={
            "fixed bottom-24 left-4 right-4 sm:left-auto sm:right-5 sm:w-96 z-[60] h-[min(620px,72vh)] rounded-3xl border shadow-2xl overflow-hidden flex flex-col " +
            (isDark
              ? "bg-zinc-950 border-zinc-800 text-zinc-100"
              : "bg-white border-zinc-200 text-zinc-900")
          }
          aria-label="Trợ lý học tập SmartNotes"
        >
          <header
            className="px-4 py-3 text-white flex items-center justify-between gap-3"
            style={{ backgroundColor: accentColor }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <h3 className="font-black text-sm truncate">
                  SmartNotes Tutor
                </h3>
                <p className="text-[10px] text-white/80 truncate">
                  Groq • {subject} • {grade}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetChat}
              disabled={isSending}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50"
              title="Cuộc trò chuyện mới"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  "flex " +
                  (message.role === "user"
                    ? "justify-end"
                    : "justify-start")
                }
              >
                <div
                  className={
                    "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap " +
                    (message.role === "user"
                      ? "text-white rounded-br-md"
                      : isDark
                      ? "bg-zinc-800 text-zinc-100 rounded-bl-md"
                      : "bg-zinc-100 text-zinc-800 rounded-bl-md")
                  }
                  style={
                    message.role === "user"
                      ? { backgroundColor: accentColor }
                      : undefined
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div
                  className={
                    "rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm flex items-center gap-2 " +
                    (isDark
                      ? "bg-zinc-800 text-zinc-300"
                      : "bg-zinc-100 text-zinc-600")
                  }
                >
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  AI đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          <div
            className={
              "border-t p-3 " +
              (isDark
                ? "border-zinc-800 bg-zinc-950"
                : "border-zinc-200 bg-white")
            }
          >
            {error && (
              <div className="mb-2 text-[11px] text-rose-500 leading-relaxed">
                {error}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_INPUT_LENGTH}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Hỏi AI về bài học..."
                className={
                  "flex-1 min-h-11 max-h-28 resize-none rounded-2xl border px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
                  (isDark
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400")
                }
              />

              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="w-11 h-11 shrink-0 rounded-2xl text-white flex items-center justify-center disabled:opacity-40"
                style={{ backgroundColor: accentColor }}
                title="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="mt-2 text-[10px] text-zinc-500 text-center">
              AI chỉ hỗ trợ chủ đề học tập. Enter để gửi, Shift + Enter để xuống dòng.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
