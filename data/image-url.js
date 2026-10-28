/**
 * URL del optimizador de imágenes de Next para usos donde no se puede usar <Image>
 * (por ejemplo, background-image). Evita descargar la imagen original completa.
 * El ancho debe ser uno de los configurados en images.imageSizes / deviceSizes (ej: 64, 96, 128).
 */
export function thumbUrl(src, width = 128) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
