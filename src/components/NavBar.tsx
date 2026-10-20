import { useEffect, useState } from "react";
import { BrandLock } from "./BrandLogo";

const navLinks = [
  { label: "APIs", href: "#apis" },
  { label: "Dietary Supplements", href: "#supplements" },
  { label: "Partners", href: "#partners" },
  { label: "Import Services", href: "#import" },
  { label: "Company", href: "#company" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#rfq" },
];

const quickLinks = [
  { label: "API Portfolio", href: "#apis" },
  { label: "Supplement Ingredients", href: "#supplements" },
  { label: "Import Services", href: "#import" },
  { label: "Documentation", href: "#resources" },
];

const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
);
const MailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
);
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
const BagIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l1 14H5L6 7z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></svg>
);
const Arrow = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M9 1l4 4-4 4M1 5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 1100) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className={`pc-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
        {/* Mini navbar */}
        <div className="pc-topbar">
          <div className="pc-topbar-inner">
            <div className="pc-topbar-group">
              <a href="tel:+201205700001"><PhoneIcon />+20 120 570 0001</a>
              <a className="pc-topbar-email" href="mailto:info@chemicalmaker.com"><MailIcon />info@chemicalmaker.com</a>
            </div>
            <div className="pc-topbar-group pc-topbar-right">
              <a href="#apis">APIs</a>
              <a href="#supplements">Supplements</a>
              <a href="#import">Import Services</a>
              <span className="pc-lang">EN</span>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="pc-mainbar">
          <div className="pc-mainbar-inner">
            <a className="pc-brand" href="#top" aria-label="Chemical Maker home">
              <BrandLock size={30} wordSize={15} color="currentColor" />
            </a>

            <nav className="pc-nav" aria-label="Primary">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </nav>

            <div className="pc-actions">
              <a className="pc-icon-btn" href="#apis" aria-label="Search the ingredient portfolio">
                <SearchIcon /><span className="pc-icon-label">Search</span>
              </a>
              <a className="pc-icon-btn" href="#supplements" aria-label="Ingredient portfolio">
                <BagIcon /><span className="pc-icon-label">Portfolio</span>
              </a>
              <a className="pc-cta ui-button" href="#rfq">Request an Inquiry</a>
              <button
                className={`pc-burger${menuOpen ? " open" : ""}`}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="pc-mobile-menu"
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <div id="pc-mobile-menu" className={`pc-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <ul className="pc-menu-links">
          {navLinks.map((link, i) => (
            <li key={link.label}>
              <a href={link.href} onClick={close} tabIndex={menuOpen ? 0 : -1}>
                <small>0{i + 1}</small>{link.label}<Arrow />
              </a>
            </li>
          ))}
        </ul>
        <div className="pc-menu-quick">
          {quickLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={close} tabIndex={menuOpen ? 0 : -1}>{link.label}</a>
          ))}
        </div>
        <div className="pc-menu-contact">
          <a href="tel:+201205700001">+20 120 570 0001</a>
          <a href="mailto:info@chemicalmaker.com">info@chemicalmaker.com</a>
        </div>
        <a className="pc-cta ui-button" href="#rfq" onClick={close} tabIndex={menuOpen ? 0 : -1}>Request an Inquiry</a>
      </div>
    </>
  );
}
