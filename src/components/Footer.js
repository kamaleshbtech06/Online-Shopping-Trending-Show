import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__row">
        <div>
          <div className="site-footer__mark">
            Trending<span>Show</span>
          </div>
          <p className="site-footer__byline">
            Small-batch dresses, organic apparel, and handcrafted home goods from independent artisans.
          </p>
        </div>

        <nav className="site-footer__links">
          <Link to="/">Shop</Link>
          <Link to="/dress-show">Dress Show 👗</Link>
          <Link to="/orders">My Orders 📦</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Account</Link>
        </nav>
      </div>

      <div className="container site-footer__legal">
        <span>© {new Date().getFullYear()} Trending Show. All rights reserved.</span>
        <span>Made for mindful living & artisanal fashion.</span>
      </div>
    </footer>
  );
}

export default Footer;
