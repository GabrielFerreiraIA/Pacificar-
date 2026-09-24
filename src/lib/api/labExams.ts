import type { LabExamFile } from '../../types';
import type { Database } from '../../types/database';
import { prepararArquivo } from '../compressImage';
import { db, ok } from './client';

type Row = Database['public']['Tables']['lab_exams']['Row'];

export const BUCKET = 'exames';
/** Mesmos limites do bucket e da policy (D11). */
export const LIMITE_BYTES = 10 * 1024 * 1024;
export const COTA_ARQUIVOS = 20;
/** Validade do link de leitura, em segundos. */
const VALIDADE_LINK = 60 * 60;

/** file_url guarda o caminho no bucket "exames"; a URL de leitura é assinada na hora. */
export function toLabExam(r: Row): LabExamFile {
  return {
    id: r.id,
    user_id: r.user_id,
    file_name: r.file_name,
    file_url: r.storage_path,
    exam_date: r.exam_date ?? '',
    category: r.category ?? '',
    tags: r.tags,
    therapist_reviewed: r.therapist_reviewed,
    therapist_notes: r.therapist_notes ?? undefined,
    created_at: r.created_at
  };
}

export async function listLabExams(userId: string): Promise<LabExamFile[]> {
  const rows = ok(
    await db().from('lab_exams').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  );
  return rows.map(toLabExam);
}

/** Nome seguro para o caminho no Storage (sem acento, espaço ou barra). */
function slug(nome: string) {
  return (
    nome
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'exame'
  );
}

/** Envio com progresso real (XHR direto na API do Storage; o supabase-js não expõe progresso). */
function enviarComProgresso(path: string, blob: Blob, tipo: string, token: string, onProgress: (p: number) => void) {
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  const apikey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${base}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', apikey);
    xhr.setRequestHeader('Content-Type', tipo);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', 'max-age=3600');
    xhr.upload.onprogress = e => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = `HTTP ${xhr.status}`;
      try {
        msg = JSON.parse(xhr.responseText).message ?? msg;
      } catch {
        /* resposta não é JSON */
      }
      reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error('Failed to fetch'));
    xhr.send(blob);
  });
}

export interface NovoExame {
  file: File;
  fileName: string;
  category: string;
  examDate: string;
}

export interface ResultadoEnvio {
  exam: LabExamFile;
  tamanhoOriginal: number;
  tamanhoEnviado: number;
}

/** Comprime (se for foto), envia para {user_id}/… e registra em lab_exams. */
export async function enviarExame(
  userId: string,
  novo: NovoExame,
  onProgress: (p: number) => void
): Promise<ResultadoEnvio> {
  const pronto = await prepararArquivo(novo.file);
  if (pronto.blob.size > LIMITE_BYTES) throw new Error('arquivo-grande');

  const { data } = await db().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('session missing');

  const path = `${userId}/${Date.now()}-${slug(novo.fileName)}.${pronto.extensao}`;
  await enviarComProgresso(path, pronto.blob, pronto.tipo, token, onProgress);

  const res = await db()
    .from('lab_exams')
    .insert({
      user_id: userId,
      file_name: novo.fileName,
      storage_path: path,
      mime_type: pronto.tipo,
      size_bytes: pronto.blob.size,
      exam_date: novo.examDate || null,
      category: novo.category
    })
    .select('*')
    .single();
  if (res.error) {
    // Não deixa arquivo órfão ocupando o Storage
    await db().storage.from(BUCKET).remove([path]);
    throw new Error(res.error.message);
  }
  return { exam: toLabExam(res.data), tamanhoOriginal: pronto.tamanhoOriginal, tamanhoEnviado: pronto.blob.size };
}

/** Apaga o registro e o arquivo (libera espaço na cota). */
export async function apagarExame(exam: LabExamFile) {
  ok(await db().from('lab_exams').delete().eq('id', exam.id));
  const res = await db().storage.from(BUCKET).remove([exam.file_url]);
  if (res.error) console.warn('[exames] arquivo não removido:', res.error.message);
}

/** Link temporário para abrir o laudo (bucket privado). */
export async function linkDoExame(path: string): Promise<string> {
  const res = await db().storage.from(BUCKET).createSignedUrl(path, VALIDADE_LINK);
  if (res.error || !res.data) throw new Error(res.error?.message ?? 'sem link');
  return res.data.signedUrl;
}
