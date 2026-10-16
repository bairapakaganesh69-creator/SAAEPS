import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  BrainCircuit,
  ChartNoAxesCombined,
  CalendarDays,
  Target,
  CheckCircle2,
  Bell,
  UserRound,
  FileText,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Smart Mock Tests",
    description:
      "Practice with subject-wise and full-length tests to build exam confidence.",
    color: "blue",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Feedback",
    description:
      "Understand your mistakes and get personalized guidance to improve.",
    color: "purple",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Weak Topic Analyzer",
    description:
      "Discover the topics that need attention and focus your preparation.",
    color: "cyan",
  },
  {
    icon: CalendarDays,
    title: "Study Planner",
    description:
      "Organize your preparation with a clear and consistent study plan.",
    color: "pink",
  },
  {
    icon: BookOpen,
    title: "Academic Resources",
    description: "Access quality study materials and notes.",
    color: "orange",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay updated with important alerts.",
    color: "violet",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up and set your goals and preferences.",
    icon: UserRound,
    color: "blue",
  },
  {
    number: "02",
    title: "Practice & Learn",
    description: "Take mock tests and use AI feedback to improve.",
    icon: FileText,
    color: "purple",
  },
  {
    number: "03",
    title: "Achieve Your Goal",
    description:
      "Track progress, fix weak topics and get closer to your dream.",
    icon: ChartNoAxesCombined,
    color: "cyan",
  },
];

