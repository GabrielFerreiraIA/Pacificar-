import type { LabExamFile } from '../../types';
import type { Database } from '../../types/database';
import { db, ok } from './client';

type Row = Database['public']['Tables']['lab_exams']['Row'];

/** file_url guarda o caminho no bucket "exames"; a URL de leitura é assinada na hora (T-50). */
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
