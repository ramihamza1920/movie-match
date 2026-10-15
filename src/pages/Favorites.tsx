import { useMemo, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { arrowForward, heart, film } from 'ionicons/icons';
import MovieCard from '../components/MovieCard';
import AccountSidebar from '../components/AccountSidebar';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite } from '../services/users';

const Favorites = () => {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const favorites = useMemo(() => profile?.favorites.filter((movie) => movie.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) ?? [], [profile?.favorites, query]);

  if (!profile) return null;

  return (
    <IonPage className="collection-page">
      <AccountSidebar active="favorites" />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ma playlist</IonTitle>
          <span className="toolbar-count" slot="end"><IonIcon icon={heart} /> {profile.favorites.length}</span>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="collection-main">
          <section className="collection-intro">
            <p className="page-eyebrow">VOTRE COLLECTION PERSONNELLE</p>
            <div className="collection-intro__row"><div><h1>Les films qui vous ressemblent.</h1><p>Vos coups de cœur, réunis au même endroit.</p></div><div className="collection-stat"><b>{profile.favorites.length.toString().padStart(2, '0')}</b><span>FILMS<br />ENREGISTRÉS</span></div></div>
          </section>

          {profile.favorites.length > 0 && <div className="collection-tools"><IonSearchbar value={query} placeholder="Rechercher dans ma playlist" onIonInput={(event) => setQuery(String(event.detail.value ?? ''))} /><span>{favorites.length} résultat{favorites.length === 1 ? '' : 's'}</span></div>}

          {profile.favorites.length === 0 ? (
            <section className="collection-empty"><span className="collection-empty__icon"><IonIcon icon={film} /></span><h2>Votre playlist commence ici.</h2><p>Ajoutez les films que vous aimez depuis l’exploration pour les retrouver facilement.</p><IonButton routerLink="/home">Explorer les films <IonIcon slot="end" icon={arrowForward} /></IonButton></section>
          ) : favorites.length === 0 ? (
            <div className="collection-no-results">Aucun film ne correspond à « {query} ».</div>
          ) : (
            <div className="movie-grid favorites-grid">
              {favorites.map((movie) => <MovieCard key={movie.id} movie={movie} isFavorite onToggle={() => toggleFavorite(profile, movie).catch(() => setError('Impossible de retirer ce film de votre playlist.'))} />)}
            </div>
          )}
        </main>
        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default Favorites;
