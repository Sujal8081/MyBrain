"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Instagram,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./storefront.module.css";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  color: string;
  badge?: string;
};

type CartLine = Product & { quantity: number };

const products: Product[] = [
  { id: 1, name: "Noma Table Lamp", category: "Lighting", price: 189, image: "/products/noma-lamp.svg", color: "Sand", badge: "Bestseller" },
  { id: 2, name: "Fjord Lounge Chair", category: "Furniture", price: 640, image: "/products/fjord-chair.svg", color: "Moss" },
  { id: 3, name: "Eira Carafe", category: "Tableware", price: 78, image: "/products/eira-carafe.svg", color: "Smoke" },
  { id: 4, name: "Tactile Wool Throw", category: "Textiles", price: 148, image: "/products/wool-throw.svg", color: "Ochre", badge: "New" },
  { id: 5, name: "Onda Side Table", category: "Furniture", price: 325, image: "/products/onda-table.svg", color: "Walnut" },
  { id: 6, name: "Raku Serving Set", category: "Tableware", price: 96, image: "/products/raku-set.svg", color: "Chalk" },
];

const categories = ["All", "Furniture", "Lighting", "Tableware", "Textiles"];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export function Storefront() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [newsletterNotice, setNewsletterNotice] = useState(false);
  const [checkoutStarted, setCheckoutStarted] = useState(false);

  const filteredProducts = useMemo(() => {
    const byCategory = activeCategory === "All" ? products : products.filter((product) => product.category === activeCategory);
    if (!query.trim()) return byCategory;
    const normalizedQuery = query.toLowerCase();
    return byCategory.filter((product) => `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(normalizedQuery));
  }, [activeCategory, query]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCartOpen(false);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: number, delta: number) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  function handleNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterNotice(true);
  }

  return (
    <main className={styles.store}>
      <div className={styles.announcement}>
        <p>Complimentary delivery on orders over $150</p>
        <a href="#journal">Discover our autumn journal <ArrowUpRight size={14} /></a>
      </div>

      <header className={styles.header}>
        <a className={styles.logo} href="#top" aria-label="Serein home">SEREIN<span>°</span></a>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <a href="#shop">New arrivals</a>
          <a href="#shop">Objects</a>
          <a href="#story">Our story</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.iconButton} onClick={() => setSearchOpen((open) => !open)} aria-label="Search products" aria-expanded={searchOpen}>
            <Search size={20} />
          </button>
          <button className={styles.cartButton} onClick={() => setCartOpen(true)} aria-label={`Open bag with ${itemCount} items`}>
            <ShoppingBag size={20} /><span>Bag</span><b>{itemCount}</b>
          </button>
          <button className={styles.menuButton} onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          <a href="#shop" onClick={() => setMenuOpen(false)}>New arrivals <ChevronRight size={18} /></a>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Objects <ChevronRight size={18} /></a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story <ChevronRight size={18} /></a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>Journal <ChevronRight size={18} /></a>
        </nav>
      )}

      {searchOpen && (
        <div className={styles.searchBar}>
          <Search size={20} />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pieces, materials, rooms…" aria-label="Search products" />
          {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={18} /></button>}
        </div>
      )}

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>The Autumn Edit · 2026</p>
          <h1>Quiet objects<br />for thoughtful homes.</h1>
          <p className={styles.heroText}>A considered collection of tactile forms, honest materials, and enduring design—made to bring calm to the everyday.</p>
          <a className={styles.primaryLink} href="#shop">Explore the collection <ArrowRight size={17} /></a>
          <div className={styles.heroNotes}>
            <span>Small-batch made</span><span>Natural materials</span><span>Designed to last</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image src="/products/hero-interior.svg" alt="Sculptural lounge chair and table lamp in a serene interior" fill priority sizes="(max-width: 800px) 100vw, 55vw" />
          <span className={styles.imageIndex}>01 / 04</span>
          <span className={styles.imageCaption}>Fjord chair in moss wool</span>
        </div>
      </section>

      <section className={styles.shopSection} id="shop">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Curated for the season</p>
            <h2>Objects of quiet utility</h2>
          </div>
          <p>Pieces selected for how they feel, function, and live with you over time.</p>
        </div>

        <div className={styles.filterRow} aria-label="Product categories">
          {categories.map((category) => (
            <button key={category} className={activeCategory === category ? styles.filterActive : ""} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>

        <div className={styles.productGrid} aria-live="polite">
          {filteredProducts.map((product, index) => (
            <article className={`${styles.productCard} ${index === 0 ? styles.productFeature : ""}`} key={product.id}>
              <div className={styles.productImage}>
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                {product.badge && <span className={styles.badge}>{product.badge}</span>}
                <button className={styles.quickAdd} onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}>
                  <Plus size={17} /> <span>Quick add</span>
                </button>
              </div>
              <div className={styles.productInfo}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category} · {product.color}</p>
                </div>
                <span>{formatPrice(product.price)}</span>
              </div>
            </article>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className={styles.noResults}><p>No pieces found for “{query}”.</p><button onClick={() => setQuery("")}>Clear search</button></div>
        )}
      </section>

      <section className={styles.storySection} id="story">
        <div className={styles.storyImage}>
          <Image src="/products/craft-story.svg" alt="Hands shaping a ceramic vessel in a workshop" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>The beauty of less</p>
          <h2>Made slowly.<br />Lived with fully.</h2>
          <p>We work with independent makers who share our belief that useful things can be beautiful, and beautiful things should be used. Every piece is chosen for its integrity—from the hand that shaped it to the home it finds.</p>
          <a href="#journal">Read our philosophy <ArrowUpRight size={16} /></a>
          <dl>
            <div><dt>24</dt><dd>Independent makers</dd></div>
            <div><dt>12</dt><dd>Countries of origin</dd></div>
            <div><dt>100%</dt><dd>Traceable materials</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.journal} id="journal">
        <div>
          <p className={styles.eyebrow}>Notes from Serein</p>
          <h2>A slower way of seeing.</h2>
        </div>
        <a href="#shop">View all stories <ArrowRight size={16} /></a>
        <article>
          <div className={styles.journalImage}><Image src="/products/journal-materials.svg" alt="Natural wood and linen material samples" fill sizes="(max-width: 800px) 100vw, 60vw" /></div>
          <div className={styles.journalCopy}>
            <span>Materials · 6 min read</span>
            <h3>Why the things we touch matter</h3>
            <p>On grain, weight, warmth, and the small sensory details that turn an object into a companion.</p>
            <a href="#story" aria-label="Read Why the things we touch matter"><ArrowUpRight size={20} /></a>
          </div>
        </article>
      </section>

      <section className={styles.newsletter}>
        <p className={styles.eyebrow}>Letters, occasionally</p>
        <h2>Thoughtful objects,<br />quietly delivered.</h2>
        <p>New collections, studio visits, and notes on living well. No noise.</p>
        {newsletterNotice ? (
          <div className={styles.successMessage}><Check size={18} /> Demo complete—connect an email provider to accept sign-ups.</div>
        ) : (
          <form onSubmit={handleNewsletter}>
            <input type="email" required placeholder="Your email address" aria-label="Email address" />
            <button type="submit">Join the list <ArrowRight size={17} /></button>
          </form>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a className={styles.logo} href="#top">SEREIN<span>°</span></a>
          <p>Objects for the considered home.<br />Curated in Copenhagen, shared worldwide.</p>
          <div className={styles.footerLinks}>
            <div><strong>Explore</strong><a href="#shop">New arrivals</a><a href="#shop">All objects</a><a href="#journal">Journal</a></div>
            <div><strong>Help</strong><a href="#story">Delivery & returns</a><a href="#story">Care guide</a><a href="#story">Contact</a></div>
            <div><strong>Visit</strong><a href="#story">Frederiksgade 12<br />Copenhagen K</a><a href="#story">Mon–Sat, 10–18</a></div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Serein Objects</span><div><a href="#story">Privacy</a><a href="#story">Terms</a></div><a href="#journal" aria-label="Instagram"><Instagram size={17} /></a>
        </div>
      </footer>

      {cartOpen && (
        <div className={styles.drawerLayer} role="dialog" aria-modal="true" aria-label="Shopping bag">
          <button className={styles.backdrop} onClick={() => setCartOpen(false)} aria-label="Close bag" />
          <aside className={styles.drawer}>
            <div className={styles.drawerHeader}><div><p>Your bag</p><span>{itemCount} {itemCount === 1 ? "piece" : "pieces"}</span></div><button onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button></div>
            {cart.length === 0 ? (
              <div className={styles.emptyBag}><ShoppingBag size={34} strokeWidth={1.3} /><h2>Your bag is quiet.</h2><p>Explore our collection and find something made to stay.</p><button onClick={() => setCartOpen(false)}>Continue exploring</button></div>
            ) : (
              <>
                <div className={styles.cartLines}>
                  {cart.map((item) => (
                    <div className={styles.cartLine} key={item.id}>
                      <div className={styles.cartThumb}><Image src={item.image} alt="" fill sizes="96px" /></div>
                      <div className={styles.cartDetails}><h3>{item.name}</h3><p>{item.color}</p><div className={styles.quantity}><button onClick={() => changeQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={14} /></button></div></div>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className={styles.cartFooter}>
                  <div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div>
                  <p>Taxes calculated at checkout. Complimentary shipping over $150.</p>
                  {checkoutStarted && <p className={styles.checkoutNotice} role="status">This storefront demo needs a payment provider before orders can be placed.</p>}
                  <button onClick={() => setCheckoutStarted(true)}>Preview checkout status <ArrowRight size={17} /></button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
