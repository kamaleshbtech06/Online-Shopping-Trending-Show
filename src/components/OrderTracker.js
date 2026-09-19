import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./OrderTracker.css";

const TRACKING_STEPS = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

function OrderTracker() {
  const { orders, addToCart, rewardPoints } = useCart();
  const [filter, setFilter] = useState("All");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [reorderSuccess, setReorderSuccess] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (filter === "Active") return o.status !== "Delivered";
    if (filter === "Delivered") return o.status === "Delivered";
    return true;
  });

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.qty, item.size, item.color);
    });
    setReorderSuccess(`✓ Re-added all ${order.items.length} items from order #${order.id} to cart!`);
    setTimeout(() => setReorderSuccess(""), 4000);
  };

  const getStepIndex = (status) => {
    if (status === "Order Placed") return 0;
    if (status === "Processing") return 1;
    if (status === "In Transit" || status === "Shipped") return 2;
    if (status === "Out for Delivery") return 3;
    if (status === "Delivered") return 4;
    return 1;
  };

  return (
    <div className="orders-page container">
      <div className="orders-header">
        <div>
          <h1>My Orders & Tracking</h1>
          <p className="orders-sub">Track active shipments, view order receipts, and re-order previous items.</p>
        </div>

        <div className="reward-badge-card">
          <span className="reward-icon">🏆</span>
          <div>
            <div className="reward-points">{rewardPoints} Eco-Points</div>
            <div className="reward-label">Earned on orders ($1 = 1 point)</div>
          </div>
        </div>
      </div>

      {reorderSuccess && <div className="reorder-toast">{reorderSuccess}</div>}

      {/* Filter Tabs */}
      <div className="orders-filter-bar">
        {["All", "Active", "Delivered"].map((tab) => (
          <button
            key={tab}
            className={`orders-filter-tab ${filter === tab ? "is-active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab} Orders ({orders.filter((o) => (tab === "Active" ? o.status !== "Delivered" : tab === "Delivered" ? o.status === "Delivered" : true)).length})
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📦</div>
          <h2>No orders found in this view</h2>
          <p>Explore our natural collections and place your first order!</p>
          <Link to="/" className="btn">Browse Shop</Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const currentStep = getStepIndex(order.status);

            return (
              <div className="order-card" key={order.id}>
                {/* Order Top Summary */}
                <div className="order-card__header">
                  <div>
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">Placed on {order.date}</span>
                  </div>

                  <div className="order-actions">
                    <button
                      className="btn-invoice"
                      onClick={() => setSelectedInvoiceOrder(order)}
                    >
                      📄 Printable Invoice
                    </button>
                    <button
                      className="btn-reorder"
                      onClick={() => handleReorder(order)}
                    >
                      🔄 Re-order Items
                    </button>
                  </div>
                </div>

                {/* Tracking Timeline Progress Bar */}
                <div className="order-tracking-section">
                  <div className="tracking-meta">
                    <div>
                      <strong>Status: </strong>
                      <span className="status-pill">{order.status}</span>
                    </div>
                    <div>
                      <strong>Tracking Number: </strong>
                      <code>{order.trackingNumber}</code>
                    </div>
                    <div>
                      <strong>Est. Delivery: </strong>
                      <span>{order.estimatedDelivery || "3-5 Business Days"}</span>
                    </div>
                  </div>

                  <div className="tracking-timeline">
                    {TRACKING_STEPS.map((stepName, i) => {
                      const isCompleted = i <= currentStep;
                      const isCurrent = i === currentStep;

                      return (
                        <div
                          key={stepName}
                          className={`timeline-step ${isCompleted ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}
                        >
                          <div className="timeline-node">{isCompleted ? "✓" : i + 1}</div>
                          <span className="timeline-label">{stepName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-grid">
                  {order.items.map((item, idx) => (
                    <div className="order-item-row" key={idx}>
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="order-item-details">
                        <h4>{item.product.name}</h4>
                        <p className="order-item-specs">
                          Size: <strong>{item.size || "One Size"}</strong> | Color: <strong>{item.color || "Natural"}</strong>
                        </p>
                        <p className="order-item-qty">Qty: {item.qty} × ${item.product.price}</p>
                      </div>
                      <div className="order-item-total">
                        ${(item.qty * item.product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="order-card__footer">
                  <div>
                    <span>Shipping Method: <strong>{order.shippingSpeed || "Standard Eco-Natural"}</strong></span>
                  </div>
                  <div className="order-total-amount">
                    Total Paid: <strong>${order.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="invoice-modal-backdrop" onClick={() => setSelectedInvoiceOrder(null)}>
          <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
            <button className="invoice-close" onClick={() => setSelectedInvoiceOrder(null)}>✕</button>

            <div className="invoice-paper" id="invoice-print-area">
              <div className="invoice-header">
                <div>
                  <h2 className="invoice-logo">Trending<span>Show</span></h2>
                  <p>Handcrafted & Artisanal Naturals</p>
                </div>
                <div className="invoice-right">
                  <h3>OFFICIAL INVOICE</h3>
                  <p><strong>Invoice #:</strong> {selectedInvoiceOrder.id}</p>
                  <p><strong>Date:</strong> {selectedInvoiceOrder.date}</p>
                </div>
              </div>

              <hr />

              <div className="invoice-addresses">
                <div>
                  <strong>Billed & Shipped To:</strong>
                  <p>
                    {selectedInvoiceOrder.shippingAddress?.name || "Customer"}<br />
                    {selectedInvoiceOrder.shippingAddress?.address || "123 Main St"}<br />
                    {selectedInvoiceOrder.shippingAddress?.city || "Portland"}, {selectedInvoiceOrder.shippingAddress?.zip || "97201"}
                  </p>
                </div>
                <div>
                  <strong>Payment & Shipping:</strong>
                  <p>
                    Method: Credit Card (Visa)<br />
                    Shipping: {selectedInvoiceOrder.shippingSpeed || "Standard Eco-Natural"}<br />
                    Status: Paid in Full
                  </p>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Size / Color</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product.name}</td>
                      <td>{item.size} / {item.color}</td>
                      <td>{item.qty}</td>
                      <td>${item.product.price}</td>
                      <td>${(item.qty * item.product.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-summary-box">
                <div className="summary-row"><span>Subtotal:</span> <span>${selectedInvoiceOrder.subtotal?.toFixed(2) || selectedInvoiceOrder.total.toFixed(2)}</span></div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="summary-row"><span>Discount:</span> <span>-${selectedInvoiceOrder.discount.toFixed(2)}</span></div>
                )}
                <div className="summary-row"><span>Shipping:</span> <span>{selectedInvoiceOrder.shipping === 0 ? "Free" : `$${selectedInvoiceOrder.shipping}`}</span></div>
                <div className="summary-row grand-total"><span>Grand Total Paid:</span> <span>${selectedInvoiceOrder.total.toFixed(2)}</span></div>
              </div>

              <div className="invoice-footer">
                <p>Thank you for supporting small-batch artisanal craftsmanship!</p>
              </div>
            </div>

            <div className="invoice-modal-actions">
              <button className="btn" onClick={() => window.print()}>
                🖨️ Print Invoice / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracker;
