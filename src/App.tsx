import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  Copy,
  Download,
  FileText,
  Gift,
  GraduationCap,
  Keyboard,
  Palette,
  RotateCcw,
  Sparkles,
  Trophy,
  Upload,
  User,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

import {
  AnalysisResult,
  CreditTransaction,
  GradeLevel,
  RedeemedGift,
  RewardItem,
  SavedNoteRecord,
  UserProfile,
} from "./types";

import { curriculumPresets } from "./data/subjectCurriculum";
import { formatToDdMmYy } from "./utils/dateUtils";

import { MindmapView } from "./components/MindmapView";
import { AuditReportView } from "./components/AuditReportView";
import { IllustrationGallery } from "./components/IllustrationGallery";
import { ReviewArena } from "./components/ReviewArena";
import { MemoryGame } from "./components/MemoryGame";
import { NotebookArchive } from "./components/NotebookArchive";
import { ProfileModal } from "./components/ProfileModal";
import { ThemeStudioModal } from "./components/ThemeStudioModal";
import { RewardShopView } from "./components/RewardShopView";

type MainTab =
  | "home"
  | "create"
  | "archive"
  | "arena"
  | "game"
  | "rewards";

const DEFAULT_PROFILE: UserProfile = {
  fullName: "Học sinh SmartNotes",
  email: "",
  username: "smartnotes_user",
  school: "",
  grade: "Lớp 6",
  gender: "Khác",
  dob: "",
};

const INITIAL_CREDIT_TRANSACTION: CreditTransaction = {
  id: "tx-init",
  type: "earn",
  amount: 200,
  description: "Điểm thưởng khởi tạo tài khoản học sinh",
  timestamp: new Date().toLocaleDateString("vi-VN"),
  category: "initial",
};

const GRADE_OPTIONS: GradeLevel[] = [
  "Lớp 1",
  "Lớp 2",
  "Lớp 3",
  "Lớp 4",
  "Lớp 5",
  "Lớp 6",
  "Lớp 7",
  "Lớp 8",
  "Lớp 9",
];

// =========================================================
// IMAGE COMPRESSION
// Giữ request JSON đủ nhỏ để tránh HTTP 413 trên Vercel.
// =========================================================
const MAX_IMAGE_EDGE = 1600;
const MAX_IMAGE_DATA_URL_LENGTH = 2_800_000;
const MIN_JPEG_QUALITY = 0.55;
const INITIAL_JPEG_QUALITY = 0.82;
const MAX_SOURCE_FILE_SIZE = 20 * 1024 * 1024;

