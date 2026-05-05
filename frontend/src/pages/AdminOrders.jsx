import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingBag, Search, RefreshCw, AlertCircle, X,
  ChevronDown, ChevronUp, Package, User, Mail, Phone,
  MapPin, Calendar, IndianRupee, Truck, CheckCircle,
  Clock, Filter, ArrowUpDown, ExternalLink, Tag,
} from 'lucide-react';
import { adminAPI } from '../services/api';

/* ─── Constants ────────────────────────────────────────────── */
const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_META = {
  pending:    { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: Clock,        label: 'Pending' },
  processing: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: Package,      label: 'Processing' },
  shipped:    { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', icon: Truck,        label: 'Shipped' },
  delivered:  { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', icon: CheckCircle,  label: 'Delivered' },
};

/* ─── Helpers ──────────────────────────────────────────────── */
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function orderId(id) {
  return '#' + String(id).slice(-8).toUpperCase();
}

/* ─── Status Badge ─────────────────────────────────────────── */
function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  const Icon = m.icon;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}
    >
      <Icon size={11} />{m.label}
    </span>
  );
}

/* ─── Status Dropdown ──────────────────────────────────────── */
function StatusSelect({ orderId, current, onUpdate }) {
  const [value, setValue]   = useState(current);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setValue(newStatus);
    setLoading(true);
    setError('');
    try {
      const updated = await adminAPI.updateOrderStatus(orderId, newStatus);
      onUpdate(updated);
    } catch {
      setError('Update failed');
      setValue(current);
    } finally {
      setLoading(false);
    }
  };

  const m = STATUS_META[value] || STATUS_META.pending;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={loading}
          className="text-xs font-bold rounded-lg pl-3 pr-7 py-1.5 border appearance-none cursor-pointer outline-none transition-all"
          style={{ background: m.bg, color: m.color, borderColor: m.border }}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_META[s].label}</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading
            ? <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            : <ChevronDown size={11} style={{ color: m.color }} />
          }
        </div>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

