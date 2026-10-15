import { useCallback, useEffect, useState } from 'react';
import {
  IonButton, IonContent, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonSegment,
  IonSegmentButton, IonLabel, IonSpinner, IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  arrowBack, arrowForward, film, heart, heartOutline, play, star,
} from 'ionicons/icons';
import MovieCard from '../components/MovieCard';
import AccountSidebar from '../components/AccountSidebar';
import { useAuth } from '../context/AuthContext';
import { Movie } from '../types';
import { fetchPopular, hasTmdbKey, searchTmdb } from '../services/tmdb';
import { fetchCustomMovies } from '../services/movies';
import { toggleFavorite } from '../services/users';

const Home = () => {
  const { profile } = useAuth();
  const history = useHistory();
  const [segment, setSegment] = useState<'tmdb' | 'custom'>('tmdb');
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (segment === 'custom') {
        const all = await fetchCustomMovies();
        const q = query.trim().toLowerCase();
        setMovies(q ? all.filter((m) => m.title.toLowerCase().includes(q)) : all);
      } else {
        setMovies(query.trim() ? await searchTmdb(query.trim()) : await fetchPopular());
      }
    } catch (e) {
      setMovies([]);
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [segment, query]);

  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    document.body.classList.add('movie-dashboard-active');
    return () => document.body.classList.remove('movie-dashboard-active');
  }, []);

  if (!profile) return null;

  const favoriteIds = new Set(profile.favorites.map((favorite) => favorite.id));
  const featured = movies[0];

  const onToggle = async (movie: Movie) => {
    try {
      await toggleFavorite(profile, movie);
    } catch {
      setError('Impossible de mettre à jour votre playlist.');
    }
  };

  const nav = (path: string) => history.push(path);

  return (
    <IonPage className="movie-dashboard-page">
      <IonContent className="movie-dashboard-content" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={async (event) => { await load(); event.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>

        <AccountSidebar active="home" />

        <main className="dash-main">
          <header className="dash-topbar">
            <div className="dash-history"><button aria-label="Page précédente" onClick={() => history.goBack()}><IonIcon icon={arrowBack} /></button><button aria-label="Page suivante" onClick={() => history.goForward()}><IonIcon icon={arrowForward} /></button></div>
            <div className="dash-search"><IonSearchbar value={query} placeholder="Rechercher un film" onIonInput={(event) => setQuery(String(event.detail.value ?? ''))} /></div>
            <button className="dash-top-avatar" onClick={() => nav('/profile')} aria-label="Ouvrir mon profil"><img src={profile.photo} alt="" /></button>
          </header>

          <div className="movie-dashboard">
            {featured && (
              <section className="featured-movie" aria-label="Film à découvrir">
                {featured.posterUrl && <img className="featured-movie__image" src={featured.posterUrl} alt="" />}
                <div className="featured-movie__shade" />
                <div className="featured-movie__content">
                  <p className="featured-movie__eyebrow"><IonIcon icon={star} /> À LA UNE</p>
                  <h1>{featured.title}</h1>
                  <div className="featured-movie__meta"><span className="featured-score">{featured.rating ? `${featured.rating.toFixed(1)} / 10` : 'NOUVEAUTÉ'}</span>{featured.year && <><i />{featured.year}</>}<i />À découvrir</div>
                  <p className="featured-movie__overview">{featured.overview || 'Ajoutez ce film à votre playlist et partagez votre passion du cinéma.'}</p>
                  <div className="featured-movie__actions"><a className="featured-primary" href="#movie-catalog"><IonIcon icon={play} /> Parcourir les films</a><IonButton fill="outline" className="featured-save" onClick={() => onToggle(featured)}><IonIcon slot="start" icon={favoriteIds.has(featured.id) ? heart : heartOutline} />{favoriteIds.has(featured.id) ? 'Dans ma playlist' : 'Ajouter'}</IonButton></div>
                </div>
              </section>
            )}

            <section className="dash-shelf" aria-labelledby="shelf-title">
              <div className="dash-section-heading"><div><p className="dashboard-kicker">VOS PROCHAINES DÉCOUVERTES</p><h2 id="shelf-title">À regarder</h2></div><button onClick={() => document.getElementById('movie-catalog')?.scrollIntoView({ behavior: 'smooth' })}>Tout voir <IonIcon icon={arrowForward} /></button></div>
              {loading && movies.length === 0 ? <div className="empty-state"><IonSpinner /></div> : (
                <div className="dash-shelf-row">
                  {movies.slice(featured ? 1 : 0, 6).map((movie) => (
                    <article className="shelf-card" key={movie.id}>
                      {movie.posterUrl ? <img src={movie.posterUrl} alt={movie.title} loading="lazy" /> : <div className="shelf-card__empty"><IonIcon icon={film} /></div>}
                      <div className="shelf-card__overlay"><button onClick={() => onToggle(movie)} aria-label={favoriteIds.has(movie.id) ? `Retirer ${movie.title} de la playlist` : `Ajouter ${movie.title} à la playlist`}><IonIcon icon={favoriteIds.has(movie.id) ? heart : heartOutline} /></button><span>{movie.rating ? <><IonIcon icon={star} /> {movie.rating.toFixed(1)}</> : movie.year}</span></div>
                      <h3>{movie.title}</h3><p>{movie.year || 'Film'}{movie.rating ? ` · ${movie.rating.toFixed(1)}/10` : ''}</p>
                    </article>
                  ))}
                  {!loading && movies.length === 0 && <p className="shelf-empty">Les films apparaîtront ici dès que le catalogue sera chargé.</p>}
                </div>
              )}
            </section>

            <section className="catalog-section" id="movie-catalog">
              <div className="dash-section-heading catalog-heading"><div><p className="dashboard-kicker">LE GRAND ÉCRAN VOUS ATTEND</p><h2>{query.trim() ? 'Résultats' : segment === 'custom' ? 'La sélection MovieMatch' : 'Explorer le catalogue'}</h2></div><span>{movies.length} film{movies.length === 1 ? '' : 's'}</span></div>
              <IonSegment value={segment} onIonChange={(event) => setSegment(event.detail.value as 'tmdb' | 'custom')}>
                <IonSegmentButton value="tmdb"><IonLabel>Films populaires</IonLabel></IonSegmentButton>
                <IonSegmentButton value="custom"><IonLabel>Sélection MovieMatch</IonLabel></IonSegmentButton>
              </IonSegment>
              {segment === 'tmdb' && !hasTmdbKey() && <div className="empty-state">Clé TMDB absente. Ajoutez VITE_TMDB_API_KEY dans le fichier .env puis relancez l'application.</div>}
              {loading && <div className="empty-state"><IonSpinner /></div>}
              {!loading && movies.length === 0 && (segment === 'custom' || hasTmdbKey()) && <div className="empty-state">{segment === 'custom' ? "L'administrateur n'a pas encore ajouté de film." : 'Aucun film trouvé.'}</div>}
              <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} isFavorite={favoriteIds.has(movie.id)} onToggle={() => onToggle(movie)} />)}</div>
            </section>
          </div>
        </main>
        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
