import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    items,
    updateQty,
    removeFromCart,
    subtotal,
    coupon,
    couponError,
    applyCoupon,
    discount,
    shipping,
    total,
  } = useCart();
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container cart cart--empty">
        <h1>Your cart is empty.</h1>
        <p>Explore our organic linen dresses and handcrafted creations!</p>
        <Link to="/" className="btn btn--primary">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container cart">
      <h1>Shopping Cart ({items.length} items)</h1>
      <div className="shelf cart__rule" />

      <div className="cart__list">
        {items.map(({ product, qty, size, color }) => (
          <div className="cart__row" key={`${product.id}-${size}-${color}`}>
            <Link to={`/product/${product.id}`} className="cart__thumb">
              <img src={product.image} alt={product.name} />
            </Link>

            <div className="cart__info">
              <p className="cart__maker">{product.maker}</p>
              <Link to={`/product/${product.id}`} className="cart__name">
                {product.name}
              </Link>
              <p className="cart__specs">
                Size: <strong>{size || "One Size"}</strong> | Color: <strong>{color || "Natural"}</strong>
              </p>
              <p className="price">${product.price}</p>
            </div>

            <div className="cart__qty">
              <button onClick={() => updateQty(product.id, size, color, qty - 1)}>−</button>
              <span>{qty}</span>
              <button onClick={() => updateQty(product.id, size, color, qty + 1)}>+</button>
            </div>

            <p className="price cart__linetotal">${(product.price * qty).toFixed(2)}</p>

            <button
              className="cart__remove"
              onClick={() => removeFromCart(product.id, size, color)}
              aria-label={`Remove ${product.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart__summary">
        <div className="cart__coupon">
          <input
            type="text"
            placeholder="Promo code (e.g. NATURAL15)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn--ghost btn" onClick={() => applyCoupon(code)}>
            Apply Code
          </button>
        </div>

        <div className="cart__promo-hints">
          <span>Available codes: </span>
          <button type="button" onClick={() => { setCode("NATURAL15"); applyCoupon("NATURAL15"); }}>NATURAL15</button>
          <button type="button" onClick={() => { setCode("WELCOME10"); applyCoupon("WELCOME10"); }}>WELCOME10</button>
        </div>

        {couponError && <p className="cart__coupon-error">{couponError}</p>}
        {coupon && (
          <p className="cart__coupon-ok">
            Applied <strong>{coupon.code}</strong> — {coupon.label}
          </p>
        )}

        <div className="cart__summary-row">
          <span>Subtotal</span>
          <span className="price">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="cart__summary-row cart__summary-row--discount">
            <span>Discount</span>
            <span className="price">−${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="cart__summary-row">
          <span>Shipping</span>
          <span className="price">{shipping === 0 ? "Free Shipping" : `$${shipping}`}</span>
        </div>

        <div className="cart__summary-row cart__summary-row--total">
          <span>Total</span>
          <span className="price">${total.toFixed(2)}</span>
        </div>

        <p className="cart__note">🌱 Free shipping on orders over $100 or with active promo code.</p>

        <button className="btn btn--primary cart__checkout" onClick={() => navigate("/checkout")}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}

export default Cart;
