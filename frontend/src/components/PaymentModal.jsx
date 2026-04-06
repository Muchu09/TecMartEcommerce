import React, { useState } from 'react';
import { CreditCard, X, CheckCircle, ShieldCheck, Smartphone } from 'lucide-react';

export default function PaymentModal({ item, isOpen, onClose, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !item) return null;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(item);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-desc"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 id="payment-modal-title" className="text-xl font-bold text-gray-900">Checkout</h2>
            <p id="payment-modal-desc" className="text-sm text-gray-500 mt-1">Complete your purchase securely</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
            aria-label="Close payment modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ flex: '1 1 auto' }}>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-2xl flex gap-4 items-center mb-6 border border-gray-100">
            <img 
              src={item.image || "https://via.placeholder.com/100"} 
              alt={item.title} 
              className="w-16 h-16 rounded-xl object-cover bg-white shadow-sm"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-blue-600">₹{(item.price || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Payment Method
          </h3>

          <div className="space-y-3 mb-6">
            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'}`}>
              <input 
                type="radio" 
                name="payment_method" 
                value="card" 
                checked={selectedMethod === 'card'} 
                onChange={() => setSelectedMethod('card')}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                aria-label="Pay with Credit or Debit Card"
              />
              <div className="ml-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-blue-600 border border-gray-100">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Credit / Debit Card</div>
                  <div className="text-xs text-gray-500">Visa, Mastercard, Amex</div>
                </div>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${selectedMethod === 'paypal' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'}`}>
              <input 
                type="radio" 
                name="payment_method" 
                value="paypal" 
                checked={selectedMethod === 'paypal'} 
                onChange={() => setSelectedMethod('paypal')}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                aria-label="Pay with PayPal"
              />
              <div className="ml-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-[#00457C] border border-gray-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">PayPal</div>
                  <div className="text-xs text-gray-500">Redirects to PayPal</div>
                </div>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20' : 'border-gray-200 hover:border-blue-300'}`}>
              <input 
                type="radio" 
                name="payment_method" 
                value="upi" 
                checked={selectedMethod === 'upi'} 
                onChange={() => setSelectedMethod('upi')}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                aria-label="Pay with UPI or Mobile Wallet"
              />
              <div className="ml-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-green-600 border border-gray-100">
                  <Smartphone size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">UPI / Mobile Wallet</div>
                  <div className="text-xs text-gray-500">GPay, PhonePe, Paytm</div>
                </div>
              </div>
            </label>
          </div>

          {selectedMethod === 'card' && (
            <form className="space-y-4 mb-2 animate-in slide-in-from-top-2 duration-300">
              <div className="form-group">
                <label htmlFor="cardholder-name" className="input-label">Cardholder Name</label>
                <input 
                  id="cardholder-name"
                  type="text" 
                  placeholder="John Doe" 
                  className="input-field"
                  aria-label="Cardholder name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-number" className="input-label">Card Number</label>
                <input 
                  id="card-number"
                  type="text" 
                  placeholder="xxxx-xxxx-xxxx-xxxx" 
                  maxLength="19" 
                  className="input-field"
                  aria-label="Card number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="expiry-date" className="input-label">Expiry Date</label>
                  <input 
                    id="expiry-date"
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength="5" 
                    className="input-field"
                    aria-label="Expiry date"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvc" className="input-label">CVC</label>
                  <input 
                    id="cvc"
                    type="text" 
                    placeholder="123" 
                    maxLength="4" 
                    className="input-field"
                    aria-label="CVC security code"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
           <button 
             onClick={handlePaymentSubmit}
             disabled={isProcessing}
             className="btn btn-primary btn-lg w-full"
           >
             {isProcessing ? (
               <span className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-custom"></div>
                 Processing Securely...
               </span>
             ) : (
               <span className="flex items-center gap-2">
                 <ShieldCheck size={20} />
                 Pay ?{(item.price || 0).toLocaleString('en-IN')}
               </span>
             )}
           </button>
           <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
             <ShieldCheck size={12} /> SSL Secured & Encrypted Payment
           </p>
        </div>

      </div>
    </div>
  );
}
