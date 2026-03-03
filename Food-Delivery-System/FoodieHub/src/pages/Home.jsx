import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiStar, FiShield, FiTruck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CUISINES = [
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍔', label: 'Burgers' },
  { emoji: '🍜', label: 'Chinese' },
  { emoji: '🍛', label: 'Indian' },
  { emoji: '🌮', label: 'Mexican' },
  { emoji: '🍣', label: 'Sushi' },
  { emoji: '🥗', label: 'Healthy' },
  { emoji: '🍰', label: 'Desserts' },
];

const HOW_IT_WORKS = [
  { step: '01', emoji: '🔍', title: 'Browse Restaurants', desc: 'Explore hundreds of local restaurants and filter by cuisine, rating, or distance.' },
  { step: '02', emoji: '🛒', title: 'Place Your Order',   desc: 'Add items to your cart, choose delivery time, and pay securely via Razorpay.' },
  { step: '03', emoji: '🚀', title: 'Fast Delivery',      desc: 'Track your order in real-time and enjoy fresh food delivered to your door.' },
];

const FEATURES = [
  { icon: FiTruck,  color: 'bg-blue-50 text-blue-600',    title: 'Express Delivery',    desc: 'Hot and fresh in under 30 minutes, guaranteed.' },
  { icon: FiStar,   color: 'bg-amber-50 text-amber-600',  title: 'Top Restaurants',     desc: 'Only top-rated restaurants with verified reviews.' },
  { icon: FiShield, color: 'bg-green-50 text-green-600',  title: 'Secure Payments',     desc: 'UPI, cards & net banking via Razorpay — 100% safe.' },
  { icon: FiClock,  color: 'bg-purple-50 text-purple-600', title: 'Schedule Orders',    desc: 'Plan ahead and schedule delivery for any time.' },
];

const STATS = [
  { value: '50K+',   label: 'Happy Customers', emoji: '😊' },
  { value: '100+',   label: 'Restaurants',     emoji: '🍽️' },
  { value: '30 min', label: 'Avg. Delivery',   emoji: '⚡' },
  { value: '4.8★',   label: 'Average Rating',  emoji: '⭐' },
];

const Home = () => {
  const { isAuthenticated, isCustomer } = useAuth();

  return (
    <main className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-amber-600">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />
        {/* Decorative blobs */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />

        {/* Floating food emojis */}
        <span className="absolute right-[12%] top-[15%] hidden animate-float select-none text-7xl opacity-25 lg:block">🍕</span>
        <span className="absolute right-[6%] top-[52%] hidden animate-float select-none text-6xl opacity-20 delay-300 lg:block">🥗</span>
        <span className="absolute bottom-[15%] right-[22%] hidden animate-float select-none text-5xl opacity-20 delay-500 lg:block">🍜</span>
        <span className="absolute right-[35%] top-[20%] hidden animate-float select-none text-4xl opacity-15 delay-200 lg:block">🌮</span>

        <div className="relative mx-auto max-w-7xl px-6 py-28">
          <div className="max-w-2xl animate-slide-up">
            {/* Badge */}
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              🎉 Free delivery on your first order
            </span>

            <h1 className="mt-2 text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              Food you love,<br />
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                delivered fast
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-primary-100">
              Hundreds of restaurants, live order tracking, and payments that just work — all in one beautiful app.
            </p>

            {/* CTA row */}
            <div className="mt-9 flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn-white gap-2 !px-7 !py-3.5 text-base shadow-primary">
                    Order Now <FiArrowRight />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/50 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </>
              ) : isCustomer ? (
                <Link to="/customer/restaurants" className="btn-white gap-2 !px-7 !py-3.5 text-base shadow-primary">
                  Browse Restaurants <FiArrowRight />
                </Link>
              ) : (
                <Link to="/restaurant/dashboard" className="btn-white gap-2 !px-7 !py-3.5 text-base shadow-primary">
                  Go to Dashboard <FiArrowRight />
                </Link>
              )}
            </div>

            {/* Trust row */}
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-primary-200">
              <span>✓ No hidden fees</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Secure checkout</span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 56L1440 56L1440 20C1200 52 960 8 720 20C480 32 240 4 0 20L0 56Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-card md:grid-cols-4">
            {STATS.map(({ value, label, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-white px-6 py-6 text-center">
                <span className="text-2xl">{emoji}</span>
                <span className="text-2xl font-extrabold text-primary-600">{value}</span>
                <span className="text-xs font-medium text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cuisine Categories ────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-2 text-center text-3xl font-extrabold text-slate-900">What are you craving?</h2>
          <p className="mb-8 text-center text-slate-500">Pick a cuisine and we'll find the best spots near you</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CUISINES.map(({ emoji, label }) => (
              <Link
                key={label}
                to={isAuthenticated ? '/customer/restaurants' : '/register'}
                className="pill group !rounded-2xl !px-5 !py-3 text-base"
              >
                <span className="text-xl transition-transform duration-150 group-hover:scale-125">{emoji}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-2 text-center text-3xl font-extrabold text-slate-900">How FoodieHub works</h2>
          <p className="mb-14 text-center text-slate-500">From browsing to your doorstep in three simple steps</p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, emoji, title, desc }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute top-10 left-1/2 hidden h-0.5 w-full translate-x-10 bg-gradient-to-r from-primary-200 to-transparent md:block" />
                )}
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-4xl shadow-sm ring-4 ring-primary-100">
                  {emoji}
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-[10px] font-extrabold text-white shadow">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-2 text-center text-3xl font-extrabold text-slate-900">Why choose FoodieHub?</h2>
          <p className="mb-12 text-center text-slate-500">Everything you need for a great food delivery experience</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card-hover group flex flex-col gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${color}`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-slate-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-amber-500 px-10 py-14 text-center shadow-primary">
              <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />
              <div className="relative">
                <span className="mb-4 inline-block animate-bounce-gentle text-5xl">🍔</span>
                <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                  Ready to satisfy your cravings?
                </h2>
                <p className="mt-3 text-primary-100">Join 50,000+ happy customers. Sign up free — no credit card needed.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link to="/register" className="btn-white gap-2 !px-8 !py-3.5 text-base shadow-primary">
                    Get Started Free <FiArrowRight />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/50 px-8 py-3.5 text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-lg font-bold text-primary-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm text-white">🍔</span>
              FoodieHub
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} FoodieHub. Bringing delicious food to your door.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <span className="cursor-pointer hover:text-slate-700">Privacy</span>
              <span className="cursor-pointer hover:text-slate-700">Terms</span>
              <span className="cursor-pointer hover:text-slate-700">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
