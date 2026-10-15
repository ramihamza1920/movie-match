import { Movie } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w342';

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
}

export const hasTmdbKey = () => Boolean(API_KEY);

const mapMovie = (m: TmdbMovie): Movie => ({
  id: `t_${m.id}`,
  title: m.title,
  overview: m.overview,
  posterUrl: m.poster_path ? `${IMG}${m.poster_path}` : null,
  year: m.release_date ? m.release_date.slice(0, 4) : '',
  rating: Math.round(m.vote_average * 10) / 10,
  source: 'tmdb',
});

async function get(path: string, params: Record<string, string> = {}): Promise<Movie[]> {
  if (!API_KEY) throw new Error('Clé TMDB manquante (VITE_TMDB_API_KEY)');
  const qs = new URLSearchParams({ api_key: API_KEY, language: 'fr-FR', ...params });
  const res = await fetch(`${BASE}${path}?${qs.toString()}`);
  if (!res.ok) throw new Error(`TMDB : erreur ${res.status}`);
  const json = await res.json();
  return (json.results as TmdbMovie[]).map(mapMovie);
}

export const fetchPopular = (page = 1) => get('/movie/popular', { page: String(page) });
export const searchTmdb = (query: string) => get('/search/movie', { query });
