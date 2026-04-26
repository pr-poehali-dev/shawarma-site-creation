import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/9a915484-42d3-4415-9942-f883e0098d6a/files/7a02cc74-6c5e-4afa-87c2-3e471b47d337.jpg";
const MENU_IMG = "https://cdn.poehali.dev/projects/9a915484-42d3-4415-9942-f883e0098d6a/files/9b7e3332-e27a-4b7b-be1e-7da953d324f3.jpg";

// Фото с сайта СВШ (скриншоты пользователя)
const IMG_SCREEN1 = "https://cdn.poehali.dev/projects/9a915484-42d3-4415-9942-f883e0098d6a/bucket/c629709b-9473-49cb-a0e0-852054fed832.jpg";
const IMG_SCREEN2 = "https://cdn.poehali.dev/projects/9a915484-42d3-4415-9942-f883e0098d6a/bucket/b1352f3b-22fc-4b8b-bda0-a04bb0f47dbf.jpg";
const IMG_SCREEN3 = "https://cdn.poehali.dev/projects/9a915484-42d3-4415-9942-f883e0098d6a/bucket/02281d91-a3bc-4f94-8d1b-2d8120cd0181.jpg";

type Section = "home" | "menu" | "about" | "delivery" | "promo" | "contacts";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const menuItems = [
  { id: 1, cat: "Шаурма", name: "Шаурма Курица Мини", desc: "Куриный шашлычок, салат из капусты, морковь по-корейски, солёные огурчики, сливочно-чесночный соус в хрустящем мини лаваше", price: 179, weight: "150г", hit: false, img: IMG_SCREEN1 },
  { id: 2, cat: "Шаурма", name: "Шаурма Курица", desc: "Куриный шашлычок, салат из капусты, морковь по-корейски, солёные огурчики, сливочно-чесночный соус в хрустящем лаваше", price: 249, weight: "280г", hit: true, img: IMG_SCREEN1 },
  { id: 3, cat: "Шаурма", name: "Шаурма Курица Макси", desc: "Двойная порция куриного шашлычка, салата из капусты, моркови по-корейски, солёных огурчиков, сливочно-чесночного соуса в хрустящем лаваше", price: 319, weight: "400г", hit: false, img: IMG_SCREEN2 },
  { id: 4, cat: "Шаурма", name: "Шаурма Свинина Мини", desc: "Шашлычок из свинины, салат из капусты, морковь по-корейски, солёные огурчики, пикантный сливочно-чесночный соус в хрустящем мини лаваше", price: 199, weight: "150г", hit: false, img: IMG_SCREEN2 },
  { id: 5, cat: "Шаурма", name: "Шаурма Кебаб", desc: "Куриный кебаб с капустой, луком, кинзой, солёными огурцами, помидорами и чесночным соусом в лаваше", price: 269, weight: "330г", hit: false, img: IMG_SCREEN3 },
  { id: 6, cat: "Шаурма", name: "Шаурма Курица Фреш", desc: "Куриный шашлычок и свежие огурцы, капуста, помидоры, лук в хрустящем лаваше с чесночным соусом", price: 269, weight: "310г", hit: false, img: IMG_SCREEN3 },
  { id: 7, cat: "Соусы", name: "Соус Heinz Сырный", desc: "Нежный соус со вкусом расплавленного сыра. Добавь для вкуса в любимые закуски!", price: 49, weight: "25мл", hit: false, img: "" },
  { id: 8, cat: "Соусы", name: "Соус Heinz Кисло-сладкий", desc: "Особый соус с кисло-сладким вкусом. Добавь для вкуса в любимые закуски!", price: 49, weight: "25мл", hit: false, img: "" },
  { id: 9, cat: "Фритюр", name: "Картофель фри", desc: "Хрустящий картофель фри, приготовленный во фритюре", price: 119, weight: "150г", hit: false, img: "" },
  { id: 10, cat: "Боксы", name: "Бокс Курица", desc: "Шаурма Курица + картофель фри + соус на выбор", price: 379, weight: "450г", hit: false, img: "" },
];

