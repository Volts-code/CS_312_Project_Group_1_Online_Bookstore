function SearchBar({ search, setSearch }) {
  return (
    <label className="search-field">
      <span className="sr-only">Search books</span>
      <span aria-hidden="true">⌕</span>
      <input type="search" placeholder="Search title, author, or genre" value={search}
        onChange={(event) => setSearch(event.target.value)} />
    </label>
  );
}

export default SearchBar;
