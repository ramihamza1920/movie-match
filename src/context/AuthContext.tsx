import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  /** true si la session a été coupée car le compte est désactivé */
  deactivated: boolean;
  clearDeactivated: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  deactivated: false,
  clearDeactivated: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deactivated, setDeactivated] = useState(false);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      unsubProfile?.();
      unsubProfile = null;
      setUser(u);

      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      // Écoute temps réel : si l'admin désactive le compte, l'utilisateur est déconnecté aussitôt
      unsubProfile = onSnapshot(
        doc(db, 'users', u.uid),
        (snap) => {
          if (snap.exists()) {
            const p = snap.data() as UserProfile;
            if (p.active === false) {
              setDeactivated(true);
              setProfile(null);
              signOut(auth);
            } else {
              setProfile(p);
            }
          } else {
            setProfile(null); // profil pas encore créé (inscription en cours)
          }
          setLoading(false);
        },
        () => setLoading(false)
      );
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin',
        deactivated,
        clearDeactivated: () => setDeactivated(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
