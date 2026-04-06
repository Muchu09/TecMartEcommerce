import { ChevronUp, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Footer.css";

export default function Footer() {
  const { user } = useAuth();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-advanced">
      {/* Decorative top wave */}
      <div className="footer-wave" aria-hidden="true">
        <svg width="100%" height="60" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,90 1080,-30 1440,30 L1440,60 L0,60 Z" fill="url(#footer-gradient)" />
          <defs>
            <linearGradient id="footer-gradient" x1="0%" x2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* CTA / Newsletter */}
      <div className="footer-cta">
        <div className="footer-container">
          <div className="cta-inner">
            <div>
              <h3 className="cta-title">Get deals, new items, and community updates</h3>
              <p className="cta-sub">Subscribe to our newsletter and never miss an update.</p>
            </div>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input 
                id="footer-email"
                type="email" 
                placeholder="Your email address" 
                className="cta-input input-field" 
                aria-label="Email address for newsletter"
              />
              <button type="submit" className="cta-button btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="col-brand">
              <div className="brand-mark">TM</div>
              <h4 className="brand-title">TecMart</h4>
              <p className="brand-desc">Community marketplace for sharing, renting and discovering great items.</p>
              <div className="social-row">
                <a href="#" aria-label="Facebook" className="social"><Facebook size={16} /></a>
                <a href="#" aria-label="Twitter" className="social"><Twitter size={16} /></a>
                <a href="#" aria-label="Instagram" className="social"><Instagram size={16} /></a>
                <a href="#" aria-label="LinkedIn" className="social"><Linkedin size={16} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h5>Explore</h5>
              <ul>
                <li><Link to="/">Marketplace</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                {user?.role === 'admin' && <li><Link to="/add-item">Add Item</Link></li>}
                <li><a href="#">Deals</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Resources</h5>
              <ul>
                <li><Link to="/help-center">Help Center</Link></li>
                <li><Link to="/safety-tips">Safety Tips</Link></li>
                <li><Link to="/help-center">How it works</Link></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Company</h5>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/press">Press</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>

            <div className="col-contact footer-col">
              <h5>Contact</h5>
              <div className="contact-card">
                <Mail size={16} />
                <div>
                  <div className="contact-label">Email</div>
                  <a href="mailto:murshidismayil2001@gmail.com">murshidismayil2001@gmail.com</a>
                </div>
              </div>
              <div className="contact-card">
                <span className="contact-icon" aria-hidden="true">📞</span>
                <div>
                  <div className="contact-label">Phone</div>
                  <a href="tel:+917994991783">+91 7994991783</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <div className="copyright">© {new Date().getFullYear()} <strong>TecMart</strong> — All rights reserved</div>
          <div className="policies">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>

      {/* back to top small */}
      <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
        <ChevronUp size={18} />
      </button>
    </footer>
  );
}
