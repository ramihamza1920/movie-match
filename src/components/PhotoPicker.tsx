import { IonButton, IonIcon } from '@ionic/react';
import { camera } from 'ionicons/icons';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';
import { resizeDataUrl } from '../utils/image';

interface Props {
  value: string | null;
  onChange: (dataUrl: string) => void;
  onError?: (message: string) => void;
  /** "selfie" = caméra frontale + aperçu rond ; "poster" = caméra/galerie + aperçu rectangulaire */
  variant?: 'selfie' | 'poster';
  label?: string;
}

const PhotoPicker = ({ value, onChange, onError, variant = 'selfie', label }: Props) => {
  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: variant === 'selfie' ? CameraSource.Camera : CameraSource.Prompt,
        direction: variant === 'selfie' ? CameraDirection.Front : CameraDirection.Rear,
        promptLabelHeader: 'Photo',
        promptLabelPhoto: 'Galerie',
        promptLabelPicture: 'Prendre une photo',
        promptLabelCancel: 'Annuler',
      });
      if (!photo.dataUrl) return;
      const small = await resizeDataUrl(
        photo.dataUrl,
        variant === 'selfie' ? 320 : 480,
        0.7
      );
      onChange(small);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // L'utilisateur a simplement fermé la caméra : pas d'erreur à afficher
      if (!/cancel/i.test(msg)) onError?.("Impossible d'accéder à la caméra.");
    }
  };

  return (
    <div className="photo-picker">
      {value ? (
        <img className={`preview ${variant === 'poster' ? 'square' : ''}`} src={value} alt="Aperçu" />
      ) : (
        <div className={`preview ${variant === 'poster' ? 'square' : ''}`} />
      )}
      <IonButton fill="outline" onClick={takePhoto}>
        <IonIcon slot="start" icon={camera} />
        {label ?? (value ? 'Reprendre la photo' : 'Prendre une photo')}
      </IonButton>
    </div>
  );
};

export default PhotoPicker;
