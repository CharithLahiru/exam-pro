import "./stats.css";
const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">50K+</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1M+</div>
          <div className="stat-label">Questions Solved</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">95%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support Available</div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
