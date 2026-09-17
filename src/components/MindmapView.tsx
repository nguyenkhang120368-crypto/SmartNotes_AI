import React, { useState } from 'react';
import { MindmapBranch } from '../types';
import { GitBranch, ChevronRight, ChevronDown, Sparkles, Layers } from 'lucide-react';

interface MindmapViewProps {
  title: string;
  branches: MindmapBranch[];
}

export const MindmapView: React.FC<MindmapViewProps> = ({ title, branches }) => {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});
  const [activeView, setActiveView] = useState<'tree' | 'radial'>('tree');

  const toggleNode = (idx: number) => {
    setCollapsedNodes(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const branchColors = [
    { border: 'border-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
    { border: 'border-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    { border: 'border-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
    { border: 'border-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
    { border: 'border-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' }
  ];

  return (
    <div id="mindmap-container" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Sơ đồ tư duy bài học (Mindmap)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                AI Phân cấp logic
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Trực quan hóa cấu trúc kiến thức từ nội dung vở ghi học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('tree')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'tree'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            Dạng Cây sơ đồ
          </button>
          <button
            onClick={() => setActiveView('radial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'radial'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            Dạng Lưới mở rộng
          </button>
        </div>
      </div>

      {/* Root Node */}
      <div className="mt-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md font-bold text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          <span>CHỦ ĐỀ GỐC: {title || "Nội dung bài học"}</span>
        </div>

        {activeView === 'tree' ? (
          <div className="space-y-5 pl-3 border-l-2 border-dashed border-indigo-200 dark:border-indigo-900/60 ml-4">
            {branches.map((branch, bIdx) => {
              const color = branchColors[bIdx % branchColors.length];
              const isCollapsed = !!collapsedNodes[bIdx];

              return (
                <div key={bIdx} className="relative group">
                  {/* Branch Horizontal Connector */}
                  <div className="absolute -left-3 top-4 w-3 h-0.5 bg-indigo-300 dark:bg-indigo-700" />

                  {/* Branch Header */}
                  <div
                    onClick={() => toggleNode(bIdx)}
                    className={`cursor-pointer inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${color.border} ${color.bg} ${color.text} font-semibold text-sm transition-all hover:shadow-sm`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                    <span>{branch.node}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-700">
                      {branch.children.length} ý
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </div>

                  {/* Branch Children */}
                  {!isCollapsed && (
                    <div className="mt-3 pl-6 space-y-2 border-l-2 border-zinc-200 dark:border-zinc-800 ml-5">
                      {branch.children.map((child, cIdx) => (
                        <div
                          key={cIdx}
                          className="relative flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 py-1.5 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-2 shrink-0" />
                          <span className="leading-relaxed">{child}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branches.map((branch, bIdx) => {
              const color = branchColors[bIdx % branchColors.length];
              return (
                <div
                  key={bIdx}
                  className={`p-4 rounded-xl border ${color.border} ${color.bg} space-y-3`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    <h4 className={`font-bold text-sm ${color.text}`}>
                      {branch.node}
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {branch.children.map((child, cIdx) => (
                      <li
                        key={cIdx}
                        className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5"
                      >
                        <span className="text-zinc-400 font-bold">•</span>
                        <span>{child}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
