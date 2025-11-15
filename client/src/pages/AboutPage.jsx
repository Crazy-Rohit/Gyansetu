import '../styles/about.css';

export default function AboutPage() {
  return (
    <section className="about-page">
      <div className="gs-container">
        <h1>About Gyan Setu</h1>
        <p className="about-intro">
          Gyan Setu is a focused coaching center for Class 9 and 10 Mathematics based on the NCERT syllabus.
          Our aim is to build strong conceptual understanding so that students feel confident, not fearful, of Maths.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h2>Our Approach</h2>
            <p>
              We break each chapter into simple steps – concept explanation, examples, practice questions, and tests.
              Students are encouraged to ask doubts freely and revise regularly.
            </p>
          </div>

          <div className="about-card">
            <h2>What Students Get</h2>
            <ul>
              <li>Structured lecture flow for each chapter</li>
              <li>Notes designed for quick revision</li>
              <li>Chapter-wise and full syllabus tests</li>
              <li>Guidance for board exam preparation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
