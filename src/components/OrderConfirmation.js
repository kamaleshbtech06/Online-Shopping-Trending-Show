import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="container oc oc--empty">
        <h1>Order Confirmed!</h1>
        <p>Thank you for shopping with Trending Show.</p>
        <Link to="/orders" className="btn btn--primary">View My Orders & Tracking →</Link>
      </div>
    );
  }

  return (
    <div className="container oc">
      <div className="oc__card">
        <div className="oc__icon">🌿</div>
        <span className="oc__badge">Order Successfully Placed!</span>
        <h1>Thank you for your order!</h1>
        <p className="oc__sub">
          We are preparing your natural artisanal items for shipment. A receipt has been sent to your email.
        </p>

        <div className="oc__details-box">
          <div className="oc__detail-row">
            <span>Order Reference Number:</span>
            <strong>#{order.id}</strong>
          </div>
          <div className="oc__detail-row">
            <span>Tracking Number:</span>
            <code>{order.trackingNumber}</code>
          </div>
          <div className="oc__detail-row">
            <span>Eco-Points Earned:</span>
            <span className="pts-highlight">+{order.pointsEarned} Points 🪙</span>
          </div>
          <div className="oc__detail-row">
            <span>Total Amount Paid:</span>
            <span className="price">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="oc__actions">
          <Link to="/orders" className="btn btn--primary">
            📦 Track Shipment & View Invoice →
          </Link>
          <Link to="/" className="btn btn--ghost">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
