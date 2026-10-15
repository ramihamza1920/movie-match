/**
 * Redimensionne et compresse une image (data URL) pour rester très en dessous
 * de la limite de 1 Mo d'un document Firestore.
 */
export function resizeDataUrl(dataUrl: string, maxSize = 320, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas indisponible'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error("Impossible de lire l'image"));
    img.src = dataUrl;
  });
}
