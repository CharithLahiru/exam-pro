import "./Welcome.css";

const welcome = () => {
  return (
    <section className="hero-section">
      <div className="hero-text">
        <h1 className="hero-title">Welcome to ExamPro! 🎯</h1>
        <p className="hero-subtitle">
          Master Your Skills, Boost Your Confidence
        </p>
        <p className="hero-description">
          Get ready to excel with our comprehensive exam preparation platform.
          Select your exam level, subject, and question type to begin solving
          real exam-style multiple-choice problems tailored to your needs.
        </p>
        <a href="#categories" className="btn-primary">
          Start Learning Now
        </a>
      </div>
      <div className="hero-image">
        <div className="placeholder-content">
          <div className="placeholder-icon">📊</div>
          <h3>Interactive Learning Dashboard</h3>
          <p>
            Track your progress, analyze performance, and identify areas for
            improvement with our advanced analytics.
          </p>
        </div>
      </div>
    </section>
  );
};

export default welcome;
