function FilterBar({ filter, setFilter, genres }) {
  return (
    <label className="filter-field">
      <span>Genre</span>
      <select value={filter} onChange={(event) => setFilter(event.target.value)}>
        {genres.map((genre) => <option key={genre}>{genre}</option>)}
      </select>
    </label>
  );
}

export default FilterBar;
