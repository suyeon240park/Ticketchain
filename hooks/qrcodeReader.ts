import jsQR from 'jsqr';

export async function readQRFromFile(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (!e.target?.result) return resolve(null);

        const img = new Image();
        img.src = e.target.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) return resolve(null);

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

          // Return null if no QR code is found
          resolve(qrCode ? qrCode.data : null);
        };

        img.onerror = () => reject(new Error('Failed to load image for QR reading'));
      } catch (error) {
        reject(new Error('Unexpected error processing QR code'));
      }
    };

    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}
