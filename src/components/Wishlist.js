import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./Wishlist.css";

function Wishlist() {
  const { ids, toggle } = useWishlist();
  const { addToCart } = useCart();
  const saved = products.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className="container wishlist wishlist--empty">
        <h1>Nothing saved yet.</h1>
        <p>Tap the heart on any product to keep it here.</p>
        <Link to="/" className="btn">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container wishlist">
      <h1>Saved items</h1>
      <div className="shelf wishlist__rule" />
      <div className="wishlist__grid">
        {saved.map((p) => (
          <div className="wishlist__card" key={p.id}>
            <Link to={`/product/${p.id}`}>
              <img src={p.image} alt={p.name} />
            </Link>
            <p className="card__maker">{p.maker}</p>
            <Link to={`/product/${p.id}`} className="card__name">{p.name}</Link>
            <p className="price">${p.price}</p>
            <div className="wishlist__actions">
              <button className="btn" onClick={() => addToCart(p, 1)}>Add to cart</button>
              <button className="btn--ghost btn" onClick={() => toggle(p.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
