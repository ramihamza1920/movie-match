import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { FavoriteMovie, Movie, UserProfile } from '../types';

const COL = 'users';

export async function registerUser(data: {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  age: number;
  photo: string;
}) {
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const profile: UserProfile = {
    uid: cred.user.uid,
    email: data.email,
    nom: data.nom,
    prenom: data.prenom,
    age: data.age,
    photo: data.photo,
    role: 'user',
    active: true,
    favorites: [],
    createdAt: Date.now(),
  };
  await setDoc(doc(db, COL, cred.user.uid), profile);
}

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => d.data() as UserProfile);
}

/** Désactivation / réactivation (on ne supprime jamais un utilisateur) */
export const setUserActive = (uid: string, active: boolean) =>
  updateDoc(doc(db, COL, uid), { active });

/** Ajoute ou retire un film de la playlist de favoris */
export async function toggleFavorite(profile: UserProfile, movie: Movie | FavoriteMovie) {
  const exists = profile.favorites.some((f) => f.id === movie.id);
  const favorites: FavoriteMovie[] = exists
    ? profile.favorites.filter((f) => f.id !== movie.id)
    : [...profile.favorites, { id: movie.id, title: movie.title, posterUrl: movie.posterUrl }];
  await updateDoc(doc(db, COL, profile.uid), { favorites });
}
