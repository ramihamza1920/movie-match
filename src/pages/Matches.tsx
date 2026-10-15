import { useCallback, useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { arrowForward, heart, people, refresh, star } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAllUsers } from '../services/users';
import { findMatches, MATCH_THRESHOLD, MatchResult } from '../utils/matching';
import AccountSidebar from '../components/AccountSidebar';

const Matches = () => {
  const { profile } = useAuth();
  const history = useHistory();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const favoriteKey = profile?.favorites.map((movie) => movie.id).join(',') ?? '';
  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setMatches(findMatches(profile, users));
      setError('');
    } catch {
      setError('Impossible de charger les affinités pour le moment.');
    } finally {
      setLoading(false);
    }
  }, [profile?.uid, favoriteKey]);

  useEffect(() => { load(); }, [load]);
  if (!profile) return null;

  return (
    <IonPage className="matches-page">
      <AccountSidebar active="matches" />
      <IonHeader><IonToolbar><IonTitle>Affinités</IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={async (event) => { await load(); event.detail.complete(); }}><IonRefresherContent /></IonRefresher>
        <main className="matches-main">
          <section className="matches-hero"><div><p className="page-eyebrow">LE CINÉMA RAPPROCHE</p><h1>Vos goûts ont<br /><em>quelque chose en commun.</em></h1><p>Retrouvez les cinéphiles dont la playlist ressemble à la vôtre.</p></div><div className="matches-hero__badge"><IonIcon icon={people} /><b>{matches.length.toString().padStart(2, '0')}</b><span>AFFINITÉS<br />TROUVÉES</span></div><div className="matches-threshold"><span>SEUIL DE CORRESPONDANCE</span><b>{Math.round(MATCH_THRESHOLD * 100)}%</b></div></section>

          <div className="matches-heading"><div><p className="page-eyebrow">VOS RENCONTRES CINÉPHILES</p><h2>La même passion, les mêmes films.</h2></div><IonButton fill="clear" onClick={load}><IonIcon slot="start" icon={refresh} /> Actualiser</IonButton></div>
          {loading && <div className="matches-loading"><IonSpinner /><span>Recherche de vos affinités…</span></div>}
          {!loading && error && <section className="matches-empty"><h3>Le chargement a échoué.</h3><p>{error}</p><IonButton onClick={load}>Réessayer</IonButton></section>}
          {!loading && !error && profile.favorites.length === 0 && <section className="matches-empty"><span><IonIcon icon={heart} /></span><h3>Votre playlist est encore vide.</h3><p>Ajoutez quelques films pour découvrir les membres qui partagent vos goûts.</p><IonButton onClick={() => history.push('/home')}>Choisir des films <IonIcon slot="end" icon={arrowForward} /></IonButton></section>}
          {!loading && !error && profile.favorites.length > 0 && matches.length === 0 && <section className="matches-empty"><span><IonIcon icon={people} /></span><h3>Vos prochaines affinités se préparent.</h3><p>Aucun membre n’atteint encore {Math.round(MATCH_THRESHOLD * 100)} % de correspondance. Revenez après avoir enrichi votre playlist.</p><IonButton fill="outline" onClick={() => history.push('/home')}>Explorer le catalogue <IonIcon slot="end" icon={arrowForward} /></IonButton></section>}

          {!loading && !error && matches.length > 0 && <div className="matches-grid">{matches.map((match) => <article className="match-card" key={match.user.uid}><div className="match-card__top"><img src={match.user.photo} alt={`Portrait de ${match.user.prenom}`} /><span className="match-card__percent">{Math.round(match.score * 100)}<small>%</small></span></div><p className="page-eyebrow">CINÉPHILE MOVIEMATCH</p><h3>{match.user.prenom} {match.user.nom}</h3><p className="match-card__age">{match.user.age} ans · {match.commonMovies.length} film{match.commonMovies.length === 1 ? '' : 's'} en commun</p><div className="match-card__movies">{match.commonMovies.slice(0, 4).map((movie) => <span key={movie.id}><IonIcon icon={star} />{movie.title}</span>)}</div><div className="match-card__foot"><span><i /> Forte affinité</span><IonIcon icon={arrowForward} /></div></article>)}</div>}
        </main>
        <IonToast isOpen={!!error && !loading} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default Matches;
