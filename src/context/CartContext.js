import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const CartContext = createContext(null);

export const COUPONS = {
  NATURAL15: { discount: 0.15, label: "15% OFF Naturals Sale" },
  WELCOME10: { discount: 0.10, label: "10% OFF Welcome Bonus" },
  MAKER15: { discount: 0.15, label: "15% OFF Artisan Special" },
  FREESHIP: { freeShipping: true, label: "Free Shipping Unlocked" },
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("verve_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("verve_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "VM-849201",
        date: "2026-09-08",
        status: "In Transit",
        estimatedDelivery: "2026-09-11",
        shippingSpeed: "Standard Eco-Natural",
        trackingNumber: "TRK-982341-NAT",
        items: [
          {
            product: {
              id: 1,
              name: "Earthy Linen Tiered Maxi Dress",
              price: 135,
              image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            },
            size: "M",
            color: "Earthy Sage",
            qty: 1,
          },
        ],
        subtotal: 135,
        discount: 20.25,
        shipping: 0,
        total: 114.75,
        pointsEarned: 115,
        shippingAddress: {
          name: "Jane Doe",
          address: "124 Greenleaf Lane",
          city: "Portland, OR",
          zip: "97201",
        },
      },
    ];
  });

  const [rewardPoints, setRewardPoints] = useState(() => {
    try {
      return Number(localStorage.getItem("verve_points")) || 115;
    } catch {
      return 115;
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("verve_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem("verve_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("verve_points", rewardPoints.toString());
    } catch {}
  }, [rewardPoints]);

  const addToCart = (product, qty = 1, size = null, color = null) => {
    const itemSize = size || (product.sizes ? product.sizes[0] : "One Size");
    const itemColor = color || (product.colors ? product.colors[0].name : "Default");

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.size === itemSize &&
          i.color === itemColor
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].qty += qty;
        return copy;
      }
      return [...prev, { product, qty, size: itemSize, color: itemColor }];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(i.product.id === productId && i.size === size && i.color === color)
      )
    );
  };

  const updateQty = (productId, size, color, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size && i.color === color
          ? { ...i, qty }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) {
      setCoupon({ code: key, ...COUPONS[key] });
      setCouponError("");
    } else {
      setCoupon(null);
      setCouponError("Invalid promo code. Try NATURAL15 or WELCOME10!");
    }
  };

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: "VM-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      trackingNumber: "TRK-" + Math.floor(100000 + Math.random() * 900000) + "-NAT",
      pointsEarned: Math.round(orderData.total),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setRewardPoints((pts) => pts + Math.round(orderData.total));
    clearCart();
    return newOrder;
  };

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.product.price, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discount) return subtotal * coupon.discount;
    return 0;
  }, [coupon, subtotal]);

  const isFreeShippingCoupon = coupon && coupon.freeShipping;
  const shipping = items.length === 0 || subtotal - discount >= 100 || isFreeShippingCoupon ? 0 : 8;
  const total = subtotal - discount + shipping;

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    count,
    subtotal,
    coupon,
    couponError,
    applyCoupon,
    discount,
    shipping,
    total,
    orders,
    addOrder,
    rewardPoints,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
