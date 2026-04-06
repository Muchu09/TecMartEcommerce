import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ChevronLeft, Image as ImageIcon, IndianRupee, Tag, Info, ListChecks, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { adminAPI, itemsAPI } from '../services/api';
import './AdminContent.css';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const product = await itemsAPI.getItem(id);
        setFormData({
          name: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.status === 'available' ? 10 : 0
        });
        setImageError(false);
      } catch (err) {
        alert('Failed to fetch product data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Product title is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
    // Reset image error when image URL changes
    if (name === 'image') {
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsUpdating(true);
    try {
      await adminAPI.updateProduct(id, formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      alert('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-loading">
        <Loader2 size={32} className="animate-spin-custom" style={{ color: 'var(--color-primary)' }} />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '896px' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to="/admin/dashboard" className="btn btn-sm btn-secondary mb-4" style={{ display: 'inline-flex' }}>
            <ChevronLeft size={16} /> Back to Catalog
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <h1>Refine Product</h1>
            <span className="product-id-badge">ID: {id.slice(-8).toUpperCase()}</span>
          </div>
          <p>Update your marketplace listing with latest information.</p>
        </div>
      </div>

      {success && (
        <div className="success-banner">
          <CheckCircle size={20} /> Product updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Details */}
        <div className="lg:col-span-2 space-y-6">
           <div className="card">
              <div className="form-group">
                <label className="input-label flex items-center gap-2">
                   <Tag size={16} style={{ color: 'var(--color-primary)' }} /> Product Title <span className="required-mark">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`input-field ${errors.name ? 'input-error' : ''}`}
                  style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="input-label flex items-center gap-2">
                   <Info size={16} style={{ color: 'var(--color-primary)' }} /> Full Description <span className="required-mark">*</span>
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className={`input-field ${errors.description ? 'input-error' : ''}`}
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="input-label flex items-center gap-2">
                     <IndianRupee size={16} style={{ color: 'var(--color-primary)' }} /> Price Point <span className="required-mark">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className={`input-field ${errors.price ? 'input-error' : ''}`}
                  />
                  {errors.price && <span className="field-error">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="input-label flex items-center gap-2">
                     <ListChecks size={16} style={{ color: 'var(--color-primary)' }} /> Stock Available
                  </label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange} 
                    className="input-field"
                  />
                </div>
              </div>
           </div>
        </div>

        {/* Right Column - Image & Meta */}
        <div className="space-y-6">
           <div className="card">
              <div className="form-group">
                <label className="input-label flex items-center gap-2">
                   <ImageIcon size={16} style={{ color: 'var(--color-primary)' }} /> Active Visual
                </label>
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange} 
                  className="input-field mb-4"
                />
                
                <div className="relative group w-full aspect-square rounded-2xl overflow-hidden border-2 border-dashed p-2" style={{ borderColor: 'var(--color-border)' }}>
                    {formData.image && !imageError ? (
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                        style={{ boxShadow: 'var(--shadow-sm)' }}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <ImageIcon size={32} />
                        <span>Image preview</span>
                      </div>
                    )}
                    {formData.image && !imageError && (
                      <div className="absolute inset-x-2 bottom-2 p-3 flex items-center gap-2 rounded-b-xl" style={{ background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4), transparent)', color: 'var(--color-text-inverse)', backdropFilter: 'blur(4px)' }}>
                         <ImageIcon size={14} style={{ opacity: 0.8 }} />
                         <span style={{ fontSize: '10px', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Preview</span>
                      </div>
                    )}
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Categorization <span className="required-mark">*</span></label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className={`input-field ${errors.category ? 'input-error' : ''}`}
                >
                   <option value="">Select Category</option>
                   <option value="Electronics">Electronics</option>
                   <option value="Sports">Sports</option>
                   <option value="Books">Books</option>
                   <option value="Music">Music</option>
                   <option value="Home">Home</option>
                   <option value="Fashion">Fashion</option>
                   <option value="Other">Other</option>
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  disabled={isUpdating}
                >
                  {isUpdating ? <><Loader2 size={18} className="animate-spin-custom" /> Updating...</> : <><RefreshCw size={18} /> Update Product</>}
                </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
