import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookDetails from "./pages/BookDetails";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const [currentUser, setCurrentUser] = useState({
    username: "",
    preferences: []
  });

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails currentUser={currentUser}/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
