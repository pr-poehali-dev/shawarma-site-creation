import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Stage = "greeting" | "askName" | "tour" | "promo" | "done";

interface Props {
  onNavigate: (section: string) => void;
  onClose: () => void;
}

const BOXES = [
  { id: "bonus", emoji: "⭐", label: "Кэшбек 3%", desc: "Программа лояльности СВШ Бонус", color: "from-amber-900/80 to-stone-900" },
  { id: "first", emoji: "🎁", label: "Скидка новым", desc: "Специальное предложение для новых гостей", color: "from-orange-900/80 to-stone-900" },
  { id: "lunch", emoji: "🍱", label: "Бизнес-ланч", desc: "Шаурма + гарнир + соус — выгодно!", color: "from-yellow-900/80 to-stone-900" },
];

const TOUR_STEPS = [
  { text: (n: string) => `Отлично, ${n}! 🌯 В разделе «Меню» — вся наша шаурма: курица, свинина, кебаб. Выбирай и добавляй в корзину!`, nav: "menu" },
  { text: (n: string) => `${n}, в разделе «Доставка» оформляешь заказ и указываешь адрес. Привезём за 40 минут горячей! 🛵`, nav: "delivery" },
  { text: (n: string) => `И последнее, ${n} — раздел «Акции». Промокоды и программа лояльности с кэшбеком 3%! 🎁`, nav: "promo" },
];

