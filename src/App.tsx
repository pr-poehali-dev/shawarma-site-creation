import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import Robot from "@/components/Robot";

const HERO_IMG = "https://cdn.poehali.dev/projects/9a915484-42d3-4415-9942-f883e0098d6a/files/7a02cc74-6c5e-4afa-87c2-3e471b47d337.jpg";

type Section = "home" | "menu" | "about" | "delivery" | "promo" | "contacts";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const menuItems = [
  { id: 1, cat: "Шаурма", name: "Шаурма Курица Мини", desc: "Куриный шашлычок, салат из капусты, морковь по-корейски, солёные огурчики, сливочно-чесночный соус в хрустящем мини лаваше", price: 179, weight: "150г", hit: false, emoji: "🌯" },
  { id: 2, cat: "Шаурма", name: "Шаурма Курица", desc: "Куриный шашлычок, салат из капусты, морковь по-корейски, солёные огурчики, сливочно-чесночный соус в хрустящем лаваше", price: 249, weight: "280г", hit: true, emoji: "🌯" },
  { id: 3, cat: "Шаурма", name: "Шаурма Курица Макси", desc: "Двойная порция куриного шашлычка, салата из капусты, моркови по-корейски, солёных огурчиков, сливочно-чесночного соуса в хрустящем лаваше", price: 319, weight: "400г", hit: false, emoji: "🌯" },
  { id: 4, cat: "Шаурма", name: "Шаурма Свинина Мини", desc: "Шашлычок из свинины, салат из капусты, морковь по-корейски, солёные огурчики, пикантный сливочно-чесночный соус в хрустящем мини лаваше", price: 199, weight: "150г", hit: false, emoji: "🌯" },
  { id: 5, cat: "Шаурма", name: "Шаурма Кебаб", desc: "Куриный кебаб с капустой, луком, кинзой, солёными огурцами, помидорами и чесночным соусом в лаваше", price: 269, weight: "330г", hit: false, emoji: "🌯" },
  { id: 6, cat: "Шаурма", name: "Шаурма Курица Фреш", desc: "Куриный шашлычок и свежие огурцы, капуста, помидоры, лук в хрустящем лаваше с чесночным соусом", price: 269, weight: "310г", hit: false, emoji: "🌯" },
  { id: 7, cat: "Соусы", name: "Соус Heinz Сырный", desc: "Нежный соус со вкусом расплавленного сыра. Добавь для вкуса в любимые закуски!", price: 49, weight: "25мл", hit: false, emoji: "🫙" },
  { id: 8, cat: "Соусы", name: "Соус Heinz Кисло-сладкий", desc: "Особый соус с кисло-сладким вкусом. Добавь для вкуса в любимые закуски!", price: 49, weight: "25мл", hit: false, emoji: "🫙" },
  { id: 9, cat: "Фритюр", name: "Картофель фри", desc: "Хрустящий картофель фри, приготовленный во фритюре", price: 119, weight: "150г", hit: false, emoji: "🍟" },
  { id: 10, cat: "Боксы", name: "Бокс Курица", desc: "Шаурма Курица + картофель фри + соус на выбор. Выгодный комбо-набор!", price: 379, weight: "450г", hit: true, emoji: "📦" },
];

const promos = [
  { id: 1, tag: "ПРОГРАММА ЛОЯЛЬНОСТИ", title: "КЭШБЕК 3%", desc: "Зарегистрируйся в программе СВШ Бонус и получай кэшбек с каждого заказа навсегда.", badge: "БОНУС", icon: "Star" },
  { id: 2, tag: "ДЛЯ НОВЫХ ГОСТЕЙ", title: "ПЕРВЫЙ ЗАКАЗ", desc: "Скидка на первый онлайн-заказ для новых гостей. Зарегистрируйся и сэкономь.", badge: "НОВЫМ", icon: "Gift" },
  { id: 3, tag: "ЕЖЕДНЕВНО 11–15", title: "БИЗНЕС-ЛАНЧ", desc: "Шаурма + гарнир + соус по специальной цене. Сытный обед без лишних затрат.", badge: "ЛАНЧ", icon: "Clock" },
];



