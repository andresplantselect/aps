// Camera photos from a phone are commonly 10-12MB. Handling a file that
// large right when a mobile browser regains foreground from the native
// picker (see productFormDraft.ts / AdminProductFormView) is a likely
// contributor to Android/iOS reloading the tab mid-upload. Downscaling and
// re-encoding client-side, before the file ever reaches uploadImages,
// keeps memory pressure low and uploads fast — a product photo doesn't
// need to be a full-resolution original anyway.

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;
const SKIP_BELOW_BYTES = 1_500_000;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Failed to load image'));
      el.src = objectUrl;
    });

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(image.width, image.height),
    );
    if (scale === 1 && file.size < SKIP_BELOW_BYTES) {
      return file;
    }

    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(image, 0, 0, width, height);

    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, JPEG_QUALITY),
    );
    if (!blob) return file;

    const extension = outputType === 'image/png' ? '.png' : '.jpg';
    const newName = file.name.replace(/\.\w+$/, extension);

    return new File([blob], newName, { type: outputType });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
