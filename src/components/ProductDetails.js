import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./ProductDetails.css";

function Stars({ rating }) {
  const full = Math.round(rating);
  return <span className="stars">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>;
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isSaved, toggle } = useWishlist();
  const product = products.find((p) => String(p.id) === id);

  const [selectedSize, setSelectedSize] = useState(
    product && product.sizes ? product.sizes[0] : "One Size"
  );
  const [selectedColor, setSelectedColor] = useState(
    product && product.colors ? product.colors[0].name : "Natural"
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container pd__missing">
        <h2>We don&apos;t have that piece right now.</h2>
        <p>It may have sold through. Explore our active natural stock instead.</p>
        <Link to="/" className="btn">Back to shop</Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAdd = () => {
    addToCart(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="container pd">
      <button className="pd__back" onClick={() => navigate(-1)}>← Back</button>

      <div className="pd__grid">
        <div className="pd__image-box">
          <img src={product.image} alt={product.name} />
          {product.badge && <span className="pd__badge">{product.badge}</span>}
        </div>

        <div>
          <div className="pd__top">
            <div>
              <p className="pd__maker">{product.maker}</p>
              <h1 className="pd__name">{product.name}</h1>
            </div>
            <button
              className={`pd__save ${isSaved(product.id) ? "is-saved" : ""}`}
              onClick={() => toggle(product.id)}
            >
              ♥ {isSaved(product.id) ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          <div className="pd__rating">
            <Stars rating={product.rating} />
            <span>{product.rating} ({product.reviewCount} customer reviews)</span>
          </div>

          <p className="price pd__price">${product.price}</p>
          <span className="pd__points-notice">🪙 Earn {Math.round(product.price * qty)} Eco-Points on this item</span>

          {product.stock <= 5 && (
            <p className="pd__stock-warning">⚠️ Limited stock: Only {product.stock} left in this run</p>
          )}

          <p className="pd__desc">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && (
            <div className="pd__option-section">
              <label className="pd__option-label">Select Size:</label>
              <div className="pd__size-grid">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pd__size-pill ${selectedSize === s ? "is-selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && (
            <div className="pd__option-section">
              <label className="pd__option-label">
                Color: <strong>{selectedColor}</strong>
              </label>
              <div className="pd__color-grid">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`pd__color-swatch ${selectedColor === c.name ? "is-selected" : ""}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                  />
                ))}
              </div>
            </div>
          )}

          <dl className="pd__meta">
            <div><dt>Material</dt><dd>{product.material}</dd></div>
            <div><dt>Category</dt><dd>{product.category}</dd></div>
          </dl>

          <div className="pd__actions">
            <div className="pd__qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn btn--primary" onClick={handleAdd}>
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          {added && (
            <div className="pd__cart-alert">
              <span>Item added with size <strong>{selectedSize}</strong> ({selectedColor}).</span>
              <Link to="/cart" className="pd__viewcart">View Cart →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="pd__reviews">
        <h2>Verified Reviews ({product.reviews.length})</h2>
        <div className="pd__reviews-list">
          {product.reviews.map((r, i) => (
            <div className="pd__review" key={i}>
              <div className="pd__review-head">
                <strong>{r.name}</strong>
                <Stars rating={r.rating} />
              </div>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pd__related">
          <h2>Complete the Look</h2>
          <div className="pd__related-grid">
            {related.map((r) => (
              <Link to={`/product/${r.id}`} key={r.id} className="pd__related-card">
                <img src={r.image} alt={r.name} />
                <p className="card__maker">{r.maker}</p>
                <h3 className="card__name">{r.name}</h3>
                <p className="price">${r.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
