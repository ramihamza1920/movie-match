import { useCallback, useEffect, useState } from 'react';
import {
  IonAvatar, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage,
  IonSegment, IonSegmentButton, IonSpinner, IonTextarea, IonTitle, IonToast, IonToggle, IonToolbar, IonSearchbar,
} from '@ionic/react';
import PhotoPicker from '../components/PhotoPicker';
import { useAuth } from '../context/AuthContext';
import { addCustomMovie } from '../services/movies';
import { fetchAllUsers, setUserActive } from '../services/users';
import { UserProfile } from '../types';
import AccountSidebar from '../components/AccountSidebar';

const Admin = () => {
  const { profile } = useAuth();
  const [segment, setSegment] = useState<'movie' | 'users'>('movie');

  // --- Ajout de film ---
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [overview, setOverview] = useState('');
  const [poster, setPoster] = useState<string | null>(null);

  // --- Utilisateurs ---
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; color: 'success' | 'danger' } | null>(null);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const all = await fetchAllUsers();
      setUsers(all.sort((a, b) => a.nom.localeCompare(b.nom)));
    } catch {
      setToast({ msg: 'Impossible de charger les utilisateurs.', color: 'danger' });
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (segment === 'users') loadUsers();
  }, [segment, loadUsers]);

  const saveMovie = async () => {
    if (!title.trim()) return setToast({ msg: 'Le titre est obligatoire.', color: 'danger' });
    if (year.trim() && (!/^\d{4}$/.test(year.trim()) || Number(year) < 1888 || Number(year) > new Date().getFullYear() + 5)) {
      return setToast({ msg: 'Indiquez une année valide entre 1888 et 5 ans dans le futur.', color: 'danger' });
    }
    setSaving(true);
    try {
      await addCustomMovie({ title: title.trim(), year: year.trim(), overview: overview.trim(), posterUrl: poster });
      setTitle(''); setYear(''); setOverview(''); setPoster(null);
      setToast({ msg: 'Film ajouté.', color: 'success' });
    } catch {
      setToast({ msg: "Impossible d'ajouter le film.", color: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: UserProfile, active: boolean) => {
    try {
      await setUserActive(u.uid, active);
      setUsers((prev) => prev.map((x) => (x.uid === u.uid ? { ...x, active } : x)));
      setToast({ msg: active ? 'Compte réactivé.' : 'Compte désactivé.', color: 'success' });
    } catch {
      setToast({ msg: 'Action refusée.', color: 'danger' });
      loadUsers();
    }
  };

  return (
    <IonPage className="admin-page">
      <AccountSidebar active="admin" />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Administration</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <main className="admin-main">
          <section className="admin-intro"><div><p className="page-eyebrow">ESPACE DE GESTION</p><h1>Administration</h1><p>Gérez le catalogue et accompagnez la communauté MovieMatch.</p></div><div className="admin-intro__badge">ACCÈS ADMINISTRATEUR</div></section>
          <div className="admin-tabs"><IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as 'movie' | 'users')}>
            <IonSegmentButton value="movie"><IonLabel>Ajouter un film</IonLabel></IonSegmentButton>
            <IonSegmentButton value="users"><IonLabel>Utilisateurs ({users.length})</IonLabel></IonSegmentButton>
          </IonSegment></div>

        {segment === 'movie' && (
          <section className="admin-form-card">
            <div className="admin-form-card__head"><div><p className="page-eyebrow">ENRICHIR LE CATALOGUE</p><h2>Ajouter un nouveau film</h2><p>Complétez les informations qui apparaîtront dans le catalogue.</p></div><span className="admin-form-icon">✦</span></div>
            <PhotoPicker value={poster} onChange={setPoster} onError={(m) => setToast({ msg: m, color: 'danger' })}
              variant="poster" label={poster ? "Changer l'affiche" : 'Ajouter une affiche'} />
            <IonInput label="Titre du film *" labelPlacement="floating" fill="outline" value={title}
              onIonInput={(e) => setTitle(String(e.detail.value ?? ''))} />
            <br />
            <IonInput label="Année de sortie" labelPlacement="floating" fill="outline" inputmode="numeric" maxlength={4} value={year}
              onIonInput={(e) => setYear(String(e.detail.value ?? ''))} />
            <br />
            <IonTextarea label="Synopsis" labelPlacement="floating" fill="outline" rows={5} value={overview}
              onIonInput={(e) => setOverview(String(e.detail.value ?? ''))} />
            <br />
            <IonButton expand="block" disabled={saving || !title.trim()} onClick={saveMovie}>Enregistrer le film</IonButton>
          </section>
        )}

        {segment === 'users' && (
          <section className="admin-users">
            <div className="admin-users__head"><div><p className="page-eyebrow">VOTRE COMMUNAUTÉ</p><h2>Comptes utilisateurs</h2><p>{users.filter((user) => user.active).length} comptes actifs · {users.filter((user) => !user.active).length} désactivés</p></div><IonButton fill="outline" onClick={loadUsers}>Actualiser</IonButton></div>
            <IonSearchbar value={userQuery} placeholder="Rechercher un nom ou un email" onIonInput={(e) => setUserQuery(String(e.detail.value ?? ''))} />
            {usersLoading ? <div className="admin-loading"><IonSpinner /><span>Chargement des comptes…</span></div> : users.filter((user) => `${user.prenom} ${user.nom} ${user.email}`.toLowerCase().includes(userQuery.trim().toLowerCase())).length === 0 ? <div className="admin-empty">{users.length === 0 ? 'Aucun compte utilisateur.' : 'Aucun compte ne correspond à cette recherche.'}</div> : <IonList className="admin-user-list">
            {users.filter((user) => `${user.prenom} ${user.nom} ${user.email}`.toLowerCase().includes(userQuery.trim().toLowerCase())).map((u) => {
              const locked = u.role === 'admin' || u.uid === profile?.uid;
              return (
                <IonItem key={u.uid} lines="full">
                  <IonAvatar slot="start"><img src={u.photo} alt={u.prenom} /></IonAvatar>
                  <IonLabel className="ion-text-wrap">
                    <h2>{u.prenom} {u.nom}</h2>
                    <p>{u.email}{u.role === 'admin' ? ' · Administrateur' : ''}</p>
                    <span className={`user-status ${u.active ? 'is-active' : 'is-disabled'}`}><i />{u.active ? 'Actif' : 'Désactivé'}</span>
                  </IonLabel>
                  <IonToggle
                    slot="end"
                    checked={u.active}
                    disabled={locked}
                    aria-label={`${u.active ? 'Désactiver' : 'Activer'} le compte de ${u.prenom} ${u.nom}`}
                    onIonChange={(e) => {
                      if (e.detail.checked !== u.active) toggleActive(u, e.detail.checked);
                    }}
                  />
                </IonItem>
              );
            })}
            </IonList>}
          </section>
        )}
        </main>

        <IonLoading isOpen={saving} message="Enregistrement..." />
        <IonToast isOpen={!!toast} message={toast?.msg} duration={2500} color={toast?.color}
          onDidDismiss={() => setToast(null)} />
      </IonContent>
    </IonPage>
  );
};

export default Admin;
