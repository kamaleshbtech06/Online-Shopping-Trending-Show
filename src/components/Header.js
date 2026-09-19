import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { AnnouncementBar } from "./MarketingToast";
import "./Header.css";

function Header() {
  const { count, rewardPoints } = useCart();
  const { ids } = useWishlist();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const links = [
    { to: "/", label: "Shop" },
    { to: "/dress-show", label: "Dress Show 👗" },
    { to: "/orders", label: "My Orders 📦" },
    { to: "/about", label: "About" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : "/");
    setOpen(false);
  };

  return (
    <>
      <AnnouncementBar />
      <header className="site-header">
        <div className="container site-header__row">
          <Link to="/" className="site-header__mark">
            Trending<span>Show</span>
          </Link>

          <form className="site-header__search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search dresses, linen, ceramics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>

          <nav className={`site-header__nav ${open ? "is-open" : ""}`}>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  "site-header__link" + (isActive ? " is-active" : "")
                }
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link to="/orders" className="site-header__points" title="Your reward eco-points">
              🪙 <span>{rewardPoints} pts</span>
            </Link>

            <Link to="/wishlist" className="site-header__cart">
              Saved
              <span className="site-header__count">{ids.length}</span>
            </Link>

            <Link to="/cart" className="site-header__cart site-header__cart--main">
              Cart
              <span className="site-header__count">{count}</span>
            </Link>

            <button
              className="site-header__toggle"
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
