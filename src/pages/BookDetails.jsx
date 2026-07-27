import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/books.json")
      .then(({ data }) => {
        const match = data.find((item) => item.id === id);
        if (!match) throw new Error("Book not found");
        setBook(match);
        setRating(Number(localStorage.getItem(`book-rating-${id}`)) || 0);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  const updateRating = (nextRating) => {
    setRating(nextRating);
    localStorage.setItem(`book-rating-${id}`, nextRating);
    setMessage(`Saved! You rated this book ${nextRating} out of 5.`);
  };

  if (status === "loading") return <main className="state-message detail-state">Finding your book…</main>;
  if (status === "error") return <main className="state-message detail-state"><h1>Book not found</h1><Link to="/">Return to the collection</Link></main>;

  return (
    <main className="detail-page">
      <Link className="back-link" to="/">← Back to all books</Link>
      <section className="book-detail">
        <div className="detail-cover"><img src={book.cover} alt={`${book.title} book cover`} /></div>
        <div className="detail-copy">
          <p className="eyebrow">{book.genre} · {book.year}</p>
          <h1>{book.title}</h1>
          <p className="byline">by {book.author}</p>
          <p className="description">{book.description}</p>
          <div className="rating-panel">
            <div><p>Your rating</p><StarRating value={rating} onChange={updateRating} label={`Your rating for ${book.title}`} /></div>
            <div className="average"><strong>{book.rating.toFixed(1)}</strong><span>reader average</span></div>
          </div>
          <p className="save-message" aria-live="polite">{message || "Choose a star to rate this book."}</p>
        </div>
      </section>
      <section className="reviews" aria-labelledby="reviews-title">
        <div className="section-title"><p className="eyebrow">Reader notes</p><h2 id="reviews-title">What people are saying</h2></div>
        <div className="review-grid">
          {book.reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <StarRating value={review.rating} readOnly label={`${review.name}'s rating`} />
              <blockquote>“{review.text}”</blockquote><p>{review.name}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BookDetails;