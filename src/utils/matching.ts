import { UserProfile } from '../types';

/** Seuil minimum de correspondance (75 %) */
export const MATCH_THRESHOLD = 0.75;

/**
 * Taux de correspondance entre deux listes de favoris : indice de Jaccard
 *   |A ∩ B| / |A ∪ B|
 * 1 = listes identiques, 0 = rien en commun.
 */
export function similarity(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 || B.size === 0) return 0;

  let common = 0;
  A.forEach((id) => {
    if (B.has(id)) common++;
  });

  const union = A.size + B.size - common;
  return common / union;
}

export interface MatchResult {
  user: UserProfile;
  score: number; // entre 0 et 1
  commonMovies: { id: string; title: string }[];
}

/** Retourne les utilisateurs actifs dont le taux de correspondance atteint le seuil. */
export function findMatches(me: UserProfile, others: UserProfile[]): MatchResult[] {
  const myIds = me.favorites.map((f) => f.id);
  const mySet = new Set(myIds);

  return others
    .filter((u) => u.uid !== me.uid && u.active && u.role === 'user')
    .map((u) => ({
      user: u,
      score: similarity(myIds, u.favorites.map((f) => f.id)),
      commonMovies: u.favorites.filter((f) => mySet.has(f.id)).map((f) => ({ id: f.id, title: f.title })),
    }))
    .filter((m) => m.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}
