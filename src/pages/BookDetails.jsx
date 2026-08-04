import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
const url = "http://localhost:5000/"

function BookDetails(props) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [description, setDescription] = useState("");
  
  useEffect(() => {
    axios.get(url + "book/" + id)
      .then(( data ) => {
        if (!data.data) throw new Error("Book not found");
        setBook(data.data);
        axios.get(url + "reviews/" + id)
          .then(( data ) => {
            setReviews(data.data.reviews);
            const userReview = data.data.reviews.filter((review) => {
              return review.author_id === props.currentUser.username;
            });
            setRating( userReview.length === 1 ? userReview[0].rating : 0 /*Number(localStorage.getItem(`book-rating-${id}`)) || 0*/);
          });

        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!rating || !description.trim()) {
      setMessage("Choose a rating and write a review first.");
      return;
      
    }

    const newReview = {
      rating: rating,
      description: description.trim(),
      author_id: props.currentUser.username,
      book_id: id
    };

    const response = await axios.post(url + "reviews", newReview);
    const newReviews = await axios.get(url + "reviews/" + id );

    setReviews(newReviews.data.reviews);
    setRating(0);
    setDescription("");
    setMessage("Your review was posted.");
  };

  if (status === "loading") return <main className="state-message detail-state">Finding your book…</main>;
  if (status === "error") return <main className="state-message detail-state"><h1>Book not found</h1><Link to="/">Return to the collection</Link></main>;

  return (
    <main className="detail-page">
      <Link className="back-link" to="/">← Back to all books</Link>
      <section className="book-detail">
        <div className="detail-cover"><img src={book.cover_img} alt={`${book.title} book cover`} /></div>
        <div className="detail-copy">
          <p className="eyebrow">{book.genre} · {book.year}</p>
          <h1>{book.title}</h1>
          <p className="byline">by {book.author}</p>
          <p className="description">{book.description}</p>
            <div className="average"><strong>{book.rating}</strong><span>reader average</span></div>
          <p className="save-message" aria-live="polite">{message || "Choose a star to rate this book."}</p>
        </div>
      </section>
      <section className="reviews" aria-labelledby="reviews-title">
        <div className="section-title"><p className="eyebrow">Reader notes</p><h2 id="reviews-title">What people are saying</h2></div>
        
        {props.currentUser.username !== "" ? (
          <form className="review-form" onSubmit={submitReview}>
            <label>Your rating</label>
            <StarRating value={rating} onChange={setRating} label={`Your rating for ${book.title}`} />
            <label htmlFor="review-description">Your review</label>
            <textarea id="review-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength="2000" required />
            <button type="submit">Post review</button>
            <p className="save-message" aria-live="polite">{message}</p>
          </form>
        ) : <p className="signin-prompt"><Link to="/login">Sign in</Link> to write a review.</p>}
        
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.review_id}>
              <StarRating value={review.rating} readOnly label={`${review.author_id}'s rating`} />
              <blockquote>“{review.description}”</blockquote><p>{review.author_id}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BookDetails;
