import "./Categories.css";
const Categories = () => {
  return (
    <section className="categories-section" id="categories">
      <h2 className="section-title">🎯 Explore by Category</h2>
      <div className="categories-grid">
        <div className="category-card">
          {" "}
          {/* onClick={() => navigateToCategory("AL")} */}
          <div className="category-icon">AL</div>
          <h3 className="category-title">Advanced Level (A/L)</h3>
          <p className="category-description">
            Comprehensive A/L preparation with past papers, model questions, and
            expert guidance for all subjects including Maths, Science, and
            Commerce streams.
          </p>
          <div className="btn-secondary">Explore A/L Resources</div>
        </div>
        <div className="category-card">
          <div className="category-icon">OL</div>{" "}
          {/* onClick={() => navigateToCategory("OL")} */}
          <h3 className="category-title">Ordinary Level (O/L)</h3>
          <p className="category-description">
            Master your O/L subjects with interactive practice tests, detailed
            explanations, and progress tracking across all core subjects.
          </p>
          <div className="btn-secondary">Explore O/L Resources</div>
        </div>
        <div className="category-card">
          {" "}
          {/* onClick={() => navigateToCategory("Grade5")} */}
          <div className="category-icon">G5</div>
          <h3 className="category-title">Grade 5 Scholarship</h3>
          <p className="category-description">
            Specialized preparation for Grade 5 Scholarship examination with
            age-appropriate content, practice tests, and performance analytics.
          </p>
          <div className="btn-secondary">Explore Grade 5 Resources</div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
