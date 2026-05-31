// 'use client';

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useReducer,
//   ReactNode,
// } from 'react';

// import { CartItem } from '@/types';

// // =========================
// // TYPES
// // =========================

// type CartState = {
//   items: CartItem[];
//   subtotal: number;
//   guestCartId: string | null;
//   loading: boolean;
// };

// type CartAction =
//   | {
//       type: 'SET_CART';
//       payload: {
//         items: CartItem[];
//       };
//     }
//   | {
//       type: 'ADD_ITEM';
//       payload: CartItem;
//     }
//   | {
//       type: 'REMOVE_ITEM';
//       payload: string; // productId
//     }
//   | {
//       type: 'UPDATE_QUANTITY';
//       payload: {
//         productId: string;
//         quantity: number;
//       };
//     }
//   | {
//       type: 'SET_GUEST_ID';
//       payload: string;
//     }
//   | {
//       type: 'SET_LOADING';
//       payload: boolean;
//     }
//   | {
//       type: 'CLEAR_CART';
//     };

// type CartContextType = {
//   state: CartState;

//   itemCount: number;

//   addItem: (item: CartItem) => void;

//   removeItem: (productId: string) => void;

//   updateQuantity: (productId: string, quantity: number) => void;

//   clearCart: () => void;

//   setGuestCartId: (id: string) => void;
// };

// // =========================
// // HELPERS
// // =========================

// function calculateSubtotal(items: CartItem[]) {
//   return items.reduce((sum, item) => {
//     const price = item.discountPrice ?? item.basePrice;
//     return sum + price * item.quantity;
//   }, 0);
// }

// // =========================
// // REDUCER
// // =========================

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case 'SET_CART': {
//       return {
//         ...state,
//         items: action.payload.items,
//         subtotal: calculateSubtotal(action.payload.items),
//       };
//     }

//     case 'ADD_ITEM': {
//       const existingItem = state.items.find(
//         (item) => item.productId === action.payload.productId
//       );

//       let updatedItems: CartItem[];

//       if (existingItem) {
//         updatedItems = state.items.map((item) =>
//           item.productId === action.payload.productId
//             ? {
//                 ...item,
//                 quantity: item.quantity + action.payload.quantity,
//               }
//             : item
//         );
//       } else {
//         updatedItems = [...state.items, action.payload];
//       }

//       return {
//         ...state,
//         items: updatedItems,
//         subtotal: calculateSubtotal(updatedItems),
//       };
//     }

//     case 'REMOVE_ITEM': {
//       const updatedItems = state.items.filter(
//         (item) => item.productId !== action.payload
//       );

//       return {
//         ...state,
//         items: updatedItems,
//         subtotal: calculateSubtotal(updatedItems),
//       };
//     }

//     case 'UPDATE_QUANTITY': {
//       const updatedItems = state.items.map((item) =>
//         item.productId === action.payload.productId
//           ? {
//               ...item,
//               quantity: action.payload.quantity,
//             }
//           : item
//       );

//       return {
//         ...state,
//         items: updatedItems,
//         subtotal: calculateSubtotal(updatedItems),
//       };
//     }

//     case 'SET_GUEST_ID': {
//       return {
//         ...state,
//         guestCartId: action.payload,
//       };
//     }

//     case 'SET_LOADING': {
//       return {
//         ...state,
//         loading: action.payload,
//       };
//     }

//     case 'CLEAR_CART': {
//       return {
//         items: [],
//         subtotal: 0,
//         guestCartId: null,
//         loading: false,
//       };
//     }

//     default:
//       return state;
//   }
// }

// // =========================
// // CONTEXT
// // =========================

// export const CartContext = createContext<CartContextType | undefined>(undefined);

// // =========================
// // PROVIDER
// // =========================

// const initialState: CartState = {
//   items: [],
//   subtotal: 0,
//   guestCartId: null,
//   loading: false,
// };

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   // =========================
//   // LOCAL STORAGE PERSIST
//   // =========================

//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart');

//     if (storedCart) {
//       const parsed = JSON.parse(storedCart);

//       dispatch({
//         type: 'SET_CART',
//         payload: {
//           items: parsed.items || [],
//         },
//       });

//       if (parsed.guestCartId) {
//         dispatch({
//           type: 'SET_GUEST_ID',
//           payload: parsed.guestCartId,
//         });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(
//       'cart',
//       JSON.stringify({
//         items: state.items,
//         guestCartId: state.guestCartId,
//       })
//     );
//   }, [state.items, state.guestCartId]);

//   // =========================
//   // ACTIONS
//   // =========================

//   const addItem = (item: CartItem) => {
//     dispatch({
//       type: 'ADD_ITEM',
//       payload: item,
//     });
//   };

//   const removeItem = (productId: string) => {
//     dispatch({
//       type: 'REMOVE_ITEM',
//       payload: productId,
//     });
//   };

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeItem(productId);
//       return;
//     }

//     dispatch({
//       type: 'UPDATE_QUANTITY',
//       payload: {
//         productId,
//         quantity,
//       },
//     });
//   };

//   const clearCart = () => {
//     dispatch({
//       type: 'CLEAR_CART',
//     });

//     localStorage.removeItem('cart');
//   };

//   const setGuestCartId = (id: string) => {
//     dispatch({
//       type: 'SET_GUEST_ID',
//       payload: id,
//     });
//   };

//   // =========================
//   // MEMOIZED VALUES
//   // =========================

//   const itemCount = useMemo(() => {
//     return state.items.reduce((sum, item) => sum + item.quantity, 0);
//   }, [state.items]);

//   const value = useMemo(
//     () => ({
//       state,
//       itemCount,
//       addItem,
//       removeItem,
//       updateQuantity,
//       clearCart,
//       setGuestCartId,
//     }),
//     [state, itemCount]
//   );

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// }

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";

import { CartItem } from "@/types";
import { useAuth } from "./AuthContext";

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
      type: "SET_CART";
      payload: {
        items: CartItem[];
      };
    }
  | {
      type: "ADD_ITEM";
      payload: CartItem;
    }
  | {
      type: "REMOVE_ITEM";
      payload: { productId: string; variantId?: string };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        variantId?: string;
        quantity: number;
      };
    }
  | {
      type: "SET_GUEST_ID";
      payload: string | null;
    }
  | {
      type: "SET_LOADING";
      payload: boolean;
    }
  | {
      type: "CLEAR_CART";
    };

