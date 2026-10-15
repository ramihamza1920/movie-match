import { IonButton, IonIcon } from '@ionic/react';
import { heart, heartOutline } from 'ionicons/icons';
import { Movie } from '../types';

interface Props {
  movie: Pick<Movie, 'id' | 'title' | 'posterUrl'> & Partial<Pick<Movie, 'year' | 'rating'>>;
  isFavorite: boolean;
  onToggle: () => void;
}

const MovieCard = ({ movie, isFavorite, onToggle }: Props) => (
  <div className="movie-card">
    {movie.posterUrl ? (
      <img className="poster" src={movie.posterUrl} alt={movie.title} loading="lazy" />
    ) : (
      <div className="poster-empty">Pas d'affiche</div>
    )}
    <div className="meta">
      <h3>{movie.title}</h3>
      <p>
        {[movie.year, movie.rating ? `${movie.rating}/10` : null].filter(Boolean).join(' • ') || '\u00A0'}
      </p>
    </div>
    <div className="actions">
      <IonButton
        fill="clear"
        color="primary"
        onClick={onToggle}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <IonIcon slot="icon-only" icon={isFavorite ? heart : heartOutline} />
      </IonButton>
    </div>
  </div>
);

export default MovieCard;
