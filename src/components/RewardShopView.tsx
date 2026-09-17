import React, { useState } from 'react';
import {
  Gift,
  Coins,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  History,
  Calendar,
  Award,
  ArrowRight,
  Check,
  Copy,
  Filter,
  Search,
  Pencil,
  Eraser,
  BookOpen,
  Activity,
  Heart,
  Boxes,
  Grid3x3,
  Crown,
  GlassWater,
  Utensils,
  ShieldCheck,
  Package,
  Trophy,
  Camera,
  ChevronRight,
  Info
} from 'lucide-react';
import { RewardItem, RewardCategory, CreditTransaction, RedeemedGift } from '../types';
import { REWARD_ITEMS } from '../data/rewardsData';

interface RewardShopViewProps {
  credits: number;
  transactions: CreditTransaction[];
  redeemedGifts: RedeemedGift[];
  onRedeemReward: (item: RewardItem) => boolean;
  onNavigateToScan: () => void;
  onNavigateToArena: () => void;
}

export const RewardShopView: React.FC<RewardShopViewProps> = ({
  credits,
  transactions,
  redeemedGifts,
  onRedeemReward,
  onNavigateToScan,
  onNavigateToArena
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'shop' | 'analytics' | 'history'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAffordable, setFilterAffordable] = useState(false);
  const [redeemingItem, setRedeemingItem] = useState<RewardItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Render proper icon for each reward
  const renderRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pencil':
        return <Pencil className="w-6 h-6 text-amber-500" />;
      case 'Eraser':
        return <Eraser className="w-6 h-6 text-rose-500" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-indigo-500" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-cyan-500" />;
      case 'Heart':
        return <Heart className="w-6 h-6 text-pink-500" />;
      case 'Boxes':
        return <Boxes className="w-6 h-6 text-emerald-500" />;
      case 'Grid3X3':
        return <Grid3x3 className="w-6 h-6 text-violet-500" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-500" />;
      case 'GlassWater':
        return <GlassWater className="w-6 h-6 text-blue-500" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6 text-teal-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-sky-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
      case 'Package':
        return <Package className="w-6 h-6 text-stone-500" />;
      default:
        return <Gift className="w-6 h-6 text-indigo-500" />;
    }
  };

  // Filter items
  const filteredItems = REWARD_ITEMS.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterAffordable && credits < item.cost) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate analytics
  const totalEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);

  const scanCount = transactions.filter(t => t.category === 'scan').length;
  const arenaWinCount = transactions.filter(t => t.category === 'arena').length;

  // Nearest reachable reward
  const sortedRewardsByCost = [...REWARD_ITEMS].sort((a, b) => a.cost - b.cost);
  const nextTargetReward = sortedRewardsByCost.find(r => r.cost > credits) || sortedRewardsByCost[0];

  const handleConfirmRedeem = () => {
    if (!redeemingItem) return;
    const success = onRedeemReward(redeemingItem);
    if (success) {
      setNotification({
        type: 'success',
        message: `Đổi thành công món quà "${redeemingItem.name}"! Mã nhận thưởng đã được lưu vào danh sách Quà đã đổi.`
      });
      setRedeemingItem(null);
      setActiveSubTab('history');
      setTimeout(() => setNotification(null), 5000);
    } else {
      setNotification({
        type: 'error',
        message: `Bạn chưa đủ credits để đổi món quà này! Cần thêm ${redeemingItem.cost - credits} credits.`
      });
      setRedeemingItem(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div id="reward-shop-module" className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg border animate-in fade-in slide-in-from-top-2 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline shrink-0"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Top Banner: Credits Status & Rules */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10 relative">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hệ thống Tích điểm & Đổi quà SmartNotes</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
              <span>Phân tích Điểm & Kho Đổi quà</span>
              <Coins className="w-7 h-7 text-amber-400 animate-bounce" />
            </h2>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Điểm credits khởi tạo ban đầu là <strong>200 credits</strong>. Dùng credits để quét & phân tích vở ghi (-2 credits/lần), và hoàn thành xuất sắc 10/10 câu ở Đấu trường ôn tập để tích lũy thêm (+1 credit) đổi các phần quà học tập hấp dẫn!
            </p>

            {/* Quick Rules Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Khởi tạo: <strong>200 credits</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                <span>Quét vở: <strong>-2 credits / lần</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Đấu trường đúng 10/10: <strong>+1 credit</strong></span>
              </div>
            </div>
          </div>

          {/* Big Balance Box */}
          <div className="w-full lg:w-auto p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 min-w-[200px] text-center">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-200 block">
                Số dư hiện tại
              </span>
              <div className="text-3xl md:text-4xl font-black text-amber-300 drop-shadow-sm flex items-center justify-center gap-1.5 mt-0.5">
                <Coins className="w-7 h-7 text-amber-400" />
                <span>{credits.toLocaleString()}</span>
              </div>
            </div>
            <span className="text-[11px] text-indigo-200 bg-indigo-500/40 px-2.5 py-1 rounded-lg">
              {credits >= 1000 ? 'Sẵn sàng đổi quà!' : 'Tích lũy thêm điểm'}
            </span>
          </div>
        </div>

        {/* Next Goal Progress bar */}
        {nextTargetReward && (
          <div className="mt-6 pt-5 border-t border-white/10 z-10 relative">
            <div className="flex flex-wrap items-center justify-between text-xs mb-2">
              <span className="text-indigo-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Mục tiêu gần nhất: <strong>{nextTargetReward.name}</strong> ({nextTargetReward.cost.toLocaleString()} credits)</span>
              </span>
              <span className="font-bold text-amber-300">
                {credits >= nextTargetReward.cost
                  ? 'Đã đạt điều kiện đổi quà!'
                  : `Cần thêm ${(nextTargetReward.cost - credits).toLocaleString()} credits (${Math.min(100, Math.round((credits / nextTargetReward.cost) * 100))}%)`}
              </span>
            </div>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (credits / nextTargetReward.cost) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Subtabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('shop')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'shop'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cửa hàng Đổi quà ({REWARD_ITEMS.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'analytics'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Phân tích Điểm ({transactions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Quà đã đổi ({redeemedGifts.length})</span>
          </button>
        </div>

        {/* Earn Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToArena}
            className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Kiếm credits ở Đấu trường (+1)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: REWARD SHOP ================= */}
      {activeSubTab === 'shop' && (
        <div className="space-y-6">
          {/* Category Filter & Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                Tất cả ({REWARD_ITEMS.length})
              </button>
              <button
                onClick={() => setSelectedCategory('school')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'school'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                Đồ dùng học tập (3)
              </button>
              <button
                onClick={() => setSelectedCategory('toys')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'toys'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                Đồ chơi (5)
              </button>
              <button
                onClick={() => setSelectedCategory('living')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'living'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                Đồ sinh hoạt (5)
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterAffordable}
                  onChange={(e) => setFilterAffordable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Chỉ hiện quà đủ credits</span>
              </label>

              <div className="relative flex-1 md:w-60">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm món quà..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Grid of Reward Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const canAfford = credits >= item.cost;
              const progressPct = Math.min(100, Math.round((credits / item.cost) * 100));

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    canAfford
                      ? 'bg-white dark:bg-zinc-900 border-indigo-300 dark:border-indigo-800/80 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
                        {renderRewardIcon(item.iconName)}
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {item.tag}
                        </span>
                        <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center justify-end gap-1">
                          <Coins className="w-4 h-4" />
                          <span>{item.cost.toLocaleString()}</span>
                          <span className="text-xs font-normal text-zinc-400">credits</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Progress to reward */}
                    <div className="pt-1">
                      <div className="flex justify-between text-[11px] mb-1 font-medium">
                        <span className="text-zinc-500">Tiến độ tích lũy</span>
                        <span className={canAfford ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-zinc-500'}>
                          {canAfford ? 'Đủ điều kiện (100%)' : `${credits} / ${item.cost.toLocaleString()} (${progressPct}%)`}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            canAfford ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Redeem Button */}
                  <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                    {canAfford ? (
                      <button
                        onClick={() => setRedeemingItem(item)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Đổi quà ngay</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 font-semibold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <span>Còn thiếu {(item.cost - credits).toLocaleString()} credits</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-400 mx-auto" />
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Không tìm thấy món quà phù hợp
              </p>
              <p className="text-xs text-zinc-500">
                Hãy thử bỏ lọc hoặc tìm kiếm với từ khóa khác nhé!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: POINTS ANALYTICS ================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Số dư hiện có</span>
              <div className="text-2xl font-black text-amber-500 flex items-center gap-1.5">
                <Coins className="w-5 h-5" />
                <span>{credits.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-zinc-400 block">Khởi tạo: 200 credits</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Tổng điểm đã tích lũy</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-5 h-5" />
                <span>+{totalEarned.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-zinc-400 block">{arenaWinCount} lần thắng 10/10 câu</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Tổng credits đã dùng</span>
              <div className="text-2xl font-black text-rose-500 flex items-center gap-1.5">
                <TrendingDown className="w-5 h-5" />
                <span>-{totalSpent.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-zinc-400 block">{scanCount} lần quét & phân tích (-2/lần)</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Số quà đã đổi</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Gift className="w-5 h-5" />
                <span>{redeemedGifts.length}</span>
              </div>
              <span className="text-[11px] text-zinc-400 block">Đồ dùng, đồ chơi & sinh hoạt</span>
            </div>
          </div>

          {/* Behavior Breakdown & Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Rule Explanations */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Cơ chế Phân bổ & Sử dụng Credits</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    200
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Điểm khởi tạo ban đầu</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Mỗi tài khoản học sinh khi bắt đầu sử dụng SmartNotes AI được tặng sẵn 200 credits làm vốn trải nghiệm.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold shrink-0">
                    -2
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Quét & Phân tích vở viết tay</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Mỗi lần gửi ảnh chụp trang vở để AI bóc tách nội dung, vẽ sơ đồ tư duy & rà soát lỗi sai sẽ tiêu hao 2 credits.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    +1
                  </div>
                  <div>
                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Đấu trường ôn tập xuất sắc</h5>
                    <p className="text-zinc-500 mt-0.5">
                      Thử thách 10 câu hỏi SGK Kết nối tri thức: Nếu học sinh trả lời đúng toàn bộ 10/10 câu sẽ được cộng ngay 1 credit vào tài khoản.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price reference table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Bảng Mức Credits Đổi quà Chuẩn</span>
                </div>
                <span className="text-[11px] text-zinc-400">13 phần quà</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                {REWARD_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <div>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-1.5">({item.tag})</span>
                      </div>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {item.cost.toLocaleString()} cr
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions History Log Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                <History className="w-4 h-4 text-indigo-500" />
                <span>Nhật ký Biến động Credits</span>
              </div>
              <span className="text-xs text-zinc-400">{transactions.length} giao dịch gần nhất</span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'earn'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                      }`}
                    >
                      {tx.type === 'earn' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">{tx.description}</div>
                      <div className="text-[11px] text-zinc-400">{tx.timestamp}</div>
                    </div>
                  </div>

                  <div
                    className={`font-black text-sm font-mono ${
                      tx.type === 'earn'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`} credits
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: REDEEMED GIFTS HISTORY ================= */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Danh sách Quà tặng đã đổi
                </h3>
                <p className="text-xs text-zinc-500">
                  Lưu trữ các mã nhận thưởng quà tặng dùng để nhận trực tiếp tại văn phòng trường hoặc ngày hội Sáng tạo trẻ
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                {redeemedGifts.length} phần quà
              </span>
            </div>

            {redeemedGifts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {redeemedGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-zinc-50 to-indigo-50/40 dark:from-zinc-800/60 dark:to-indigo-950/30 border border-zinc-200 dark:border-zinc-700 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            {gift.rewardName}
                          </h4>
                          <span className="text-[11px] text-zinc-500">
                            {gift.categoryName} • {gift.cost.toLocaleString()} credits
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        Đã xác nhận
                      </span>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">MÃ NHẬN THƯỞNG:</span>
                        <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 tracking-wider">
                          {gift.code}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(gift.code)}
                        className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-1 transition-colors"
                        title="Sao chép mã"
                      >
                        {copiedCode === gift.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>Thời gian đổi: {gift.redeemedAt}</span>
                      <span className="text-indigo-500 font-medium">Hợp lệ</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3">
                <Gift className="w-10 h-10 text-zinc-400 mx-auto" />
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Em chưa đổi món quà nào
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Tích lũy điểm từ Đấu trường ôn tập hoặc sử dụng điểm khởi tạo ban đầu để rinh về những phần quà học tập và đồ chơi bổ ích nhé!
                </p>
                <button
                  onClick={() => setActiveSubTab('shop')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
                >
                  Khám phá Cửa hàng quà tặng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN ĐỔI QUÀ ================= */}
      {redeemingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-inner">
                {renderRewardIcon(redeemingItem.iconName)}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Xác nhận Đổi quà tặng?
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Bạn sắp dùng <strong className="text-amber-600 font-bold">{redeemingItem.cost.toLocaleString()} credits</strong> để đổi lấy:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                  {redeemingItem.name}
                </span>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                  {redeemingItem.tag}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {redeemingItem.description}
              </p>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between text-xs">
                <span className="text-zinc-500">Số dư hiện tại:</span>
                <span className="font-bold">{credits.toLocaleString()} credits</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Số dư sau khi đổi:</span>
                <span className="font-bold text-emerald-600">
                  {(credits - redeemingItem.cost).toLocaleString()} credits
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRedeemingItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Đồng ý đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
