import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
const url = "http://localhost:5000/"

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios.get(url + "books")
      .then(({ data }) => { setBooks(data); setStatus("ready"); })
      .catch(() => setStatus("error"));
  }, []);

  const genres = useMemo(() => ["All", ...new Set(books.map((book) => book.genre))], [books]);
  const filteredBooks = books.filter((book) => {
    const query = search.trim().toLowerCase();
    return (filter === "All" || book.genre === filter)
      && [book.title, book.author, book.genre].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <main className="books-page">
      <section className="hero-section">
        <p className="eyebrow">Online Book Catalog</p>
        <h1>Popular Books</h1>
        <p className="hero-copy">Search for a book, filter by genre, and click a card to read reviews.</p>
      </section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="collection-heading">
          <div><p className="eyebrow">Book List</p><h2 id="collection-title">All Books</h2></div>
          <p>{filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}</p>
        </div>
        <div className="toolbar">
          <SearchBar search={search} setSearch={setSearch} />
          <FilterBar filter={filter} setFilter={setFilter} genres={genres} />
        </div>
        {status === "loading" && <p className="state-message">Opening the shelves…</p>}
        {status === "error" && <p className="state-message">The books could not be loaded. Please refresh the page.</p>}
        {status === "ready" && filteredBooks.length === 0 && <p className="state-message">No books match that search.</p>}
        <div className="book-container">{filteredBooks.map((book) => <BookCard key={book.book_id} book={book} />)}</div>
      </section>
    </main>
  );
}

export default Books;
