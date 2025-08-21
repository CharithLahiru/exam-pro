const SearchBar = () => {
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search for courses, topics, practice tests... "
        ></input>
        <div className="search-icon">🔍</div>
      </div>
    </div>
  );
};

export default SearchBar;
