import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForward, film, heart, people, play, sparkles, star } from 'ionicons/icons';
import { useLocation, useHistory } from 'react-router-dom';
import heroBackdrop from '../assets/premiere-hero.jpg';
import spotlightImage from '../assets/premiere-spotlight.jpg';

const Welcome = () => {
  const location = useLocation();
  const history = useHistory();
  const page = location.pathname === '/contact' ? 'contact' : location.pathname === '/about' || location.pathname === '/apropos' ? 'about' : 'home';
  const go = (path: string) => history.push(path);

  return (
    <IonPage>
      <IonContent className="welcome-content" fullscreen>
        <div className={`welcome-shell ${page !== 'home' ? 'welcome-shell--subpage' : ''}`}>
          {page !== 'home' && <img className="subpage-backdrop" src={heroBackdrop} alt="" aria-hidden="true" />}
          <header className="welcome-nav">
            <button className="brand" onClick={() => go('/')} aria-label="MovieMatch, accueil"><span className="brand-mark"><IonIcon icon={film} /></span><span>movie<span className="brand-accent">match</span></span></button>
            <nav aria-label="Navigation principale">
              <button className={page === 'home' ? 'active' : ''} onClick={() => go('/')}>Accueil</button>
              <button className={page === 'about' ? 'active' : ''} onClick={() => go('/about')}>À propos</button>
              <button className={page === 'contact' ? 'active' : ''} onClick={() => go('/contact')}>Contact</button>
            </nav>
            <IonButton className="nav-login" routerLink="/login" fill="clear">Se connecter <IonIcon slot="end" icon={arrowForward} /></IonButton>
          </header>

          {page === 'home' ? (
            <main>
              <section className="stream-hero">
                <img className="stream-hero__image" src={heroBackdrop} alt="Une rue de cinéma éclairée à la nuit tombée" />
                <div className="stream-hero__shade" />
                <div className="stream-hero__content">
                  <p className="stream-eyebrow"><IonIcon icon={star} /> VOTRE CLUB DE CINÉMA</p>
                  <h1>Chaque film ouvre<br />un nouveau <span>monde.</span></h1>
                  <div className="stream-meta"><span className="match-pill">✦ VOS GOÛTS, VOS DÉCOUVERTES</span><i /> Playlist personnelle <i /> Rencontres cinéphiles</div>
                  <p className="stream-description">Découvrez votre prochain coup de cœur, gardez vos films préférés et trouvez les personnes qui les aiment autant que vous.</p>
                  <div className="stream-actions"><IonButton className="cta-primary" routerLink="/register"><IonIcon slot="start" icon={play} /> Rejoindre MovieMatch</IonButton><button className="stream-info" onClick={() => go('/about')}><span>i</span> En savoir plus</button></div>
                </div>
                <div className="stream-hero__bottom"><span><b>01</b> — Les histoires sont meilleures ensemble.</span><span className="hero-indicators"><i className="selected" /><i /><i /></span></div>
              </section>
              <section className="stream-section">
                <div className="stream-section__head"><div><p className="stream-kicker">POUR VOTRE PROCHAINE SOIRÉE</p><h2>À découvrir sur MovieMatch</h2></div><button onClick={() => go('/register')}>Explorer les films <IonIcon icon={arrowForward} /></button></div>
                <div className="stream-cards">
                  <article className="stream-card card-discover"><span className="stream-card__number">01</span><div className="stream-card__icon"><IonIcon icon={film} /></div><div><small>À VOUS DE CHOISIR</small><h3>Des films à<br />découvrir.</h3><p>Explorez un catalogue qui vous réserve toujours une surprise.</p></div><button onClick={() => go('/register')} aria-label="Découvrir les films"><IonIcon icon={arrowForward} /></button></article>
                  <article className="stream-card card-favorites"><span className="stream-card__number">02</span><div className="stream-card__icon"><IonIcon icon={heart} /></div><div><small>VOTRE COLLECTION</small><h3>Vos favoris,<br />votre histoire.</h3><p>Retrouvez au même endroit les films qui vous ressemblent.</p></div><button onClick={() => go('/register')} aria-label="Créer ma playlist"><IonIcon icon={arrowForward} /></button></article>
                  <article className="stream-card card-matches"><span className="stream-card__number">03</span><div className="stream-card__icon"><IonIcon icon={people} /></div><div><small>À REGARDER ENSEMBLE</small><h3>Les mêmes goûts.<br />La même passion.</h3><p>Rencontrez des cinéphiles qui partagent votre playlist.</p></div><button onClick={() => go('/register')} aria-label="Trouver des affinités"><IonIcon icon={arrowForward} /></button></article>
                </div>
              </section>
              <section className="stream-spotlight">
                <img src={spotlightImage} alt="Un navire illuminé dans le port au crépuscule" />
                <div className="stream-spotlight__copy"><p className="stream-kicker">LE CINÉMA EST ENCORE MEILLEUR À PLUSIEURS</p><h2>Les bons films<br />créent des liens.</h2><p>Votre prochaine discussion passionnée est peut-être au détour d’une playlist. MovieMatch rapproche les cinéphiles, un film à la fois.</p><IonButton className="cta-primary" routerLink="/register">Trouver mes affinités <IonIcon slot="end" icon={arrowForward} /></IonButton></div>
              </section>
              <footer className="welcome-footer"><span>© MovieMatch</span><span>Fait pour les amoureux du cinéma <span className="footer-star">✦</span></span><button onClick={() => go('/contact')}>Nous contacter</button></footer>
            </main>
          ) : (
            <>
              <main className={`welcome-subpage welcome-subpage--${page}`}>
                <div className="subpage-kicker"><IonIcon icon={sparkles} /> {page === 'about' ? 'NOTRE UNIVERS' : 'À VOTRE ÉCOUTE'}</div>
                {page === 'about' ? (
                  <div className="welcome-editorial about-editorial">
                    <p className="editorial-overline">LE CINÉMA NOUS RAPPROCHE</p>
                    <h1>Les histoires<br />nous <span>rassemblent.</span></h1>
                    <p className="editorial-lead">MovieMatch transforme votre passion du cinéma en découvertes et en rencontres.</p>
                    <p>Parcourez une sélection de films, gardez vos coups de cœur dans une playlist personnelle et trouvez des cinéphiles qui partagent vos goûts. Chaque film aimé devient le début d’une nouvelle conversation.</p>
                    <div className="editorial-pillars" aria-label="Les trois étapes MovieMatch">
                      <div><span>01</span><strong>Découvrir</strong><small>Explorez des films à votre rythme.</small></div>
                      <div><span>02</span><strong>Collectionner</strong><small>Composez une playlist qui vous ressemble.</small></div>
                      <div><span>03</span><strong>Partager</strong><small>Rencontrez celles et ceux qui les aiment aussi.</small></div>
                    </div>
                    <IonButton className="cta-primary" routerLink="/register">Créer mon compte <IonIcon slot="end" icon={arrowForward} /></IonButton>
                  </div>
                ) : (
                  <div className="welcome-editorial contact-editorial">
                    <p className="editorial-overline">UNE QUESTION, UNE IDÉE ?</p>
                    <h1>Parlons<br /><span>cinéma.</span></h1>
                    <p className="editorial-lead">Notre équipe est à votre écoute.</p>
                    <p>Vous souhaitez nous faire part d’une remarque, signaler un problème ou simplement nous parler de votre expérience ? Écrivez-nous, nous vous répondrons avec plaisir.</p>
                    <a className="contact-link" href="mailto:bonjour@moviematch.app"><span><small>ÉCRIVEZ-NOUS</small><strong>bonjour@moviematch.app</strong></span><IonIcon icon={arrowForward} /></a>
                    <p className="contact-note">Nous répondons à vos messages dès que possible.</p>
                  </div>
                )}
              </main>
              <footer className="welcome-footer welcome-subpage-footer"><span>© MovieMatch</span><span>Fait pour les amoureux du cinéma <span className="footer-star">✦</span></span><button onClick={() => go(page === 'about' ? '/contact' : '/')}>{page === 'about' ? 'Nous contacter' : 'Retour à l’accueil'}</button></footer>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
