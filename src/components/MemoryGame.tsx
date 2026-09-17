import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Award, CheckCircle2 } from 'lucide-react';

interface CardItem {
  id: number;
  matchId: number;
  text: string;
  type: 'question' | 'answer';
}

const memoryPairs = [
  {
    q: "Nước sôi ở áp suất chuẩn",
    a: "100°C (Thang Celsius)"
  },
  {
    q: "Công thức Định luật Ôm",
    a: "I = U / R"
  },
  {
    q: "Số hữu tỉ kí hiệu là",
    a: "Tập hợp Q"
  },
  {
    q: "Đoạn mạch nối tiếp",
    a: "I = I₁ = I₂ và Rtd = R₁ + R₂"
  },
  {
    q: "Chu vi hình vuông cạnh a",
    a: "P = a × 4"
  },
  {
    q: "Đơn vị điện trở",
    a: "Ôm (kí hiệu Ω)"
  }
];

export const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    memoryPairs.forEach((pair, idx) => {
      deck.push({
        id: idx * 2,
        matchId: idx,
        text: pair.q,
        type: 'question'
      });
      deck.push({
        id: idx * 2 + 1,
        matchId: idx,
        text: pair.a,
        type: 'answer'
      });
    });

    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
        setMatched(prev => {
          const updated = [...prev, newFlipped[0], newFlipped[1]];
          if (updated.length === cards.length) {
            setGameWon(true);
          }
          return updated;
        });
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div id="memory-game-container" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Mini Game: Lật thẻ Ghép đôi Khái niệm
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ghép nối chính xác thuật ngữ với định nghĩa/công thức chuẩn SGK
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            Số lượt lật: <strong className="text-zinc-900 dark:text-zinc-100">{moves}</strong>
          </div>
          <button
            onClick={initGame}
            className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Chơi lại</span>
          </button>
        </div>
      </div>

      {gameWon ? (
        <div className="p-8 text-center space-y-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40 border border-pink-200 dark:border-pink-800">
          <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            Tuyệt vời! Bạn đã hoàn thành trong {moves} lượt lật!
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Trí nhớ và khả năng liên kết kiến thức SGK Kết nối tri thức của bạn rất xuất sắc.
          </p>
          <div className="pt-2">
            <button
              onClick={initGame}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử lại với bộ thẻ mới</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            const isMatched = matched.includes(idx);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-28 rounded-2xl p-3 flex items-center justify-center text-center cursor-pointer transition-all duration-300 select-none shadow-sm ${
                  isMatched
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                    : isFlipped
                    ? 'bg-white dark:bg-zinc-800 border-2 border-indigo-500 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold hover:scale-[1.02]'
                }`}
              >
                {isFlipped ? (
                  <div className="space-y-1">
                    <p className="text-xs leading-snug">{card.text}</p>
                    {isMatched && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mt-1" />
                    )}
                  </div>
                ) : (
                  <Sparkles className="w-5 h-5 text-white/80" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