const promos = [
  { id: 1, tag: "БОНУС", title: "КЭШБЕК 3%", desc: "Зарегистрируйся в программе лояльности СВШ Бонус и получай кэшбек с каждого заказа.", badge: "БОНУС", color: "from-orange-900/60 to-stone-900" },
  { id: 2, tag: "СКИДКА", title: "ПЕРВЫЙ ЗАКАЗ", desc: "Скидка на первый онлайн-заказ для новых гостей. Успей воспользоваться!", badge: "НОВЫМ", color: "from-amber-900/60 to-stone-900" },
  { id: 3, tag: "КОМБО", title: "БИЗНЕС-ЛАНЧ", desc: "Шаурма + гарнир + напиток за 390 рублей. Ежедневно с 11 до 15.", badge: "11:00–15:00", color: "from-yellow-900/60 to-stone-900" },
];

export default function App() {
  const [active, setActive] = useState<Section>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuCat, setMenuCat] = useState("Все");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const finalTotal = cartTotal - discount;

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
    if (promoCode.toUpperCase() === "ПЕРВЫЙ15") setPromoApplied(true);
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
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setActive("home")} className="font-display text-2xl font-bold tracking-widest text-gold">
            ШАУР
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`font-display text-sm tracking-wider px-4 py-2 transition-colors ${active === n.id ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-gold text-background font-display text-sm font-semibold tracking-wider px-4 py-2 hover:bg-amber-400 transition-colors"
            >
              <Icon name="ShoppingBag" size={16} />
              <span className="hidden sm:inline">КОРЗИНА</span>
              {cartCount > 0 && (
                <span className="bg-background text-gold text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
          <div className="md:hidden bg-card border-t border-border py-2">
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
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img src={HERO_IMG} alt="Шаурма" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              </div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20">
                <div className="max-w-2xl">
                  <p className="font-body text-gold text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in">
                    — Доставка за 40 минут
                  </p>
                  <h1 className="font-display text-6xl sm:text-8xl font-bold leading-none tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                    НАСТОЯЩАЯ<br />
                    <span className="text-gold">ШАУРМА</span>
                  </h1>
                  <p className="font-body text-muted-foreground text-lg leading-relaxed mb-8 max-w-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
                    Мясо на вертеле, свежие овощи, фирменный соус.<br />
                    Без компромиссов, каждый день с 10:00 до 23:00.
                  </p>
                  <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <button
                      onClick={() => setActive("menu")}
                      className="bg-gold text-background font-display font-semibold tracking-widest px-8 py-4 hover:bg-amber-400 transition-colors text-sm uppercase"
                    >
                      Смотреть меню
                    </button>
                    <button
                      onClick={() => setActive("delivery")}
                      className="border border-gold text-gold font-display font-semibold tracking-widest px-8 py-4 hover:bg-gold hover:text-background transition-colors text-sm uppercase"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border-y border-border py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                  { num: "15+", label: "Позиций в меню" },
                  { num: "40 мин", label: "Время доставки" },
                  { num: "с 10:00", label: "Работаем ежедневно" },
                  { num: "100%", label: "Свежие ингредиенты" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-display text-3xl font-bold text-gold mb-1">{s.num}</div>
                    <div className="font-body text-muted-foreground text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Популярное</p>
                  <h2 className="font-display text-4xl font-bold tracking-tight">ТОП ПОЗИЦИЙ</h2>
                </div>
                <button onClick={() => setActive("menu")} className="hidden sm:flex items-center gap-2 text-gold text-sm font-display tracking-wider hover:underline">
                  Всё меню <Icon name="ArrowRight" size={16} />
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {menuItems.filter(i => i.cat === "Шаурма").slice(0, 3).map(item => (
                  <div key={item.id} className="bg-card border border-border hover-lift group overflow-hidden">
                    <div className="h-44 overflow-hidden relative">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-stone-800 flex items-center justify-center">
                          <span className="text-5xl">🌯</span>
                        </div>
                      )}
                      {item.hit && <span className="absolute top-3 right-3 bg-gold text-background text-xs font-display font-bold px-2 py-1 tracking-wider">ХИТ</span>}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-display font-semibold tracking-wide text-foreground">{item.name}</h3>
                        <span className="text-muted-foreground text-xs ml-2 mt-1">{item.weight}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl font-bold text-gold">от {item.price} ₽</span>
                        <button onClick={() => addToCart(item)} className="bg-gold text-background text-sm font-display font-semibold tracking-wider px-4 py-2 hover:bg-amber-400 transition-colors">
                          В КОРЗИНУ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="bg-gold py-14 px-4 text-center cursor-pointer hover:bg-amber-400 transition-colors"
              onClick={() => setActive("promo")}
            >
              <p className="font-display text-background text-3xl sm:text-4xl font-bold tracking-widest uppercase">
                Программа лояльности СВШ Бонус — кэшбек 3% →
              </p>
            </section>
          </div>
        )}

        {/* ======= MENU ======= */}
        {active === "menu" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-10">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Полное меню</p>
              <h2 className="font-display text-5xl font-bold tracking-tight">МЕНЮ</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setMenuCat(c)}
                  className={`font-display text-sm tracking-wider px-5 py-2 border transition-colors ${menuCat === c ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold hover:text-gold"}`}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => (
                <div key={item.id} className="bg-card border border-border hover-lift flex flex-col group overflow-hidden">
                  <div className="h-44 relative overflow-hidden">
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-stone-800 flex items-center justify-center">
                        <span className="text-4xl">{item.cat === "Соусы" ? "🫙" : item.cat === "Фритюр" ? "🍟" : item.cat === "Боксы" ? "📦" : "🌯"}</span>
                      </div>
                    )}
                    {item.hit && <span className="absolute top-3 right-3 bg-gold text-background text-xs font-display font-bold px-2 py-1 tracking-wider">ХИТ ПРОДАЖ</span>}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display font-semibold tracking-wide text-foreground leading-tight">{item.name}</h3>
                      <span className="text-muted-foreground text-xs ml-2 mt-0.5 shrink-0">{item.weight}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{item.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-display text-2xl font-bold text-gold">от {item.price} ₽</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-gold text-background text-sm font-display font-semibold tracking-wider px-4 py-2 hover:bg-amber-400 transition-colors"
                      >
                        + В КОРЗИНУ
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
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Наша история</p>
              <h2 className="font-display text-5xl font-bold tracking-tight">О НАС</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-wide mb-4 text-gold">С 2018 года — без компромиссов</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Мы открылись в 2018 году с одной идеей: делать настоящую шаурму по оригинальным рецептам. Без полуфабрикатов, без заморозки — только свежее мясо на вертеле, отборные овощи и соусы собственного приготовления.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Сегодня у нас три точки в городе и собственная доставка. Каждый день мы готовим свежее мясо и используем только проверенных поставщиков.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Наши мастера прошли обучение на Ближнем Востоке и принесли аутентичные техники приготовления прямо к вашему столу.
                </p>
              </div>
              <div className="relative">
                <img src={MENU_IMG} alt="Наша кухня" className="w-full h-80 object-cover opacity-80" />
                <div className="absolute bottom-4 left-4 bg-gold text-background font-display font-bold px-4 py-2 text-sm tracking-widest">
                  С 2018 ГОДА
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: "Award", title: "Качество", text: "Только свежие продукты от проверенных поставщиков. Мясо поставляется ежедневно." },
                { icon: "Users", title: "Команда", text: "Опытные мастера с международным опытом. Готовим с душой каждый день." },
                { icon: "MapPin", title: "3 точки", text: "Три заведения в городе для вашего удобства. Доставка по всему городу." },
              ].map((v, i) => (
                <div key={i} className="bg-card border border-border p-7">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-4">
                    <Icon name={v.icon as "Award" | "Users" | "MapPin"} size={20} className="text-gold" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-wide mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======= DELIVERY ======= */}
        {active === "delivery" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-12">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Быстро и надёжно</p>
              <h2 className="font-display text-5xl font-bold tracking-tight">ДОСТАВКА</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-wide mb-6 text-gold uppercase">Условия доставки</h3>
                <div className="space-y-4">
                  {[
                    { label: "Время доставки", value: "30–40 минут" },
                    { label: "Минимальный заказ", value: "500 ₽" },
                    { label: "Бесплатная доставка", value: "от 1200 ₽" },
                    { label: "Стоимость доставки", value: "199 ₽" },
                    { label: "Зона доставки", value: "В пределах города" },
                    { label: "Часы работы", value: "Ежедневно 10:00 — 23:00" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground text-sm">{r.label}</span>
                      <span className="font-display font-semibold tracking-wide text-foreground">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border p-8">
                <h3 className="font-display text-xl font-semibold tracking-wide mb-6 uppercase">Оформить заказ</h3>
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-muted-foreground mb-4">Корзина пуста</p>
                    <button
                      onClick={() => setActive("menu")}
                      className="bg-gold text-background font-display font-semibold tracking-wider px-6 py-3 hover:bg-amber-400 transition-colors text-sm uppercase"
                    >
                      Перейти в меню
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-3 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-display text-sm tracking-wide">{item.name}</p>
                            <p className="text-muted-foreground text-xs">{item.price} ₽ × {item.qty}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 border border-border text-foreground hover:border-gold hover:text-gold transition-colors text-xs flex items-center justify-center">−</button>
                            <span className="font-display font-semibold w-4 text-center">{item.qty}</span>
                            <button onClick={() => addToCart(menuItems.find(m => m.id === item.id)!)} className="w-6 h-6 border border-border text-foreground hover:border-gold hover:text-gold transition-colors text-xs flex items-center justify-center">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 mb-4">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Промокод"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value)}
                          className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold text-foreground"
                        />
                        <button onClick={applyPromo} className="border border-gold text-gold font-display text-sm tracking-wider px-4 py-2 hover:bg-gold hover:text-background transition-colors">
                          ОК
                        </button>
                      </div>
                      {promoApplied && <p className="text-green-400 text-xs font-body">Скидка 10% применена!</p>}
                    </div>
                    <div className="mb-4">
                      {discount > 0 && <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Скидка</span><span className="text-green-400">−{discount} ₽</span></div>}
                      <div className="flex justify-between font-display font-bold text-lg">
                        <span>ИТОГО</span>
                        <span className="text-gold">{finalTotal} ₽</span>
                      </div>
                    </div>
                    <input type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-3 py-2 text-sm mb-3 focus:outline-none focus:border-gold text-foreground" />
                    <input type="tel" placeholder="Телефон" className="w-full bg-background border border-border px-3 py-2 text-sm mb-3 focus:outline-none focus:border-gold text-foreground" />
                    <input type="text" placeholder="Адрес доставки" className="w-full bg-background border border-border px-3 py-2 text-sm mb-4 focus:outline-none focus:border-gold text-foreground" />
                    <button onClick={placeOrder} className="w-full bg-gold text-background font-display font-bold tracking-widest py-3 hover:bg-amber-400 transition-colors text-sm uppercase">
                      Оформить заказ
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: "Clock", title: "40 минут", text: "Среднее время доставки" },
                { icon: "Package", title: "Горячая", text: "Упакована в термосумку" },
                { icon: "CreditCard", title: "Онлайн", text: "Оплата картой при оформлении" },
              ].map((f, i) => (
                <div key={i} className="bg-card border border-border p-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon name={f.icon as "Clock" | "Package" | "CreditCard"} size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-display font-semibold tracking-wide">{f.title}</p>
                    <p className="text-muted-foreground text-sm">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======= PROMO ======= */}
        {active === "promo" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
            <div className="mb-12">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Выгодные предложения</p>
              <h2 className="font-display text-5xl font-bold tracking-tight">АКЦИИ</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 mb-16">
              {promos.map(p => (
                <div key={p.id} className={`bg-gradient-to-br ${p.color} border border-border p-8 hover-lift`}>
                  <div className="inline-block border border-gold text-gold font-display text-xs tracking-[0.2em] px-3 py-1 mb-4">{p.badge}</div>
                  <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">{p.tag}</p>
                  <h3 className="font-display text-3xl font-bold tracking-tight mb-3">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border p-8">
              <h3 className="font-display text-2xl font-semibold tracking-wide mb-6 uppercase">Промокоды</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { code: "ПЕРВЫЙ15", desc: "Скидка 15% на первый заказ", valid: "Бессрочно" },
                  { code: "СВШ3", desc: "Кэшбек 3% за регистрацию в программе лояльности", valid: "Постоянно" },
                ].map((pc, i) => (
                  <div key={i} className="border border-border p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display font-bold text-gold tracking-widest text-lg">{pc.code}</p>
                      <p className="text-muted-foreground text-sm">{pc.desc}</p>
                      <p className="text-muted-foreground text-xs mt-1">Действует: {pc.valid}</p>
                    </div>
                    <button
                      onClick={() => { setPromoCode(pc.code); setActive("delivery"); }}
                      className="border border-gold text-gold font-display text-xs tracking-wider px-3 py-2 hover:bg-gold hover:text-background transition-colors shrink-0 uppercase"
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
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Мы рядом</p>
              <h2 className="font-display text-5xl font-bold tracking-tight">КОНТАКТЫ</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-4">
                {[
                  { icon: "Mail", label: "Email", value: "info@svsh.info", sub: "Ответим в течение дня" },
                  { icon: "MapPin", label: "Юридический адрес", value: "г. Москва, ул. Малая Тульская, д. 16, пом. 1Б/1", sub: "ООО «СВШ» · ИНН 7105051710" },
                  { icon: "Globe", label: "Сайт", value: "свш.рф", sub: "Федеральная сеть кафе" },
                  { icon: "Building2", label: "ОГРН", value: "1177154017260", sub: "Зарегистрирована в 2017 году" },
                ].map((c, i) => (
                  <div key={i} className="bg-card border border-border p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                      <Icon name={c.icon as "Mail" | "MapPin" | "Globe" | "Building2"} size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">{c.label}</p>
                      <p className="font-display font-semibold tracking-wide">{c.value}</p>
                      <p className="text-muted-foreground text-xs">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border p-8">
                <h3 className="font-display text-xl font-semibold tracking-wide mb-6 uppercase">Написать нам</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Ваше имя" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors" />
                  <input type="tel" placeholder="Телефон" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors" />
                  <input type="email" placeholder="Email" className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors" />
                  <textarea placeholder="Ваше сообщение" rows={4} className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold text-foreground transition-colors resize-none" />
                  <button className="w-full bg-gold text-background font-display font-bold tracking-widest py-3 hover:bg-amber-400 transition-colors text-sm uppercase">
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-card border-t border-border py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display text-2xl font-bold tracking-widest text-gold">ШАУР</span>
            <p className="text-muted-foreground text-sm">Настоящая шаурма с 2018 года</p>
            <div className="flex flex-wrap justify-center gap-4">
              {navItems.map(n => (
                <button key={n.id} onClick={() => setActive(n.id)} className="text-muted-foreground hover:text-gold text-xs font-display tracking-wider transition-colors">
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border mt-6 pt-6 text-center text-muted-foreground text-xs space-y-1">
            <p>ООО «СВШ» · ИНН 7105051710 · ОГРН 1177154017260</p>
            <p>115191, г. Москва, ул. Малая Тульская, д. 16, пом. 1Б/1 · info@svsh.info</p>
            <p className="mt-2">© 2024 СВШ — Самая вкусная шаурма. Федеральная сеть кафе быстрого питания.</p>
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative bg-card w-full max-w-md h-full flex flex-col border-l border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-display text-xl font-bold tracking-wide uppercase">Корзина</h3>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="text-muted-foreground">Корзина пуста</p>
                  <button onClick={() => { setActive("menu"); setCartOpen(false); }} className="mt-4 text-gold font-display text-sm tracking-wider hover:underline">
                    Перейти в меню →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border">
                      <div className="flex-1">
                        <p className="font-display text-sm tracking-wide">{item.name}</p>
                        <p className="text-gold text-sm font-semibold">{item.price * item.qty} ₽</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 border border-border hover:border-gold text-foreground flex items-center justify-center text-sm transition-colors">−</button>
                        <span className="font-display font-bold w-4 text-center">{item.qty}</span>
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
                  <input
                    type="text"
                    placeholder="Промокод"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold text-foreground"
                  />
                  <button onClick={applyPromo} className="border border-gold text-gold font-display text-sm tracking-wider px-4 py-2 hover:bg-gold hover:text-background transition-colors">ОК</button>
                </div>
                {promoApplied && <p className="text-green-400 text-xs mb-3">Скидка 10% применена!</p>}
                {discount > 0 && <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Скидка</span><span className="text-green-400">−{discount} ₽</span></div>}
                <div className="flex justify-between font-display font-bold text-xl mb-4">
                  <span>ИТОГО</span>
                  <span className="text-gold">{finalTotal} ₽</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); setActive("delivery"); }}
                  className="w-full bg-gold text-background font-display font-bold tracking-widest py-3 hover:bg-amber-400 transition-colors text-sm uppercase"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDER SUCCESS TOAST */}
      {orderPlaced && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gold text-background font-display font-bold tracking-wider px-8 py-4 text-sm uppercase shadow-2xl animate-fade-in">
          ✓ Заказ принят! Ожидайте звонка
        </div>
      )}
    </div>
  );
}