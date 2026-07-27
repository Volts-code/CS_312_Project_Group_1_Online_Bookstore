function StarRating({ value, onChange, readOnly = false, label = "Rating" }) {
  return (
    <div className={`stars ${readOnly ? "read-only" : ""}`} aria-label={`${label}: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) =>
        readOnly ? (
          <span key={star} className={star <= Math.round(value) ? "filled" : ""}>★</span>
        ) : (
          <button type="button" key={star} className={star <= value ? "filled" : ""}
            onClick={() => onChange(star)} aria-label={`Set rating to ${star} star${star === 1 ? "" : "s"}`}>
            ★
          </button>
        ),
      )}
    </div>
  );
}

export default StarRating;