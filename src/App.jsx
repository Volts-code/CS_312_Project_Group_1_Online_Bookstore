import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';

function App() {
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
          element={<Login />}
        />
        
        <Route
          path="/"
          element={<Books />}
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