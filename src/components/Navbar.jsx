import { Link } from "react-router-dom";

function Navbar(){

  return(
    <nav className="navbar">

      <h2>Books 4 everyone</h2>

      <div className="nav-links">
            <Link to="/">
            Books
            </Link>

            <Link to="/contact">
            Contact
            </Link>

            <Link to="/signup">
            Sign In
            </Link>

            <Link to="/login">
            Log In
            </Link>
      </div>

    </nav>
  );

}
export default Navbar;