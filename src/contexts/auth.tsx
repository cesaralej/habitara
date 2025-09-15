// AuthProvider.jsx
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useReducer } from "react";
import { ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true, // Start with loading as true
};

const AuthProviderContext = createContext<{
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  isLoading: boolean;
  signOutUser: () => Promise<void>;
} | null>(null);

// Action types
const AUTH_ACTIONS = {
  SET_USER: "set_user",
  LOADING: "loading",
  SIGN_OUT: "sign_out",
};

// Reducer function
interface AuthState {
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  isLoading: boolean;
}

interface AuthAction {
  type: string;
  payload?: FirebaseUser | boolean | null | undefined;
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AUTH_ACTIONS.SET_USER:
      // Use a type guard to ensure the payload is what you expect for this action
      if (action.payload === undefined) {
        // This case handles the undefined payload from the error callback
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          isLoading: false,
        };
      }
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload as FirebaseUser | null, // Cast it to the correct type
        isLoading: false,
      };
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        isLoading: action.payload as boolean,
      };
    case AUTH_ACTIONS.SIGN_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Handle sign out
  const signOutUser = async () => {
    try {
      await auth.signOut();
      dispatch({ type: AUTH_ACTIONS.SIGN_OUT });
    } catch (error) {
      console.error("Sign out error:", error);
      throw new Error("Failed to sign out");
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
      },
      (error) => {
        console.error("Auth state observer error:", error);
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: null });
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []); // Empty dependency array is correct here

  const value = {
    ...state,
    signOutUser,
  };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
