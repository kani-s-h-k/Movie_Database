import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const StateContext = createContext(null);

export function useApp() {
  return useContext(StateContext);
}

/**
 * Holds app-wide state that is NOT navigation (the router owns that):
 * the signed-in Firebase user and the transient alert banner.
 */
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  // With no Firebase config there is nothing to wait for.
  const [authReady, setAuthReady] = useState(!auth);
  const [alert, setAlert] = useState(null);
  const alertTimer = useRef(null);

  const showAlert = useCallback((message, type) => {
    clearTimeout(alertTimer.current);
    setAlert({ message, type });
    alertTimer.current = setTimeout(() => setAlert(null), 4000);
  }, []);

  useEffect(() => () => clearTimeout(alertTimer.current), []);

  // Firebase restores the session on reload; this keeps `user` in sync.
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);

  const value = useMemo(
    () => ({ user, authReady, alert, showAlert }),
    [user, authReady, alert, showAlert]
  );

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}
