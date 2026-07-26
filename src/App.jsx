import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';

function App() {
  const [ currentUser, setCurrentUser ] = useState({
    username: "test",
    preferences: []
  });

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>
        
        <Route 
          path="/signup"
          element={<Signup />}
        />
        
        <Route 
          path="/login"
          element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser}/>}
        />
        
        <Route
          path="/"
          element={<Books currentUser={currentUser}/>}
        />
          
        <Route
          path="/contact"
          element={<Contact />}
        />
      
      </Routes>
    
    </BrowserRouter>
  
  );
}
export default App;