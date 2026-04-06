import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Menu, X, Search, User, ShoppingCart, Bell, LogIn, 
  UserPlus, Clock, TrendingUp, Loader, Mic, ChevronDown, 
  LayoutDashboard, UserCircle, LogOut, Package, PlusCircle, Heart, Shield,
  Smartphone, Monitor, Book, Guitar, Trophy, Grid
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { itemsAPI } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import "./Navbar.css";

// Highlight Match Utility Component
const HighlightMatch = ({ text, highlight }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="highlighted-term">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems, animating } = useCart();
  const { totalFavorites } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });

  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);
  const catMenuRef = useRef(null);
  
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [placeholders, setPlaceholders] = useState(["Search anything..."]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (searchFocused || searchQuery || placeholders.length === 0) {
      setPlaceholderText("Search items...");
      return;
    }
    const currentString = placeholders[placeholderIndex % placeholders.length];
    let timeout;
    
    if (isDeleting) {
      timeout = setTimeout(() => {
        setPlaceholderText(currentString.substring(0, placeholderText.length - 1));
        if (placeholderText.length <= 1) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setPlaceholderText(currentString.substring(0, placeholderText.length + 1));
        if (placeholderText.length === currentString.length) {
          timeout = setTimeout(() => setIsDeleting(true), 2500);
        }
      }, 70);
    }
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, placeholderIndex, searchFocused, searchQuery]);

  // Voice Search (Web Speech API)
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSearchFocused(true);
      setPlaceholderText("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      executeSearch(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    itemsAPI.getItems()
      .then(items => {
        if (items && items.length > 0) {
          const titles = items.slice(0, 5).map(item => `Search "${item.title}"...`);
          titles.push("Search anything...");
          setPlaceholders(titles);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 0) {
      setIsSearching(true);
      itemsAPI.getItems()
        .then(items => {
           const term = debouncedSearchTerm.toLowerCase();
           const filtered = items.filter(item => 
             item.title.toLowerCase().includes(term) || 
             (item.category && item.category.toLowerCase().includes(term))
           ).slice(0, 5);
           setLiveResults(filtered);
           setSelectedIndex(-1);
        })
        .finally(() => setIsSearching(false));
    } else {
      setLiveResults([]);
      setSelectedIndex(-1);
    }
  }, [debouncedSearchTerm]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeSearch = (query) => {
    if (query.trim()) {
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      navigate(`/?search=${encodeURIComponent(query)}`);
      setSearchFocused(false);
      setIsOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < liveResults.length) {
      const selectedItem = liveResults[selectedIndex];
      navigate(`/item/${selectedItem._id}`);
      setSearchQuery("");
      setSearchFocused(false);
      return;
    }
    executeSearch(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (!searchFocused) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < liveResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
    }
  };

  const removeRecentSearch = (e, index) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserOpen(false);
    setIsOpen(false);
  };

  const categories = [
    { name: "Electronics", icon: <Smartphone size={16} /> },
    { name: "Tech Accessories", icon: <Monitor size={16} /> },
    { name: "Books", icon: <Book size={16} /> },
    { name: "Music", icon: <Guitar size={16} /> },
    { name: "Sports", icon: <Trophy size={16} /> },
    { name: "All Categories", icon: <Grid size={16} />, path: "/?category=All" }
  ];

  return (
    <div className={`navbar-container ${isScrolled ? "scrolled" : ""}`}>
      <nav className="navbar-main">
        
        {/* LOGO */}
        <Link to="/" className="nav-brand">
          <div className="logo-icon-wrapper">
            <span>TM</span>
          </div>
          <span className="nav-brand-text">TecMart</span>
        </Link>

        {/* CENTER: NAV LINKS & SEARCH */}
        <div className="nav-middle">
          
          <div className="nav-links-wrapper">
             <div className="category-dropdown-wrapper" ref={catMenuRef}>
               <button className="nav-link-item cat-menu-btn" onClick={() => setCatOpen(!catOpen)}>
                 Categories <ChevronDown size={14} className={`transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
               </button>
               {catOpen && (
                 <div className="cat-dropdown">
                    {categories.map((cat, idx) => (
                      <Link 
                        key={idx} 
                        to={cat.path || `/?category=${cat.name}`} 
                        className="cat-item"
                        onClick={() => setCatOpen(false)}
                      >
                        {cat.icon}
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                 </div>
               )}
             </div>

             <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                Marketplace
             </NavLink>

             {isAuthenticated && (
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
                   Dashboard
                </NavLink>
             )}
          </div>

          <div className="search-wrapper" ref={searchContainerRef}>
            <form className="search-bar" onSubmit={handleSearch}>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder={placeholderText}
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search items"
              />
              {searchQuery ? (
                <button type="button" className="action-btn" style={{ width: 28, height: 28 }} onClick={() => setSearchQuery("")}>
                  <X size={14} />
                </button>
              ) : (
                <button 
                  type="button" 
                  className={`action-btn ${isListening ? 'listening' : ''}`} 
                  style={{ width: 28, height: 28 }} 
                  onClick={handleVoiceSearch}
                >
                  <Mic size={16} className={isListening ? "text-red-500 animate-pulse" : ""} />
                </button>
              )}
            </form>

            {/* Search Dropdown */}
            {searchFocused && (
              <div className="search-results-dropdown">
                {/* Recent Searches */}
                {recentSearches.length > 0 && !searchQuery && (
                  <div className="dropdown-section">
                    <p className="dropdown-section-title">
                      Recent Searches 
                      <button className="clear-recent-btn" onClick={() => { setRecentSearches([]); localStorage.removeItem('recentSearches'); }}>Clear</button>
                    </p>
                    {recentSearches.map((s, i) => (
                      <div key={i} className="search-result-item" onClick={() => executeSearch(s)}>
                         <div className="result-icon"><Clock size={14} /></div>
                         <span className="recent-text">{s}</span>
                         <button className="remove-recent-btn" onClick={(e) => removeRecentSearch(e, i)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live Results */}
                {searchQuery && (
                  <div className="dropdown-section">
                    <p className="dropdown-section-title">
                      Results for "{searchQuery}"
                      {isSearching && <Loader size={12} className="animate-spin" />}
                    </p>
                    {liveResults.length > 0 ? (
                      liveResults.map((item, idx) => (
                        <Link 
                          key={item._id} 
                          to={`/item/${item._id}`} 
                          className="live-result-link"
                          onClick={() => { setSearchFocused(false); setSearchQuery(""); }}
                          style={{ background: selectedIndex === idx ? "#f8fafc" : "transparent" }}
                        >
                          <img src={item.image || "https://via.placeholder.com/40"} alt="" className="live-result-img" />
                          <div className="live-result-info">
                             <span className="live-result-title">
                               <HighlightMatch text={item.title} highlight={debouncedSearchTerm} />
                             </span>
                             <span className="live-result-price">€{item.price}</span>
                          </div>
                        </Link>
                      ))
                    ) : !isSearching && (
                      <p className="p-4 text-sm text-gray-400 text-center">No results found.</p>
                    )}
                    
                    {searchQuery && (
                      <div className="p-3 border-t border-gray-50">
                        <button 
                          className="w-full text-center text-sm font-bold text-blue-600 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => executeSearch(searchQuery)}
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Popular Chips */}
                {!searchQuery && (
                  <div className="dropdown-section pt-2">
                    <p className="dropdown-section-title">Trending Now</p>
                    <div className="flex flex-wrap gap-2 px-4 py-2">
                       {["Smartphone", "Laptops", "Books", "Music"].map(tag => (
                         <button 
                          key={tag} 
                          className="search-chip" 
                          onClick={() => executeSearch(tag)}
                        >
                          <TrendingUp size={12} /> {tag}
                        </button>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: ACCOUNT & CART */}
        <div className="nav-actions">
           <Link to="/wishlist" className="action-btn hide-on-mobile" title="Favorites">
             <Heart size={20} />
             {totalFavorites > 0 && <span className="cart-badge" style={{ backgroundColor: 'var(--color-primary)' }}>{totalFavorites}</span>}
           </Link>

           <Link to="/cart" className={`action-btn ${animating ? "animate-bounce" : ""}`} title="My Cart">
             <ShoppingCart size={20} />
             {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
           </Link>

           <div className="user-menu-wrapper" ref={userMenuRef}>
             {isAuthenticated ? (
               <div className="relative">
                 <button className="user-account-btn" onClick={() => setUserOpen(!userOpen)}>
                   <div className="avatar-wrapper">
                     <User size={18} />
                   </div>
                   <span className="user-name-text hide-on-tablet">{user?.username ? `Hi, ${user.username.split(' ')[0]}` : 'Account'}</span>
                   <ChevronDown size={14} className={`text-gray-400 hide-on-tablet transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                 </button>

                 {userOpen && (
                   <div className="user-dropdown">
                      <div className="dropdown-user-info">
                         <span className="u-name">{user?.username || "User"}</span>
                         <span className="u-email">{user?.email || "user@example.com"}</span>
                      </div>
                      <Link to="/dashboard" className="dropdown-link" onClick={() => setUserOpen(false)}>
                        <LayoutDashboard size={18} /> Dashboard
                      </Link>
                      <Link to="/profile" className="dropdown-link" onClick={() => setUserOpen(false)}>
                        <UserCircle size={18} /> Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="dropdown-link" onClick={() => setUserOpen(false)}>
                           <Shield size={18} /> Admin Panel
                        </Link>
                      )}
                      <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="flex gap-2">
                 <Link to="/login" className="nav-login-link hide-on-mobile" title="Login">
                   Sign In
                 </Link>
                 <Link to="/register" className="nav-cta hide-on-mobile">
                    Get Started
                 </Link>
               </div>
             )}
           </div>

           {/* Mobile menu toggle */}
           <button className="mobile-btn action-btn md-hidden" onClick={() => setIsOpen(true)}>
             <Menu size={24} />
           </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setIsOpen(false)} />
          <div className="mobile-drawer">
            <div className="drawer-header">
               <Link to="/" className="nav-brand" onClick={() => setIsOpen(false)}>
                  <div className="logo-icon-wrapper"><span>TM</span></div>
                  <span className="nav-brand-text" style={{ display: 'block' }}>TecMart</span>
               </Link>
               <button className="close-drawer-btn" onClick={() => setIsOpen(false)}>
                 <X size={24} />
               </button>
            </div>

            <form className="search-bar" onSubmit={handleSearch} style={{ width: '100%', maxWidth: 'none' }}>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="drawer-links">
               <NavLink to="/" className="drawer-link" onClick={() => setIsOpen(false)}>Marketplace</NavLink>
               <NavLink to="/wishlist" className="drawer-link" onClick={() => setIsOpen(false)}>Favorites</NavLink>
               <NavLink to="/dashboard" className="drawer-link" onClick={() => setIsOpen(false)}>Dashboard</NavLink>
               {user?.role === 'admin' && (
                  <NavLink to="/add-item" className="drawer-link" onClick={() => setIsOpen(false)}>List Product</NavLink>
               )}
            </div>

            <div className="mobile-auth-btns">
               {isAuthenticated ? (
                 <button onClick={handleLogout} className="logout-btn" style={{ width: '100%', justifyContent: 'center' }}>
                   Logout
                 </button>
               ) : (
                 <>
                   <Link to="/login" className="m-btn-outline" onClick={() => setIsOpen(false)}>Login</Link>
                   <Link to="/register" className="m-btn-primary" onClick={() => setIsOpen(false)}>Register</Link>
                 </>
               )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
