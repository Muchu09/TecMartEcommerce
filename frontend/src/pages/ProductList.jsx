import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, PackageOpen, LayoutGrid, CheckCircle2, XCircle, IndianRupee, AlertTriangle, Loader2, PlusCircle, X } from 'lucide-react';
import { adminAPI } from '../services/api';
import './AdminContent.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const cancelBtnRef = useRef(null);

  // Focus management and Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDeleteModal();
    };
    if (deleteModal.open) {
      window.addEventListener('keydown', handleKeyDown);
      // Small timeout to ensure DOM is ready
      setTimeout(() => cancelBtnRef.current?.focus(), 10);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteModal.open]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin');
      } else {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setDeleteModal({ open: true, product });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, product: null });
    setDeleting(false);
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    try {
      await adminAPI.deleteProduct(deleteModal.product._id);
      fetchProducts(); // re-fetch after delete
      closeDeleteModal();
    } catch (err) {
      alert('Failed to delete product');
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stat card colors using CSS variables
  const statColors = {
    blue: { bg: 'var(--color-primary-light)', text: 'var(--color-primary)' },
    emerald: { bg: 'var(--color-success-light)', text: 'var(--color-success)' },
    rose: { bg: 'var(--color-danger-light)', text: 'var(--color-danger)' },
    amber: { bg: 'var(--color-warning-light)', text: 'var(--color-warning)' }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Manage Products</h1>
          <p className="admin-subtitle">Add, edit, and organize all listed marketplace items.</p>
        </div>
        <Link 
          to="/admin/product/add" 
          className="btn btn-primary"
        >
          <Plus size={20} />
          <span>New Product</span>
        </Link>
      </header>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         {[
           { label: 'Total Listings', value: products.length, icon: <LayoutGrid />, color: 'blue' },
           { label: 'Available', value: products.filter(p => p.status === 'available').length, icon: <CheckCircle2 />, color: 'emerald' },
           { label: 'Sold Out', value: products.filter(p => p.status !== 'available').length, icon: <XCircle />, color: 'rose' },
           { label: 'Inventory Value', value: `₹${products.reduce((acc, p) => acc + (Number(p.price) || 0), 0).toLocaleString()}`, icon: <IndianRupee />, color: 'amber' }
         ].map((stat, i) => (
           <div key={i} className="card flex items-center gap-5" style={{ padding: 'var(--space-6)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: statColors[stat.color].bg, color: statColors[stat.color].text }}>
                 {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <div>
                 <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-1)' }}>{stat.label}</p>
                 <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Global Filter Bar */}
      <div className="card mb-8" style={{ padding: 'var(--space-4)' }}>
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors" style={{ color: 'var(--color-text-tertiary)' }}>
                  <Search size={18} />
               </div>
               <input 
                  type="text" 
                  placeholder="Search by product name or category..." 
                  className="input-field pl-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
               {searchTerm && (
                 <button
                   onClick={() => setSearchTerm('')}
                   className="absolute inset-y-0 right-0 pr-4 flex items-center"
                   style={{ color: 'var(--color-text-tertiary)' }}
                   title="Clear search"
                 >
                   <X size={18} />
                 </button>
               )}
            </div>
            <div className="flex items-center gap-3 px-4 rounded-xl font-bold text-sm h-[52px]" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>
               <PackageOpen size={18} />
               {filteredProducts.length} Items Found
            </div>
         </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
           <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}></div>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-bold)' }}>Gathering your inventory...</p>
           </div>
        ) : filteredProducts.length === 0 ? (
           <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)' }}>
                 <LayoutGrid size={48} />
              </div>
              <h3 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>Inventory is empty</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)', maxWidth: '24rem', margin: '0 auto var(--space-8)', lineHeight: 1.625 }}>Try searching with a different keyword or create a brand new product to get started.</p>
              {searchTerm ? (
                 <button onClick={() => setSearchTerm('')} className="btn btn-primary">
                    Clear Search Filters
                 </button>
              ) : (
                 <Link to="/admin/product/add" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                    <PlusCircle size={18} /> Add First Product
                 </Link>
              )}
           </div>
        ) : (
           <div className="overflow-x-auto">
             <table className="admin-table">
               <thead>
                 <tr>
                   <th>Preview</th>
                   <th>Product Info</th>
                   <th>Price (₹)</th>
                   <th>Category</th>
                   <th className="text-center">Inventory</th>
                   <th className="text-center">Operations</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredProducts.map((product, i) => (
                   <tr key={product._id || i}>
                     <td>
                       <img 
                          src={product.image || 'https://via.placeholder.com/150'} 
                          alt={product.title || 'Product'} 
                          className="admin-img-preview" 
                       />
                     </td>
                     <td>
                        <div className="flex flex-col">
                           <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-bold)' }}>{product.title || 'Untitled'}</span>
                           <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 'var(--space-1)' }}>
                             ID: ...{product._id ? product._id.toString().slice(-8).toUpperCase() : 'N/A'}
                           </span>
                        </div>
                     </td>
                     <td style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary)' }}>₹{Number(product.price || 0).toLocaleString()}</td>
                     <td>
                        <span style={{ backgroundColor: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category || 'Other'}</span>
                     </td>
                     <td className="text-center">
                        <span className={`status-chip ${product.status === 'available' ? 'status-available' : 'status-sold'}`}>
                           {product.status === 'available' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                           {product.status === 'available' ? 'Available' : 'Sold Out'}
                        </span>
                     </td>
                     <td>
                       <div className="flex justify-center gap-3">
                         <Link 
                           to={`/admin/product/edit/${product._id}`} 
                           className="btn btn-sm btn-secondary"
                           title="Edit Product"
                           style={{ padding: 'var(--space-2)' }}
                         >
                           <Edit size={16} />
                         </Link>
                         <button 
                           onClick={() => openDeleteModal(product)}
                           className="btn btn-sm btn-danger"
                           title="Delete Product"
                           style={{ padding: 'var(--space-2)' }}
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </div>
      
      <p className="text-center mt-12" style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
         Last Updated: {new Date().toLocaleDateString()} &bull; Version 1.2.0
      </p>

      {deleteModal.open && (
        <div className="delete-modal-overlay" onClick={closeDeleteModal}>
          <div className="delete-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <button className="modal-close-btn" onClick={closeDeleteModal} aria-label="Close modal">
              <X size={20} />
            </button>
            
            <div className="delete-modal-icon">
              <AlertTriangle size={36} strokeWidth={2.5} />
            </div>
            
            <h3 className="delete-modal-title" id="delete-title">Confirm Deletion</h3>
            
            <p className="delete-modal-text">
              You are about to permanently remove <strong>"{deleteModal.product?.title || 'this product'}"</strong>. This action is irreversible. Are you sure?
            </p>
            
            <div className="delete-modal-actions">
               <button 
                ref={cancelBtnRef}
                className="btn btn-secondary" 
                onClick={closeDeleteModal} 
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete} 
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin-custom mr-2" /> 
                    Processing...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
