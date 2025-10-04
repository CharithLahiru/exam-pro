import "./Search-bar.css";
const SearchBar = () => {
  return (
    <>
      <div className="container">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search for courses, topics, or practice tests..."
            ></input>
            <div className="search-icon">🔍</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
