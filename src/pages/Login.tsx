import { useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonToast, IonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/users';
import heroBackdrop from '../assets/premiere-hero.jpg';

export const authErrorMessage = (e: unknown): string => {
  const code = (e as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email ou mot de passe incorrect.';
    case 'auth/invalid-email':
      return "L'adresse email n'est pas valide.";
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé.';
    case 'auth/weak-password':
      return 'Mot de passe trop court (6 caractères minimum).';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez dans quelques minutes.';
    case 'auth/network-request-failed':
      return 'Pas de connexion réseau.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return "Action refusée par les règles de sécurité.";
    default:
      return 'Une erreur est survenue. Réessayez.';
  }
};

const Login = () => {
  const history = useHistory();
  const { deactivated, clearDeactivated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email || !password) {
      setError('Renseignez votre email et votre mot de passe.');
      return;
    }
    clearDeactivated();
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      // La redirection est automatique : AuthContext charge le profil
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton className="auth-toolbar-link" slot="start" fill="clear" onClick={() => history.push('/')}>← Accueil</IonButton>
          <IonTitle>MovieMatch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="auth-content">
        <img className="auth-backdrop" src={heroBackdrop} alt="" aria-hidden="true" />
        <div className="auth-wrap">
          <div className="auth-brand"><span className="auth-brand__mark">MM</span><span>MOVIEMATCH <small>LE CINÉMA À VOTRE IMAGE</small></span></div>
          <h1>Connexion</h1>
          <p className="sub">Retrouvez vos films favoris et vos affinités.</p>

          {deactivated && (
            <IonText color="danger">
              <p>Votre compte a été désactivé par un administrateur.</p>
            </IonText>
          )}

          <IonInput
            label="Email" labelPlacement="floating" fill="outline" type="email"
            autocomplete="email" value={email}
            onIonInput={(e) => setEmail(String(e.detail.value ?? ''))}
          />
          <br />
          <IonInput
            label="Mot de passe" labelPlacement="floating" fill="outline" type="password"
            autocomplete="current-password" value={password}
            onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
            onKeyUp={(e) => e.key === 'Enter' && submit()}
          />
          <br />
          <IonButton className="auth-submit" expand="block" onClick={submit}>Se connecter</IonButton>
          <IonButton className="auth-switch" expand="block" fill="clear" onClick={() => history.push('/register')}>
            Pas encore de compte ? S'inscrire
          </IonButton>
        </div>
        <IonLoading isOpen={loading} message="Connexion..." />
        <IonToast isOpen={!!error} message={error} duration={3000} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
