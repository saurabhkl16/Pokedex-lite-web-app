import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <>
      <nav className="d-flex justify-content-between align-items-center">
        <div className="logo d-flex justify-content-between align-items-center">
          <img
            className="me-2"
            src="https://www.freepnglogos.com/uploads/pokemon-symbol-logo-png-31.png"
            alt="logo"
            height={30}
          />
          <h2 className="fw-bold">Pokedex Lite</h2>
        </div>
        <div className="links d-flex justify-content-between align-items-center">
          <ul className="d-flex justify-content-between align-items-center m-0">
            <li>
              <Link className="link me-3 " to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="link me-3" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
