import { Link } from "react-router-dom";
import StarRating from "./StarRating";

function BookCard({ book }) {
  const bookUrl = `/books/${book.id}`;

  return (
    <article className="book-card">
      <Link className="book-card-cover-link" to={bookUrl}>
        <div className="cover-wrap">
          <img src={book.cover} alt={`${book.title} book cover`} loading="lazy" />
          <span className="genre-pill">{book.genre}</span>
        </div>
      </Link>

      <div className="book-card-copy">
        <div className="book-card-heading">
          <h2><Link to={bookUrl}>{book.title}</Link></h2>
          <p>by {book.author}</p>
        </div>

        <div className="card-rating">
          <StarRating value={book.rating} readOnly label={`${book.title} rating`} />
          <strong>{book.rating.toFixed(1)}</strong>
        </div>

        <Link className="book-card-link" to={bookUrl}>View Book</Link>
      </div>
    </article>
  );
}

export default BookCard;
