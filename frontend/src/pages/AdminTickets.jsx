import React, { useState, useEffect, useCallback } from 'react';
import {
  Ticket, Search, Filter, CheckCircle, Clock, Trash2,
  ChevronDown, ChevronUp, MessageSquare, Mail, Tag,
  Calendar, RefreshCw, AlertCircle, Send, X, User,
} from 'lucide-react';
import { adminAPI } from '../services/api';

/* ── Helpers ───────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  'Order Issue':       { bg: '#fef3c7', text: '#92400e' },
  'Payment Problem':   { bg: '#fee2e2', text: '#991b1b' },
  'Returns & Refunds': { bg: '#e0f2fe', text: '#075985' },
  'Account Help':      { bg: '#f3e8ff', text: '#6b21a8' },
  'Shipping Delay':    { bg: '#dcfce7', text: '#166534' },
  'Technical Bug':     { bg: '#fce7f3', text: '#9d174d' },
  'Other':             { bg: '#f1f5f9', text: '#475569' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── Respond Modal ─────────────────────────────────────────── */
function RespondModal({ ticket, onClose, onSaved }) {
  const [response, setResponse] = useState(ticket.adminResponse || '');
  const [markResolved, setMarkResolved] = useState(ticket.status === 'resolved');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!response.trim()) { setError('Please write a response before saving.'); return; }
    setLoading(true);
    setError('');
    try {
      const updated = await adminAPI.updateTicket(ticket._id, {
        adminResponse: response,
        status: markResolved ? 'resolved' : 'pending',
      });
      onSaved(updated);
      onClose();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Respond to Ticket</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{ticket.subject}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Original message */}
          <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 border border-gray-100">
            <p className="font-semibold text-gray-800 mb-1 text-xs uppercase tracking-wide">User Message</p>
            <p className="leading-relaxed">{ticket.message}</p>
          </div>

          {/* Response textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Response *</label>
            <textarea
              rows={5}
              value={response}
              onChange={(e) => { setResponse(e.target.value); setError(''); }}
              placeholder="Write your reply to the user here..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-blue-400 resize-none"
            />
            {error && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />{error}
              </p>
            )}
          </div>

          {/* Mark resolved toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setMarkResolved(r => !r)}
              className={`w-11 h-6 rounded-full transition-colors relative ${markResolved ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${markResolved ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Mark as <span className={markResolved ? 'text-green-600' : 'text-orange-500'}>{markResolved ? 'Resolved' : 'Pending'}</span>
            </span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            {loading
              ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              : <><Send size={14} />Save Response</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Ticket Row ────────────────────────────────────────────── */
function TicketRow({ ticket, onUpdated, onDeleted }) {
  const [expanded, setExpanded] = useState(false);
  const [showRespond, setShowRespond] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const catStyle = CATEGORY_COLORS[ticket.category] || CATEGORY_COLORS['Other'];
  const isPending = ticket.status === 'pending';

  const handleToggleStatus = async () => {
    setTogglingId(ticket._id);
    try {
      const updated = await adminAPI.updateTicket(ticket._id, {
        status: isPending ? 'resolved' : 'pending',
      });
      onUpdated(updated);
    } catch { /* silent */ }
    finally { setTogglingId(null); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket? This cannot be undone.')) return;
    setDeletingId(ticket._id);
    try {
      await adminAPI.deleteTicket(ticket._id);
      onDeleted(ticket._id);
    } catch { /* silent */ }
    finally { setDeletingId(null); }
  };

  return (
    <>
      {showRespond && (
        <RespondModal
          ticket={ticket}
          onClose={() => setShowRespond(false)}
          onSaved={onUpdated}
        />
      )}

      <div className={`card !p-0 overflow-hidden transition-all border-l-4 ${isPending ? 'border-l-orange-400' : 'border-l-green-500'}`}>
        {/* Header row */}
        <button
          className="w-full text-left px-5 py-4 flex items-start gap-4"
          onClick={() => setExpanded(e => !e)}
        >
          {/* Status icon */}
          <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isPending ? 'bg-orange-100' : 'bg-green-100'}`}>
            {isPending
              ? <Clock size={15} className="text-orange-500" />
              : <CheckCircle size={15} className="text-green-500" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{ticket.subject}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.text }}>
                {ticket.category}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPending ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                {isPending ? 'Pending' : 'Resolved'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              <span className="flex items-center gap-1"><User size={11} />{ticket.name}</span>
              <span className="flex items-center gap-1"><Mail size={11} />{ticket.email}</span>
              <span className="flex items-center gap-1"><Calendar size={11} />{timeAgo(ticket.createdAt)}</span>
            </div>
          </div>

          <div className="flex-shrink-0 mt-0.5 text-gray-400">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {/* Expanded body */}
        {expanded && (
          <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            {/* Message */}
            <div className="pt-4">
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Message</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{ticket.message}</p>
            </div>

            {/* Admin response (if any) */}
            {ticket.adminResponse && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-2 flex items-center gap-1">
                  <MessageSquare size={11} /> Admin Response
                </p>
                <p className="text-sm leading-relaxed text-blue-800">{ticket.adminResponse}</p>
                {ticket.resolvedAt && (
                  <p className="text-xs text-blue-400 mt-2">Resolved on {formatDate(ticket.resolvedAt)}</p>
                )}
              </div>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              <span>Submitted: {formatDate(ticket.createdAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setShowRespond(true)}
                className="btn btn-primary btn-sm flex items-center gap-1.5"
              >
                <MessageSquare size={14} />
                {ticket.adminResponse ? 'Edit Response' : 'Respond'}
              </button>

              <button
                onClick={handleToggleStatus}
                disabled={!!togglingId}
                className={`btn btn-sm flex items-center gap-1.5 ${isPending ? 'btn-success' : 'btn-warning'}`}
                style={{
                  background: isPending ? '#dcfce7' : '#fef3c7',
                  color: isPending ? '#166534' : '#92400e',
                  border: `1px solid ${isPending ? '#bbf7d0' : '#fde68a'}`,
                }}
              >
                {togglingId === ticket._id
                  ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  : isPending ? <CheckCircle size={14} /> : <RefreshCw size={14} />
                }
                {isPending ? 'Mark Resolved' : 'Reopen'}
              </button>

              <button
                onClick={handleDelete}
                disabled={!!deletingId}
                className="btn btn-sm flex items-center gap-1.5"
                style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
              >
                {deletingId === ticket._id
                  ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  : <Trash2 size={14} />
                }
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Main AdminTickets Page ────────────────────────────────── */
export default function AdminTickets() {
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [search, setSearch]       = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getTickets(statusFilter);
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load tickets. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleUpdated = (updatedTicket) => {
    setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
  };

  const handleDeleted = (id) => {
    setTickets(prev => prev.filter(t => t._id !== id));
  };

  const filtered = tickets.filter(t => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.message.toLowerCase().includes(q)
    );
  });

  const pendingCount  = tickets.filter(t => t.status === 'pending').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>
            Support Tickets
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Manage and respond to customer support requests
          </p>
        </div>
        <button onClick={fetchTickets} className="btn btn-outline btn-sm flex items-center gap-2 self-start">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: tickets.length, color: '#3b82f6', bg: '#eff6ff', icon: Ticket },
          { label: 'Pending', value: pendingCount,  color: '#f59e0b', bg: '#fffbeb', icon: Clock },
          { label: 'Resolved', value: resolvedCount, color: '#10b981', bg: '#ecfdf5', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field w-full"
            style={{ paddingLeft: '2.25rem' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={14} />
            </button>
          )}
        </div>
        {/* Status filter */}
        <div className="flex gap-2 flex-shrink-0">
          {[
            { value: 'all',      label: 'All',      color: '#3b82f6' },
            { value: 'pending',  label: 'Pending',  color: '#f59e0b' },
            { value: 'resolved', label: 'Resolved', color: '#10b981' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className="btn btn-sm font-semibold transition-all"
              style={
                statusFilter === opt.value
                  ? { background: opt.color, color: '#fff', border: `1px solid ${opt.color}` }
                  : { background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
              }
            >
              <Filter size={12} className="mr-1 inline" />{opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets list */}
      {loading ? (
        <div className="card text-center py-16">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>Loading tickets…</p>
        </div>
      ) : error ? (
        <div className="card text-center py-12">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <p className="font-semibold text-red-600">{error}</p>
          <button onClick={fetchTickets} className="btn btn-outline btn-sm mt-4">Try Again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Ticket size={44} className="mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
          <p className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            {search ? `No tickets match "${search}"` : 'No tickets yet'}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            {search ? 'Try different keywords.' : 'Support tickets from the Help Center will appear here.'}
          </p>
          {search && <button onClick={() => setSearch('')} className="btn btn-outline btn-sm mt-4">Clear Search</button>}
        </div>
      ) : (
        <div className="space-y-3">
          {search && (
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
          {filtered.map(ticket => (
            <TicketRow
              key={ticket._id}
              ticket={ticket}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
