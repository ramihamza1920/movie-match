export type Role = 'user' | 'admin';

/** Version allégée d'un film, stockée dans la liste de favoris de l'utilisateur */
export interface FavoriteMovie {
  id: string; // "t_123" (TMDB) ou "c_abc" (film ajouté par l'admin)
  title: string;
  posterUrl: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  nom: string;
  prenom: string;
  age: number;
  photo: string; // data URL (JPEG compressé)
  role: Role;
  active: boolean;
  favorites: FavoriteMovie[];
  createdAt: number;
}

export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string | null;
  year: string;
  rating?: number;
  source: 'tmdb' | 'custom';
}
