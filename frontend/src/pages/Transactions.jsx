import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { itemsAPI } from "../services/api";

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const savedPurchases = JSON.parse(localStorage.getItem("purchased") || "[]");

        if (savedPurchases.length === 0) {
          setLoading(false);
          return;
        }

        const allItems = await itemsAPI.getItems();
        // Keep order of purchase if possible, or just filter
        const matchedItems = allItems.filter(item => savedPurchases.includes(item._id));
        setItems(matchedItems);
      } catch (err) {
        setError("Failed to load your transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
              <ShoppingBag style={{ color: 'var(--color-success)' }} size={32} /> My Transactions
            </h1>
            <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              Review your purchase history and active orders.
            </p>
          </div>
          <Link to="/dashboard" className="flex items-center gap-2 whitespace-nowrap transition" style={{ color: 'var(--color-text-secondary)' }}>
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin-custom mx-auto mb-4" style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-success)', borderRadius: '50%' }}></div>
            <p style={{ color: 'var(--color-text-secondary)' }}>Loading your transaction history...</p>
          </div>
        ) : error ? (
          <div className="card text-center" style={{ borderColor: 'var(--color-danger-light)' }}>
            <p className="text-lg mb-4" style={{ color: 'var(--color-danger)' }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
          </div>
        ) : items.length === 0 ? (
          <div className="card text-center flex flex-col items-center justify-center" style={{ padding: '3rem' }}>
             <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--color-bg-secondary)' }}>
                <ShoppingBag style={{ color: 'var(--color-border-hover)' }} size={48} />
             </div>
             <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No Transactions Yet</h2>
             <p className="mb-8 max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
               You haven't made any purchases yet. Head over to the marketplace to find something great!
             </p>
             <Link to="/" className="btn btn-success">
               Explore Marketplace
             </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item, index) => (
              <div key={item._id} className="card overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 h-40 relative shrink-0" style={{ background: 'var(--color-bg-tertiary)' }}>
                    <img
                      src={item.image || "https://via.placeholder.com/200"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'rgba(0,0,0,0.1)' }}></div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold line-clamp-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>
                         <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>${item.price}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium" style={{ background: 'var(--color-success-light)', color: 'var(--color-success-hover)' }}>
                          <CheckCircle size={12} /> Payment Completed
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                          <Clock size={12} /> Order #{item._id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/item/${item._id}`}
                        className="flex-1 text-center py-2.5 font-medium rounded-xl border transition"
                        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}
                      >
                        View Details
                      </Link>
                      <button
                         className="flex-1 py-2.5 font-medium rounded-xl transition"
                         style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                         onClick={() => alert('Receipt generated. Check your email!')}
                      >
                        Download Receipt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
