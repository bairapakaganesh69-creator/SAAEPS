import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Compass,
  GraduationCap,
  Layers3,
  Menu,
  ScanSearch,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import "./LandingPage.css";

const features = [
  {
    number: "01",
    icon: BookOpen,
    title: "Practice with purpose",
    description:
      "Build exam readiness through mock tests and subject-based practice.",
    tone: "blue",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Understand your progress",
    description:
      "Review performance insights and see where your preparation is moving.",
    tone: "mint",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "Get focused support",
    description:
      "Use AI-powered academic assistance to make challenging topics easier to approach.",
    tone: "violet",
  },
  {
    number: "04",
    icon: Target,
    title: "Plan the next step",
    description:
      "Turn your study goals into a clearer, more manageable preparation routine.",
    tone: "gold",
  },
];

const steps = [
  ["01", "Register", "Create your student account and set up your learning space."],
  ["02", "Take an assessment", "Practice with a mock test or explore your subjects."],
  ["03", "Review your progress", "Use performance insights to understand what needs attention."],
  ["04", "Get guidance", "Explore study planning and AI-powered academic support."],
  ["05", "Keep improving", "Return to practice with a clearer focus for what comes next."],
];

const learningStages = [
  ["Assess", "Practice with purpose", BookOpen],
  ["Analyze", "See what needs focus", ScanSearch],
  ["Plan", "Choose your next step", Target],
  ["Learn", "Get academic support", BrainCircuit],
  ["Improve", "Build steady progress", ArrowUpRight],
];