export default function Robot({ onNavigate, onClose }: Props) {
  const [stage, setStage] = useState<Stage>("greeting");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [tourIdx, setTourIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [blinking, setBlinking] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const greetText = "Привет! 👋 Я Шаур — ваш помощник в СВШ. Как вас зовут? Давайте познакомимся!";
  const promoText = (n: string) => `${n}, выбери акцию, которая тебя интересует — нажми на коробочку! 🎁`;
  const doneText = (n: string) => `Всё готово, ${n}! Выбирай шаурму и заказывай. Вкусного тебе дня! 😋 Кнопка 🤖 внизу — если понадоблюсь.`;

  function typeText(text: string, cb?: () => void) {
    if (typingRef.current) clearTimeout(typingRef.current);
    setTyped("");
    let i = 0;
    const tick = () => {
      i++;
      setTyped(text.slice(0, i));
      if (i < text.length) typingRef.current = setTimeout(tick, 20);
      else if (cb) cb();
    };
    typingRef.current = setTimeout(tick, 200);
  }

  useEffect(() => {
    if (stage === "greeting") typeText(greetText, () => setStage("askName"));
    if (stage === "tour") typeText(TOUR_STEPS[tourIdx].text(name));
    if (stage === "promo") typeText(promoText(name));
    if (stage === "done") typeText(doneText(name));
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [stage, tourIdx]);

  // Моргание глаз
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function submitName() {
    const n = nameInput.trim() || "Гость";
    setName(n);
    setStage("tour");
    setTourIdx(0);
  }

  function nextTour() {
    onNavigate(TOUR_STEPS[tourIdx].nav);
    if (tourIdx < TOUR_STEPS.length - 1) {
      setTourIdx(i => i + 1);
    } else {
      setStage("promo");
    }
  }

  function selectBox(id: string) {
    setSelectedBox(id);
    onNavigate("promo");
    setTimeout(() => setStage("done"), 800);
  }

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] z-[100] animate-slide-up">
      <div className="bg-card border border-gold/30 shadow-2xl shadow-black/60 overflow-hidden">

        {/* Прогресс */}
        <div className="h-0.5 bg-border">
          <div className="h-full bg-gold transition-all duration-700"
            style={{ width: stage === "greeting" || stage === "askName" ? "20%" : stage === "tour" ? `${40 + tourIdx * 20}%` : stage === "promo" ? "90%" : "100%" }} />
        </div>

        <div className="p-5 flex gap-4 items-start">

          {/* 3D РОБОТ — CSS */}
          <div className="shrink-0 flex flex-col items-center gap-1 select-none">
            <div className="robot-3d" style={{ perspective: "200px" }}>
              {/* Голова */}
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/40 flex flex-col items-center justify-center robot-head" style={{ transformStyle: "preserve-3d" }}>
                {/* Блик */}
                <div className="absolute top-1 left-1.5 w-4 h-2 rounded-full bg-white/30" />
                {/* Антенна */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-amber-500 rounded-full" />
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold border-2 border-amber-400 shadow-sm shadow-gold/60" />
                {/* Глаза */}
                <div className="flex gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full bg-background flex items-center justify-center transition-all ${blinking ? "h-0.5" : ""}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-background flex items-center justify-center transition-all ${blinking ? "h-0.5" : ""}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                </div>
                {/* Рот */}
                <div className={`w-6 h-1.5 rounded-full border-2 border-background/60 transition-all ${stage === "done" ? "rounded-b-full border-b-4" : "rounded-full"}`} />
              </div>

              {/* Тело */}
              <div className="w-14 h-10 bg-gradient-to-b from-amber-500 to-amber-700 rounded-lg mt-1 flex items-center justify-center relative shadow-md shadow-amber-600/30">
                <div className="w-6 h-4 bg-background/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                </div>
                {/* Руки */}
                <div className="absolute -left-2 top-1 w-2 h-7 bg-amber-500 rounded-full" />
                <div className="absolute -right-2 top-1 w-2 h-7 bg-amber-500 rounded-full" />
              </div>

              {/* Ноги */}
              <div className="flex gap-2 mt-1 justify-center">
                <div className="w-4 h-4 bg-amber-600 rounded-b-lg" />
                <div className="w-4 h-4 bg-amber-600 rounded-b-lg" />
              </div>
            </div>
            <span className="text-gold text-xs font-display font-black tracking-widest mt-1">ШАУР</span>
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            {/* Текст с курсором */}
            <p className="text-foreground text-sm leading-relaxed min-h-[52px]">
              {typed}
              <span className="inline-block w-0.5 h-4 bg-gold ml-0.5 animate-pulse align-middle" />
            </p>

            {/* Ввод имени */}
            {stage === "askName" && (
              <div className="mt-3 flex gap-2 animate-fade-in">
                <input
                  autoFocus
                  type="text"
                  placeholder="Ваше имя..."
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitName()}
                  className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold text-foreground transition-colors"
                />
                <button
                  onClick={submitName}
                  className="bg-gold text-background font-display font-black text-xs tracking-wider px-4 py-2 hover:bg-amber-400 transition-colors"
                >
                  OK
                </button>
              </div>
            )}

            {/* Экскурсия */}
            {stage === "tour" && (
              <div className="mt-3 flex items-center justify-between animate-fade-in">
                <span className="text-muted-foreground text-xs">{tourIdx + 1} / {TOUR_STEPS.length}</span>
                <button onClick={nextTour}
                  className="bg-gold text-background font-display font-black text-xs tracking-wider px-5 py-2 hover:bg-amber-400 transition-colors flex items-center gap-1">
                  ДАЛЕЕ <Icon name="ChevronRight" size={12} />
                </button>
              </div>
            )}

            {/* Коробочки акций */}
            {stage === "promo" && (
              <div className="mt-3 grid grid-cols-3 gap-2 animate-fade-in">
                {BOXES.map(b => (
                  <button
                    key={b.id}
                    onClick={() => selectBox(b.id)}
                    className={`relative bg-gradient-to-b ${b.color} border transition-all p-3 text-center hover:scale-105 active:scale-95 ${selectedBox === b.id ? "border-gold shadow-lg shadow-gold/30" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="text-2xl mb-1">{b.emoji}</div>
                    <p className="font-display text-xs font-bold text-foreground tracking-wide leading-tight">{b.label}</p>
                    {selectedBox === b.id && (
                      <div className="absolute inset-0 bg-gold/10 flex items-center justify-center">
                        <Icon name="Check" size={20} className="text-gold" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Финал */}
            {stage === "done" && (
              <div className="mt-3 flex justify-end animate-fade-in">
                <button onClick={onClose}
                  className="bg-gold text-background font-display font-black text-xs tracking-wider px-5 py-2 hover:bg-amber-400 transition-colors">
                  ПОЕХАЛИ! 🚀
                </button>
              </div>
            )}
          </div>

          {/* Закрыть */}
          <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors -mt-1">
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
