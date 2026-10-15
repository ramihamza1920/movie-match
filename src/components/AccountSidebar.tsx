import { useState } from 'react';
import { IonIcon, IonToast } from '@ionic/react';
import { film, heart, logOut, people, person, play, shieldCheckmark } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/users';

type Section = 'home' | 'favorites' | 'matches' | 'profile' | 'admin';

interface Props { active: Section; }

const AccountSidebar = ({ active }: Props) => {
  const { profile, isAdmin } = useAuth();
  const history = useHistory();
  const [error, setError] = useState('');
  if (!profile) return null;

  const navigate = (path: string) => history.push(path);

  return (
    <>
      <aside className="account-sidebar" aria-label="Navigation de MovieMatch">
        <button className="account-sidebar__brand" onClick={() => navigate('/home')}>
          <span className="account-sidebar__mark"><IonIcon icon={play} /></span>
          <span>MOVIE<span>MATCH</span><small>VOTRE CLUB CINÉMA</small></span>
        </button>
        <p className="account-sidebar__label">DÉCOUVRIR</p>
        <button className={`account-sidebar__link ${active === 'home' ? 'is-active' : ''}`} onClick={() => navigate('/home')}><IonIcon icon={film} />Explorer</button>
        <button className={`account-sidebar__link ${active === 'favorites' ? 'is-active' : ''}`} onClick={() => navigate('/favorites')}><IonIcon icon={heart} />Ma playlist<span className="account-sidebar__count">{profile.favorites.length}</span></button>
        <button className={`account-sidebar__link ${active === 'matches' ? 'is-active' : ''}`} onClick={() => navigate('/matches')}><IonIcon icon={people} />Affinités</button>
        {isAdmin && <button className={`account-sidebar__link ${active === 'admin' ? 'is-active' : ''}`} onClick={() => navigate('/admin')}><IonIcon icon={shieldCheckmark} />Administration</button>}
        <div className="account-sidebar__divider" />
        <p className="account-sidebar__label">MON ESPACE</p>
        <button className={`account-sidebar__link ${active === 'profile' ? 'is-active' : ''}`} onClick={() => navigate('/profile')}><IonIcon icon={person} />Mon profil</button>
        <div className="account-sidebar__user"><img src={profile.photo} alt="" /><span><b>{profile.prenom} {profile.nom}</b><small>{isAdmin ? 'Administrateur' : 'Membre MovieMatch'}</small></span></div>
        <button className="account-sidebar__logout" onClick={() => logoutUser().catch(() => setError('Déconnexion impossible.'))}><IonIcon icon={logOut} />Se déconnecter</button>
      </aside>
      <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
    </>
  );
};

export default AccountSidebar;
