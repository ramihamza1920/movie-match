import { useState } from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToast, IonToolbar,
} from '@ionic/react';
import PhotoPicker from '../components/PhotoPicker';
import { registerUser } from '../services/users';
import { authErrorMessage } from './Login';
import heroBackdrop from '../assets/premiere-hero.jpg';

const Register = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const ageNum = Number(age);
    if (!prenom.trim() || !nom.trim() || !email.trim() || !password) {
      return setError('Tous les champs sont obligatoires.');
    }
    if (!Number.isInteger(ageNum) || ageNum < 5 || ageNum > 120) {
      return setError('Âge invalide.');
    }
    if (password.length < 6) {
      return setError('Le mot de passe doit contenir 6 caractères minimum.');
    }
    if (!photo) {
      return setError('Prenez une photo avec la caméra pour finaliser votre inscription.');
    }

    setLoading(true);
    try {
      await registerUser({
        email: email.trim(), password, nom: nom.trim(), prenom: prenom.trim(), age: ageNum, photo,
      });
      // AuthContext détecte le nouveau profil et redirige vers l'application
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
          <IonButtons slot="start">
            <IonButton className="auth-toolbar-link register-nav-home" fill="clear" routerLink="/">Accueil</IonButton>
            <IonButton className="auth-toolbar-link register-nav-login" fill="clear" routerLink="/login">Connexion</IonButton>
          </IonButtons>
          <IonTitle>Inscription</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="auth-content">
        <img className="auth-backdrop" src={heroBackdrop} alt="" aria-hidden="true" />
        <div className="auth-wrap register-wrap">
          <div className="auth-brand"><span className="auth-brand__mark">MM</span><span>MOVIEMATCH <small>VOTRE HISTOIRE COMMENCE ICI</small></span></div>
          <h1>Créer un compte</h1>
          <p className="sub">Rejoignez une communauté de passionnés et trouvez vos prochaines découvertes.</p>
          <PhotoPicker value={photo} onChange={setPhoto} onError={setError} variant="selfie" />

          <div className="register-fields">
            <IonInput label="Prénom" labelPlacement="floating" fill="outline" value={prenom}
              onIonInput={(e) => setPrenom(String(e.detail.value ?? ''))} />
            <IonInput label="Nom" labelPlacement="floating" fill="outline" value={nom}
              onIonInput={(e) => setNom(String(e.detail.value ?? ''))} />
            <IonInput label="Âge" labelPlacement="floating" fill="outline" type="number" inputmode="numeric" value={age}
              onIonInput={(e) => setAge(String(e.detail.value ?? ''))} />
            <IonInput label="Email" labelPlacement="floating" fill="outline" type="email" value={email}
              onIonInput={(e) => setEmail(String(e.detail.value ?? ''))} />
            <IonInput className="register-password" label="Mot de passe" labelPlacement="floating" fill="outline" type="password" value={password}
              onIonInput={(e) => setPassword(String(e.detail.value ?? ''))} />
          </div>
          <br />
          <IonButton className="auth-submit" expand="block" onClick={submit}>Créer mon compte</IonButton>
          <IonButton className="auth-switch" expand="block" fill="clear" routerLink="/login">Déjà inscrit ? Se connecter</IonButton>
        </div>
        <IonLoading isOpen={loading} message="Création du compte..." />
        <IonToast isOpen={!!error} message={error} duration={3500} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default Register;
