import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink className="brand" to="/">Books for Everyone</NavLink>
      <div className="nav-links">
        <NavLink to="/" end>Books</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
