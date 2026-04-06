import React, { useState, useMemo } from 'react';
import {
  Search, Book, FileText, MessagesSquare, X, CheckCircle,
  ChevronDown, ChevronUp, AlertCircle, ArrowRight,
  ShoppingCart, ShieldCheck, Truck, RotateCcw, CreditCard,
  UserCheck, Package, HelpCircle
} from 'lucide-react';

/* ─── FAQ Data ───────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'How do I verify a seller?',
    a: 'Check their reviews, badges, and number of successfully completed transactions. You can also view their listing history and send them a message through the platform before purchasing.',
    category: 'Buying'
  },
  {
    q: 'What payment methods are supported?',
    a: 'We support Credit/Debit Cards (Visa, Mastercard, Amex), UPI (GPay, PhonePe, Paytm), PayPal, and Cash on Delivery for eligible orders.',
    category: 'Payments'
  },
  {
    q: 'How do I list an item for sale?',
    a: 'Go to the Admin Dashboard (if you are an admin) or contact support to request a seller account. Once approved, use the "Add Product" page to upload images, set a price, and publish your listing.',
    category: 'Selling'
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard delivery takes 2–4 business days. Express delivery (where available) takes 1–2 business days. You will receive a tracking link once your order is dispatched.',
    category: 'Shipping'
  },
  {
    q: 'Can I return a product?',
    a: 'Yes! We offer a 30-day return policy on all products. Items must be in original condition. Initiate a return from your Dashboard → Orders → Return Item.',
    category: 'Returns'
  },
  {
    q: 'How do I track my order?',
    a: 'Go to your Dashboard and click on "My Orders". Each order shows its current status. You will also receive email notifications at each delivery stage.',
    category: 'Orders'
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. All payments are SSL encrypted. We never store your full card details. Payments are processed through PCI-DSS compliant payment gateways.',
    category: 'Security'
  },
  {
    q: 'How do I cancel an order?',
    a: 'Orders can be cancelled within 1 hour of placement from Dashboard → Orders → Cancel. After 1 hour, the order enters processing and cannot be cancelled directly — please contact support.',
    category: 'Orders'
  },
];

/* ─── Modal Wrapper ──────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, children, maxWidth = '640px' }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth, maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Getting Started Guide ──────────────────────────────────── */
const GUIDE_STEPS = [
  {
    icon: UserCheck,
    color: '#3b82f6',
    bg: '#eff6ff',
    title: '1. Create Your Account',
    desc: 'Click "Sign Up" and register with your name, email and a password. Verify your email to unlock all features.',
  },
  {
    icon: Search,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    title: '2. Browse the Marketplace',
    desc: 'Use the search bar or categories to find products. Filter by category, price, or availability.',
  },
  {
    icon: ShoppingCart,
    color: '#f59e0b',
    bg: '#fffbeb',
    title: '3. Add Items to Cart',
    desc: 'Click "Add to Cart" or "Buy Now" on any product. Review your cart and update quantities as needed.',
  },
  {
    icon: CreditCard,
    color: '#10b981',
    bg: '#ecfdf5',
    title: '4. Checkout Securely',
    desc: 'Enter your delivery address, choose a payment method (UPI, Card, or Cash on Delivery), and place your order.',
  },
  {
    icon: Package,
    color: '#ef4444',
    bg: '#fef2f2',
    title: '5. Track Your Order',
    desc: 'Monitor your order progress from your Dashboard → My Orders. You\'ll receive updates at each stage.',
  },
  {
    icon: RotateCcw,
    color: '#6366f1',
    bg: '#eef2ff',
    title: '6. Easy Returns',
    desc: 'Not satisfied? Request a return within 30 days from your Dashboard. We\'ll arrange a pickup at no extra cost.',
  },
];

function GuideContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm mb-6">
        Follow these simple steps to get the most out of TecMart. It takes less than 5 minutes to get started!
      </p>
      {GUIDE_STEPS.map((step) => (
        <div
          key={step.title}
          className="flex gap-4 p-4 rounded-2xl border border-gray-100"
          style={{ background: step.bg }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: step.color + '22', color: step.color }}
          >
            <step.icon size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Policies Content ───────────────────────────────────────── */
function PoliciesContent() {
  const sections = [
    {
      icon: RotateCcw,
      color: '#10b981',
      title: 'Return & Refund Policy',
      points: [
        '30-day return window from the date of delivery.',
        'Items must be unused and in original packaging.',
        'Refunds are processed within 5–7 business days to the original payment method.',
        'Digital products and perishable goods are non-returnable.',
        'Damaged or defective items qualify for immediate replacement at no cost.',
      ],
    },
    {
      icon: Truck,
      color: '#3b82f6',
      title: 'Shipping Policy',
      points: [
        'Standard shipping: 2–4 business days. Express: 1–2 business days.',
        'Free delivery on all orders above ₹500.',
        'Orders placed before 2 PM IST are dispatched the same day.',
        'A tracking number is emailed once your parcel is handed to the courier.',
        'TecMart is not responsible for delays caused by courier services or natural events.',
      ],
    },
    {
      icon: ShieldCheck,
      color: '#8b5cf6',
      title: 'Buyer Protection',
      points: [
        'All payments are SSL encrypted and PCI-DSS compliant.',
        'We never share your personal or financial details with third parties.',
        'If an item is significantly different from its description, you are fully protected.',
        'Disputes are resolved within 72 hours by our dedicated support team.',
        'Chargeback requests are handled directly with your bank if needed.',
      ],
    },
    {
      icon: FileText,
      color: '#f59e0b',
      title: 'Terms of Use',
      points: [
        'Users must be 18+ to make purchases or list items.',
        'Listing counterfeit, illegal, or prohibited items is strictly banned and may result in account suspension.',
        'TecMart reserves the right to remove listings that violate community guidelines.',
        'Any attempt to manipulate reviews or ratings will result in immediate account termination.',
        'By using TecMart, you agree to our full Terms of Service and Privacy Policy.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((sec) => (
        <div key={sec.title} className="border border-gray-100 rounded-2xl overflow-hidden">
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: sec.color + '11' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: sec.color + '22', color: sec.color }}
            >
              <sec.icon size={18} />
            </div>
            <h3 className="font-bold text-gray-900">{sec.title}</h3>
          </div>
          <ul className="px-5 py-4 space-y-2">
            {sec.points.map((pt, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ─── Support Ticket Form ────────────────────────────────────── */
const TICKET_CATEGORIES = [
  'Order Issue', 'Payment Problem', 'Returns & Refunds',
  'Account Help', 'Shipping Delay', 'Technical Bug', 'Other'
];

function TicketForm({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', category: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.category) e.category = 'Please select a category';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 20) e.message = 'Please describe your issue (min 20 characters)';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API submit
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Ticket Submitted!</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          Thank you, <strong>{form.name}</strong>! Our support team will respond to <strong>{form.email}</strong> within 24 hours.
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 text-left mt-4 text-sm text-gray-600">
          <div><span className="font-semibold">Category:</span> {form.category}</div>
          <div><span className="font-semibold">Subject:</span> {form.subject}</div>
        </div>
        <button onClick={onClose} className="btn btn-primary mt-2">Close</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-sm text-gray-500">Fill in the form below and our team will get back to you within 24 hours.</p>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="Your name" type="text"
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
          <input
            name="email" value={form.email} onChange={handleChange}
            placeholder="you@email.com" type="email"
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
        <select
          name="category" value={form.category} onChange={handleChange}
          className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all bg-white ${errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
        >
          <option value="">Select a category...</option>
          {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.category}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
        <input
          name="subject" value={form.subject} onChange={handleChange}
          placeholder="Brief description of your issue"
          className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
        />
        {errors.subject && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
        <textarea
          name="message" value={form.message} onChange={handleChange}
          rows={5} placeholder="Describe your issue in detail — the more info, the faster we can help!"
          className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
        />
        <div className="flex justify-between items-start mt-1">
          {errors.message
            ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.message}</p>
            : <span />
          }
          <span className="text-xs text-gray-400 ml-auto">{form.message.length} chars</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full btn-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
        ) : (
          <><MessagesSquare size={18} />Submit Support Ticket</>
        )}
      </button>
    </form>
  );
}

/* ─── FAQ Item ───────────────────────────────────────────────── */
function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden transition-all"
      style={{ borderColor: open ? 'var(--color-primary)' : 'var(--color-border)', background: 'var(--color-bg-secondary)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-center justify-between px-5 py-4 gap-4"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            {faq.category}
          </span>
          <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
            {faq.q}
          </span>
        </div>
        {open
          ? <ChevronUp size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          : <ChevronDown size={18} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
        }
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <div className="border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
            {faq.a}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main HelpCenter Page ───────────────────────────────────── */
export default function HelpCenter() {
  const [modal, setModal] = useState(null); // 'guide' | 'policies' | 'ticket'
  const [search, setSearch] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return FAQS;
    const q = search.toLowerCase();
    return FAQS.filter(f =>
      f.q.toLowerCase().includes(q) ||
      f.a.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero */}
        <div className="card text-center space-y-6" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'var(--color-text-inverse)' }}>
          <h1 className="text-4xl font-extrabold">How can we assist you?</h1>
          <p className="text-lg" style={{ opacity: 0.9 }}>Find answers, support, and guides to get the most out of TecMart.</p>
          <div className="max-w-xl mx-auto mt-4 relative">
            <Search className="absolute top-3 left-4" style={{ color: 'var(--color-text-tertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '3rem', borderRadius: '9999px' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 3 Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Getting Started */}
          <div className="card text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <Book size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Getting Started</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Learn the basics of renting, buying, and listing items.</p>
            <button className="btn btn-outline btn-sm" onClick={() => setModal('guide')}>
              Read Guide <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>

          {/* Policies */}
          <div className="card text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <FileText size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Policies &amp; Terms</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Review our refund, shipping, and dispute policies.</p>
            <button className="btn btn-outline btn-sm" onClick={() => setModal('policies')}>
              View Policies <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>

          {/* Contact */}
          <div className="card text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
              <MessagesSquare size={28} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-primary)' }}>Contact Support</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Can't find an answer? Our team is here to help 24/7.</p>
            <button className="btn btn-outline btn-sm" onClick={() => setModal('ticket')}>
              Open Ticket <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card">
          <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <HelpCircle size={22} style={{ color: 'var(--color-primary)' }} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Frequently Asked Questions
              </h2>
            </div>
            {search && (
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => <FaqItem key={i} faq={faq} />)
            ) : (
              <div className="text-center py-12">
                <HelpCircle size={40} className="mx-auto mb-3" style={{ color: 'var(--color-border)' }} />
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>No FAQs match "{search}"</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Try different keywords or{' '}
                  <button onClick={() => setModal('ticket')} className="underline" style={{ color: 'var(--color-primary)' }}>
                    open a support ticket
                  </button>.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Modals ── */}
      <Modal isOpen={modal === 'guide'} onClose={() => setModal(null)} title="Getting Started Guide" maxWidth="680px">
        <GuideContent />
      </Modal>

      <Modal isOpen={modal === 'policies'} onClose={() => setModal(null)} title="Policies & Terms" maxWidth="700px">
        <PoliciesContent />
      </Modal>

      <Modal isOpen={modal === 'ticket'} onClose={() => setModal(null)} title="Open a Support Ticket" maxWidth="580px">
        <TicketForm onClose={() => setModal(null)} />
      </Modal>
    </div>
  );
}
