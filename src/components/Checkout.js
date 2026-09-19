import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const STEPS = ["Shipping", "Payment", "Review"];

function Checkout() {
  const { items, subtotal, discount, shipping, total, addOrder } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [shippingSpeed, setShippingSpeed] = useState("Standard Eco-Natural (Free)");

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    card: "",
    expiry: "",
    cvc: "",
  });
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="container checkout checkout--empty">
        <h1>Your cart is currently empty.</h1>
        <p>Explore our natural dress show and handcrafted creations!</p>
        <Link to="/" className="btn btn--primary">Back to shop</Link>
      </div>
    );
  }

  const next = () => {
    if (step === 0) {
      if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
        setError("Please fill in all shipping details to continue.");
        return;
      }
    }
    if (step === 1) {
      if (!paymentInfo.card || !paymentInfo.expiry || !paymentInfo.cvc) {
        setError("Please enter your card details to continue.");
        return;
      }
    }
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const placeOrder = () => {
    const newOrder = addOrder({
      items,
      subtotal,
      discount,
      shipping,
      total,
      shippingSpeed,
      shippingAddress: shippingInfo,
      estimatedDelivery: "2026-09-12",
    });

    navigate("/order-confirmation", { state: { order: newOrder } });
  };

  return (
    <div className="container checkout">
      <h1>Secure Checkout</h1>
      <div className="checkout__steps">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`checkout__step ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`}
          >
            <span>{i + 1}</span> {s}
          </div>
        ))}
      </div>

      <div className="checkout__grid">
        <div className="checkout__form">
          {error && <p className="checkout__error">{error}</p>}

          {/* STEP 0: SHIPPING */}
          {step === 0 && (
            <div className="checkout__fields">
              <h3>1. Shipping Address</h3>
              <label>
                Full Name
                <input
                  placeholder="e.g. Elena Rostova"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                />
              </label>
              <label>
                Street Address
                <input
                  placeholder="123 Natural Lane, Suite 4B"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </label>
              <div className="checkout__row2">
                <label>
                  City
                  <input
                    placeholder="Portland"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  />
                </label>
                <label>
                  ZIP / Postal Code
                  <input
                    placeholder="97201"
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                  />
                </label>
              </div>

              <h3>2. Select Shipping Method</h3>
              <div className="shipping-methods-grid">
                <label className={`shipping-option ${shippingSpeed.includes("Standard") ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingSpeed.includes("Standard")}
                    onChange={() => setShippingSpeed("Standard Eco-Natural (3-5 Days)")}
                  />
                  <div>
                    <strong>Standard Eco-Natural Packaging</strong>
                    <p>3-5 Business Days • 100% Recyclable Paper</p>
                  </div>
                </label>

                <label className={`shipping-option ${shippingSpeed.includes("Express") ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingSpeed.includes("Express")}
                    onChange={() => setShippingSpeed("Express Air Delivery (1-2 Days)")}
                  />
                  <div>
                    <strong>Express Air Delivery</strong>
                    <p>1-2 Business Days Priority Courier</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 1: PAYMENT */}
          {step === 1 && (
            <div className="checkout__fields">
              <h3>Payment Information</h3>
              <label>
                Card Number
                <input
                  placeholder="4242 4242 4242 4242"
                  value={paymentInfo.card}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, card: e.target.value })}
                />
              </label>
              <div className="checkout__row2">
                <label>
                  Expiry Date
                  <input
                    placeholder="MM/YY"
                    value={paymentInfo.expiry}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                  />
                </label>
                <label>
                  Security Code (CVC)
                  <input
                    placeholder="123"
                    value={paymentInfo.cvc}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvc: e.target.value })}
                  />
                </label>
              </div>
              <p className="checkout__hint">🔒 256-Bit Encrypted Demo Checkout — No actual payment is charged.</p>
            </div>
          )}

          {/* STEP 2: REVIEW */}
          {step === 2 && (
            <div className="checkout__review">
              <h3>Order Review</h3>
              <div className="review-box">
                <p><strong>Shipping to:</strong> {shippingInfo.name}, {shippingInfo.address}, {shippingInfo.city} {shippingInfo.zip}</p>
                <p><strong>Shipping Method:</strong> {shippingSpeed}</p>
              </div>

              <h3>Selected Items ({items.length})</h3>
              {items.map(({ product, qty, size, color }) => (
                <div className="checkout__review-row" key={`${product.id}-${size}-${color}`}>
                  <div>
                    <strong>{product.name}</strong> × {qty}
                    <div className="review-specs">Size: {size || "One Size"} | Color: {color || "Natural"}</div>
                  </div>
                  <span className="price">${(product.price * qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="checkout__actions">
            {step > 0 && (
              <button className="btn btn--ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn btn--primary" onClick={next}>
                Continue to {STEPS[step + 1]} →
              </button>
            ) : (
              <button className="btn btn--primary" onClick={placeOrder}>
                Complete Order & Earn {Math.round(total)} Points ✨
              </button>
            )}
          </div>
        </div>

        <aside className="checkout__summary">
          <h3>Order Summary</h3>
          <div className="shelf" />
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span className="price">${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="checkout__summary-row">
              <span>Discount</span>
              <span className="price">−${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="checkout__summary-row">
            <span>Shipping</span>
            <span className="price">{shipping === 0 ? "Free" : `$${shipping}`}</span>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total</span>
            <span className="price">${total.toFixed(2)}</span>
          </div>
          <div className="points-earned-box">
            🏆 You will earn <strong>{Math.round(total)} Eco-Points</strong> on completion!
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
