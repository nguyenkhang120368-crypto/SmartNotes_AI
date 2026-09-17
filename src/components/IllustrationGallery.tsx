import React from 'react';
import { IllustrationImage } from '../types';
import { Image as ImageIcon, BookOpen, ExternalLink } from 'lucide-react';

interface IllustrationGalleryProps {
  illustrations?: IllustrationImage[];
}

export const IllustrationGallery: React.FC<IllustrationGalleryProps> = ({ illustrations = [] }) => {
  if (!illustrations || illustrations.length === 0) return null;

  return (
    <div id="illustration-gallery-container" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Hình ảnh minh họa & Sơ đồ chuẩn SGK
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-semibold">
              Trích nguồn chính khóa
            </span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Minh họa trực quan hóa tương ứng với nội dung học sinh ghi chép
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {illustrations.map((item, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-800/40 hover:shadow-md transition-all flex flex-col"
          >
            {item.url && (
              <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>SGK KNTT</span>
                </div>
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-2">
                {item.caption}
              </p>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold text-violet-600 dark:text-violet-400 shrink-0">Nguồn trích:</span>
                <span className="italic">{item.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
