import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Camera,
  Upload,
  Keyboard,
  Sparkles,
  Brain,
  Trophy,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sun,
  Moon,
  Palette,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  Lightbulb,
  FileCheck,
  AlertCircle,
  Download,
  Search,
  Gamepad2,
  ShieldCheck,
  Flame,
  FileText,
  Coins,
  Gift
} from "lucide-react";
import { UserProfile, AnalysisResult, GradeLevel, SavedNoteRecord, CreditTransaction, RedeemedGift, RewardItem } from "./types";
import { curriculumPresets } from "./data/subjectCurriculum";
import { MindmapView } from "./components/MindmapView";
import { AuditReportView } from "./components/AuditReportView";
import { IllustrationGallery } from "./components/IllustrationGallery";
import { ReviewArena } from "./components/ReviewArena";
import { MemoryGame } from "./components/MemoryGame";
import { NotebookArchive } from "./components/NotebookArchive";
import { ProfileModal } from "./components/ProfileModal";
import { ThemeStudioModal } from "./components/ThemeStudioModal";
import { RewardShopView } from "./components/RewardShopView";
import { formatToDdMmYy } from "./utils/dateUtils";

export default function SmartNotesApp() {
  // ================= AUTHENTICATION STATE =================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Login form states (with default line edit example@abc.com)
  const [loginEmail, setLoginEmail] = useState("example@abc.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register form states (with default line edit Nguyễn Văn A & example@abc.com)
  const [regFullName, setRegFullName] = useState("Nguyễn Văn A");
  const [regEmail, setRegEmail] = useState("example@abc.com");
  const [regUsername, setRegUsername] = useState("nguyenvana");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regSchool, setRegSchool] = useState("THCS & THPT FPT Đà Nẵng");
  const [regGrade, setRegGrade] = useState<GradeLevel>("Lớp 6");
  const [regGender, setRegGender] = useState("Nam");
  const [regDob, setRegDob] = useState("15/05/2012");
  const [regError, setRegError] = useState("");

  // ================= MAIN NAVIGATION & THEME =================
  const [activeTab, setActiveTab] = useState<"home" | "create" | "archive" | "arena" | "game" | "rewards" | "profile">("home");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "studio">("light");
  const [accentColor, setAccentColor] = useState("#4f46e5");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ================= CREDITS & REWARDS SYSTEM =================
  // Rule: Khởi tạo 200 credits ban đầu
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem("sn_user_credits");
    if (saved !== null) {
      const parsed = Number(saved);
      if (!isNaN(parsed)) return parsed;
    }
    return 200;
  });

  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem("sn_credit_transactions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "tx-init",
        type: "earn",
        amount: 200,
        description: "Điểm thưởng khởi tạo tài khoản học sinh",
        timestamp: new Date().toLocaleDateString("vi-VN"),
        category: "initial"
      }
    ];
  });

  const [redeemedGifts, setRedeemedGifts] = useState<RedeemedGift[]>(() => {
    const saved = localStorage.getItem("sn_redeemed_gifts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [insufficientCreditsModal, setInsufficientCreditsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("sn_user_credits", credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem("sn_credit_transactions", JSON.stringify(creditTransactions));
  }, [creditTransactions]);

  useEffect(() => {
    localStorage.setItem("sn_redeemed_gifts", JSON.stringify(redeemedGifts));
  }, [redeemedGifts]);

  // Handler to award credits (e.g. +1 credit when answering all 10/10 questions in Arena)
  const handleAddCredits = (amount: number, reason: string) => {
    setCredits(prev => prev + amount);
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      type: "earn",
      amount,
      description: reason,
      timestamp: `${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${new Date().toLocaleDateString("vi-VN")}`,
      category: "arena"
    };
    setCreditTransactions(prev => [newTx, ...prev]);
  };

  // Handler to redeem reward from catalogue
  const handleRedeemReward = (item: RewardItem): boolean => {
    if (credits < item.cost) {
      return false;
    }
    setCredits(prev => prev - item.cost);
    const nowStr = `${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${new Date().toLocaleDateString("vi-VN")}`;
    const code = `SN-${item.category.toUpperCase().slice(0, 3)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newGift: RedeemedGift = {
      id: `gift-${Date.now()}`,
      rewardId: item.id,
      rewardName: item.name,
      categoryName: item.tag || "Quà tặng",
      cost: item.cost,
      code,
      redeemedAt: nowStr
    };
    setRedeemedGifts(prev => [newGift, ...prev]);

    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      type: "spend",
      amount: item.cost,
      description: `Đổi quà: ${item.name} (Mã: ${code})`,
      timestamp: nowStr,
      category: "reward"
    };
    setCreditTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const defaultProfile: UserProfile = {
      fullName: "Nguyễn Văn A",
      email: "example@abc.com",
      username: "nguyenvana",
      school: "THCS & THPT FPT Đà Nẵng",
      grade: "Lớp 6",
      gender: "Nam",
      dob: "15/05/2012"
    };
    const saved = localStorage.getItem("sn_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.dob) {
          parsed.dob = formatToDdMmYy(parsed.dob);
        }
        return { ...defaultProfile, ...parsed };
      } catch (e) {}
    }
    return defaultProfile;
  });

  // ================= SCANNING & AI DIGITIZATION STATE =================
  const [inputMode, setInputMode] = useState<"upload" | "camera" | "typing">("upload");
  const [selectedSubjectPreset, setSelectedSubjectPreset] = useState<string>("KHTN 6 (Kết nối tri thức)");
  const [typedText, setTypedText] = useState<string>("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisSuccessToast, setAnalysisSuccessToast] = useState<string | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);
  const [copiedNotepad, setCopiedNotepad] = useState<boolean>(false);
  const [revealedFlashcard, setRevealedFlashcard] = useState<Record<number, boolean>>({});

  // Camera Refs
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ================= SAVED NOTES ARCHIVE =================
  const [savedNotes, setSavedNotes] = useState<SavedNoteRecord[]>(() => {
    const saved = localStorage.getItem("sn_saved_notes_archive");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default initial seeded archive from preset
    return [
      {
        id: "note-init-1",
        title: curriculumPresets["KHTN 6 (Kết nối tri thức)"].title,
        subject: "Khoa học tự nhiên",
        grade: "Lớp 6",
        createdAt: "17/09/2026",
        summary: curriculumPresets["KHTN 6 (Kết nối tri thức)"].summary,
        fullData: curriculumPresets["KHTN 6 (Kết nối tri thức)"]
      },
      {
        id: "note-init-2",
        title: curriculumPresets["Toán 7 (Kết nối tri thức)"].title,
        subject: "Toán học",
        grade: "Lớp 7",
        createdAt: "16/09/2026",
        summary: curriculumPresets["Toán 7 (Kết nối tri thức)"].summary,
        fullData: curriculumPresets["Toán 7 (Kết nối tri thức)"]
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("sn_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("sn_saved_notes_archive", JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sn_theme_mode") as any;
    const savedColor = localStorage.getItem("sn_accent_color");
    if (savedTheme) setThemeMode(savedTheme);
    if (savedColor) setAccentColor(savedColor);
  }, []);

  const handleThemeChange = (mode: "light" | "dark" | "studio") => {
    setThemeMode(mode);
    localStorage.setItem("sn_theme_mode", mode);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("sn_accent_color", color);
  };

  // Camera Management
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  useEffect(() => {
    if (inputMode !== "camera") {
      stopCameraStream();
    }
  }, [inputMode]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Trình duyệt không hỗ trợ webcam hoặc thiết bị camera.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError("Không thể mở camera. Vui lòng cho phép quyền truy cập camera hoặc chuyển sang chế độ Tải ảnh / Đánh máy.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setUploadedImagePreview(dataUrl);
      stopCameraStream();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auth Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoggedIn(true);
    setActiveTab("home");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regEmail || !regUsername || !regPassword || !regConfirmPassword) {
      setRegError("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    if (regPassword.length <= 8) {
      setRegError("Mật khẩu phải dài trên 8 kí tự để đảm bảo tính an toàn!");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    const updatedProfile: UserProfile = {
      fullName: regFullName || "Nguyễn Văn A",
      email: regEmail,
      username: regUsername,
      school: regSchool,
      grade: regGrade,
      gender: regGender,
      dob: formatToDdMmYy(regDob)
    };

    setUserProfile(updatedProfile);
    setIsLoggedIn(true);
    setActiveTab("home");
  };

  // AI Digitization & Semantic Analysis via Gemini AI
  // Rule: Mỗi lần quét & Phân tích vở là sẽ trừ 2 credits
  const handleStartAnalysis = async () => {
    if (!uploadedImagePreview && !typedText.trim()) {
      setAnalysisError("Vui lòng chụp ảnh/tải lên ảnh trang vở hoặc nhập nội dung bài trước khi phân tích!");
      return;
    }

    if (credits < 2) {
      setInsufficientCreditsModal(true);
      return;
    }

    setAnalysisError(null);
    setAnalysisSuccessToast(null);

    // Deduct 2 credits and log transaction
    setCredits(prev => Math.max(0, prev - 2));
    const scanTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      type: "spend",
      amount: 2,
      description: `Quét & Tóm tắt vở ghi (${selectedSubjectPreset})`,
      timestamp: `${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ${formatToDdMmYy(new Date())}`,
      category: "scan"
    };
    setCreditTransactions(prev => [scanTx, ...prev]);

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: typedText || undefined,
          subject: selectedSubjectPreset,
          imageBase64: uploadedImagePreview || undefined
        })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const analyzed = resData.data;
        analyzed.rawPhotoPreview = uploadedImagePreview || undefined;
        analyzed.isRealGeminiAnalysis = true;
        setAnalysisResult(analyzed);

        // Automatically save to local notebook archive
        const newRecord: SavedNoteRecord = {
          id: `note-${Date.now()}`,
          title: analyzed.title || "Bài ghi số hóa",
          subject: analyzed.subject || selectedSubjectPreset.split(" ")[0],
          grade: analyzed.grade || userProfile.grade,
          createdAt: formatToDdMmYy(new Date()),
          summary: analyzed.summary || "",
          fullData: analyzed
        };
        setSavedNotes(prev => [newRecord, ...prev]);
        setIsAnalyzing(false);
        setAnalysisSuccessToast("Gemini AI đã phân tích và tóm tắt thành công bài học từ ảnh chụp!");
        setTimeout(() => {
          resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return;
      } else {
        throw new Error(resData.error || resData.message || "Hệ thống AI không thể phản hồi lúc này.");
      }
    } catch (e: any) {
      console.error("Gemini analysis failed:", e);
      setIsAnalyzing(false);
      setAnalysisError(e?.message || "Không thể phân tích bằng Gemini AI lúc này. Vui lòng bấm 'Thử lại' hoặc kiểm tra ảnh chụp.");
    }
  };

  const handleLoadSamplePreset = () => {
    const preset = curriculumPresets[selectedSubjectPreset] || curriculumPresets["KHTN 6 (Kết nối tri thức)"];
    setAnalysisResult(preset);
    setAnalysisError(null);
    setAnalysisSuccessToast("Đã tải bài phân tích mẫu tham khảo!");
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Export current active note to Notepad (.txt)
  const handleDownloadNotepad = () => {
    if (!analysisResult) return;
    let text = `==========================================================\n`;
    text += `SMARTNOTES AI - SỔ TAY SỐ HÓA VỞ GHI (SGK KẾT NỐI TRI THỨC)\n`;
    text += `==========================================================\n\n`;
    text += `BÀI HỌC: ${analysisResult.title}\n`;
    text += `KHỐI LỚP: ${analysisResult.grade || userProfile.grade} | MÔN: ${analysisResult.subject || selectedSubjectPreset}\n\n`;
    text += `I. TÓM TẮT TRỌNG TÂM:\n${analysisResult.summary}\n\n`;

    if (analysisResult.mindmap && analysisResult.mindmap.length > 0) {
      text += `II. SƠ ĐỒ TƯ DUY (MINDMAP CÂY KIẾN THỨC):\n`;
      analysisResult.mindmap.forEach((b, i) => {
        text += `[Nhánh ${i + 1}] ${b.node}:\n`;
        b.children.forEach(c => (text += `   + ${c}\n`));
      });
      text += `\n`;
    }

    if (analysisResult.auditChecks && analysisResult.auditChecks.length > 0) {
      text += `III. RÀ SOÁT LỖI SAI VỞ GHI & ĐÍNH CHÍNH (AI AUDIT):\n`;
      analysisResult.auditChecks.forEach((chk, i) => {
        text += `(${i + 1}) Lỗi ghi chép: ${chk.issue}\n`;
        text += `    => Đính chính SGK: ${chk.suggestion}\n`;
      });
      text += `\n`;
    }

    if (analysisResult.academicSources && analysisResult.academicSources.length > 0) {
      text += `IV. TRÍCH NGUỒN TÀI LIỆU HỌC THUẬT CHUẨN SGK:\n`;
      analysisResult.academicSources.forEach(s => {
        text += `- ${s.title} (${s.link})\n`;
      });
    }

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SmartNotes_${analysisResult.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedNotepad(true);
    setTimeout(() => setCopiedNotepad(false), 2500);
  };

  // Grade Options 1 - 9
  const gradeOptions: GradeLevel[] = [
    "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5",
    "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"
  ];

  // ==================== AUTHENTICATION SCREEN ====================
  if (!isLoggedIn) {
    return (
      <div id="auth-screen" className="min-h-screen bg-gradient-to-br from-indigo-950 via-zinc-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-indigo-500/30 p-6 md:p-8 rounded-3xl w-full max-w-lg text-white shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg mb-1">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sáng tạo trẻ Quốc gia về AI</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-300 via-indigo-200 to-teal-200 bg-clip-text text-transparent">
              SmartNotes AI
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Hệ thống AI số hóa, hiểu sâu & rà soát nội dung ghi chép viết tay học sinh TH & THCS theo SGK Kết nối tri thức
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode("login"); setLoginError(""); setRegError(""); }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                authMode === "login"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("register"); setLoginError(""); setRegError(""); }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                authMode === "register"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {regError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{regError}</span>
            </div>
          )}

          {/* Login Form */}
          {authMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email đăng nhập
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="example@abc.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Họ và tên học sinh
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@abc.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="nguyenvana"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Khối lớp (1 - 9)
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/20 text-white text-sm focus:outline-none"
                  >
                    {gradeOptions.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Trường học
                  </label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="THCS & THPT FPT Đà Nẵng"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/20 text-white text-sm focus:outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-zinc-300">
                      Ngày sinh
                    </label>
                    <span className="text-[10px] text-indigo-400 font-bold">dd/mm/yyyy</span>
                  </div>
                  <input
                    type="text"
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    placeholder="dd/mm/yyyy (ví dụ: 15/05/2012)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/20 text-white text-sm focus:outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Password & Confirm Password (>8 characters) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mật khẩu (&gt;8 ký tự) *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 9 ký tự"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 italic">
                * Mật khẩu yêu cầu trên 8 ký tự để đảm bảo tính an toàn tài khoản.
              </p>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl shadow-lg transition mt-2 text-sm flex items-center justify-center gap-2"
              >
                <span>Đăng ký & Vào hệ thống</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==================== MAIN APPLICATION SHELL ====================
  const isDark = themeMode === "dark";
  const isStudio = themeMode === "studio";

  const themeClasses = isStudio
    ? "bg-stone-100 text-stone-900"
    : isDark
    ? "bg-zinc-950 text-zinc-100 dark"
    : "bg-slate-50 text-zinc-900";

  const cardClasses = isStudio
    ? "bg-white border-stone-300 shadow-sm"
    : isDark
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-zinc-200 shadow-sm";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* HEADER BAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 py-3 flex items-center justify-between ${
        isDark ? "bg-zinc-950/80 border-zinc-800" : isStudio ? "bg-stone-200/80 border-stone-300" : "bg-white/80 border-zinc-200"
      }`}>
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab("home")}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-lg tracking-tight">SmartNotes AI</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                TH & THCS
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              SGK Kết nối tri thức với cuộc sống
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "home" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "create" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Quét & Phân tích vở
          </button>
          <button
            onClick={() => setActiveTab("archive")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "archive" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Sổ tay số ({savedNotes.length})
          </button>
          <button
            onClick={() => setActiveTab("arena")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "arena" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Đấu trường Ôn tập
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "rewards" ? "bg-white dark:bg-zinc-800 shadow-sm text-amber-600 dark:text-amber-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-500" />
            <span>Đổi quà & Điểm</span>
          </button>
          <button
            onClick={() => setActiveTab("game")}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === "game" ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            Mini Game
          </button>
        </nav>

        {/* Right Tools: Credits Quick Pill, Theme, Profile, Logout */}
        <div className="flex items-center gap-2">
          {/* Quick Credits Balance Pill */}
          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              activeTab === "rewards"
                ? "bg-amber-500 text-white border-amber-600"
                : "bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 hover:bg-amber-100"
            }`}
            title="Xem số dư credits & Cửa hàng Đổi quà"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>{credits.toLocaleString()}</span>
            <span className="hidden sm:inline font-normal text-[11px] opacity-80">cr</span>
            <span className="hidden lg:inline text-[10px] bg-amber-200/70 dark:bg-amber-900/60 px-1.5 py-0.5 rounded-md font-semibold ml-0.5">
              Đổi quà
            </span>
          </button>

          <button
            onClick={() => setShowThemeModal(true)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Theme Studio"
          >
            <Palette className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">{userProfile.fullName}</span>
          </button>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              stopCameraStream();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
          >
            Thoát
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex justify-around p-2 shadow-lg">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center text-[11px] p-1 font-medium ${
            activeTab === "home" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-500"
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Trang chủ</span>
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`flex flex-col items-center text-[11px] p-1 font-medium ${
            activeTab === "create" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-500"
          }`}
        >
          <Camera className="w-4 h-4 mb-0.5" />
          <span>Quét vở</span>
        </button>
        <button
          onClick={() => setActiveTab("archive")}
          className={`flex flex-col items-center text-[11px] p-1 font-medium ${
            activeTab === "archive" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-500"
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Sổ tay</span>
        </button>
        <button
          onClick={() => setActiveTab("arena")}
          className={`flex flex-col items-center text-[11px] p-1 font-medium ${
            activeTab === "arena" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-500"
          }`}
        >
          <Trophy className="w-4 h-4 mb-0.5" />
          <span>Đấu trường</span>
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex flex-col items-center text-[11px] p-1 font-medium ${
            activeTab === "rewards" ? "text-amber-600 dark:text-amber-400 font-bold" : "text-zinc-500"
          }`}
        >
          <Gift className="w-4 h-4 mb-0.5 text-amber-500" />
          <span>Đổi quà</span>
        </button>
        <button
          onClick={() => setActiveTab("game")}
          className={`flex flex-col items-center text-[11px] p-1 font-medium ${
            activeTab === "game" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-zinc-500"
          }`}
        >
          <Gamepad2 className="w-4 h-4 mb-0.5" />
          <span>Game</span>
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 pb-24 md:pb-12 space-y-8">

        {/* ================= TAB: HOME ================= */}
        {activeTab === "home" && (
          <div className="space-y-8">
            {/* Hero Welcome Banner */}
            <div className={`p-6 md:p-8 rounded-3xl border ${cardClasses} flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden`}>
              <div className="space-y-3.5 z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{userProfile.grade} • {userProfile.school}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  Chào mừng trở lại, {userProfile.fullName}! 📚
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  SmartNotes AI giúp biến trang vở viết tay rải rác thành tài liệu học tập số chuẩn cấu trúc SGK Kết nối tri thức. Tự động trích xuất sơ đồ tư duy, rà soát lỗi sai công thức và ôn tập cùng Đấu trường kiến thức Khối 1 - 9.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Quét trang vở mới</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("arena")}
                    className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Vào Đấu trường Ôn tập</span>
                  </button>
                </div>
              </div>

              {/* Stats Box */}
              <div className="w-full lg:w-80 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-500/10 border border-indigo-500/20 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>Hoạt động & Điểm thưởng</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("rewards")}
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Đổi quà</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-700/50">
                    <span className="text-zinc-500">Điểm Credits tích lũy:</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{credits.toLocaleString()} credits</span>
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-700/50">
                    <span className="text-zinc-500">Bài vở đã số hóa:</span>
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{savedNotes.length} trang (-{savedNotes.length * 2} cr)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-700/50">
                    <span className="text-zinc-500">Quà đã đổi nhận:</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-bold">{redeemedGifts.length} phần quà</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Cơ sở dữ liệu SGK:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Khối 1 - 9</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab("create")}
                className={`p-5 rounded-3xl border ${cardClasses} cursor-pointer hover:border-indigo-400 transition group`}
              >
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1 flex items-center justify-between">
                  <span>Số hóa Vở ghi AI</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Nhận diện viết tay, trích sơ đồ tư duy & rà soát lỗi sai công thức (-2 credits/lần quét).
                </p>
              </div>

              <div
                onClick={() => setActiveTab("arena")}
                className={`p-5 rounded-3xl border ${cardClasses} cursor-pointer hover:border-amber-400 transition group`}
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1 flex items-center justify-between">
                  <span>Đấu trường Ôn tập</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Thi đấu trắc nghiệm SGK Khối 1 - 9. Đúng 10/10 câu thưởng ngay +1 credit điểm tích lũy.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("rewards")}
                className={`p-5 rounded-3xl border ${cardClasses} cursor-pointer hover:border-emerald-400 transition group`}
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1 flex items-center justify-between">
                  <span>Kho Đổi quà & Điểm</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Đổi đồ dùng học tập (Bút chì, Tẩy, Vở), đồ chơi (Lego, Rubik, Cờ vua) & đồ sinh hoạt.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("archive")}
                className={`p-5 rounded-3xl border ${cardClasses} cursor-pointer hover:border-violet-400 transition group`}
              >
                <div className="w-11 h-11 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1 flex items-center justify-between">
                  <span>Sổ tay số & Notepad</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Lưu trữ có cấu trúc, xuất nhanh ra Notepad (.txt) và tra cứu kiến thức học kỳ.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: CREATE / DIGITIZE ================= */}
        {activeTab === "create" && (
          <div className="space-y-6">
            <div className={`p-6 md:p-8 rounded-3xl border ${cardClasses} space-y-6 shadow-sm`}>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-bold">Chụp & Phân tích Vở ghi Học sinh (AI Core)</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    AI không chỉ nhận diện văn bản mà còn phân tích cấu trúc, tạo sơ đồ tư duy & rà soát lỗi ghi chép
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-500">Môn & Bài mẫu:</span>
                  <select
                    value={selectedSubjectPreset}
                    onChange={(e) => {
                      setSelectedSubjectPreset(e.target.value);
                      const preset = curriculumPresets[e.target.value];
                      if (preset) setAnalysisResult(preset);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    {Object.keys(curriculumPresets).map((presetKey) => (
                      <option key={presetKey} value={presetKey}>{presetKey}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input Mode Selector: Upload / Camera / Typing */}
              <div className="grid grid-cols-3 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                <button
                  onClick={() => setInputMode("upload")}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    inputMode === "upload" ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Tải ảnh trang vở</span>
                </button>
                <button
                  onClick={() => {
                    setInputMode("camera");
                    startCamera();
                  }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    inputMode === "camera" ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Chụp trực tiếp</span>
                </button>
                <button
                  onClick={() => setInputMode("typing")}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    inputMode === "typing" ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  <span>Đánh máy thủ công</span>
                </button>
              </div>

              {/* Upload File Mode */}
              {inputMode === "upload" && (
                <div className="space-y-4">
                  <label className="block p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 rounded-3xl text-center cursor-pointer transition-colors bg-zinc-50 dark:bg-zinc-800/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                    <span className="text-sm font-bold block text-zinc-800 dark:text-zinc-200">
                      Chọn tệp ảnh trang vở hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-zinc-500 mt-1 block">
                      Hỗ trợ PNG, JPG, JPEG (Ảnh chụp trang vở viết tay, sơ đồ, bảng biểu)
                    </span>
                  </label>

                  {uploadedImagePreview && (
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadedImagePreview}
                          alt="Trang vở đã chọn"
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-300 dark:border-zinc-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            Ảnh trang vở đã sẵn sàng
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            Nhấn nút bên dưới để AI bắt đầu quét và phân tích
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedImagePreview(null)}
                        className="text-xs font-semibold text-rose-500 hover:underline"
                      >
                        Chọn ảnh khác
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Camera Capture Mode */}
              {inputMode === "camera" && (
                <div className="space-y-4">
                  {cameraError ? (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
                      {cameraError}
                    </div>
                  ) : isCameraActive ? (
                    <div className="space-y-3 text-center">
                      <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-indigo-500 bg-black shadow-lg">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-auto max-h-72 object-cover"
                        />
                      </div>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={capturePhoto}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Chụp trang vở</span>
                        </button>
                        <button
                          onClick={stopCameraStream}
                          className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={startCamera}
                      className="w-full py-6 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-center font-bold text-sm text-indigo-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    >
                      Bật Camera để chụp trực tiếp trang vở
                    </button>
                  )}

                  {uploadedImagePreview && !isCameraActive && (
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadedImagePreview}
                          alt="Ảnh chụp từ camera"
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-300 dark:border-zinc-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            Ảnh chụp từ camera đã lưu
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            Sẵn sàng gửi AI xử lý
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedImagePreview(null);
                          startCamera();
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Chụp lại
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Typing Mode */}
              {inputMode === "typing" && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-500">Nội dung ghi chép của học sinh:</span>
                    <button
                      onClick={() =>
                        setTypedText(
                          "Bài 6: Thang nhiệt độ - Các phép đo nhiệt độ (KHTN 6)\n- Khái niệm: Nhiệt độ là số đo độ nóng, lạnh của một vật.\n- Thang Celsius (°C): 0°C là nước đá đang tan, 100°C là nước sôi ở áp suất chuẩn.\n- Dụng cụ đo: Nhiệt kế thủy ngân, nhiệt kế rượu, nhiệt kế y tế.\n- Thao tác: Cần ước lượng nhiệt độ và chọn GHĐ, ĐCNN phù hợp."
                        )
                      }
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      + Dán bài mẫu KHTN 6
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    placeholder="Gõ hoặc dán nội dung chữ viết tay, định nghĩa, công thức ghi chép trên lớp..."
                    className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white text-zinc-950 font-medium placeholder:text-zinc-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                  />
                </div>
              )}

              {/* Credit Cost & Balance Indicator */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-300">
                      Chi phí AI quét & phân tích: <strong className="text-zinc-900 dark:text-zinc-100 font-bold">2 credits / lần</strong>
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Tự động trừ khi bắt đầu phân tích
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Số dư hiện tại:</span>
                  <span className={`px-2.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1 ${
                    credits >= 2
                      ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                      : "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700"
                  }`}>
                    <Coins className="w-3.5 h-3.5" />
                    <span>{credits.toLocaleString()} credits</span>
                  </span>
                </div>
              </div>

              {/* Insufficient Credit Inline Notice */}
              {credits < 2 && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>Số dư không đủ (cần ít nhất 2 credits để quét)</span>
                  </div>
                  <p className="text-rose-700 dark:text-rose-300">
                    Em hiện chỉ còn {credits} credit(s). Hãy tham gia Đấu trường Ôn tập và trả lời đúng 10/10 câu để được thưởng thêm +1 credit!
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("arena")}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 shadow-sm flex items-center gap-1"
                    >
                      <Trophy className="w-3 h-3" />
                      <span>Đến Đấu trường Ôn tập (+1 cr)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("rewards")}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-700 font-semibold text-[11px] hover:bg-rose-100"
                    >
                      Xem lịch sử điểm & Quà
                    </button>
                  </div>
                </div>
              )}

              {/* Inline Error & Success Banners */}
              {analysisError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="font-bold text-sm text-rose-900 dark:text-rose-100">Chưa thể hoàn tất phân tích</div>
                    <p className="leading-relaxed">{analysisError}</p>
                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Thử phân tích lại ngay</span>
                    </button>
                  </div>
                </div>
              )}

              {analysisSuccessToast && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{analysisSuccessToast}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalysisSuccessToast(null)}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Đóng
                  </button>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    <span>Gemini AI đang nhận diện chữ, tóm tắt ý chính & chuẩn hóa ngày tháng...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Tiến hành Phân tích & Tóm tắt bằng Gemini AI (Trừ 2 credits)</span>
                  </>
                )}
              </button>
            </div>

            {/* RESULTS VIEW */}
            <div ref={resultsSectionRef} id="analysis-result-container">
              {analysisResult ? (
                <div className="space-y-6">
                  {/* Result Title & Notepad Export Action */}
                  <div className={`p-6 rounded-3xl border ${cardClasses} flex flex-wrap items-center justify-between gap-4 shadow-sm`}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã phân tích bằng Gemini AI</span>
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                          ✓ Chỉ lấy nội dung trong bài đã chụp
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                          {analysisResult.grade || userProfile.grade}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black mt-2.5 text-zinc-900 dark:text-zinc-100">
                        {analysisResult.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={handleDownloadNotepad}
                        className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-2 border border-zinc-200 dark:border-zinc-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>{copiedNotepad ? "Đã xuất Notepad (.txt)!" : "Xuất Notepad (.txt)"}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("arena")}
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Trophy className="w-4 h-4" />
                        <span>Ôn tập bài này</span>
                      </button>
                    </div>
                  </div>

                  {/* Section: OCR & Captured Note Content */}
                  {(analysisResult.extractedText || uploadedImagePreview) && (
                    <div className={`p-6 rounded-3xl border ${cardClasses} space-y-4 shadow-sm`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <span>Nội dung chữ nhận diện trực tiếp từ bài chụp (Gemini OCR)</span>
                        </h4>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                          Trung thực 100% - Không bịa đặt
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Uploaded photo thumbnail */}
                        {uploadedImagePreview && (
                          <div className="space-y-1.5">
                            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                              Ảnh chụp bài vở thực tế:
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 max-h-72 flex items-center justify-center">
                              <img
                                src={uploadedImagePreview}
                                alt="Ảnh bài vở đã chụp"
                                className="w-full h-full object-contain max-h-72"
                              />
                            </div>
                          </div>
                        )}

                        {/* Extracted text */}
                        <div className={`space-y-1.5 ${!uploadedImagePreview ? 'lg:col-span-2' : ''}`}>
                          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            Văn bản trích xuất được:
                          </div>
                          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-xs font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 max-h-72 overflow-y-auto whitespace-pre-wrap select-text">
                            {analysisResult.extractedText || "(Đã phân tích nội dung từ ảnh chụp)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section: Dates and Birthdates found (dd/mm/yyyy format) */}
                  {analysisResult.datesFound && analysisResult.datesFound.length > 0 && (
                    <div className={`p-5 rounded-3xl border ${cardClasses} space-y-2 shadow-sm bg-gradient-to-r from-amber-50/60 via-transparent to-transparent dark:from-amber-950/20`}>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Mốc thời gian / Ngày sinh trong bài (Định dạng chuẩn dd/mm/yyyy):</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {analysisResult.datesFound.map((dStr, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-bold text-xs border border-amber-300 dark:border-amber-700 flex items-center gap-1.5 shadow-sm"
                          >
                            <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                            <span>{formatToDdMmYy(dStr)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 1: Summary */}
                  <div className={`p-6 rounded-3xl border ${cardClasses} space-y-3 shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Bản tóm tắt ý chính trọng tâm (Gemini AI)</span>
                      </h4>
                      <span className="text-[11px] text-zinc-400">
                        Chỉ tóm tắt nội dung trong bài đã chụp
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      {analysisResult.summary}
                    </p>

                    {/* Key points if available */}
                    {analysisResult.keyPoints && analysisResult.keyPoints.length > 0 && (
                      <div className="pt-2 space-y-2">
                        <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Các điểm cốt lõi trong bài:</div>
                        <div className="space-y-1.5">
                          {analysisResult.keyPoints.map((kp, kIdx) => (
                            <div key={kIdx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{kp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Interactive Mindmap */}
                  <MindmapView
                    title={analysisResult.title}
                    branches={analysisResult.mindmap || []}
                  />

                  {/* Section 3: AI Audit & Error Check */}
                  <AuditReportView
                    auditChecks={analysisResult.auditChecks || []}
                  />

                  {/* Section 4: Illustration Gallery */}
                  {analysisResult.illustrationImages && analysisResult.illustrationImages.length > 0 && (
                    <IllustrationGallery
                      illustrations={analysisResult.illustrationImages}
                    />
                  )}

                  {/* Section 5: Flashcards */}
                  {analysisResult.flashcards && analysisResult.flashcards.length > 0 && (
                    <div className={`p-6 rounded-3xl border ${cardClasses} space-y-4 shadow-sm`}>
                      <h4 className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>Flashcards ôn nhanh theo nội dung vừa học</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysisResult.flashcards.map((fc, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setRevealedFlashcard(prev => ({
                                ...prev,
                                [idx]: !prev[idx]
                              }))
                            }
                            className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 cursor-pointer hover:border-indigo-400 transition space-y-2"
                          >
                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              Câu hỏi {idx + 1}: {fc.q}
                            </div>
                            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs">
                              {revealedFlashcard[idx] ? (
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  ✓ Đáp án: {fc.a}
                                </span>
                              ) : (
                                <span className="text-zinc-400 italic">
                                  💡 Nhấp vào đây để xem đáp án...
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 6: Academic Sources (Strict Anti-Hallucination) */}
                  <div className={`p-6 rounded-3xl border ${cardClasses} space-y-3 shadow-sm`}>
                    <h4 className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>Nguồn tài liệu học thuật</span>
                    </h4>
                    {analysisResult.academicSources && analysisResult.academicSources.length > 0 ? (
                      <div className="space-y-2">
                        {analysisResult.academicSources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{src.title}</span>
                            {src.link && (
                              <a
                                href={src.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 shrink-0"
                              >
                                <span>Xem tài liệu</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Không phát hiện nguồn trích dẫn ghi trong bài chụp (Đảm bảo trung thực 100%, tuân thủ nghiêm ngặt nguyên tắc cấm bịa thông tin/nguồn).</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty state when no note has been analyzed yet */
                <div className={`p-8 md:p-12 rounded-3xl border ${cardClasses} text-center space-y-4 shadow-sm`}>
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Chưa có nội dung phân tích nào
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Hãy tải lên ảnh chụp trang vở hoặc gõ nội dung bài học, sau đó bấm nút <span className="font-bold text-indigo-600 dark:text-indigo-400">"Tiến hành Phân tích & Tóm tắt bằng Gemini AI"</span> để nhận diện chữ, tóm tắt và trích xuất ngày tháng theo định dạng dd/mm/yyyy.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadSamplePreset}
                      className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold shadow-sm transition flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Thử xem bài phân tích mẫu</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: ARCHIVE / NOTEBOOK ================= */}
        {activeTab === "archive" && (
          <NotebookArchive
            savedNotes={savedNotes}
            onSelectNote={(note) => {
              setAnalysisResult(note);
              setActiveTab("create");
            }}
            onDeleteNote={(id) => {
              setSavedNotes(prev => prev.filter(n => n.id !== id));
            }}
          />
        )}

        {/* ================= TAB: REVIEW ARENA ================= */}
        {activeTab === "arena" && (
          <ReviewArena
            initialGrade={userProfile.grade}
            onAddCredits={handleAddCredits}
            userCredits={credits}
            onNavigateToRewards={() => setActiveTab("rewards")}
          />
        )}

        {/* ================= TAB: REWARD SHOP & CREDIT ANALYTICS ================= */}
        {activeTab === "rewards" && (
          <RewardShopView
            credits={credits}
            transactions={creditTransactions}
            redeemedGifts={redeemedGifts}
            onRedeemReward={handleRedeemReward}
            onNavigateToScan={() => setActiveTab("create")}
            onNavigateToArena={() => setActiveTab("arena")}
          />
        )}

        {/* ================= TAB: MINI GAME ================= */}
        {activeTab === "game" && (
          <MemoryGame />
        )}

      </main>

      {/* MODAL: INSUFFICIENT CREDITS WARNING */}
      {insufficientCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Coins className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Không đủ credits để phân tích vở!
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Mỗi lần quét & phân tích bằng AI cần <strong>2 credits</strong>. Hiện tại tài khoản của em chỉ còn <strong className="text-rose-600 dark:text-rose-400">{credits} credits</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Cách tích lũy thêm credits miễn phí:</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Vào <strong>Đấu trường ôn tập</strong> và hoàn thành xuất sắc thử thách đúng trọn vẹn <strong>10/10 câu hỏi</strong> SGK Kết nối tri thức để nhận ngay <strong>+1 credit</strong>!
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setInsufficientCreditsModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setInsufficientCreditsModal(false);
                  setActiveTab("arena");
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                <span>Vào Đấu trường (+1)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showThemeModal && (
        <ThemeStudioModal
          theme={themeMode}
          accentColor={accentColor}
          onThemeChange={handleThemeChange}
          onAccentColorChange={handleAccentColorChange}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          profile={userProfile}
          onSave={(up) => setUserProfile(up)}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
