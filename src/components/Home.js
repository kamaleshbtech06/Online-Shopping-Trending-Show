import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import products from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import QuickViewModal from "./QuickViewModal";
import { SocialProofToast } from "./MarketingToast";
import "./Home.css";

const PAGE_SIZE = 6;

function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars">
      {"★".repeat(full)}{"☆".repeat(5 - full)}
    </span>
  );
}

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const categories = ["All", "Women's Fashion", "Men's Fashion", "Unisex Fashion", "Kitchen & Home", "Accessories", "Lighting", "Textiles"];

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeGender, setActiveGender] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(250);
  const [selectedBadge, setSelectedBadge] = useState("All");
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { isSaved, toggle } = useWishlist();

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (activeGender !== "All") list = list.filter((p) => p.gender === activeGender);
    if (selectedBadge !== "All") list = list.filter((p) => p.badge === selectedBadge);
    if (q) {
      const term = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.maker.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.material.toLowerCase().includes(term)
      );
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, activeGender, sort, maxPrice, selectedBadge, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearSearch = () => {
    searchParams.delete("q");
    setSearchParams(searchParams);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <div className="hero__badge">✨ Men&apos;s & Women&apos;s Equal Fashion & Dress Show</div>
            <h1 className="hero__title">
              Pure Organic Linen & Silk,<br />Crafted Equally for Men & Women.
            </h1>
            <p className="hero__body">
              Discover balanced collections: handcrafted maxi dresses, silk wraps, tailored men&apos;s linen button-downs, raw selvage denim coats, and artisanal stoneware.
            </p>
            <div className="hero__actions">
              <Link to="/dress-show" className="btn btn--primary">
                👗 View Dress & Fashion Showcase
              </Link>
              <a href="#shop" className="btn btn--ghost">
                Explore All Products ↓
              </a>
            </div>
          </div>

          <div className="hero__image-box">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80"
              alt="Trending Show Fashion Collection"
            />
            <div className="hero__floating-card">
              <span className="floating-tag">🌿 Balanced Apparel</span>
              <h4>Men&apos;s & Women&apos;s Sustainable Fashion</h4>
              <p>50% Women • 50% Men & Unisex</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="container shop">
        <div className="shop__heading">
          <h2>{q ? `Results for "${q}"` : "Artisan & Fashion Stock"}</h2>
          <p className="shop__sub">Showing {filtered.length} sustainable creations</p>
        </div>

        {q && (
          <button className="shop__clear" onClick={clearSearch}>
            Clear search ✕
          </button>
        )}

        {/* Gender Filter Pills */}
        <div className="gender-filter-bar">
          <span className="gender-filter-label">Department:</span>
          {["All", "Women", "Men", "Unisex"].map((g) => (
            <button
              key={g}
              className={`gender-pill ${activeGender === g ? "is-active" : ""}`}
              onClick={() => {
                setActiveGender(g);
                setPage(1);
              }}
            >
              {g === "Women" ? "👩 Women's" : g === "Men" ? "👨 Men's" : g === "Unisex" ? "✨ Unisex" : "All Departments"}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="shop__controls">
          <div className="shop__filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`shop__filter ${activeCategory === c ? "is-active" : ""}`}
                onClick={() => {
                  setActiveCategory(c);
                  setPage(1);
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="shop__secondary-filters">
            <label className="filter-label">
              Badge:
              <select
                value={selectedBadge}
                onChange={(e) => {
                  setSelectedBadge(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Badges</option>
                <option value="Bestseller">Bestseller</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Eco-Friendly">Eco-Friendly</option>
                <option value="Handmade">Handmade</option>
                <option value="Limited Edition">Limited Edition</option>
              </select>
            </label>

            <label className="filter-label">
              Max price: <strong>${maxPrice}</strong>
              <input
                type="range"
                min="40"
                max="250"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
              />
            </label>

            <label className="filter-label">
              Sort:
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </label>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="shop__empty-card">
            <p>No pieces match those filters right now.</p>
            <button
              className="btn btn--ghost"
              onClick={() => {
                setActiveCategory("All");
                setActiveGender("All");
                setSelectedBadge("All");
                setMaxPrice(250);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="shop__grid">
            {visible.map((p) => (
              <div className="card" key={p.id}>
                <button
                  className={`card__save ${isSaved(p.id) ? "is-saved" : ""}`}
                  onClick={() => toggle(p.id)}
                  aria-label="Save to wishlist"
                >
                  ♥
                </button>

                <div className="card__image">
                  <img src={p.image} alt={p.name} />
                  {p.badge && <span className="card__badge">{p.badge}</span>}
                  {p.gender && <span className="card__gender-badge">{p.gender}</span>}

                  <button
                    className="card__quickview-btn"
                    onClick={() => setQuickViewProduct(p)}
                  >
                    ⚡ Quick View & Select Size
                  </button>
                </div>

                <div className="card__content">
                  <p className="card__maker">{p.maker}</p>
                  <h3 className="card__name">
                    <Link to={`/product/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p className="card__material">🌿 {p.material}</p>
                  <div className="card__rating-row">
                    <Stars rating={p.rating} />
                    <span className="card__reviews-count">({p.reviewCount})</span>
                  </div>
                  <div className="card__footer">
                    <p className="price">${p.price}</p>
                    <Link to={`/product/${p.id}`} className="card__link">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="shop__pagination">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={n === page ? "is-active" : ""}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Live Social Proof Marketing Toast */}
      <SocialProofToast />
    </div>
  );
}

export default Home;
