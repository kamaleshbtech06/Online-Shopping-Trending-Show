import React, { useState } from "react";
import products from "../data/products";
import QuickViewModal from "./QuickViewModal";
import "./DressShowcase.css";

const LOOKBOOK_MODELS = [
  {
    title: "Women's Summer Solstice Linen Lookbook",
    season: "Spring / Summer 2026",
    description: "Flowing organic linen dresses and plant-dyed mulberry silk gowns for effortless elegance.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80",
    featuredIds: [1, 2, 3],
  },
  {
    title: "Men's Tailored Linen & Denim Lookbook",
    season: "Artisan Menswear 2026",
    description: "Precision-cut French linen button-downs, Japanese raw selvage denim chore jackets, and relaxed stonewashed trousers.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80",
    featuredIds: [16, 17, 18],
  },
];

function DressShowcase() {
  const [activeGenderFilter, setActiveGenderFilter] = useState("All");
  const [activeLookbook, setActiveLookbook] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fashionProducts = products.filter((p) => {
    if (activeGenderFilter === "Women") return p.gender === "Women";
    if (activeGenderFilter === "Men") return p.gender === "Men";
    if (activeGenderFilter === "Unisex") return p.gender === "Unisex";
    return p.category.includes("Fashion") || p.category === "Dresses";
  });

  const lookbook = LOOKBOOK_MODELS[activeLookbook];
  const lookbookProducts = products.filter((p) => lookbook.featuredIds.includes(p.id));

  return (
    <div className="dress-showcase container">
      {/* Banner */}
      <section className="dress-hero">
        <div className="dress-hero__badge">✨ Men&apos;s & Women&apos;s Fashion Showcase</div>
        <h1 className="dress-hero__title">Haute Organic Fashion & Dress Show</h1>
        <p className="dress-hero__sub">
          Explore handcrafted maxi dresses, silk wraps, tailored men&apos;s linen button-downs, and selvage denim coats. Zero synthetic dyes.
        </p>

        {/* Tab Lookbooks */}
        <div className="lookbook-selector">
          {LOOKBOOK_MODELS.map((lb, idx) => (
            <button
              key={lb.title}
              className={`lookbook-tab ${activeLookbook === idx ? "is-active" : ""}`}
              onClick={() => setActiveLookbook(idx)}
            >
              {lb.title}
            </button>
          ))}
        </div>
      </section>

      {/* Main Feature Showcase */}
      <section className="lookbook-feature">
        <div className="lookbook-feature__image-box">
          <img src={lookbook.image} alt={lookbook.title} />
          <div className="lookbook-feature__overlay">
            <span className="lookbook-tag">{lookbook.season}</span>
            <h2>{lookbook.title}</h2>
            <p>{lookbook.description}</p>
          </div>
        </div>

        <div className="lookbook-feature__products">
          <h3>Featured Pieces in this Lookbook</h3>
          <div className="lookbook-products-list">
            {lookbookProducts.map((item) => (
              <div className="lookbook-item-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="lookbook-item-info">
                  <h4>{item.name}</h4>
                  <p className="lookbook-item-price">${item.price}</p>
                  <button
                    className="btn-quick-look"
                    onClick={() => setQuickViewProduct(item)}
                  >
                    Quick View / Select Size & Color →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of All Apparel */}
      <section className="dress-grid-section">
        <div className="section-header-row">
          <div>
            <h2>Men&apos;s & Women&apos;s Equal Collection</h2>
            <p>100% organic linen, raw mulberry silk, virgin wool, and selvage cotton</p>
          </div>

          <div className="showcase-gender-pills">
            {["All", "Women", "Men", "Unisex"].map((g) => (
              <button
                key={g}
                className={`showcase-pill ${activeGenderFilter === g ? "is-active" : ""}`}
                onClick={() => setActiveGenderFilter(g)}
              >
                {g === "Women" ? "👩 Women's" : g === "Men" ? "👨 Men's" : g === "Unisex" ? "✨ Unisex" : "All Pieces"}
              </button>
            ))}
          </div>
        </div>

        <div className="dress-grid">
          {fashionProducts.map((product) => (
            <div className="dress-card" key={product.id}>
              <div className="dress-card__media">
                <img src={product.image} alt={product.name} />
                {product.badge && <span className="dress-badge">{product.badge}</span>}
                <span className="dress-gender-tag">{product.gender}</span>
                <button
                  className="dress-quickview-btn"
                  onClick={() => setQuickViewProduct(product)}
                >
                  ⚡ Quick View & Select Size
                </button>
              </div>

              <div className="dress-card__body">
                <span className="dress-maker">{product.maker}</span>
                <h3 className="dress-name">{product.name}</h3>
                <p className="dress-material">🌿 {product.material}</p>
                <div className="dress-card__bottom">
                  <span className="dress-price">${product.price}</span>
                  <span className="stars">
                    {"★".repeat(Math.round(product.rating))} ({product.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

export default DressShowcase;
