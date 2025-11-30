import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useContext, useState } from "react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 🛒 Calculate total cart quantity
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <nav className="bg-gray-800 text-white px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold text-blue-300">
            MyShop
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-gray-200 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Right side */}
        <div className="hidden sm:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium hover:text-blue-300 ${isActive ? "text-blue-400" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `font-medium hover:text-blue-300 ${isActive ? "text-blue-400" : ""}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative font-medium hover:text-blue-300 ${isActive ? "text-blue-400" : ""}`
            }
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-xs rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `font-medium hover:text-blue-300 ${isActive ? "text-blue-400" : ""}`
            }
          >
            Orders
          </NavLink>

          {user ? (
            <>
              <span className="text-sm">Hi, {user?.name || "user"}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-3 space-y-2">
          <NavLink to="/" className="block hover:text-blue-300">
            Home
          </NavLink>
          <NavLink to="/products" className="block hover:text-blue-300">
            Products
          </NavLink>
          <NavLink to="/cart" className="block hover:text-blue-300">
            Cart ({cartCount})
          </NavLink>
          <NavLink to="/order" className="block hover:text-blue-300">
            Orders
          </NavLink>
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}