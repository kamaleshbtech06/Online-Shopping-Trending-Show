import React, { useState, useEffect } from "react";
import "./MarketingToast.css";

const SALES_TOASTS = [
  { name: "Sophia", city: "Milan", item: "Earthy Linen Tiered Maxi Dress", time: "2 mins ago" },
  { name: "Chloe", city: "Paris", item: "Botanical Silk Wrap Midi Dress", time: "5 mins ago" },
  { name: "Aria", city: "London", item: "Woven Bamboo Sun Tote Set", time: "12 mins ago" },
  { name: "Marcus", city: "New York", item: "Kiln Stoneware Nesting Bowls", time: "18 mins ago" },
];

export function AnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState({ hours: 8, mins: 42, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="announcement-bar">
      <div className="container announcement-bar__content">
        <span>🌿 <strong>NATURAL SEASON SALE:</strong> Take 15% OFF with code <code>NATURAL15</code></span>
        <span className="announcement-bar__timer">
          Ends in: <strong>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.mins).padStart(2, '0')}:{String(timeLeft.secs).padStart(2, '0')}</strong>
        </span>
      </div>
    </div>
  );
}

export function SocialProofToast() {
  const [activeToast, setActiveToast] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setActiveToast(SALES_TOASTS[index % SALES_TOASTS.length]);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
      index++;
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!activeToast || !visible) return null;

  return (
    <div className="social-toast">
      <div className="social-toast__icon">🛍️</div>
      <div className="social-toast__body">
        <p className="social-toast__text">
          <strong>{activeToast.name}</strong> in {activeToast.city} just ordered{" "}
          <span className="social-toast__item">{activeToast.item}</span>
        </p>
        <span className="social-toast__time">{activeToast.time} • Verified Buyer</span>
      </div>
      <button className="social-toast__close" onClick={() => setVisible(false)}>✕</button>
    </div>
  );
}
