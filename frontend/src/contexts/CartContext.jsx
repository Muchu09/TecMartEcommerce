import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
          lastAdded: action.payload,
          animating: true,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
        lastAdded: action.payload,
        animating: true,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i._id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload._id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'STOP_ANIMATION':
      return { ...state, animating: false };
    default:
      return state;
  }
};

const initialState = {
  items: (() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  })(),
  lastAdded: null,
  animating: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.animating) {
      const timer = setTimeout(() => dispatch({ type: 'STOP_ANIMATION' }), 800);
      return () => clearTimeout(timer);
    }
  }, [state.animating]);

  const addToCart = (item) => {
    if (item.status && item.status !== 'available') {
      console.warn("Attempted to add an out-of-stock item to cart.");
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { _id: id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart: state.items,
      lastAdded: state.lastAdded,
      animating: state.animating,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
