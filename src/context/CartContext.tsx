'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';

import { CartItem } from '@/types';

// =========================
// TYPES
// =========================

type CartState = {
  items: CartItem[];
  subtotal: number;
  guestCartId: string | null;
  loading: boolean;
};

type CartAction =
  | {
      type: 'SET_CART';
      payload: {
        items: CartItem[];
      };
    }
  | {
      type: 'ADD_ITEM';
      payload: CartItem;
    }
  | {
      type: 'REMOVE_ITEM';
      payload: string; // productId
    }
  | {
      type: 'UPDATE_QUANTITY';
      payload: {
        productId: string;
        quantity: number;
      };
    }
  | {
      type: 'SET_GUEST_ID';
      payload: string;
    }
  | {
      type: 'SET_LOADING';
      payload: boolean;
    }
  | {
      type: 'CLEAR_CART';
    };

type CartContextType = {
  state: CartState;

  itemCount: number;

  addItem: (item: CartItem) => void;

  removeItem: (productId: string) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  clearCart: () => void;

  setGuestCartId: (id: string) => void;
};

// =========================
// HELPERS
// =========================

function calculateSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return sum + price * item.quantity;
  }, 0);
}

// =========================
// REDUCER
// =========================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART': {
      return {
        ...state,
        items: action.payload.items,
        subtotal: calculateSubtotal(action.payload.items),
      };
    }

    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity,
              }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        (item) => item.productId !== action.payload
      );

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.productId === action.payload.productId
          ? {
              ...item,
              quantity: action.payload.quantity,
            }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    }

    case 'SET_GUEST_ID': {
      return {
        ...state,
        guestCartId: action.payload,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        subtotal: 0,
        guestCartId: null,
        loading: false,
      };
    }

    default:
      return state;
  }
}

// =========================
// CONTEXT
// =========================

export const CartContext = createContext<CartContextType | undefined>(undefined);

// =========================
// PROVIDER
// =========================

const initialState: CartState = {
  items: [],
  subtotal: 0,
  guestCartId: null,
  loading: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // =========================
  // LOCAL STORAGE PERSIST
  // =========================

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');

    if (storedCart) {
      const parsed = JSON.parse(storedCart);

      dispatch({
        type: 'SET_CART',
        payload: {
          items: parsed.items || [],
        },
      });

      if (parsed.guestCartId) {
        dispatch({
          type: 'SET_GUEST_ID',
          payload: parsed.guestCartId,
        });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'cart',
      JSON.stringify({
        items: state.items,
        guestCartId: state.guestCartId,
      })
    );
  }, [state.items, state.guestCartId]);

  // =========================
  // ACTIONS
  // =========================

  const addItem = (item: CartItem) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    });
  };

  const removeItem = (productId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        productId,
        quantity,
      },
    });
  };

  const clearCart = () => {
    dispatch({
      type: 'CLEAR_CART',
    });

    localStorage.removeItem('cart');
  };

  const setGuestCartId = (id: string) => {
    dispatch({
      type: 'SET_GUEST_ID',
      payload: id,
    });
  };

  // =========================
  // MEMOIZED VALUES
  // =========================

  const itemCount = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const value = useMemo(
    () => ({
      state,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setGuestCartId,
    }),
    [state, itemCount]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

