import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Movie } from '../types';

const COL = 'movies';

/** Films ajoutés par l'administrateur (collection Firestore "movies") */
export async function fetchCustomMovies(): Promise<Movie[]> {
  const snap = await getDocs(collection(db, COL));
  const rows = snap.docs.map((d) => {
    const data = d.data();
    return {
      createdAt: (data.createdAt as number) ?? 0,
      movie: {
        id: `c_${d.id}`,
        title: data.title as string,
        overview: (data.overview as string) ?? '',
        posterUrl: (data.posterUrl as string) || null,
        year: (data.year as string) ?? '',
        source: 'custom' as const,
      } satisfies Movie,
    };
  });
  return rows.sort((a, b) => b.createdAt - a.createdAt).map((r) => r.movie);
}

export async function addCustomMovie(input: {
  title: string;
  overview: string;
  year: string;
  posterUrl: string | null;
}) {
  await addDoc(collection(db, COL), { ...input, createdAt: Date.now() });
}
