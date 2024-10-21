import { logError } from './errorLogging';
import Pica from 'pica';

const pica = new Pica();

export async function resizeImage(imageUrl: string, width: number, height: number,mode: 'speed' | 'highQuality'): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be used in the browser');
  }

  return new Promise((resolve, reject) => {
    if (width <= 0 || height <= 0) {
      logError('Invalid image dimensions', { width, height });
      reject(new Error(`Invalid image dimensions: width=${width}, height=${height}`));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      logError('Image loaded', {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        resizeTo: { width, height }
      });

      const from = document.createElement('canvas');
      from.width = img.width;
      from.height = img.height;
      const fromCtx = from.getContext('2d');
      if (!fromCtx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      fromCtx.drawImage(img, 0, 0);

      const to = document.createElement('canvas');
      to.width = width;
      to.height = height;

      try {
        // Step 1: Resize the image
        await pica.resize(from, to, {
          quality: 3,
        });

        // Step 2: Create a new canvas for cropping
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width - 1;
        croppedCanvas.height = height - 1;
        const croppedCtx = croppedCanvas.getContext('2d');
        if (!croppedCtx) {
          reject(new Error('Failed to get cropped canvas context'));
          return;
        }

        // Step 3: Draw the cropped image
        if (mode === 'speed') {
          croppedCtx.drawImage(to, 0, 0, width - 1, height - 1, 0, 0, width - 1, height - 1);
        } else {
          croppedCtx.drawImage(to, 0, 0, width, height, 0, 0, width, height);
        }

        // Step 4: Convert the cropped canvas to a Blob
        croppedCanvas.toBlob((blob) => {
          if (blob) {
            logError('Blob created successfully', { size: blob.size });
            resolve(blob);
          } else {
            logError('Failed to create blob from canvas');
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg', 0.95);
      } catch (error) {
        logError('Error processing image', { error });
        reject(error);
      }
    };

    img.onerror = () => {
      logError('Error loading image');
      reject(new Error('Failed to load image'));
    };
    img.src = imageUrl;
  });
}