# MovieMatch — Ionic React + Firebase

Application de gestion de films : inscription (photo caméra), playlist de favoris,
administration (ajout de films, désactivation d'utilisateurs) et matching entre utilisateurs (≥ 75 %).

## Étapes pour lancer le projet

### 1. Prérequis
- Node.js 18+ (`node -v`)
- Ionic CLI : `npm install -g @ionic/cli`
- Android Studio (seulement pour tester sur téléphone)

### 2. Installer les dépendances
```bash
cd movie-match
npm install
```

### 3. Créer le projet Firebase
1. https://console.firebase.google.com > **Ajouter un projet**.
2. **Authentication** > Commencer > **Adresse e-mail/Mot de passe** > Activer.
3. **Firestore Database** > Créer une base (mode production, région proche de vous).
4. Onglet **Règles** de Firestore : collez le contenu de `firestore.rules` > Publier.
5. Paramètres du projet (roue dentée) > **Vos applications** > icône `</>` (Web) > enregistrez l'app,
   puis copiez la configuration `firebaseConfig`.

### 4. Clé TMDB
1. Créez un compte sur https://www.themoviedb.org
2. Paramètres > API > demandez une clé (usage personnel / éducatif).
3. Copiez la clé « API Key (v3 auth) ».

### 5. Fichier .env
```bash
cp .env.example .env
```
Remplissez `.env` avec les valeurs Firebase et la clé TMDB, puis lancez :
```bash
ionic serve        # ou : npm run dev
```

### 6. Créer le compte administrateur
1. Inscrivez-vous normalement dans l'application (c'est un compte "user").
2. Firebase Console > Firestore > collection `users` > votre document.
3. Modifiez le champ `role` : `user` → `admin`.
4. Déconnectez-vous puis reconnectez-vous : l'onglet **Admin** apparaît.

(Les règles de sécurité interdisent à un utilisateur de se donner le rôle admin lui-même.)

### 7. Tester le matching
Le seuil est de 75 % avec l'indice de Jaccard : |A ∩ B| / |A ∪ B|.
Exemple : 3 films en commun sur 4 films au total (union) = 75 % → match.
1. Créez 2 comptes utilisateurs (A et B).
2. Ajoutez la même playlist (ex. 4 films) aux deux : 100 %.
3. Ajoutez/retirez un film chez B pour voir le pourcentage changer.
4. Onglet **Affinités** : A voit B si le taux est ≥ 75 %.

### 8. Application Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android      # Android Studio > Run
```
Ajoutez dans `android/app/src/main/AndroidManifest.xml` si absent :
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```
Après chaque modification du code : `npm run build && npx cap sync android`.

## Structure
```
src/
  firebase.ts            Initialisation Firebase (Auth + Firestore)
  types.ts               Types UserProfile, Movie, FavoriteMovie
  context/AuthContext    Session + profil en temps réel (déconnexion auto si désactivé)
  services/tmdb.ts       API TMDB (populaires, recherche)
  services/movies.ts     Films ajoutés par l'admin (Firestore)
  services/users.ts      Inscription, connexion, favoris, activation
  utils/matching.ts      Algorithme de matching (seuil 75 %)
  utils/image.ts         Compression de la photo
  components/            MovieCard, PhotoPicker (caméra)
  pages/                 Login, Register, Home, Favorites, Matches, Profile, Admin
```

## Modèle de données Firestore
- `users/{uid}` : uid, email, nom, prenom, age, photo (data URL JPEG), role (`user`|`admin`),
  active (bool), favorites [{id, title, posterUrl}], createdAt
- `movies/{id}` : title, year, overview, posterUrl, createdAt

Identifiants de films : `t_<id TMDB>` pour TMDB, `c_<id doc>` pour les films de l'admin.
