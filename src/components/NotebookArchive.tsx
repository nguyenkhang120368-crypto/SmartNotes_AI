import React, { useState } from 'react';
import { SavedNoteRecord, AnalysisResult } from '../types';
import {
  FileText,
  Download,
  Search,
  BookOpen,
  Calendar,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface NotebookArchiveProps {
  savedNotes: SavedNoteRecord[];
  onSelectNote: (note: AnalysisResult) => void;
  onDeleteNote: (id: string) => void;
}

export const NotebookArchive: React.FC<NotebookArchiveProps> = ({
  savedNotes,
  onSelectNote,
  onDeleteNote
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('Tất cả');

  const filteredNotes = savedNotes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      filterSubject === 'Tất cả' || note.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  // Export a note as standard Notepad .txt file
  const exportToNotepad = (record: SavedNoteRecord) => {
    const data = record.fullData;
    let content = `==========================================================\n`;
    content += `SMARTNOTES AI - BẢN SỐ HÓA VỞ GHI HỌC SINH (SGK KẾT NỐI TRI THỨC)\n`;
    content += `==========================================================\n\n`;
    content += `BÀI HỌC: ${data.title}\n`;
    content += `MÔN HỌC: ${data.subject || record.subject} | KHỐI LỚP: ${data.grade || record.grade}\n`;
    content += `THỜI GIAN LƯU: ${record.createdAt}\n\n`;
    content += `----------------------------------------------------------\n`;
    content += `I. TÓM TẮT TRỌNG TÂM KIẾN THỨC:\n`;
    content += `----------------------------------------------------------\n`;
    content += `${data.summary}\n\n`;

    if (data.structuredSections && data.structuredSections.length > 0) {
      content += `----------------------------------------------------------\n`;
      content += `II. CẤU TRÚC CHI TIẾT:\n`;
      content += `----------------------------------------------------------\n`;
      data.structuredSections.forEach((sec, idx) => {
        content += `${idx + 1}. [${sec.heading}]\n${sec.content}\n\n`;
      });
    }

    if (data.mindmap && data.mindmap.length > 0) {
      content += `----------------------------------------------------------\n`;
      content += `III. SƠ ĐỒ TƯ DUY (MINDMAP CÂY KIẾN THỨC):\n`;
      content += `----------------------------------------------------------\n`;
      data.mindmap.forEach((branch, idx) => {
        content += `[Nhánh ${idx + 1}] ${branch.node}:\n`;
        branch.children.forEach(child => {
          content += `   + ${child}\n`;
        });
        content += `\n`;
      });
    }

    if (data.auditChecks && data.auditChecks.length > 0) {
      content += `----------------------------------------------------------\n`;
      content += `IV. RÀ SOÁT LỖI SAI & ĐÍNH CHÍNH CHUẨN SGK (AI AUDIT):\n`;
      content += `----------------------------------------------------------\n`;
      data.auditChecks.forEach((check, idx) => {
        content += `(${idx + 1}) Lỗi/Lưu ý: ${check.issue}\n`;
        content += `    => Đính chính SGK: ${check.suggestion}\n\n`;
      });
    }

    if (data.flashcards && data.flashcards.length > 0) {
      content += `----------------------------------------------------------\n`;
      content += `V. FLASHCARDS ÔN NHANH:\n`;
      content += `----------------------------------------------------------\n`;
      data.flashcards.forEach((fc, idx) => {
        content += `Q${idx + 1}: ${fc.q}\n`;
        content += `A${idx + 1}: ${fc.a}\n\n`;
      });
    }

    if (data.academicSources && data.academicSources.length > 0) {
      content += `----------------------------------------------------------\n`;
      content += `VI. TRÍCH NGUỒN TÀI LIỆU HỌC THUẬT CHUẨN:\n`;
      content += `----------------------------------------------------------\n`;
      data.academicSources.forEach(src => {
        content += `- ${src.title} (${src.link})\n`;
      });
    }

    content += `\n==========================================================\n`;
    content += `Được tạo tự động bởi SmartNotes AI - Sáng tạo trẻ Quốc gia về AI\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartNotes_${record.subject}_${record.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const exportToJson = (record: SavedNoteRecord) => {
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartNotes_${record.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="notebook-archive-container" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Sổ tay Số hóa & Tra cứu Ngôn ngữ tự nhiên
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Toàn bộ bài học viết tay đã được lưu trữ, hỗ trợ xuất tệp Notepad (.txt) và tra cứu
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          Tổng cộng: {savedNotes.length} bài ghi
        </div>
      </div>

      {/* Search & Query Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bằng ngôn ngữ tự nhiên: 'đo nhiệt độ', 'số hữu tỉ', 'đoạn mạch nối tiếp'..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* List of Saved Notes */}
      {filteredNotes.length === 0 ? (
        <div className="py-12 text-center text-zinc-400 space-y-2">
          <FileText className="w-10 h-10 mx-auto stroke-1 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm font-medium">Chưa có bài ghi nào khớp với từ khóa tìm kiếm</p>
          <p className="text-xs">Hãy quét hoặc nhập thêm bài vở từ trang chủ để lưu vào sổ tay số.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((record) => (
            <div
              key={record.id}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                      {record.subject}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {record.grade}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {record.createdAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {record.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {record.summary}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectNote(record.fullData)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Xem chi tiết</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => exportToNotepad(record)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    title="Xuất ra tệp Notepad (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(record.id)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Xóa khỏi sổ tay"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
