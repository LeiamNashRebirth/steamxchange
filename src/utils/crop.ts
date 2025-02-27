import { Area } from 'react-easy-crop';

export default async function getCroppedImg(imageSrc: File, croppedAreaPixels: Area) {
  const image = await createImage(URL.createObjectURL(imageSrc));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => resolve(new File([blob!], 'croppedImage.png')), 'image/png');
  });
}

function createImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}