/* ─── Order Row ────────────────────────────────────────────── */
function OrderRow({ order, onUpdated }) {
  const [expanded, setExpanded] = useState(false);

  const customer = order.user || {};
  const product  = order.item  || {};
  const addr     = order.shippingAddress || {};

  const handleUpdate = (updated) => {
    onUpdated({ ...order, status: updated.status ?? updated.data?.status ?? order.status });
  };

  return (
    <div className={`card !p-0 overflow-hidden border-l-4 transition-all`}
      style={{ borderLeftColor: STATUS_META[order.status]?.color || '#e5e7eb' }}>

      {/* Collapsed summary row */}
      <button
        className="w-full text-left px-5 py-4 flex items-center gap-4"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Product image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
          {product.image
            ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-gray-400" /></div>
          }
        </div>

        {/* Core info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-bold text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
              {product.title || 'Unknown Product'}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="font-mono font-semibold">{orderId(order._id)}</span>
            <span className="flex items-center gap-1"><User size={10} />{customer.username || 'N/A'}</span>
            <span className="flex items-center gap-1"><Mail size={10} />{customer.email || 'N/A'}</span>
            <span className="flex items-center gap-1"><Calendar size={10} />{timeAgo(order.createdAt)}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex-shrink-0 text-right mr-2">
          <p className="font-extrabold text-base" style={{ color: 'var(--color-primary)' }}>
            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Total</p>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t px-5 pb-5 pt-4 grid md:grid-cols-3 gap-6"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>

          {/* Customer info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--color-text-tertiary)' }}>Customer Details</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-blue-500 flex-shrink-0" />
                <span style={{ color: 'var(--color-text-primary)' }}>{customer.username || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-blue-500 flex-shrink-0" />
                <a href={`mailto:${customer.email}`}
                  className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {customer.email || '—'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-blue-500 flex-shrink-0" />
                <span style={{ color: 'var(--color-text-secondary)' }}>{order.contactPhone || '—'}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {addr.street || addr}{addr.city ? `, ${addr.city}` : ''}{addr.zip ? ` — ${addr.zip}` : ''}
                  {!addr.street && !addr.city && !addr.zip && (typeof addr === 'string' ? addr : '—')}
                </span>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--color-text-tertiary)' }}>Product Details</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package size={14} className="text-purple-500 flex-shrink-0" />
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {product.title || '—'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-purple-500 flex-shrink-0" />
                <span style={{ color: 'var(--color-text-secondary)' }}>{product.category || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <IndianRupee size={14} className="text-purple-500 flex-shrink-0" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                </span>
              </div>
              {product._id && (
                <a href={`/item/${product._id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold mt-1"
                  style={{ color: 'var(--color-primary)' }}>
                  <ExternalLink size={11} />View Product
                </a>
              )}
            </div>
          </div>

          {/* Order management */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--color-text-tertiary)' }}>Order Management</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Update Status
                </p>
                <StatusSelect
                  orderId={order._id}
                  current={order.status}
                  onUpdate={handleUpdate}
                />
              </div>
              <div className="text-xs space-y-1" style={{ color: 'var(--color-text-tertiary)' }}>
                <p>Order ID: <span className="font-mono font-bold">{orderId(order._id)}</span></p>
                <p>Placed: {formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main AdminOrders Page ────────────────────────────────── */
export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDir, setSortDir] = useState('desc'); // newest first

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdated = (updated) => {
    setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, status: updated.status } : o));
  };

  /* Filtered + sorted */
  const displayed = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== 'all') {
      list = list.filter(o => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        orderId(o._id).toLowerCase().includes(q) ||
        (o.user?.username || '').toLowerCase().includes(q) ||
        (o.user?.email    || '').toLowerCase().includes(q) ||
        (o.item?.title    || '').toLowerCase().includes(q) ||
        (o.item?.category || '').toLowerCase().includes(q) ||
        (o.status         || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortDir === 'desc' ? -diff : diff;
    });
    return list;
  }, [orders, statusFilter, search, sortDir]);

  /* Stats */
  const stats = useMemo(() => ({
    total:      orders.length,
    pending:    orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped:    orders.filter(o => o.status === 'shipped').length,
    delivered:  orders.filter(o => o.status === 'delivered').length,
    revenue:    orders.filter(o => o.status !== 'pending').reduce((s, o) => s + (o.totalAmount || 0), 0),
  }), [orders]);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
            Order Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            View and manage all customer orders
          </p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline btn-sm flex items-center gap-2 self-start">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total',      value: stats.total,      ...STATUS_META.pending,    color: '#6366f1', bg: '#eef2ff', icon: ShoppingBag },
          { label: 'Pending',    value: stats.pending,    ...STATUS_META.pending    },
          { label: 'Processing', value: stats.processing, ...STATUS_META.processing },
          { label: 'Shipped',    value: stats.shipped,    ...STATUS_META.shipped    },
          { label: 'Delivered',  value: stats.delivered,  ...STATUS_META.delivered  },
          { label: 'Revenue',    value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: '#10b981', bg: '#ecfdf5', icon: IndianRupee },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card !py-3 !px-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg, color: s.color }}>
                <Icon size={17} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-lg leading-none truncate" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="card flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by order ID, customer, product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-full"
            style={{ paddingLeft: '2.25rem' }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          {[
            { value: 'all',        label: 'All',        color: '#6366f1' },
            { value: 'pending',    label: 'Pending',    color: STATUS_META.pending.color },
            { value: 'processing', label: 'Processing', color: STATUS_META.processing.color },
            { value: 'shipped',    label: 'Shipped',    color: STATUS_META.shipped.color },
            { value: 'delivered',  label: 'Delivered',  color: STATUS_META.delivered.color },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className="btn btn-sm font-semibold transition-all"
              style={statusFilter === opt.value
                ? { background: opt.color, color: '#fff', border: `1px solid ${opt.color}` }
                : { background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
              }
            >
              <Filter size={11} className="mr-1 inline" />{opt.label}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="btn btn-outline btn-sm flex items-center gap-1.5 flex-shrink-0"
          title={sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        >
          <ArrowUpDown size={13} />
          {sortDir === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {/* Results count while searching */}
      {(search || statusFilter !== 'all') && !loading && !error && (
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
          Showing {displayed.length} of {orders.length} orders
          {search && ` for "${search}"`}
          {statusFilter !== 'all' && ` · ${STATUS_META[statusFilter]?.label}`}
        </p>
      )}

      {/* Content */}
      {loading ? (
        <div className="card text-center py-16">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>Loading orders…</p>
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <p className="font-semibold text-red-600">{error}</p>
          <button onClick={fetchOrders} className="btn btn-outline btn-sm mt-4">Try Again</button>
        </div>
      ) : displayed.length === 0 ? (
        <div className="card text-center py-16">
          <ShoppingBag size={44} className="mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
          <p className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            {search || statusFilter !== 'all' ? 'No orders match your filters' : 'No orders yet'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            {search || statusFilter !== 'all'
              ? 'Try clearing the search or changing the status filter.'
              : 'Orders placed by customers will appear here.'}
          </p>
          {(search || statusFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); }}
              className="btn btn-outline btn-sm mt-4">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(order => (
            <OrderRow key={order._id} order={order} onUpdated={handleUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}
