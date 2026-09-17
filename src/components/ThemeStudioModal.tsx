import React from 'react';
import { X, Sun, Moon, Palette, Check, Sparkles } from 'lucide-react';

interface ThemeStudioModalProps {
  theme: 'light' | 'dark' | 'studio';
  accentColor: string;
  onThemeChange: (theme: 'light' | 'dark' | 'studio') => void;
  onAccentColorChange: (color: string) => void;
  onClose: () => void;
}

const colorPresets = [
  { name: 'Xanh Trí tuệ (Indigo)', hex: '#4f46e5' },
  { name: 'Xanh STEM (Emerald)', hex: '#059669' },
  { name: 'Hoàng hôn (Sunset Amber)', hex: '#d97706' },
  { name: 'Tím Sáng tạo (Purple)', hex: '#9333ea' },
  { name: 'Hồng Năng động (Rose)', hex: '#e11d48' },
  { name: 'Xanh Biển sâu (Cyan)', hex: '#0891b2' }
];

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({
  theme,
  accentColor,
  onThemeChange,
  onAccentColorChange,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Theme Studio (Giao diện)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Tự chỉnh chế độ hiển thị và màu sắc theo sở thích
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Mode Selection */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            1. Chế độ hiển thị
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Sun className="w-5 h-5 mx-auto mb-1.5 text-amber-500" />
              <span className="text-xs">Sáng</span>
            </button>

            <button
              onClick={() => onThemeChange('dark')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Moon className="w-5 h-5 mx-auto mb-1.5 text-indigo-400" />
              <span className="text-xs">Tối</span>
            </button>

            <button
              onClick={() => onThemeChange('studio')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                theme === 'studio'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-violet-500" />
              <span className="text-xs">Studio</span>
            </button>
          </div>
        </div>

        {/* Color Palette & Custom Picker */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            2. Màu chủ đạo tự chọn
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            {colorPresets.map((preset) => {
              const isSelected = accentColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  onClick={() => onAccentColorChange(preset.hex)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-indigo-500 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className="text-[11px] truncate text-zinc-700 dark:text-zinc-300">{preset.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 ml-auto text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Color Input */}
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => onAccentColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Bảng chọn mã màu HEX tùy ý
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    {accentColor.toUpperCase()}
                  </div>
                </div>
              </div>

              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-mono">
                Real-time
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm shadow-md transition-all"
          >
            Đóng bảng Theme
          </button>
        </div>
      </div>
    </div>
  );
};
