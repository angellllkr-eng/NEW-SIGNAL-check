/** Signal Office style: persistent navigation stays paper-solid, crisp, and readable over every page state. */
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/services", label: "Services" },
  { href: "/process", label: "How it works" },
  { href: "/insights", label: "Insights" },
  { href: "/diagnostic", label: "Signal check" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-lockup" onClick={() => setMenuOpen(false)} aria-label="Signal Accounting home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Signal<span>Accounting</span></span>
        </Link>
        <nav className={`desktop-nav ${menuOpen ? "mobile-nav-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={location === link.href ? "nav-link nav-link-active" : "nav-link"} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
          <Link href="/contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Talk it through <ArrowUpRight size={15} /></Link>
        </nav>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}<span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span></button>
      </div>
    </header>
    <div id="main-content">{children}</div>
    <footer className="site-footer">
      <div className="container footer-top">
        <div><Link href="/" className="brand-lockup footer-brand"><span className="brand-mark" aria-hidden="true" /><span className="brand-name">Signal<span>Accounting</span></span></Link><p className="footer-note">Clearer numbers.<br />Better next moves.</p></div>
        <div className="footer-links"><div><span className="micro-label">Explore</span>{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/contact">Contact</Link></div><div><span className="micro-label">A note</span><p>Informational content only. This site does not provide tax, legal, investment, or personalized financial advice.</p></div></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Signal Accounting</span><span>Built for the work behind the work.</span></div>
    </footer>
  </div>;
}
