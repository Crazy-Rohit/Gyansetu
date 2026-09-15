import { Link } from 'react-router-dom';
import '../styles/home.css';
import banner from '../assets/images/banner.png';
import Reveal from '../components/Reveal';
import StatCounter from '../components/StatCounter';
import FeatureIcon from '../components/FeatureIcon';
import TiltCard from '../components/TiltCard';
import { stats, features, steps, testimonials } from '../data/siteContent';
import { getActiveChallenge } from '../data/challengeData';

export default function HomePage() {
  const weeklyChallenge = getActiveChallenge('weekly');

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-dots" aria-hidden="true"></div>

        <div className="gs-container home-hero-inner">
          <div className="home-hero-text">
            <span className="home-tagline home-entrance home-entrance--1">
              <span className="material-symbols-outlined">menu_book</span>
              Class 9 &amp; 10 • NCERT Mathematics
            </span>
            <h1 className="home-entrance home-entrance--2">Master Mathematics with Confidence.</h1>
            <p className="home-entrance home-entrance--3">
              Gyan Setu builds sturdy bridges to mathematical understanding. Free NCERT lectures,
              notes, tests and interactive quizzes — tailored for Class 9 and 10 students.
            </p>
            <div className="home-hero-actions home-entrance home-entrance--4">
              <Link to="/courses" className="gs-btn">
                Start Learning
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <a href="#what-we-offer" className="gs-btn gs-btn--ghost">
                View Syllabus
              </a>
            </div>
          </div>

          <div className="home-hero-image home-entrance home-entrance--3">
            <span className="home-hero-image__layer home-hero-image__layer--1" aria-hidden="true"></span>
            <span className="home-hero-image__layer home-hero-image__layer--2" aria-hidden="true"></span>
            <TiltCard className="home-hero-image__frame" intensity={8}>
              <img src={banner} alt="Gyan Setu - Students learning Mathematics" />
            </TiltCard>
            <span className="home-hero-image__badge">
              <span className="material-symbols-outlined">calculate</span>
            </span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="gs-container home-stats-grid">
          {stats.map((s) => (
            <StatCounter key={s.id} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* THIS WEEK'S CHALLENGE */}
      {weeklyChallenge && (
        <section className="home-challenge">
          <div className="gs-container home-challenge-inner">
            <div className="home-challenge-text">
              <span className="home-tagline">
                <span className="material-symbols-outlined">bolt</span>
                This Week's Challenge
              </span>
              <h2>{weeklyChallenge.title}</h2>
              <p>{weeklyChallenge.description}</p>
            </div>
            <Link to={`/challenges/weekly/${weeklyChallenge.id}/quiz`} className="gs-btn home-challenge-cta">
              Play Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="home-features">
        <div className="gs-container">
          <h2>Why Choose Gyan Setu?</h2>
          <p className="home-section-subtitle">
            Everything you need to build real confidence in Maths — not just marks.
          </p>

          <Reveal className="home-features-grid">
            {features.map((f) => (
              <TiltCard className="feature-card" key={f.id}>
                <div className="feature-card__icon">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="home-classes" id="what-we-offer">
        <div className="gs-container">
          <h2>What We Offer</h2>
          <p className="home-section-subtitle">
            Structured NCERT-based Mathematics videos, notes, tests and quizzes for both Class 9 and Class 10.
          </p>

          <Reveal className="home-class-grid">
            <TiltCard as={Link} to="/courses/class-9" className="home-class-card home-class-card--link">
              <h3>Class 9 Mathematics</h3>
              <p>
                Complete NCERT Maths syllabus with chapter-wise lectures, notes, tests, and book references.
              </p>
              <ul>
                <li>Concept-building lectures</li>
                <li>Handwritten &amp; printed notes</li>
                <li>Chapter-wise tests &amp; quizzes</li>
              </ul>
              <span className="home-card-link">
                Explore Class 9
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </TiltCard>

            <TiltCard as={Link} to="/courses/class-10" className="home-class-card home-class-card--link">
              <h3>Class 10 Mathematics</h3>
              <p>
                Board-focused preparation with NCERT coverage, previous year questions, and extra practice.
              </p>
              <ul>
                <li>Board exam–oriented approach</li>
                <li>Important questions &amp; summaries</li>
                <li>Regular mock tests &amp; quizzes</li>
              </ul>
              <span className="home-card-link">
                Explore Class 10
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-steps">
        <div className="gs-container">
          <h2>How It Works</h2>
          <p className="home-section-subtitle">From enrolling to exam day, here's the journey.</p>

          <Reveal className="home-steps-row">
            {steps.map((s) => (
              <div className="step-card" key={s.id}>
                <span className="step-card__number">{s.number}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="home-testimonials">
        <div className="gs-container">
          <h2>What Students &amp; Parents Say</h2>

          <Reveal className="home-testimonials-grid">
            {testimonials.map((t) => (
              <TiltCard className="testimonial-card" key={t.id}>
                <div className="testimonial-card__stars">★★★★★</div>
                <p className="testimonial-card__quote">"{t.quote}"</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__avatar">
                    {t.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.classLabel}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-cta">
        <div className="gs-container home-cta-inner">
          <h2>Ready to build a strong Maths foundation?</h2>
          <p>Join Gyan Setu today and take the first step towards confident, exam-ready Mathematics.</p>
          <Link to="/courses" className="gs-btn gs-btn--light">View Courses</Link>
        </div>
      </section>
    </div>
  );
}
