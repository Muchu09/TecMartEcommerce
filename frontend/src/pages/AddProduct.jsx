import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ChevronLeft, Image as ImageIcon, IndianRupee, Tag, Info, ListChecks, Loader2, CheckCircle } from 'lucide-react';
import { adminAPI } from '../services/api';
import './AdminContent.css';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '1'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

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
    // Clear error when field value changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    setIsSubmitting(true);
    try {
      await adminAPI.addProduct(formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      alert('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '896px' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to="/admin/dashboard" className="btn btn-sm btn-secondary mb-4" style={{ display: 'inline-flex' }}>
            <ChevronLeft size={16} /> Back to Inventory
          </Link>
          <h1>Create New Listing</h1>
          <p>Provide high-quality details for your new marketplace item.</p>
        </div>
      </div>

      {success && (
        <div className="success-banner">
          <CheckCircle size={20} /> Product added successfully! Redirecting...
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
                  placeholder="e.g. MacBook Pro M3 Max"
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
                  placeholder="Describe the product features, condition, and specifications..."
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
                     <IndianRupee size={16} style={{ color: 'var(--color-primary)' }} /> Price <span className="required-mark">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="2499"
                    value={formData.price} 
                    onChange={handleChange} 
                    className={`input-field ${errors.price ? 'input-error' : ''}`}
                  />
                  {errors.price && <span className="field-error">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="input-label flex items-center gap-2">
                     <ListChecks size={16} style={{ color: 'var(--color-primary)' }} /> Initial Stock
                  </label>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="10"
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
                   <ImageIcon size={16} style={{ color: 'var(--color-primary)' }} /> Product Image
                </label>
                <input 
                  type="text" 
                  name="image" 
                  placeholder="Paste URL (https://...)"
                  value={formData.image} 
                  onChange={handleChange} 
                  className="input-field mb-4"
                />
                
                {formData.image && !imageError ? (
                   <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-dashed p-2" style={{ borderColor: 'var(--color-border)' }}>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-xl" 
                        style={{ boxShadow: 'var(--shadow-sm)' }}
                        onError={() => setImageError(true)}
                      />
                   </div>
                ) : (
                   <div className="image-placeholder">
                      <ImageIcon size={32} />
                      <span>Image preview</span>
                   </div>
                )}
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
                  disabled={isSubmitting}
                  className="btn btn-success btn-lg"
                >
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin-custom" /> Saving...</> : <><Save size={18} /> Add Product</>}
                </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