function FeatureIcon({ color, children }) {
  const styles = {
    blue: ["bg-blue-100", "bg-blue-500"],
    purple: ["bg-violet-100", "bg-violet-600"],
    cyan: ["bg-teal-100", "bg-teal-500"],
    pink: ["bg-pink-100", "bg-pink-600"],
    orange: ["bg-orange-100", "bg-orange-500"],
    violet: ["bg-indigo-100", "bg-indigo-600"],
  };

  const [ring, fill] = styles[color];

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-full ${ring}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg ${fill}`}
      >
        {children}
      </div>
    </div>
  );
}

/* Hero artwork is now loaded from the public folder. */

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      {/* Soft light behind the illustration */}
      <div className="pointer-events-none absolute inset-[10%] rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-[15%] rounded-full bg-blue-500/30 blur-3xl" />

      {/* Fade the image edges into the hero background */}
      <img
        src="/saaeps-hero-illustration.png"
        alt="SAAEPS dashboard showing mock tests, AI feedback, books, and student performance"
        className="relative block h-auto w-full object-contain"
        style={{
          maskImage:
            "radial-gradient(ellipse 78% 82% at 50% 50%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 82% at 50% 50%, black 55%, transparent 100%)",
        }}
        fetchPriority="high"
      />
    </div>
  );
}


export default function Landing() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800">
      {/* Header */}
      <header className="relative z-30 border-b border-white/10 bg-gradient-to-r from-indigo-950 via-blue-900 to-violet-700 text-white">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            
<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-lg">
  <img
    src="/saaeps-logo.png"
    alt="SAAEPS Knowledge Shield Logo"
    className="h-full w-full object-contain"
  />
</div>


            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                SAAEPS
              </h1>
              <p className="hidden text-[10px] text-blue-100 sm:block sm:text-xs">
                Smart Academic Assistant and Exam Preparation Platform
              </p>
            </div>
          </Link>

          
<div className="hidden items-center gap-7 lg:flex">
  <a
    href="#home"
    onClick={() => setActiveSection("home")}
    className={`border-b-2 pb-2 text-sm font-bold transition ${
      activeSection === "home"
        ? "border-cyan-400 text-cyan-300"
        : "border-transparent text-white hover:text-cyan-300"
    }`}
  >
    Home
  </a>

  <a
    href="#features"
    onClick={() => setActiveSection("features")}
    className={`border-b-2 pb-2 text-sm font-semibold transition ${
      activeSection === "features"
        ? "border-cyan-400 text-cyan-300"
        : "border-transparent text-white hover:text-cyan-300"
    }`}
  >
    Features
  </a>

  <a
    href="#how-it-works"
    onClick={() => setActiveSection("how-it-works")}
    className={`border-b-2 pb-2 text-sm font-semibold transition ${
      activeSection === "how-it-works"
        ? "border-cyan-400 text-cyan-300"
        : "border-transparent text-white hover:text-cyan-300"
    }`}
  >
    How It Works
  </a>

  <a
    href="#about"
    onClick={() => setActiveSection("about")}
    className={`border-b-2 pb-2 text-sm font-semibold transition ${
      activeSection === "about"
        ? "border-cyan-400 text-cyan-300"
        : "border-transparent text-white hover:text-cyan-300"
    }`}
  >
    About
  </a>
</div>


          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              state={{ backgroundLocation: location }}
              className="rounded-full border border-white/80 px-4 py-2.5 text-xs font-bold transition hover:bg-white/10 sm:min-w-24 sm:text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              state={{ backgroundLocation: location }}
              className="rounded-full border border-white/80 bg-transparent px-4 py-2.5 text-xs font-bold text-white shadow-none transition hover:bg-white/10 sm:min-w-24 sm:text-sm"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-800 to-violet-600 text-white"
      >
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="absolute right-1/4 top-12 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_60%,rgba(14,165,233,0.3),transparent_40%)]" />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-10 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-4 lg:px-8 lg:py-8">
          {/* Hero text */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-blue-50 shadow-sm backdrop-blur">
              <Target size={15} className="text-cyan-300" />
              ECET &amp; POLYCET Preparation Platform
            </div>

            <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl xl:text-[58px]">
              Prepare Smarter.
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent">
                Perform Better.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-blue-50 sm:text-base sm:leading-8">
              Make your ECET and POLYCET preparation more organized with mock
              tests, performance insights, AI-powered feedback, and personalized
              study support—all in one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/register"
                state={{ backgroundLocation: location }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-50"
              >
                Get Started <ArrowRight size={17} />
              </Link>
              <Link
                to="/login"
                state={{ backgroundLocation: location }}
                className="inline-flex min-w-36 items-center justify-center rounded-full border border-white/80 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Login
              </Link>
            </div>

            <div className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-white/20">
              <div className="flex items-center gap-2 px-2 first:pl-0">
                <ClipboardCheck
                  size={24}
                  className="shrink-0 text-cyan-300"
                />
                <span className="text-[10px] font-semibold leading-4 sm:text-xs">
                  Expert Designed
                  <br />
                  Question Sets
                </span>
              </div>

              <div className="flex items-center gap-2 px-3">
                <BrainCircuit
                  size={24}
                  className="shrink-0 text-cyan-300"
                />
                <span className="text-[10px] font-semibold leading-4 sm:text-xs">
                  AI Feedback
                  <br />
                  &amp; Guidance
                </span>
              </div>

              <div className="flex items-center gap-2 px-3">
                <ChartNoAxesCombined
                  size={24}
                  className="shrink-0 text-cyan-300"
                />
                <span className="text-[10px] font-semibold leading-4 sm:text-xs">
                  Track Progress
                  <br />
                  &amp; Improve
                </span>
              </div>
            </div>
          </div>

          {/* New hero image */}
          <div className="relative z-10 min-w-0">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 bg-white px-5 py-12 lg:px-8 lg:py-10"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">
            Features
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
            Everything You Need to Succeed
          </h2>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Powerful features designed to make your exam preparation simple,
            smart and effective.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <article
                key={title}
                className="rounded-xl border border-blue-100 bg-white p-4 shadow-[0_3px_12px_rgba(37,99,235,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <FeatureIcon color={color}>
                  <Icon size={23} />
                </FeatureIcon>

                <h3 className="mt-4 text-sm font-extrabold leading-5 text-blue-950">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-gradient-to-b from-blue-50 to-slate-50 px-5 py-12 lg:px-8 lg:py-8"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-600">
            How It Works
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-blue-950">
            Start Your Preparation in 3 Simple Steps
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            From registration to results—we make it easy for you.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {steps.map(({ number, title, description, icon: Icon, color }) => (
              <div key={number} className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : color === "purple"
                        ? "bg-violet-100 text-violet-600"
                        : "bg-teal-100 text-teal-600"
                  }`}
                >
                  <Icon size={28} />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-blue-600">
                    {number}
                  </p>
                  <h3 className="mt-1 text-sm font-extrabold text-blue-950">
                    {title}
                  </h3>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-600">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        id="about"
        className="bg-slate-50 px-5 pb-8 pt-3 lg:px-8"
      >
        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-blue-600 to-violet-600 px-6 py-6 text-center text-white shadow-lg sm:px-8 md:flex-row md:text-left">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
              <Trophy size={29} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold sm:text-xl">
                Ready to Prepare with Purpose?
              </h2>
              <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm">
                Take the next step in your ECET or POLYCET preparation.
              </p>
            </div>
          </div>

          <Link
            to="/register"
            state={{ backgroundLocation: location }}
            className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-cyan-50"
          >
            Get Started <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
