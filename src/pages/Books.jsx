import { useState } from "react";
import BookCard from "../components/BookCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

function Books( props ) {
  alert(`${props.currentUser.username}, ${props.currentUser.preferences}`);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const books = [
    {
      id: 1,
      title: "Books Coming Soon",
      author: "Unknown Author",
      genre: "Fantasy",
      rating: 4
    },
    {
      id: 2,
      title: "Books Coming Soon",
      author: "Unknown Author",
      genre: "Mystery",
      rating: 5
    },
    {
      id: 3,
      title: "Books Coming Soon",
      author: "Unknown Author",
      genre: "Romance",
      rating: 3
    },
    {
      id: 4,
      title: "Books Coming Soon",
      author: "Unknown Author",
      genre: "Science Fiction",
      rating: 5
    },
    {
      id: 5,
      title: "Books Coming Soon",
      author: "Unknown Author",
      genre: "History",
      rating: 4
    },
    {
      id: 6,
      title: "Books Coming Soon",
      author: "Unknown Author",
      genre: "Adventure",
      rating: 5
    }
  ];

  const filteredBooks = books.filter((book)=>{

        const matchesSearch =
        book.title.toLowerCase()
        .includes(search.toLowerCase()) ||
        book.author.toLowerCase()
        .includes(search.toLowerCase()) ||
        book.genre.toLowerCase()
        .includes(search.toLowerCase());

        const matchesFilter =
        filter === "All" ||
        book.genre === filter;

        return matchesSearch && matchesFilter;
    });


  return (
    <div className="books-page">

      <h1>Online Bookstore</h1>

      <SearchBar 
        search={search}
        setSearch={setSearch}
      />


      <FilterBar
        filter={filter}
        setFilter={setFilter}
      />


      <div className="book-container">
            {
                filteredBooks.map((book)=>(
                    <BookCard 
                    key={book.id}
                    book={book}
                    />
                ))
            }
      </div>

    </div>
  );
}
export default Books;