function Brand({ footer = false }) {
  return (
    <Link
      className={`saaeps-brand${footer ? " saaeps-brand--footer" : ""}`}
      to="/"
      aria-label="SAAEPS home"
    >
      <span className="saeeps-brand__mark" aria-hidden="true">
        <GraduationCap className="saeeps-brand__cap" />
        <Sparkles className="saeeps-brand__spark" />
      </span>
      <span className="saeeps-brand__word">SAAEPS</span>
    </Link>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <div className="landing-nav__inner">
          <Brand />

          <button
            className="landing-nav__toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <nav
            className={`landing-nav__links${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <Link to="/subjects" onClick={closeMenu}>Resources</Link>
            <a href="#approach" onClick={closeMenu}>About</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <div className="landing-nav__mobile-actions">
              <Link className="button button--quiet" to="/login" onClick={closeMenu}>Log in</Link>
              <Link className="button button--nav-cta" to="/register" onClick={closeMenu}>
                Get started <ArrowRight size={16} />
              </Link>
            </div>
          </nav>

          <div className="landing-nav__actions">
            <Link className="landing-nav__login" to="/login">Log in</Link>
            <Link className="button button--nav-cta" to="/register">
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow__spark"><Sparkles size={13} /></span>
              A clearer path to exam readiness
            </p>
            <h1>
              Study smarter.
              <span>Prepare for exams.</span>
            </h1>
            <p className="hero__description">
              SAAEPS brings exam practice, performance insights, personalized
              study planning, and AI-powered academic assistance together in
              one place.
            </p>
            <div className="hero__actions">
              <Link className="button button--hero-primary" to="/register">
                Get started <ArrowRight size={17} />
              </Link>
              <a className="button button--hero-secondary" href="#features">
                Explore features <ArrowDown size={16} />
              </a>
            </div>
            <div className="hero__note">
              <span className="hero__note-icon"><Check size={14} /></span>
              <span>Made for semester exams and competitive exam preparation</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Illustration of the SAAEPS learning workspace">
            <div className="hero-art__orbit hero-art__orbit--one" />
            <div className="hero-art__orbit hero-art__orbit--two" />
            <div className="hero-art__compass" aria-hidden="true">
              <div className="hero-art__compass-ring">
                <Compass size={88} strokeWidth={1.15} />
                <span className="hero-art__compass-center"><Sparkles size={19} /></span>
              </div>
            </div>
            <div className="study-card">
              <div className="study-card__topline">
                <div>
                  <span className="study-card__overline">YOUR LEARNING SPACE</span>
                  <h2>A little progress, every day.</h2>
                </div>
                <span className="study-card__badge"><Sparkles size={14} /> SAAEPS</span>
              </div>
              <div className="study-card__rule" />
              <div className="study-card__focus">
                <div className="study-card__focus-icon"><Layers3 size={19} /></div>
                <div>
                  <span className="study-card__label">YOUR NEXT FOCUS</span>
                  <strong>Practice <span>·</span> Review <span>·</span> Plan</strong>
                </div>
                <ChevronRight size={18} />
              </div>
              <div className="study-card__path" aria-hidden="true">
                <span className="study-card__path-line" />
                {learningStages.map(([title, , Icon], index) => (
                  <span className={`study-card__path-step${index === 2 ? " is-current" : ""}`} key={title}>
                    <Icon size={15} />
                  </span>
                ))}
              </div>
              <div className="study-card__path-labels">
                <span>Practice</span><span>Understand</span><span>Move forward</span>
              </div>
            </div>
            <div className="hero-float hero-float--top">
              <span className="hero-float__icon hero-float__icon--mint"><BrainCircuit size={17} /></span>
              <span><small>ACADEMIC SUPPORT</small><strong>Guidance that fits you</strong></span>
            </div>
            <div className="hero-float hero-float--bottom">
              <span className="hero-float__icon hero-float__icon--gold"><Target size={17} /></span>
              <span><small>YOUR NEXT STEP</small><strong>One topic at a time</strong></span>
            </div>
          </div>
        </div>
        <div className="hero__bottomline" aria-hidden="true">
          <span>LEARN WITH DIRECTION</span><span /><span>PREPARE WITH PURPOSE</span>
        </div>
      </section>

      <section className="features section-pad" id="features">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow__dash" /> THE SAAEPS TOOLKIT</p>
            <h2>Everything you need to<br />prepare with <em>purpose.</em></h2>
          </div>
          <p className="section-heading__aside">
            Practical tools for the full study cycle, from your first practice
            session to your next focused study plan.
          </p>
        </div>
        <div className="feature-grid">
          {features.map(({ number, icon: Icon, title, description, tone }) => (
            <article className="feature-card" key={number}>
              <div className="feature-card__top">
                <span className={`feature-card__icon feature-card__icon--${tone}`}><Icon size={21} /></span>
                <span className="feature-card__number">{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className={`feature-card__line feature-card__line--${tone}`} />
            </article>
          ))}
        </div>
        <div className="features__more">
          <span>Also in your learning space</span>
          <Link to="/subjects">Subjects &amp; resources <ArrowUpRight size={15} /></Link>
          <Link to="/tests">Mock tests <ArrowUpRight size={15} /></Link>
          <Link to="/performance">Performance insights <ArrowUpRight size={15} /></Link>
        </div>
      </section>

      <section className="how section-pad" id="how-it-works">
        <div className="how__intro">
          <p className="eyebrow eyebrow--light"><span className="eyebrow__dash" /> YOUR PREPARATION, IN MOTION</p>
          <h2>Five steps.<br /><em>One stronger you.</em></h2>
          <p>Small, thoughtful steps can make a big syllabus feel more manageable.</p>
          <Link className="text-link text-link--light" to="/register">
            Start your journey <ArrowRight size={16} />
          </Link>
          <div className="how__index" aria-hidden="true">01 <span>—</span> 05</div>
        </div>
        <div className="steps-list">
          {steps.map(([number, title, description]) => (
            <article className="step-row" key={number}>
              <span className="step-row__number">{number}</span>
              <div className="step-row__copy">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight className="step-row__arrow" size={18} />
            </article>
          ))}
        </div>
      </section>

      <section className="approach section-pad" id="approach">
        <div className="approach__heading">
          <p className="eyebrow"><span className="eyebrow__dash" /> A BETTER STUDY RHYTHM</p>
          <h2>Assess. Analyze. Plan.<br /><em>Learn. Improve.</em></h2>
          <p>Technology supports your journey. You stay in control of it.</p>
        </div>
        <div className="workflow" aria-label="SAAEPS learning workflow">
          {learningStages.map(([title, description, Icon], index) => (
            <div className="workflow__item" key={title}>
              <div className={`workflow__icon workflow__icon--${index + 1}`}><Icon size={22} /></div>
              <span className="workflow__number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              {index < learningStages.length - 1 && <ArrowRight className="workflow__arrow" size={16} />}
            </div>
          ))}
        </div>
        <div className="approach__note">
          <span className="approach__note-icon"><Sparkles size={18} /></span>
          <p><strong>Personalized support, grounded in your progress.</strong> SAAEPS brings practice, performance insights, and AI assistance together to help you choose a useful next step.</p>
        </div>
      </section>

      <section className="proof-strip" aria-label="What SAAEPS brings together">
        <div className="proof-strip__inner">
          <div className="proof-strip__lead">
            <span className="proof-strip__icon"><GraduationCap size={22} /></span>
            <span>Built around the way students prepare</span>
          </div>
          <div className="proof-strip__item"><Check size={15} /> Semester exam preparation</div>
          <div className="proof-strip__item"><Check size={15} /> Competitive exam practice</div>
          <div className="proof-strip__item"><Check size={15} /> A more personal study routine</div>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="final-cta__pattern" aria-hidden="true" />
        <div className="final-cta__content">
          <span className="final-cta__icon"><Compass size={25} /></span>
          <p className="eyebrow eyebrow--light">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2>Ready to prepare<br /><em>with more direction?</em></h2>
          <p>Start your academic preparation journey with SAAEPS.</p>
          <Link className="button button--hero-primary" to="/register">
            Get started now <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer__main">
          <div className="landing-footer__brand">
            <Brand footer />
            <p>Smart Academic Assistance &amp;<br />Exam Preparation System</p>
          </div>
          <div className="landing-footer__nav">
            <div>
              <span className="landing-footer__label">EXPLORE</span>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <Link to="/subjects">Subjects &amp; resources</Link>
            </div>
            <div>
              <span className="landing-footer__label">YOUR ACCOUNT</span>
              <Link to="/login">Log in</Link>
              <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
        <div className="landing-footer__bottom">
          <span>© {new Date().getFullYear()} SAAEPS. All rights reserved.</span>
          <a href="#home">Back to top <ArrowUpRight size={14} /></a>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;