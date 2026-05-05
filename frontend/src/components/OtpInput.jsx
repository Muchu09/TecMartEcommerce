import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, value, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Sync external value with internal state
    if (value) {
      const valueArr = value.split('').slice(0, length);
      const newOtp = [...new Array(length).fill('')].map((_, i) => valueArr[i] || '');
      setOtp(newOtp);
    } else {
      setOtp(new Array(length).fill(''));
    }
  }, [value, length]);

  useEffect(() => {
    // Auto-focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); // Only take the last char
    setOtp(newOtp);

    // Trigger parent onChange
    onChange(newOtp.join(''));

    // Move to next input
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft') {
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowRight') {
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pasteData) {
      const newOtp = [...new Array(length).fill('')].map((_, i) => pasteData[i] || '');
      setOtp(newOtp);
      onChange(newOtp.join(''));
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pasteData.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center my-4" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          style={{ 
            color: 'var(--color-text-primary)', 
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: data ? 'var(--color-primary)' : 'var(--color-border)'
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