type CartContextType = {
  state: CartState;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setGuestCartId: (id: string) => void;
};

// =========================
// HELPERS
// =========================

const CART_STORAGE_KEY = "cart";

function calculateSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return sum + price * item.quantity;
  }, 0);
}

function loadCartFromStorage(): Pick<CartState, "items" | "guestCartId"> {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [], guestCartId: null };

    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      guestCartId: parsed.guestCartId ?? null,
    };
  } catch {
    // Corrupted data — wipe it and start fresh
    localStorage.removeItem(CART_STORAGE_KEY);
    return { items: [], guestCartId: null };
  }
}

function saveCartToStorage(items: CartItem[], guestCartId: string | null) {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items, guestCartId })
    );
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

// =========================
// REDUCER
// =========================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART": {
      return {
        ...state,
        items: action.payload.items,
        subtotal: calculateSubtotal(action.payload.items),
      };
    }

    case "ADD_ITEM": {
      // Treat productId+variantId as the unique key for cart items
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          (item.variantId ?? null) === (action.payload.variantId ?? null)
      );

      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId &&
          (item.variantId ?? null) === (action.payload.variantId ?? null)
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

    case "REMOVE_ITEM": {
      const { productId, variantId } = action.payload;
      const updatedItems = state.items.filter(
        (item) =>
          !(item.productId === productId && (item.variantId ?? null) === (variantId ?? null))
      );

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.productId === productId && (item.variantId ?? null) === (variantId ?? null)
          ? {
              ...item,
              quantity,
            }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
      };
    }

    case "SET_GUEST_ID": {
      return {
        ...state,
        guestCartId: action.payload,
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case "CLEAR_CART": {
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

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

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

  // -------------------------------------------------------
  // 1. RESTORE from localStorage on mount
  // -------------------------------------------------------
  useEffect(() => {
    const { items, guestCartId } = loadCartFromStorage();

    // Generate a guestCartId if one doesn't exist yet
    const resolvedGuestId = guestCartId ?? crypto.randomUUID();

    dispatch({ type: "SET_CART", payload: { items } });
    dispatch({ type: "SET_GUEST_ID", payload: resolvedGuestId });
  }, []);

  // -------------------------------------------------------
  // 2. PERSIST to localStorage whenever cart changes
  // -------------------------------------------------------
  useEffect(() => {
    saveCartToStorage(state.items, state.guestCartId);
  }, [state.items, state.guestCartId]);

  // -------------------------------------------------------
  // 3. GUEST → USER MIGRATION
  //    Fires when the user logs in (user?.id changes).
  //    CartProvider is a child of AuthProvider so useAuth() works here.
  // -------------------------------------------------------
  // Uncomment once you wire up AuthContext:
  //
  const { state: authState } = useAuth();

  useEffect(() => {
    if (!authState.user) return; // still a guest

    if (state.items.length > 0) {
      // OPTION A — local only: items already in state, just drop the guestCartId
      dispatch({ type: "SET_GUEST_ID", payload: null });

      // OPTION B — sync to backend:
      // (async () => {
      //   dispatch({ type: 'SET_LOADING', payload: true });
      //   try {
      //     const merged = await mergeCartAPI(user.id, state.guestCartId, state.items);
      //     dispatch({ type: 'SET_CART', payload: { items: merged } });
      //     dispatch({ type: 'SET_GUEST_ID', payload: null });
      //   } finally {
      //     dispatch({ type: 'SET_LOADING', payload: false });
      //   }
      // })();
    } else {
      // No guest items — optionally fetch the user's saved cart from backend:
      // const userCart = await fetchUserCart(user.id);
      // dispatch({ type: 'SET_CART', payload: { items: userCart } });
    }
  }, [authState.user?.id]); // only fires when the logged-in identity changes

  // -------------------------------------------------------
  // 4. MEMOIZED CONTEXT VALUE
  //    All action functions are defined inline so dispatch
  //    (which is stable) is the only real dependency.
  // -------------------------------------------------------

  // =========================
  // ACTIONS
  // =========================

  const addItem = (item: CartItem) => {
    dispatch({
      type: "ADD_ITEM",
      payload: item,
    });
  };

  const removeItem = (productId: string, variantId?: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId, variantId },
    });
  };

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        productId,
        variantId,
        quantity,
      },
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });

    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const setGuestCartId = (id: string) => {
    dispatch({
      type: "SET_GUEST_ID",
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// =========================
// HOOK
// =========================

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx;
}