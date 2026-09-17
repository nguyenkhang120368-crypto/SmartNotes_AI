import React, { useState, useMemo } from 'react';
import { GradeLevel, QuizQuestion, Semester } from '../types';
import { sampleQuizzesBank } from '../data/quizBank';
import {
  Trophy,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  Filter,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Coins
} from 'lucide-react';

interface ReviewArenaProps {
  initialGrade: GradeLevel;
  onAddCredits?: (amount: number, reason: string) => void;
}

export const ReviewArena: React.FC<ReviewArenaProps> = ({ initialGrade, onAddCredits }) => {
  // Arena Filters
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [selectedSemester, setSelectedSemester] = useState<Semester>('Học kì I');
  const [selectedSubject, setSelectedSubject] = useState<string>('Tất cả');
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [questionType, setQuestionType] = useState<'all' | 'mc' | 'essay'>('all');

  // Game State
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [essayAnswer, setEssayAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [awardedCreditBonus, setAwardedCreditBonus] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const gradeOptions: GradeLevel[] = [
    'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5',
    'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'
  ];

  // Play synthetic Web Audio sound effect
  const playSound = (isCorrect: boolean) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
        osc.frequency.setValueAtTime(196, audioCtx.currentTime + 0.12); // G3
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio not supported or blocked
    }
  };

  // Filter available subjects based on grade
  const availableSubjects = useMemo(() => {
    const subjectsSet = new Set<string>();
    sampleQuizzesBank
      .filter(q => q.grade === selectedGrade)
      .forEach(q => subjectsSet.add(q.subject));
    return ['Tất cả', ...Array.from(subjectsSet)];
  }, [selectedGrade]);

  // Build the active quiz set based on user preferences
  const activeQuestions = useMemo(() => {
    let pool = sampleQuizzesBank.filter(q => q.grade === selectedGrade);

    if (selectedSemester !== 'Cả năm') {
      pool = pool.filter(q => !q.semester || q.semester === selectedSemester);
    }

    if (selectedSubject !== 'Tất cả') {
      pool = pool.filter(q => q.subject === selectedSubject);
    }

    if (questionType === 'mc') {
      pool = pool.filter(q => q.type === 'mc');
    } else if (questionType === 'essay') {
      pool = pool.filter(q => q.type === 'essay');
    }

    // If filtered pool is too small, fallback to same grade
    if (pool.length === 0) {
      pool = sampleQuizzesBank.filter(q => q.grade === selectedGrade);
    }

    // Shuffle and slice to desired count
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  }, [selectedGrade, selectedSemester, selectedSubject, questionType, questionCount]);

  const currentQ = activeQuestions[currentIndex];

  const handleStartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setAwardedCreditBonus(false);
    setSelectedOption(null);
    setEssayAnswer('');
    setShowExplanation(false);
    setGameFinished(false);
    setGameStarted(true);
  };

  const handleSelectOption = (idx: number) => {
    if (showExplanation || !currentQ) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      setScore(prev => prev + 100 + streak * 10);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      playSound(true);
    } else {
      setStreak(0);
      playSound(false);
    }
  };

  const handleCheckEssay = (selfGradedCorrect: boolean) => {
    setShowExplanation(true);
    if (selfGradedCorrect) {
      setScore(prev => prev + 100 + streak * 10);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      playSound(true);
    } else {
      setStreak(0);
      playSound(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setEssayAnswer('');
      setShowExplanation(false);
    } else {
      setGameFinished(true);
      // Check 10/10 bonus rule
      if (activeQuestions.length === 10 && correctCount === 10 && !awardedCreditBonus) {
        setAwardedCreditBonus(true);
        onAddCredits?.(1, 'Thưởng hoàn thành xuất sắc 10/10 câu Đấu trường ôn tập');
      }
    }
  };

  // Ensure credit bonus is triggered if final question state aligns
  React.useEffect(() => {
    if (gameFinished && activeQuestions.length === 10 && correctCount === 10 && !awardedCreditBonus) {
      setAwardedCreditBonus(true);
      onAddCredits?.(1, 'Thưởng hoàn thành xuất sắc 10/10 câu Đấu trường ôn tập');
    }
  }, [gameFinished, activeQuestions.length, correctCount, awardedCreditBonus, onAddCredits]);

  return (
    <div id="review-arena-module" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Đấu trường Ôn tập Kiến thức SGK
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Kết nối tri thức
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Thử thách trắc nghiệm & tự luận đa dạng từ Khối 1 đến Khối 9
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {gameStarted && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-bold text-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Chuỗi: {streak}</span>
            </div>
          )}
          {gameStarted && (
            <div className="px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
              XP: {score}
            </div>
          )}
        </div>
      </div>

      {/* Configuration & Filter Panel */}
      {!gameStarted || gameFinished ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
              <Filter className="w-4 h-4 text-indigo-500" />
              <span>Tùy chọn Đấu trường ôn tập</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Grade Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Khối lớp (1 - 9)
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Semester Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Học kì
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value as Semester)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Học kì I">Học kì I</option>
                  <option value="Học kì II">Học kì II</option>
                  <option value="Cả năm">Cả năm</option>
                </select>
              </div>

              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Môn học
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {availableSubjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Question Count Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Số lượng câu hỏi
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value={2}>2 câu (Luyện nhanh)</option>
                  <option value={4}>4 câu (Tiêu chuẩn)</option>
                  <option value={6}>6 câu (Nâng cao)</option>
                  <option value={10}>10 câu (Thử thách - Đúng 10/10: +1 Credit 🪙)</option>
                </select>
              </div>

              {/* Question Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Dạng câu hỏi
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="all">Cả hai (Trắc nghiệm + Tự luận)</option>
                  <option value="mc">Chỉ Trắc nghiệm</option>
                  <option value="essay">Chỉ Tự luận</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Số câu tìm thấy trong ngân hàng SGK: <strong className="text-zinc-900 dark:text-zinc-100">{activeQuestions.length} câu</strong></span>
              </div>

              <button
                onClick={handleStartGame}
                disabled={activeQuestions.length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Bắt đầu thi đấu ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Screen if finished */}
          {gameFinished && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                Chúc mừng bạn đã hoàn thành Đấu trường!
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Bạn đã hoàn thành xuất sắc thử thách ôn tập SGK Kết nối tri thức. Điểm số kinh nghiệm này đã được tích lũy vào hồ sơ cá nhân.
              </p>

              {/* Special 10/10 Credit Bonus Banner */}
              {activeQuestions.length === 10 && correctCount === 10 ? (
                <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 flex items-center justify-center gap-3 shadow-sm animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-sm">🎉 XUẤT SẮC 10/10 CÂU: ĐÃ THƯỞNG +1 CREDIT!</div>
                    <div className="text-xs text-amber-800 dark:text-amber-300">
                      Chúc mừng bạn đã làm đúng cả 10 câu! 1 credit đã được cộng vào số dư để đổi quà học tập.
                    </div>
                  </div>
                </div>
              ) : activeQuestions.length === 10 ? (
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 text-xs flex items-center justify-center gap-2">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Em đã đúng <strong>{correctCount}/10</strong> câu. Hãy cố gắng trả lời đúng cả 10 câu ở lượt tới để nhận thưởng <strong>+1 credit</strong> nhé!</span>
                </div>
              ) : null}

              <div className="flex justify-center gap-4 py-3">
                <div className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-xs text-zinc-500">Số câu đúng</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {correctCount} / {activeQuestions.length}
                  </div>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-xs text-zinc-500">Tổng điểm XP</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{score}</div>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <div className="text-xs text-zinc-500">Chuỗi cao nhất</div>
                  <div className="text-2xl font-black text-orange-500">{streak} 🔥</div>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại vòng mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Active Question Screen */
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">
              Câu hỏi {currentIndex + 1} / {activeQuestions.length} ({currentQ.subject} - {currentQ.grade})
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-medium">
              {currentQ.type === 'mc' ? 'Dạng Trắc nghiệm' : 'Dạng Tự luận'}
            </span>
          </div>

          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          {currentQ.type === 'mc' && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-zinc-800 dark:text-zinc-200";

                if (showExplanation) {
                  if (idx === currentQ.answer) {
                    btnStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                  } else if (idx === selectedOption) {
                    btnStyle = "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200";
                  } else {
                    btnStyle = "opacity-50 border-zinc-200 dark:border-zinc-800";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showExplanation}
                    className={`p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3 shadow-sm ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 font-medium">{opt}</span>
                    {showExplanation && idx === currentQ.answer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showExplanation && idx === selectedOption && idx !== currentQ.answer && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Essay Answer Section */}
          {currentQ.type === 'essay' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Nhập câu trả lời hoặc dàn ý tự luận của em:
                </label>
                <textarea
                  value={essayAnswer}
                  onChange={(e) => setEssayAnswer(e.target.value)}
                  disabled={showExplanation}
                  rows={4}
                  placeholder="Ghi các ý chính, công thức hoặc định lý em nhớ được..."
                  className="w-full p-3.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {!showExplanation ? (
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Xem đáp án chuẩn SGK & Đối chiếu</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                    Đáp án chuẩn SGK Kết nối tri thức:
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 whitespace-pre-line leading-relaxed">
                    {currentQ.answer}
                  </p>

                  <div className="pt-3 border-t border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      Tự đánh giá: Em làm đúng bao nhiêu phần?
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCheckEssay(false)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
                      >
                        Chưa chính xác
                      </button>
                      <button
                        onClick={() => handleCheckEssay(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm"
                      >
                        Đã làm chính xác (+XP)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Giải thích kiến thức chuẩn SGK:
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{currentIndex + 1 < activeQuestions.length ? "Câu tiếp theo" : "Xem kết quả"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