export default function SmartNotesApp() {
  // =========================================================
  // AUTHENTICATION
  // =========================================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authNotice, setAuthNotice] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regGrade, setRegGrade] = useState<GradeLevel>("Lớp 6");
  const [regGender, setRegGender] = useState("Nam");
  const [regDob, setRegDob] = useState("");
  const [regError, setRegError] = useState("");

  // =========================================================
  // USER PROFILE
  // =========================================================
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("sn_user_profile");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          dob: parsed?.dob ? formatToDdMmYy(parsed.dob) : "",
        };
      } catch {
        return DEFAULT_PROFILE;
      }
    }

    return DEFAULT_PROFILE;
  });

  // =========================================================
  // APP NAVIGATION / THEME
  // =========================================================
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "studio">(
    "light"
  );
  const [accentColor, setAccentColor] = useState("#4f46e5");
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // =========================================================
  // CREDITS / REWARDS
  // =========================================================
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem("sn_user_credits");
    const parsed = saved !== null ? Number(saved) : NaN;
    return Number.isFinite(parsed) ? parsed : 200;
  });

  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransaction[]
  >(() => {
    const saved = localStorage.getItem("sn_credit_transactions");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_CREDIT_TRANSACTION];
      }
    }

    return [INITIAL_CREDIT_TRANSACTION];
  });

  const [redeemedGifts, setRedeemedGifts] = useState<RedeemedGift[]>(() => {
    const saved = localStorage.getItem("sn_redeemed_gifts");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    return [];
  });

  const [insufficientCreditsModal, setInsufficientCreditsModal] =
    useState(false);

  // =========================================================
  // SCAN / GEMINI
  // =========================================================
  const [inputMode, setInputMode] = useState<"upload" | "camera" | "typing">(
    "upload"
  );

  const [selectedSubjectPreset, setSelectedSubjectPreset] = useState(
    "KHTN 6 (Kết nối tri thức)"
  );

  const [typedText, setTypedText] = useState("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisSuccessToast, setAnalysisSuccessToast] = useState<
    string | null
  >(null);

  const [revealedFlashcard, setRevealedFlashcard] = useState<
    Record<number, boolean>
  >({});

  const resultsSectionRef = useRef<HTMLDivElement | null>(null);

  // =========================================================
  // CAMERA
  // =========================================================
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // =========================================================
  // SAVED NOTES
  // =========================================================
  const [savedNotes, setSavedNotes] = useState<SavedNoteRecord[]>(() => {
    const saved = localStorage.getItem("sn_saved_notes_archive");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    const preset = curriculumPresets["KHTN 6 (Kết nối tri thức)"];

    if (!preset) return [];

    return [
      {
        id: "note-init-1",
        title: preset.title,
        subject: preset.subject || "Khoa học tự nhiên",
        grade: preset.grade || "Lớp 6",
        createdAt: formatToDdMmYy(new Date()),
        summary: preset.summary,
        fullData: preset,
      },
    ];
  });

  // =========================================================
  // FIREBASE SESSION
  // =========================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setIsLoggedIn(true);

        setUserProfile((prev) => ({
          ...prev,
          fullName: firebaseUser.displayName || prev.fullName,
          email: firebaseUser.email || prev.email,
          username:
            prev.username ||
            firebaseUser.email?.split("@")[0] ||
            "smartnotes_user",
        }));
      } else {
        setIsLoggedIn(false);
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // =========================================================
  // LOCAL STORAGE
  // =========================================================
  useEffect(() => {
    localStorage.setItem("sn_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("sn_user_credits", String(credits));
  }, [credits]);

  useEffect(() => {
    localStorage.setItem(
      "sn_credit_transactions",
      JSON.stringify(creditTransactions)
    );
  }, [creditTransactions]);

  useEffect(() => {
    localStorage.setItem("sn_redeemed_gifts", JSON.stringify(redeemedGifts));
  }, [redeemedGifts]);

  useEffect(() => {
    localStorage.setItem("sn_saved_notes_archive", JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sn_theme_mode");
    const savedColor = localStorage.getItem("sn_accent_color");

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "studio"
    ) {
      setThemeMode(savedTheme);
    }

    if (savedColor) {
      setAccentColor(savedColor);
    }
  }, []);

  // =========================================================
  // CAMERA CLEANUP
  // =========================================================
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsCameraActive(false);
  };

  useEffect(() => {
    if (inputMode !== "camera") {
      stopCameraStream();
    }
  }, [inputMode]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // =========================================================
  // AUTH HANDLERS
  // =========================================================
  const resetAuthMessages = () => {
    setLoginError("");
    setRegError("");
    setAuthNotice("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    resetAuthMessages();

    const email = loginEmail.trim();

    if (!email || !loginPassword) {
      setLoginError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        loginPassword
      );

      const firebaseUser = credential.user;

      if (!firebaseUser.emailVerified) {
        try {
          await sendEmailVerification(firebaseUser);
        } catch (verifyError) {
          console.warn("Không thể gửi lại email xác minh:", verifyError);
        }

        await signOut(auth);

        setLoginError(
          "Email chưa được xác minh. Hãy kiểm tra hộp thư, xác minh tài khoản rồi đăng nhập lại."
        );
        return;
      }

      setUserProfile((prev) => ({
        ...prev,
        fullName: firebaseUser.displayName || prev.fullName,
        email: firebaseUser.email || email,
      }));

      setLoginPassword("");
      setActiveTab("home");
      setIsLoggedIn(true);
    } catch (error: any) {
      console.error("Firebase login error:", error);

      switch (error?.code) {
        case "auth/invalid-email":
          setLoginError("Địa chỉ email không hợp lệ.");
          break;

        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setLoginError("Email hoặc mật khẩu không chính xác.");
          break;

        case "auth/user-disabled":
          setLoginError("Tài khoản đã bị vô hiệu hóa.");
          break;

        case "auth/too-many-requests":
          setLoginError(
            "Có quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau."
          );
          break;

        case "auth/network-request-failed":
          setLoginError(
            "Không thể kết nối Firebase. Vui lòng kiểm tra Internet."
          );
          break;

        default:
          setLoginError(
            error?.message || "Không thể đăng nhập. Vui lòng thử lại."
          );
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    resetAuthMessages();

    const email = regEmail.trim();
    const username = regUsername.trim();
    const fullName = regFullName.trim();

    if (!email || !username || !regPassword || !regConfirmPassword) {
      setRegError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (regPassword.length < 8) {
      setRegError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        regPassword
      );

      const firebaseUser = credential.user;

      await updateProfile(firebaseUser, {
        displayName: fullName || username,
      });

      await sendEmailVerification(firebaseUser);

      setUserProfile({
        fullName: fullName || username,
        email,
        username,
        school: regSchool.trim(),
        grade: regGrade,
        gender: regGender,
        dob: regDob ? formatToDdMmYy(regDob) : "",
      });

      // Không cho vào ứng dụng trước khi xác minh email.
      await signOut(auth);

      setAuthMode("login");
      setLoginEmail(email);
      setLoginPassword("");
      setRegPassword("");
      setRegConfirmPassword("");

      setAuthNotice(
        "Đăng ký thành công. Firebase đã gửi email xác minh. Hãy xác minh email rồi đăng nhập."
      );
    } catch (error: any) {
      console.error("Firebase register error:", error);

      switch (error?.code) {
        case "auth/email-already-in-use":
          setRegError("Email này đã được đăng ký.");
          break;

        case "auth/invalid-email":
          setRegError("Email không hợp lệ.");
          break;

        case "auth/weak-password":
          setRegError("Mật khẩu chưa đủ mạnh.");
          break;

        case "auth/network-request-failed":
          setRegError(
            "Không thể kết nối Firebase. Vui lòng kiểm tra Internet."
          );
          break;

        default:
          setRegError(
            error?.message || "Không thể tạo tài khoản. Vui lòng thử lại."
          );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    } finally {
      stopCameraStream();
      setIsLoggedIn(false);
      setActiveTab("home");
      setLoginPassword("");
      setAnalysisError(null);
      setAnalysisSuccessToast(null);
    }
  };

  // =========================================================
  // CAMERA HANDLERS
  // =========================================================
  const startCamera = async () => {
    setCameraError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Trình duyệt không hỗ trợ camera.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError(
        "Không thể mở camera. Hãy cấp quyền camera hoặc dùng chế độ tải ảnh."
      );
      setIsCameraActive(false);
    }
  };

  const createCompressedJpeg = (
    source: CanvasImageSource,
    sourceWidth: number,
    sourceHeight: number
  ): string => {
    if (!sourceWidth || !sourceHeight) {
      throw new Error("Không đọc được kích thước ảnh.");
    }

    let scale = Math.min(
      1,
      MAX_IMAGE_EDGE / Math.max(sourceWidth, sourceHeight)
    );

    let width = Math.max(1, Math.round(sourceWidth * scale));
    let height = Math.max(1, Math.round(sourceHeight * scale));

    let quality = INITIAL_JPEG_QUALITY;

    const render = (
      targetWidth: number,
      targetHeight: number,
      targetQuality: number
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Trình duyệt không hỗ trợ xử lý ảnh bằng Canvas.");
      }

      // Nền trắng giúp chữ vở rõ hơn khi chuyển PNG/WebP sang JPEG.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        source,
        0,
        0,
        sourceWidth,
        sourceHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      return canvas.toDataURL("image/jpeg", targetQuality);
    };

    let dataUrl = render(width, height, quality);

    // Bước 1: giảm chất lượng từ từ nhưng vẫn giữ chữ đủ rõ cho OCR.
    while (
      dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH &&
      quality > MIN_JPEG_QUALITY
    ) {
      quality = Math.max(MIN_JPEG_QUALITY, quality - 0.07);
      dataUrl = render(width, height, quality);
    }

    // Bước 2: nếu ảnh vẫn lớn thì giảm thêm kích thước.
    while (
      dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH &&
      Math.max(width, height) > 1000
    ) {
      width = Math.max(1, Math.round(width * 0.85));
      height = Math.max(1, Math.round(height * 0.85));
      dataUrl = render(width, height, quality);
    }

    if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
      throw new Error(
        "Ảnh vẫn quá lớn sau khi nén. Hãy chụp gần trang vở hơn hoặc chọn ảnh nhỏ hơn."
      );
    }

    return dataUrl;
  };

  const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(
          new Error(
            "Không thể đọc ảnh. Hãy dùng JPG, JPEG, PNG hoặc WebP."
          )
        );
      };

      image.src = objectUrl;
    });
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const dataUrl = createCompressedJpeg(
        video,
        width,
        height
      );

      setUploadedImagePreview(dataUrl);
      setAnalysisError(null);
      stopCameraStream();
    } catch (error: any) {
      console.error("Capture/compression error:", error);

      setAnalysisError(
        error?.message ||
          "Không thể xử lý ảnh từ camera. Vui lòng thử lại."
      );
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    // Cho phép chọn lại đúng cùng một file sau đó.
    e.target.value = "";

    if (!file) return;

    setAnalysisError(null);
    setAnalysisSuccessToast(null);

    if (!file.type.startsWith("image/")) {
      setAnalysisError("Vui lòng chọn tệp hình ảnh.");
      return;
    }

    if (file.size > MAX_SOURCE_FILE_SIZE) {
      setAnalysisError(
        "Ảnh gốc lớn hơn 20 MB. Vui lòng chọn ảnh nhỏ hơn."
      );
      return;
    }

    try {
      const image = await loadImageFromFile(file);

      const compressedDataUrl = createCompressedJpeg(
        image,
        image.naturalWidth,
        image.naturalHeight
      );

      setUploadedImagePreview(compressedDataUrl);

      const estimatedKb = Math.round(
        (compressedDataUrl.length * 0.75) / 1024
      );

      setAnalysisSuccessToast(
        `Ảnh đã được tối ưu còn khoảng ${estimatedKb.toLocaleString(
          "vi-VN"
        )} KB, sẵn sàng gửi Gemini.`
      );
    } catch (error: any) {
      console.error("Image compression error:", error);

      setUploadedImagePreview(null);

      setAnalysisError(
        error?.message ||
          "Không thể xử lý ảnh. Vui lòng chọn ảnh JPG/PNG khác."
      );
    }
  };

  // =========================================================
  // CREDITS / REWARDS
  // =========================================================
  const handleAddCredits = (amount: number, reason: string) => {
    setCredits((prev) => prev + amount);

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      type: "earn",
      amount,
      description: reason,
      timestamp: `${new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })} ${new Date().toLocaleDateString("vi-VN")}`,
      category: "arena",
    };

    setCreditTransactions((prev) => [tx, ...prev]);
  };

  const handleRedeemReward = (item: RewardItem): boolean => {
    if (credits < item.cost) return false;

    setCredits((prev) => prev - item.cost);

    const nowStr = `${new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })} ${new Date().toLocaleDateString("vi-VN")}`;

    const code = `SN-${item.category
      .toUpperCase()
      .slice(0, 3)}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    const gift: RedeemedGift = {
      id: `gift-${Date.now()}`,
      rewardId: item.id,
      rewardName: item.name,
      categoryName: item.tag || "Quà tặng",
      cost: item.cost,
      code,
      redeemedAt: nowStr,
    };

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}-reward`,
      type: "spend",
      amount: item.cost,
      description: `Đổi quà: ${item.name} (Mã: ${code})`,
      timestamp: nowStr,
      category: "reward",
    };

    setRedeemedGifts((prev) => [gift, ...prev]);
    setCreditTransactions((prev) => [tx, ...prev]);

    return true;
  };

  // =========================================================
  // GEMINI ANALYSIS
  // =========================================================
  const handleStartAnalysis = async () => {
    if (!uploadedImagePreview && !typedText.trim()) {
      setAnalysisError(
        "Vui lòng tải ảnh/chụp ảnh trang vở hoặc nhập nội dung trước khi phân tích."
      );
      return;
    }

    if (
      uploadedImagePreview &&
      uploadedImagePreview.length > MAX_IMAGE_DATA_URL_LENGTH
    ) {
      setAnalysisError(
        "Ảnh vẫn quá lớn để gửi lên máy chủ. Hãy chọn lại ảnh để SmartNotes tự nén."
      );
      return;
    }

    if (credits < 2) {
      setInsufficientCreditsModal(true);
      return;
    }

    const firebaseUser = auth.currentUser;

    if (!firebaseUser || !firebaseUser.emailVerified) {
      setAnalysisError(
        "Phiên đăng nhập Firebase không hợp lệ. Vui lòng đăng nhập lại."
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisSuccessToast(null);

    try {
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch("/api/analyze-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          text: typedText.trim() || undefined,
          subject: selectedSubjectPreset,
          imageBase64: uploadedImagePreview || undefined,
        }),
      });

      let resData: any = null;

      try {
        resData = await response.json();
      } catch {
        if (response.status === 413) {
          throw new Error(
            "Ảnh gửi lên vẫn quá lớn (HTTP 413). Hãy chọn lại ảnh để SmartNotes tự nén trước khi phân tích."
          );
        }

        throw new Error(
          `Server trả về dữ liệu không hợp lệ (HTTP ${response.status}).`
        );
      }

      if (!response.ok || !resData?.success || !resData?.data) {
        throw new Error(
          resData?.error ||
            resData?.message ||
            `Không thể phân tích bài ghi (HTTP ${response.status}).`
        );
      }

      const analyzed: AnalysisResult = {
        ...resData.data,
        rawPhotoPreview: uploadedImagePreview || undefined,
        isRealGeminiAnalysis: true,
        mindmap: Array.isArray(resData.data.mindmap)
          ? resData.data.mindmap
          : [],
        academicSources: Array.isArray(resData.data.academicSources)
          ? resData.data.academicSources
          : [],
        flashcards: Array.isArray(resData.data.flashcards)
          ? resData.data.flashcards
          : [],
      };

      setAnalysisResult(analyzed);

      const record: SavedNoteRecord = {
        id: `note-${Date.now()}`,
        title: analyzed.title || "Bài ghi số hóa",
        subject:
          analyzed.subject || selectedSubjectPreset.split("(")[0].trim(),
        grade: analyzed.grade || userProfile.grade,
        createdAt: formatToDdMmYy(new Date()),
        summary: analyzed.summary || "",
        fullData: analyzed,
      };

      setSavedNotes((prev) => [record, ...prev]);

      // Chỉ trừ credit sau khi Gemini trả kết quả thành công.
      setCredits((prev) => Math.max(0, prev - 2));

      const tx: CreditTransaction = {
        id: `tx-${Date.now()}-scan`,
        type: "spend",
        amount: 2,
        description: `Quét & phân tích vở (${selectedSubjectPreset})`,
        timestamp: `${new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })} ${formatToDdMmYy(new Date())}`,
        category: "scan",
      };

      setCreditTransactions((prev) => [tx, ...prev]);

      setAnalysisSuccessToast(
        `Phân tích thành công bằng ${resData.modelUsed || "Gemini AI"}.`
      );

      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch (error: any) {
      console.error("Gemini analysis failed:", error);
      setAnalysisError(
        error?.message ||
          "Không thể phân tích bằng Gemini AI. Vui lòng thử lại."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSamplePreset = () => {
    const preset =
      curriculumPresets[selectedSubjectPreset] ||
      curriculumPresets["KHTN 6 (Kết nối tri thức)"];

    if (!preset) return;

    setAnalysisResult(preset);
    setAnalysisError(null);
    setAnalysisSuccessToast("Đã tải bài phân tích mẫu.");
  };

  // =========================================================
  // EXPORT NOTE
  // =========================================================
  const handleDownloadNotepad = () => {
    if (!analysisResult) return;

    let text = "";
    text += "SMARTNOTES AI - BẢN SỐ HÓA VỞ GHI\n";
    text += "=====================================\n\n";
    text += `BÀI: ${analysisResult.title}\n`;
    text += `MÔN: ${analysisResult.subject || selectedSubjectPreset}\n`;
    text += `KHỐI: ${analysisResult.grade || userProfile.grade}\n\n`;
    text += `TÓM TẮT:\n${analysisResult.summary}\n\n`;

    if (analysisResult.extractedText) {
      text += `NỘI DUNG NHẬN DIỆN:\n${analysisResult.extractedText}\n\n`;
    }

    if (analysisResult.keyPoints?.length) {
      text += "Ý CHÍNH:\n";
      analysisResult.keyPoints.forEach((item, index) => {
        text += `${index + 1}. ${item}\n`;
      });
      text += "\n";
    }

    if (analysisResult.flashcards?.length) {
      text += "FLASHCARDS:\n";
      analysisResult.flashcards.forEach((item, index) => {
        text += `Q${index + 1}: ${item.q}\n`;
        text += `A${index + 1}: ${item.a}\n\n`;
      });
    }

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `SmartNotes_${analysisResult.title.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}.txt`;

    anchor.click();
    URL.revokeObjectURL(url);
  };

  // =========================================================
  // THEME
  // =========================================================
  const handleThemeChange = (mode: "light" | "dark" | "studio") => {
    setThemeMode(mode);
    localStorage.setItem("sn_theme_mode", mode);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem("sn_accent_color", color);
  };

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

  // =========================================================
  // AUTH LOADING
  // =========================================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-zinc-900 to-slate-900 flex items-center justify-center p-4 text-white">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-black">SmartNotes AI</h1>

          <p className="text-sm text-zinc-400">
            Đang xác minh tài khoản Firebase...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // AUTH SCREEN
  // =========================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-zinc-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-zinc-900/90 border border-indigo-500/30 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 text-white">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              SmartNotes AI
            </div>

            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-300 via-indigo-200 to-teal-200 bg-clip-text text-transparent">
              Học thông minh từ chính trang vở
            </h1>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Tài khoản được xác thực bằng Firebase Authentication. Email phải
              được xác minh trước khi sử dụng hệ thống.
            </p>
          </div>

          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                resetAuthMessages();
              }}
              className={`flex-1 py-2.5 rounded-xl transition ${
                authMode === "login"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400"
              }`}
            >
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                resetAuthMessages();
              }}
              className={`flex-1 py-2.5 rounded-xl transition ${
                authMode === "register"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400"
              }`}
            >
              Đăng ký tài khoản
            </button>
          </div>

          {authNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-xs text-emerald-100 flex gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authNotice}</span>
            </div>
          )}

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-xs text-rose-100 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {regError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-xs text-rose-100 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-400"
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
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                Đăng nhập
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1"
            >
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Họ và tên
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
                    placeholder="email@example.com"
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
                    Khối lớp
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) =>
                      setRegGrade(e.target.value as GradeLevel)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/20 text-white text-sm"
                  >
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
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
                    placeholder="Tên trường"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
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
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/20 text-white text-sm"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="text"
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                Đăng ký tài khoản
                <Check className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN APP
  // =========================================================
  return (
    <div className={`min-h-screen transition-colors ${themeClasses}`}>
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 ${
          isDark
            ? "bg-zinc-950/85 border-zinc-800"
            : isStudio
            ? "bg-stone-200/85 border-stone-300"
            : "bg-white/85 border-zinc-200"
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="text-left">
            <h1 className="font-black text-lg">SmartNotes AI</h1>
            <p className="text-[11px] text-zinc-500">
              Firebase Auth + Gemini AI
            </p>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
          {[
            ["home", "Trang chủ"],
            ["create", "Quét vở"],
            ["archive", `Sổ tay (${savedNotes.length})`],
            ["arena", "Đấu trường"],
            ["rewards", "Đổi quà"],
            ["game", "Mini Game"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as MainTab)}
              className={`px-3.5 py-2 rounded-xl transition ${
                activeTab === tab
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("rewards")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold"
          >
            <Coins className="w-4 h-4" />
            {credits} cr
          </button>

          <button
            type="button"
            onClick={() => setShowThemeModal(true)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800"
            title="Theme Studio"
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{userProfile.fullName}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40"
          >
            Thoát
          </button>
        </div>
      </header>

      <div className="lg:hidden sticky top-[65px] z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <div className="flex gap-1 p-2 min-w-max text-xs font-bold">
          {[
            ["home", "Trang chủ"],
            ["create", "Quét vở"],
            ["archive", "Sổ tay"],
            ["arena", "Đấu trường"],
            ["rewards", "Đổi quà"],
            ["game", "Game"],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab as MainTab)}
              className={`px-3 py-2 rounded-xl ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {activeTab === "home" && (
          <div className="space-y-6">
            <section
              className={`p-6 md:p-8 rounded-3xl border ${cardClasses} shadow-sm`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    <GraduationCap className="w-4 h-4" />
                    {userProfile.grade}
                    {userProfile.school ? ` • ${userProfile.school}` : ""}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black">
                    Chào {userProfile.fullName}! 📚
                  </h2>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    SmartNotes AI số hóa trang vở, đọc chữ viết, tóm tắt kiến
                    thức, tạo mindmap, flashcard và hỗ trợ rà soát nội dung.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("create")}
                      className="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Camera className="w-4 h-4" />
                      Quét trang vở
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("arena")}
                      className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-sm flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Đấu trường ôn tập
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-72 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Tài khoản</span>
                    <strong className="text-emerald-600">Đã xác minh</strong>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Credits</span>
                    <strong>{credits}</strong>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Bài đã lưu</span>
                    <strong>{savedNotes.length}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                className={`text-left p-5 rounded-3xl border ${cardClasses}`}
              >
                <Sparkles className="w-6 h-6 text-indigo-500 mb-3" />
                <h3 className="font-bold">AI số hóa vở ghi</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Ảnh → OCR → tóm tắt → mindmap → flashcard.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("archive")}
                className={`text-left p-5 rounded-3xl border ${cardClasses}`}
              >
                <FileText className="w-6 h-6 text-violet-500 mb-3" />
                <h3 className="font-bold">Sổ tay số</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Lưu trữ và mở lại các bài đã phân tích.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rewards")}
                className={`text-left p-5 rounded-3xl border ${cardClasses}`}
              >
                <Gift className="w-6 h-6 text-amber-500 mb-3" />
                <h3 className="font-bold">Điểm & đổi quà</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Theo dõi credit và lịch sử phần thưởng.
                </p>
              </button>
            </section>
          </div>
        )}

        {activeTab === "create" && (
          <div className="space-y-6">
            <section
              className={`p-6 md:p-8 rounded-3xl border ${cardClasses} space-y-6`}
            >
              <div className="flex flex-wrap gap-4 justify-between items-start">
                <div>
                  <h2 className="text-xl font-black">
                    Quét & phân tích vở ghi
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Mỗi lần phân tích thành công sử dụng 2 credits.
                  </p>
                </div>

                <select
                  value={selectedSubjectPreset}
                  onChange={(e) => setSelectedSubjectPreset(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold"
                >
                  {Object.keys(curriculumPresets).map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setInputMode("upload")}
                  className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 ${
                    inputMode === "upload"
                      ? "bg-white dark:bg-zinc-900 text-indigo-600"
                      : "text-zinc-500"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Tải ảnh
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputMode("camera");
                    setTimeout(() => startCamera(), 50);
                  }}
                  className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 ${
                    inputMode === "camera"
                      ? "bg-white dark:bg-zinc-900 text-indigo-600"
                      : "text-zinc-500"
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Camera
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode("typing")}
                  className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 ${
                    inputMode === "typing"
                      ? "bg-white dark:bg-zinc-900 text-indigo-600"
                      : "text-zinc-500"
                  }`}
                >
                  <Keyboard className="w-4 h-4" />
                  Gõ chữ
                </button>
              </div>

              {inputMode === "upload" && (
                <div className="space-y-4">
                  <label className="block p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />

                    <strong className="text-sm block">
                      Chọn ảnh trang vở
                    </strong>

                    <span className="text-xs text-zinc-500">
                      PNG, JPG, JPEG
                    </span>
                  </label>

                  {uploadedImagePreview && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <img
                        src={uploadedImagePreview}
                        alt="Trang vở"
                        className="w-20 h-20 object-cover rounded-xl"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-bold">Ảnh đã sẵn sàng</p>
                        <p className="text-xs text-zinc-500">
                          Có thể bắt đầu phân tích.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setUploadedImagePreview(null)}
                        className="text-xs text-rose-600 font-semibold"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}

              {inputMode === "camera" && (
                <div className="space-y-4">
                  {cameraError && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
                      {cameraError}
                    </div>
                  )}

                  {isCameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-h-[420px] bg-black rounded-2xl object-contain"
                      />

                      <canvas ref={canvasRef} className="hidden" />

                      <div className="flex gap-3 justify-center">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          Chụp ảnh
                        </button>

                        <button
                          type="button"
                          onClick={stopCameraStream}
                          className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold"
                        >
                          Tắt camera
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full py-5 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 font-bold"
                    >
                      Bật camera
                    </button>
                  )}

                  {uploadedImagePreview && (
                    <img
                      src={uploadedImagePreview}
                      alt="Ảnh vừa chụp"
                      className="w-full max-h-96 object-contain rounded-2xl border border-zinc-200 dark:border-zinc-700"
                    />
                  )}
                </div>
              )}

              {inputMode === "typing" && (
                <textarea
                  rows={8}
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Nhập hoặc dán nội dung bài học..."
                  className="w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              <div className="flex flex-wrap justify-between items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs">
                <span>
                  Chi phí: <strong>2 credits / lần thành công</strong>
                </span>

                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Coins className="w-4 h-4" />
                  {credits} credits
                </span>
              </div>

              {analysisError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <strong className="block mb-1">
                      Chưa thể hoàn tất phân tích
                    </strong>
                    <span>{analysisError}</span>
                  </div>
                </div>
              )}

              {analysisSuccessToast && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{analysisSuccessToast}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: accentColor }}
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    Gemini đang phân tích...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Phân tích bằng Gemini AI
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLoadSamplePreset}
                className="w-full py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold"
              >
                Xem bài phân tích mẫu
              </button>
            </section>

            <div ref={resultsSectionRef}>
              {analysisResult && (
                <div className="space-y-6">
                  <section
                    className={`p-6 rounded-3xl border ${cardClasses} space-y-4`}
                  >
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Đã phân tích
                        </div>

                        <h3 className="text-2xl font-black mt-2">
                          {analysisResult.title}
                        </h3>

                        <p className="text-xs text-zinc-500 mt-1">
                          {analysisResult.subject || selectedSubjectPreset} •{" "}
                          {analysisResult.grade || userProfile.grade}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadNotepad}
                        className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Xuất .txt
                      </button>
                    </div>

                    {analysisResult.extractedText && (
                      <div>
                        <h4 className="text-sm font-bold mb-2">
                          Nội dung nhận diện
                        </h4>
                        <pre className="whitespace-pre-wrap text-xs leading-relaxed p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 font-sans">
                          {analysisResult.extractedText}
                        </pre>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-bold mb-2">Tóm tắt</h4>
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {analysisResult.summary}
                      </p>
                    </div>

                    {analysisResult.keyPoints?.length ? (
                      <div>
                        <h4 className="text-sm font-bold mb-2">Ý chính</h4>

                        <div className="space-y-2">
                          {analysisResult.keyPoints.map((point, index) => (
                            <div
                              key={index}
                              className="flex gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </section>

                  <MindmapView
                    title={analysisResult.title}
                    branches={analysisResult.mindmap || []}
                  />

                  <AuditReportView
                    auditChecks={analysisResult.auditChecks || []}
                  />

                  {analysisResult.illustrationImages?.length ? (
                    <IllustrationGallery
                      illustrations={analysisResult.illustrationImages}
                    />
                  ) : null}

                  {analysisResult.flashcards?.length ? (
                    <section
                      className={`p-6 rounded-3xl border ${cardClasses}`}
                    >
                      <h3 className="font-bold mb-4">Flashcards</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysisResult.flashcards.map((card, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              setRevealedFlashcard((prev) => ({
                                ...prev,
                                [index]: !prev[index],
                              }))
                            }
                            className="text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50"
                          >
                            <strong className="text-xs text-indigo-600">
                              Q{index + 1}: {card.q}
                            </strong>

                            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 text-xs">
                              {revealedFlashcard[index] ? (
                                <span className="text-emerald-600 font-semibold">
                                  {card.a}
                                </span>
                              ) : (
                                <span className="text-zinc-400">
                                  Nhấn để xem đáp án
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "archive" && (
          <NotebookArchive
            savedNotes={savedNotes}
            onSelectNote={(note) => {
              setAnalysisResult(note);
              setActiveTab("create");
            }}
            onDeleteNote={(id) => {
              setSavedNotes((prev) => prev.filter((item) => item.id !== id));
            }}
          />
        )}

        {activeTab === "arena" && (
          <ReviewArena
            initialGrade={userProfile.grade}
            onAddCredits={handleAddCredits}
            userCredits={credits}
            onNavigateToRewards={() => setActiveTab("rewards")}
          />
        )}

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

        {activeTab === "game" && <MemoryGame />}
      </main>

      {insufficientCreditsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <Coins className="w-7 h-7" />
            </div>

            <div className="text-center">
              <h3 className="font-black text-lg">Không đủ credits</h3>
              <p className="text-xs text-zinc-500 mt-2">
                Bạn cần ít nhất 2 credits để phân tích. Hiện có {credits}{" "}
                credits.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setInsufficientCreditsModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold"
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => {
                  setInsufficientCreditsModal(false);
                  setActiveTab("arena");
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Vào Đấu trường
              </button>
            </div>
          </div>
        </div>
      )}

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
          onSave={(updated) => {
            setUserProfile(updated);

            if (auth.currentUser && updated.fullName) {
              updateProfile(auth.currentUser, {
                displayName: updated.fullName,
              }).catch((error) => {
                console.error("Firebase displayName update error:", error);
              });
            }
          }}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
