/* ═══════════════════════════════════════════════════════════════
   Compressão de fotos no aparelho antes do envio (T-50 · D11).
   O Storage gratuito do Supabase tem 1 GB no total: uma foto de celular
   (~3 MB) vira ~300 KB, legível para a leitura do laudo.
   PDF e formatos que o navegador não decodifica seguem como estão.
   ═══════════════════════════════════════════════════════════════ */

/** Lado maior em pixels: mantém números pequenos do laudo legíveis. */
const LADO_MAX = 2000;
const QUALIDADE = 0.8;

const DECODIFICAVEIS = /^image\/(jpeg|png|webp|heic|heif)$/i;

function canvasParaBlob(canvas: HTMLCanvasElement, tipo: string, qualidade: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, tipo, qualidade));
}

export interface ArquivoPronto {
  blob: Blob;
  tipo: string;
  extensao: string;
  /** Tamanho original, para mostrar a economia */
  tamanhoOriginal: number;
}

const EXTENSOES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif'
};

function semCompressao(file: File): ArquivoPronto {
  const tipo = file.type || 'application/octet-stream';
  const extensao = EXTENSOES[tipo] ?? (file.name.split('.').pop() || 'bin').toLowerCase();
  return { blob: file, tipo, extensao, tamanhoOriginal: file.size };
}

export async function prepararArquivo(file: File): Promise<ArquivoPronto> {
  if (!DECODIFICAVEIS.test(file.type)) return semCompressao(file);

  let bitmap: ImageBitmap;
  try {
    // imageOrientation: foto de celular em pé não sai deitada
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return semCompressao(file); // ex.: HEIC fora do Safari
  }

  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  const ctx = canvas.getContext('2d');
  if (!ctx) return semCompressao(file);
  // Fundo branco: PNG com transparência não vira preto no JPEG
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // WebP quando o navegador codifica; senão JPEG (Safari antigo devolve PNG para webp)
  let blob = await canvasParaBlob(canvas, 'image/webp', QUALIDADE);
  if (!blob || blob.type !== 'image/webp') blob = await canvasParaBlob(canvas, 'image/jpeg', QUALIDADE);
  if (!blob || blob.size >= file.size) return semCompressao(file);

  return { blob, tipo: blob.type, extensao: EXTENSOES[blob.type], tamanhoOriginal: file.size };
}

export function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}