// Плавающие частицы
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            background: "hsl(32,90%,52%)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${6 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState<Section>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuCat, setMenuCat] = useState("Все");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [robotVisible, setRobotVisible] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const finalTotal = cartTotal - discount;

  useEffect(() => {
    const t = setTimeout(() => setRobotVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const navItems: { id: Section; label: string }[] = [
    { id: "home", label: "Главная" },
    { id: "menu", label: "Меню" },
    { id: "about", label: "О нас" },
    { id: "delivery", label: "Доставка" },
    { id: "promo", label: "Акции" },
    { id: "contacts", label: "Контакты" },
  ];

  function addToCart(item: typeof menuItems[0]) {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.reduce<CartItem[]>((acc, i) => {
      if (i.id !== id) return [...acc, i];
      if (i.qty > 1) return [...acc, { ...i, qty: i.qty - 1 }];
      return acc;
    }, []));
  }

  function applyPromo() {
    if (promoCode.toUpperCase() === "ПЕРВЫЙ15" || promoCode.toUpperCase() === "СВШ3") setPromoApplied(true);
  }

  function placeOrder() {
    setOrderPlaced(true);
    setCart([]);
    setCartOpen(false);
    setTimeout(() => setOrderPlaced(false), 4000);
  }

  const cats = ["Все", ...Array.from(new Set(menuItems.map(i => i.cat)))];
  const filtered = menuCat === "Все" ? menuItems : menuItems.filter(i => i.cat === menuCat);

  return (
    <div className="min-h-screen bg-background text-foreground font-body relative">
      <Particles />

      {/* === РОБОТ-ГИД === */}
      {robotVisible ? (
        <Robot onNavigate={(s) => setActive(s as Section)} onClose={() => setRobotVisible(false)} />
      ) : (
        <button
          onClick={() => setRobotVisible(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-xl shadow-gold/40 hover:scale-110 transition-transform robot-bounce"
          title="Вызвать помощника"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setActive("home")} className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-bold tracking-widest text-gold group-hover:scale-105 transition-transform inline-block">СВШ</span>
            <span className="hidden sm:block text-muted-foreground text-xs font-body tracking-wide">Самая Вкусная Шаурма</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`font-display text-sm tracking-wider px-4 py-2 transition-all relative group ${active === n.id ? "text-gold" : "text-muted-foreground hover:text-foreground"} ${tourHighlight === n.id ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""}`}
              >
                {n.label}
                {active === n.id && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-gold text-background font-display text-sm font-bold tracking-wider px-4 py-2 hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-gold/30"
            >
              <Icon name="ShoppingBag" size={16} />
              <span className="hidden sm:inline">КОРЗИНА</span>
              {cartCount > 0 && (
                <span className="bg-background text-gold text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur border-t border-border py-2">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => { setActive(n.id); setMobileMenuOpen(false); }}
                className={`w-full text-left font-display tracking-wider px-6 py-3 text-sm transition-colors ${active === n.id ? "text-gold bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="pt-16">

        {/* ======= HOME ======= */}
        {active === "home" && (
          <div>
            {/* HERO */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img src={HERO_IMG} alt="Шаурма" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Декоративные линии */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent hidden lg:block" />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-6 animate-fade-in">
                    <div className="h-px w-12 bg-gold" />
                    <p className="font-body text-gold text-xs tracking-[0.4em] uppercase">Федеральная сеть кафе</p>
                  </div>

                  <h1 className="font-display font-bold leading-none tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    <span className="block text-5xl sm:text-7xl lg:text-9xl text-foreground">САМАЯ</span>
                    <span className="block text-5xl sm:text-7xl lg:text-9xl text-gold glow-gold">ВКУСНАЯ</span>
                    <span className="block text-5xl sm:text-7xl lg:text-9xl text-foreground/60">ШАУРМА</span>
                  </h1>

                  <p className="font-body text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg animate-fade-in" style={{ animationDelay: "0.25s" }}>
                    Куриный шашлычок, свежие овощи, фирменный соус в хрустящем лаваше.<br />
                    Доставка за 40 минут. Ежедневно с 10:00 до 23:00.
                  </p>

                  <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <button
                      onClick={() => setActive("menu")}
                      className="group bg-gold text-background font-display font-bold tracking-widest px-8 py-4 hover:bg-amber-400 transition-all text-sm uppercase hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <Icon name="UtensilsCrossed" size={16} />
                      Смотреть меню
                    </button>
                    <button
                      onClick={() => setActive("delivery")}
                      className="border border-gold/50 text-gold font-display font-bold tracking-widest px-8 py-4 hover:border-gold hover:bg-gold/10 transition-all text-sm uppercase flex items-center gap-2"
                    >
                      <Icon name="Bike" size={16} />
                      Заказать доставку
                    </button>
                  </div>
                </div>
              </div>

              {/* Плавающие цены */}
              <div className="absolute right-8 top-1/3 hidden xl:flex flex-col gap-3 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                {menuItems.slice(0, 4).map((item, i) => (
                  <div
                    key={item.id}
                    className="bg-card/80 backdrop-blur border border-border px-4 py-2 flex items-center gap-3 hover-lift cursor-pointer"
                    style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                    onClick={() => setActive("menu")}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="font-display text-xs tracking-wide text-foreground">{item.name}</p>
                      <p className="text-gold text-sm font-bold">от {item.price} ₽</p>
                    </div>
                    {item.hit && <span className="text-xs bg-gold/20 text-gold px-1.5 py-0.5 font-display tracking-wider">ХИТ</span>}
                  </div>
                ))}
              </div>
            </section>

            {/* STATS BAR */}
            <section className="bg-gold py-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 11px)" }} />
              <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                {[
                  { num: "10+", label: "Позиций в меню", icon: "UtensilsCrossed" },
                  { num: "40 мин", label: "Среднее время доставки", icon: "Bike" },
                  { num: "Ежедн.", label: "Работаем с 10 до 23", icon: "Clock" },
                  { num: "3%", label: "Кэшбек по программе СВШ", icon: "Star" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-display text-2xl sm:text-3xl font-black text-background mb-0.5">{s.num}</div>
                    <div className="font-body text-background/70 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* МЕНЮ ПРЕВЬЮ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-8 bg-gold" />
                    <p className="text-gold text-xs tracking-[0.3em] uppercase">Популярное</p>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">ТОП ПОЗИЦИЙ</h2>
                </div>
                <button onClick={() => setActive("menu")} className="hidden sm:flex items-center gap-2 text-gold text-sm font-display tracking-wider group">
                  Всё меню
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {menuItems.filter(i => i.cat === "Шаурма").slice(0, 3).map((item, idx) => (
                  <div
                    key={item.id}
                    className="group bg-card border border-border overflow-hidden hover-lift transition-all duration-300 hover:border-gold/40"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Цветной блок вместо картинки */}
                    <div className="h-40 bg-gradient-to-br from-amber-950 via-stone-900 to-background relative overflow-hidden flex items-center justify-center">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">{item.emoji}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.hit && (
                          <span className="bg-gold text-background text-xs font-display font-black px-2 py-1 tracking-wider">ХИТ</span>
                        )}
                        <span className="bg-background/60 backdrop-blur text-muted-foreground text-xs px-2 py-1">{item.weight}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-bold tracking-wide text-foreground text-lg mb-2 group-hover:text-gold transition-colors">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground text-xs">от</span>
                          <span className="font-display text-2xl font-black text-gold ml-1">{item.price} ₽</span>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gold text-background text-sm font-display font-bold tracking-wider px-5 py-2.5 hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 flex items-center gap-1.5"
                        >
                          <Icon name="Plus" size={14} />
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* АКЦИЯ БАННЕР */}
            <section className="relative overflow-hidden bg-card border-y border-border py-16 px-4">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(32,90%,52%) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(32,90%,52%) 0%, transparent 50%)" }} />
              <div className="relative max-w-4xl mx-auto text-center">
                <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4 font-display">Программа лояльности</p>
                <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight mb-4">
                  СВШ БОНУС — <span className="text-gold">КЭШБЕК 3%</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  С каждого заказа возвращаем бонусы. Копи и оплачивай следующие заказы.
                </p>
                <button
                  onClick={() => setActive("promo")}
                  className="bg-gold text-background font-display font-black tracking-widest px-10 py-4 hover:bg-amber-400 transition-all text-sm uppercase hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-1"
                >
                  Узнать подробнее →
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ======= MENU ======= */}
        {active === "menu" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold" />
                <p className="text-gold text-xs tracking-[0.3em] uppercase">Полный выбор</p>
              </div>
              <h2 className="font-display text-5xl font-black tracking-tight">МЕНЮ</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setMenuCat(c)}
                  className={`font-display text-sm tracking-wider px-6 py-2.5 border transition-all ${menuCat === c ? "bg-gold text-background border-gold shadow-lg shadow-gold/20" : "border-border text-muted-foreground hover:border-gold/50 hover:text-gold"}`}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="group bg-card border border-border overflow-hidden hover-lift hover:border-gold/40 transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="h-36 bg-gradient-to-br from-amber-950 via-stone-900 to-background relative overflow-hidden flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{item.emoji}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.hit && <span className="bg-gold text-background text-xs font-display font-black px-2 py-0.5 tracking-wider">ХИТ</span>}
                      <span className="bg-background/60 backdrop-blur text-muted-foreground text-xs px-2 py-0.5">{item.weight}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col">
                    <h3 className="font-display font-bold tracking-wide text-foreground mb-2 group-hover:text-gold transition-colors">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-black text-gold">от {item.price} ₽</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gold text-background text-sm font-display font-bold tracking-wider px-4 py-2 hover:bg-amber-400 transition-all hover:shadow-md hover:shadow-gold/20 flex items-center gap-1"
                      >
                        <Icon name="Plus" size={14} />
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======= ABOUT ======= */}
        {active === "about" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold" />
                <p className="text-gold text-xs tracking-[0.3em] uppercase">Наша история</p>
              </div>
              <h2 className="font-display text-5xl font-black tracking-tight">О НАС</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-wide mb-5 text-gold">СВШ — федеральная сеть кафе быстрого питания</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Мы создали сеть, где каждая шаурма — это результат строго проверенного рецепта и свежих ингредиентов. Никаких полуфабрикатов — только мясо на вертеле, отборные овощи и соусы фирменного приготовления.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  СВШ — это про качество без компромиссов. Мы работаем ежедневно, от открытия до закрытия, чтобы каждый гость получил идеальную шаурму.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Программа лояльности «СВШ Бонус» — ваш кэшбек 3% с каждого заказа. Регистрируйтесь и экономьте уже с первого визита.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Award", title: "Качество", text: "Только свежие ингредиенты. Мясо поставляется ежедневно без заморозки." },
                  { icon: "Zap", title: "Скорость", text: "Готовим быстро — без потери качества. Доставка за 40 минут." },
                  { icon: "Users", title: "Для всех", text: "Курица, свинина, кебаб — каждый найдёт свой вкус в нашем меню." },
                  { icon: "Star", title: "Программа", text: "СВШ Бонус: кэшбек 3% с каждого заказа. Копи — трать на шаурму." },
                ].map((v, i) => (
                  <div key={i} className="bg-card border border-border p-5 hover:border-gold/40 transition-colors group">
                    <div className="w-9 h-9 bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-colors">
                      <Icon name={v.icon as "Award" | "Zap" | "Users" | "Star"} size={18} className="text-gold" />
                    </div>
                    <h3 className="font-display font-bold tracking-wide mb-1 text-sm">{v.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ======= DELIVERY ======= */}
        {active === "delivery" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold" />
                <p className="text-gold text-xs tracking-[0.3em] uppercase">Быстро и надёжно</p>
              </div>
              <h2 className="font-display text-5xl font-black tracking-tight">ДОСТАВКА</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="font-display text-lg font-bold tracking-wide mb-6 text-gold uppercase">Условия</h3>
                <div className="space-y-0">
                  {[
                    { label: "Время доставки", value: "30–40 минут" },
                    { label: "Минимальный заказ", value: "500 ₽" },
                    { label: "Бесплатная доставка", value: "от 1 200 ₽" },
                    { label: "Стоимость доставки", value: "199 ₽" },
                    { label: "Зона доставки", value: "В пределах города" },
                    { label: "Часы работы", value: "Ежедневно 10:00 — 23:00" },
                  ].map((r, i) => (
                    <div key={i} className={`flex items-center justify-between py-4 border-b border-border group hover:bg-secondary/30 px-3 -mx-3 transition-colors`}>
                      <span className="text-muted-foreground text-sm">{r.label}</span>
                      <span className="font-display font-bold tracking-wide text-foreground">{r.value}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8">
                  {[
                    { icon: "Clock", title: "40 мин", text: "Доставка" },
                    { icon: "Package", title: "Горячая", text: "Термосумка" },
                    { icon: "CreditCard", title: "Онлайн", text: "Оплата" },
                  ].map((f, i) => (
                    <div key={i} className="bg-card border border-border p-4 text-center hover:border-gold/40 transition-colors">
                      <Icon name={f.icon as "Clock" | "Package" | "CreditCard"} size={20} className="text-gold mx-auto mb-2" />
                      <p className="font-display font-bold text-sm">{f.title}</p>
                      <p className="text-muted-foreground text-xs">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border p-7">
                <h3 className="font-display text-xl font-bold tracking-wide mb-6 uppercase">Оформить заказ</h3>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-5xl block mb-4">🛒</span>
                    <p className="text-muted-foreground mb-5">Корзина пуста</p>
                    <button onClick={() => setActive("menu")} className="bg-gold text-background font-display font-bold tracking-wider px-6 py-3 hover:bg-amber-400 transition-all text-sm uppercase">
                      Перейти в меню
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-3 mb-5">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-border">
                          <div>
                            <p className="font-display text-sm tracking-wide">{item.name}</p>
                            <p className="text-muted-foreground text-xs">{item.price} ₽ × {item.qty}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 border border-border text-foreground hover:border-gold hover:text-gold transition-colors text-xs flex items-center justify-center">−</button>
                            <span className="font-display font-bold w-4 text-center text-sm">{item.qty}</span>
                            <button onClick={() => addToCart(menuItems.find(m => m.id === item.id)!)} className="w-6 h-6 border border-border text-foreground hover:border-gold hover:text-gold transition-colors text-xs flex items-center justify-center">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4">
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Промокод (ПЕРВЫЙ15)" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                          className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold text-foreground" />
                        <button onClick={applyPromo} className="border border-gold text-gold font-display text-sm tracking-wider px-4 py-2 hover:bg-gold hover:text-background transition-colors">ОК</button>
                      </div>
                      {promoApplied && <p className="text-green-400 text-xs">✓ Скидка 10% применена!</p>}
                    </div>
                    {discount > 0 && <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Скидка</span><span className="text-green-400">−{discount} ₽</span></div>}
                    <div className="flex justify-between font-display font-black text-xl mb-5">
                      <span>ИТОГО</span><span className="text-gold">{finalTotal} ₽</span>
                    </div>
                    <input type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-gold text-foreground" />
                    <input type="tel" placeholder="Телефон" className="w-full bg-background border border-border px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-gold text-foreground" />
                    <input type="text" placeholder="Адрес доставки" className="w-full bg-background border border-border px-3 py-2.5 text-sm mb-5 focus:outline-none focus:border-gold text-foreground" />
                    <button onClick={placeOrder} className="w-full bg-gold text-background font-display font-black tracking-widest py-3.5 hover:bg-amber-400 transition-all text-sm uppercase hover:shadow-lg hover:shadow-gold/30">
                      Оформить заказ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ======= PROMO ======= */}
        {active === "promo" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold" />
                <p className="text-gold text-xs tracking-[0.3em] uppercase">Выгодные предложения</p>
              </div>
              <h2 className="font-display text-5xl font-black tracking-tight">АКЦИИ</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 mb-12">
              {promos.map((p, idx) => (
                <div
                  key={p.id}
                  className="relative bg-card border border-border p-8 hover-lift hover:border-gold/40 transition-all group overflow-hidden"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full group-hover:bg-gold/10 transition-colors" />
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-5">
                    <Icon name={p.icon as "Star" | "Gift" | "Clock"} size={20} className="text-gold" />
                  </div>
                  <span className="inline-block border border-gold text-gold font-display text-xs tracking-[0.2em] px-3 py-1 mb-3">{p.badge}</span>
                  <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2 font-display">{p.tag}</p>
                  <h3 className="font-display text-2xl font-black tracking-tight mb-3">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border p-8">
              <h3 className="font-display text-xl font-bold tracking-wide mb-6 uppercase">Промокоды</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { code: "ПЕРВЫЙ15", desc: "Скидка 10% на первый заказ", valid: "Бессрочно" },
                  { code: "СВШ3", desc: "Активировать программу лояльности СВШ Бонус — кэшбек 3%", valid: "Постоянно" },
                ].map((pc, i) => (
                  <div key={i} className="border border-border p-5 flex items-center justify-between gap-4 hover:border-gold/40 transition-colors">
                    <div>
                      <p className="font-display font-black text-gold tracking-widest text-lg">{pc.code}</p>
                      <p className="text-muted-foreground text-sm mt-0.5">{pc.desc}</p>
                      <p className="text-muted-foreground text-xs mt-1">Действует: {pc.valid}</p>
                    </div>
                    <button
                      onClick={() => { setPromoCode(pc.code); setActive("delivery"); }}
                      className="border border-gold text-gold font-display text-xs tracking-wider px-3 py-2 hover:bg-gold hover:text-background transition-all shrink-0 uppercase"
                    >
                      Применить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ======= CONTACTS ======= */}
        {active === "contacts" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold" />
                <p className="text-gold text-xs tracking-[0.3em] uppercase">Мы рядом</p>
              </div>
              <h2 className="font-display text-5xl font-black tracking-tight">КОНТАКТЫ</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-4">
                {[
                  { icon: "Mail", label: "Email", value: "info@svsh.info", sub: "Ответим в течение рабочего дня" },
                  { icon: "Globe", label: "Сайт сети", value: "свш.рф", sub: "Федеральная сеть кафе быстрого питания" },
                  { icon: "MapPin", label: "Юридический адрес", value: "г. Москва, ул. Малая Тульская, д. 16, пом. 1Б/1", sub: "ООО «СВШ» · ИНН 7105051710" },
                  { icon: "Building2", label: "ОГРН", value: "1177154017260", sub: "Зарегистрировано в 2017 году" },
                  { icon: "Clock", label: "Часы работы", value: "10:00 — 23:00", sub: "Ежедневно, без выходных" },
                ].map((c, i) => (
                  <div key={i} className="bg-card border border-border p-5 flex items-start gap-4 hover:border-gold/40 transition-colors group">
                    <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <Icon name={c.icon as "Mail" | "Globe" | "MapPin" | "Building2" | "Clock"} size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5 font-display">{c.label}</p>
                      <p className="font-display font-bold tracking-wide">{c.value}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-8">
                <h3 className="font-display text-xl font-bold tracking-wide mb-6 uppercase">Написать нам</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors" />
                  <input type="tel" placeholder="Телефон" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors" />
                  <input type="email" placeholder="Email" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors" />
                  <textarea placeholder="Ваше сообщение или вопрос..." rows={4} className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors resize-none" />
                  <button className="w-full bg-gold text-background font-display font-black tracking-widest py-3.5 hover:bg-amber-400 transition-all text-sm uppercase hover:shadow-lg hover:shadow-gold/30">
                    Отправить сообщение
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-10 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, hsl(32,90%,52%) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <span className="font-display text-3xl font-black tracking-widest text-gold block">СВШ</span>
              <span className="text-muted-foreground text-xs tracking-widest font-display">САМАЯ ВКУСНАЯ ШАУРМА</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {navItems.map(n => (
                <button key={n.id} onClick={() => setActive(n.id)} className="text-muted-foreground hover:text-gold text-xs font-display tracking-wider transition-colors hover:underline">
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-muted-foreground text-xs space-y-1">
            <p>ООО «СВШ» · ИНН 7105051710 · ОГРН 1177154017260</p>
            <p>115191, г. Москва, ул. Малая Тульская, д. 16, пом. 1Б/1 · info@svsh.info</p>
            <p className="mt-2 text-muted-foreground/50">© 2024 СВШ — Самая Вкусная Шаурма. Федеральная сеть кафе быстрого питания.</p>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-card w-full max-w-md h-full flex flex-col border-l border-border shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-display text-xl font-black tracking-wide uppercase">Корзина</h3>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-6xl block mb-4">🛒</span>
                  <p className="text-muted-foreground mb-5">Корзина пуста</p>
                  <button onClick={() => { setActive("menu"); setCartOpen(false); }} className="text-gold font-display text-sm tracking-wider hover:underline">
                    Перейти в меню →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border">
                      <div className="flex-1">
                        <p className="font-display text-sm tracking-wide">{item.name}</p>
                        <p className="text-gold text-sm font-bold">{item.price * item.qty} ₽</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 border border-border hover:border-gold text-foreground flex items-center justify-center text-sm transition-colors">−</button>
                        <span className="font-display font-black w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(menuItems.find(m => m.id === item.id)!)} className="w-7 h-7 border border-border hover:border-gold text-foreground flex items-center justify-center text-sm transition-colors">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border">
                <div className="flex gap-2 mb-4">
                  <input type="text" placeholder="Промокод" value={promoCode} onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold text-foreground" />
                  <button onClick={applyPromo} className="border border-gold text-gold font-display text-sm tracking-wider px-4 py-2 hover:bg-gold hover:text-background transition-colors">ОК</button>
                </div>
                {promoApplied && <p className="text-green-400 text-xs mb-3">✓ Скидка 10% применена!</p>}
                {discount > 0 && <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Скидка</span><span className="text-green-400">−{discount} ₽</span></div>}
                <div className="flex justify-between font-display font-black text-xl mb-4">
                  <span>ИТОГО</span><span className="text-gold">{finalTotal} ₽</span>
                </div>
                <button onClick={() => { setCartOpen(false); setActive("delivery"); }}
                  className="w-full bg-gold text-background font-display font-black tracking-widest py-3.5 hover:bg-amber-400 transition-all text-sm uppercase hover:shadow-lg hover:shadow-gold/30">
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDER SUCCESS */}
      {orderPlaced && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gold text-background font-display font-black tracking-wider px-8 py-4 text-sm uppercase shadow-2xl shadow-gold/40 animate-fade-in flex items-center gap-2">
          <Icon name="CheckCircle" size={16} />
          Заказ принят! Ожидайте звонка
        </div>
      )}
    </div>
  );
}