import React from 'react';
import { AuditCheck } from '../types';
import { AlertTriangle, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface AuditReportViewProps {
  auditChecks?: AuditCheck[];
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({ auditChecks = [] }) => {
  if (!auditChecks || auditChecks.length === 0) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            Nội dung vở ghi chuẩn xác theo SGK Kết nối tri thức
          </h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
            Không phát hiện sai sót về công thức, thuật ngữ hay thiếu sót định nghĩa quan trọng.
          </p>
        </div>
      </div>
    );
  }

  const warningCount = auditChecks.filter(c => c.status === 'warning' || c.status === 'error').length;

  return (
    <div id="audit-report-container" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Rà soát & Đính chính ghi chép (AI Audit)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold">
                {warningCount > 0 ? `${warningCount} điểm cần lưu ý` : 'Chuẩn xác'}
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Đối chiếu với chuẩn kiến thức SGK Kết nối tri thức để phát hiện lỗi sai hoặc thiếu sót
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {auditChecks.map((check, idx) => {
          const isWarning = check.status === 'warning' || check.status === 'error';
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isWarning
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Nội dung ghi chép rà soát</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {check.issue}
                  </p>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">
                      💡 Đính chính chuẩn SGK:
                    </span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      {check.suggestion}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
