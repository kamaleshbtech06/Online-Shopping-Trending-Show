import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./QuickViewModal.css";

function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { isSaved, toggle } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : "One Size"
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors ? product.colors[0].name : "Natural"
  );
  const [qty, setQty] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="quickview-backdrop" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="quickview-grid">
          <div className="quickview-image-box">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="quickview-badge">{product.badge}</span>}
          </div>

          <div className="quickview-details">
            <p className="quickview-maker">{product.maker}</p>
            <h2 className="quickview-title">{product.name}</h2>
            <div className="quickview-meta">
              <span className="stars">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </span>
              <span className="rating-num">({product.reviewCount} reviews)</span>
            </div>

            <p className="quickview-price">${product.price}</p>
            <p className="quickview-desc">{product.description}</p>

            <div className="quickview-spec">
              <strong>Material:</strong> {product.material}
            </div>

            {/* Sizes */}
            {product.sizes && (
              <div className="quickview-option-group">
                <label className="quickview-label">Select Size:</label>
                <div className="quickview-size-pills">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size-pill ${selectedSize === s ? "is-selected" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && (
              <div className="quickview-option-group">
                <label className="quickview-label">
                  Color: <span>{selectedColor}</span>
                </label>
                <div className="quickview-color-swatches">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`color-swatch ${selectedColor === c.name ? "is-selected" : ""}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Qty and Actions */}
            <div className="quickview-actions">
              <div className="qty-selector">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>

              <button className="btn btn-add" onClick={handleAddToCart}>
                {addedNotice ? "✓ Added to Cart!" : "Add to Cart"}
              </button>

              <button
                className={`btn-wishlist-icon ${isSaved(product.id) ? "is-saved" : ""}`}
                onClick={() => toggle(product.id)}
                title="Save to Wishlist"
              >
                ♥
              </button>
            </div>

            <div className="quickview-footer">
              <Link to={`/product/${product.id}`} onClick={onClose} className="link-full-details">
                View Full Specifications & Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
