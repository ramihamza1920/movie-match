import { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { arrowForward, heart, logOut, people, shieldCheckmark } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/users';
import AccountSidebar from '../components/AccountSidebar';

const Profile = () => {
  const { profile, isAdmin } = useAuth();
  const history = useHistory();
  const [error, setError] = useState('');
  if (!profile) return null;

  return (
    <IonPage className="profile-page">
      <AccountSidebar active="profile" />
      <IonHeader><IonToolbar><IonTitle>Mon profil</IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <main className="profile-main">
          <section className="profile-cover">
            <div className="profile-cover__grain" />
            <div className="profile-cover__identity"><img src={profile.photo} alt={`Portrait de ${profile.prenom}`} /><div><p className="page-eyebrow">VOTRE ESPACE CINÉPHILE</p><h1>{profile.prenom} {profile.nom}</h1><span>{isAdmin ? <><IonIcon icon={shieldCheckmark} /> Administrateur</> : 'Membre MovieMatch'}</span></div></div>
            <div className="profile-cover__stat"><IonIcon icon={heart} /><b>{profile.favorites.length}</b><span>favori{profile.favorites.length === 1 ? '' : 's'}</span></div>
          </section>

          <section className="profile-details">
            <div className="profile-section-title"><p className="page-eyebrow">INFORMATIONS</p><h2>Votre compte</h2></div>
            <IonList inset className="profile-list">
              <IonItem><IonLabel><span className="detail-label">Adresse e-mail</span><h3>{profile.email}</h3></IonLabel><IonLabel slot="end" className="detail-side">COMPTE</IonLabel></IonItem>
              <IonItem><IonLabel><span className="detail-label">Prénom et nom</span><h3>{profile.prenom} {profile.nom}</h3></IonLabel></IonItem>
              <IonItem><IonLabel><span className="detail-label">Âge</span><h3>{profile.age} ans</h3></IonLabel></IonItem>
            </IonList>
          </section>

          <section className="profile-shortcuts">
            <button onClick={() => history.push('/favorites')}><span><IonIcon icon={heart} /></span><b>Ma playlist</b><small>{profile.favorites.length} film{profile.favorites.length === 1 ? '' : 's'} enregistré{profile.favorites.length === 1 ? '' : 's'}</small><IonIcon className="shortcut-arrow" icon={arrowForward} /></button>
            <button onClick={() => history.push('/matches')}><span><IonIcon icon={people} /></span><b>Affinités</b><small>Rencontrer des cinéphiles aux goûts proches</small><IonIcon className="shortcut-arrow" icon={arrowForward} /></button>
            {isAdmin && <button onClick={() => history.push('/admin')}><span><IonIcon icon={shieldCheckmark} /></span><b>Administration</b><small>Gérer le catalogue et les comptes</small><IonIcon className="shortcut-arrow" icon={arrowForward} /></button>}
          </section>

          <div className="profile-actions"><IonButton fill="outline" color="secondary" onClick={() => logoutUser().catch(() => setError('La déconnexion a échoué. Réessayez.'))}><IonIcon slot="start" icon={logOut} /> Se déconnecter</IonButton></div>
        </main>
        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
