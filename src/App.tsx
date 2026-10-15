import { IonApp, IonIcon, IonLabel, IonLoading, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { film, heart, people, person, shieldCheckmark } from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Welcome from './pages/Welcome';

setupIonicReact();

const AppRoutes = () => {
  const { profile, loading, isAdmin } = useAuth();

  if (loading) return <IonLoading isOpen message="Chargement..." />;

  // L'accueil public reste accessible sans compte.
  if (!profile) {
    return (
      <IonRouterOutlet>
        <Route exact path="/" component={Welcome} />
        <Route exact path="/about" component={Welcome} />
        <Route exact path="/apropos" component={Welcome} />
        <Route exact path="/contact" component={Welcome} />
        <Route exact path="/login"><Login /></Route>
        <Route exact path="/register"><Register /></Route>
        <Route render={() => <Redirect to="/" />} />
      </IonRouterOutlet>
    );
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home"><Home /></Route>
        <Route exact path="/favorites"><Favorites /></Route>
        <Route exact path="/matches"><Matches /></Route>
        <Route exact path="/profile"><Profile /></Route>
        <Route exact path="/admin">{isAdmin ? <Admin /> : <Redirect to="/home" />}</Route>
        <Route render={() => <Redirect to="/home" />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={film} /><IonLabel>Films</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorites" href="/favorites">
          <IonIcon icon={heart} /><IonLabel>Playlist</IonLabel>
        </IonTabButton>
        <IonTabButton tab="matches" href="/matches">
          <IonIcon icon={people} /><IonLabel>Affinités</IonLabel>
        </IonTabButton>
        {isAdmin && (
          <IonTabButton tab="admin" href="/admin">
            <IonIcon icon={shieldCheckmark} /><IonLabel>Admin</IonLabel>
          </IonTabButton>
        )}
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} /><IonLabel>Profil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
