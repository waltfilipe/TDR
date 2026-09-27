/** Resize and compress an image file for localStorage (base64 data URL). */
export async function fileToCompressedDataUrl(file: File, maxWidth = 800, quality = 0.82): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mime, quality);

  if (dataUrl.length > 4_500_000) {
    throw new Error("Image is still too large after compression. Try a smaller photo.");
  }

  return dataUrl;
}
