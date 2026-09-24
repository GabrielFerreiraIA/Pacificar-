/* Dados do painel da terapeuta (T-57). O RLS garante que só role = 'admin' lê tudo. */
import type { DailyCheckin, LabExamFile, Prescription, UserProfile } from '../../types';
import { db, ok } from './client';
import { getAnamnese, type AnamneseRecord } from './anamnese';
import { listCheckins } from './checkins';
import { listLabExams } from './labExams';
import { getPrescription } from './prescriptions';
import { toUserProfile } from './profile';

export interface PatientSummary {
  profile: UserProfile;
  accessStatus: 'active' | 'revoked';
  anamneseCompleted: boolean;
  exams: number;
  examsToReview: number;
  checkins: number;
  /** Pedido de exclusão em aberto (T-63) */
  deletionRequest: { created_at: string; reason: string | null } | null;
}

export interface PatientDetail {
  anamnese: AnamneseRecord;
  exams: LabExamFile[];
  checkins: DailyCheckin[];
  prescription: Prescription | null;
}

/** Lista de pacientes com os indicadores da lista, em 5 consultas (leve para o plano grátis). */
export async function listPatients(): Promise<PatientSummary[]> {
  const [profiles, anamneses, exams, checkins, pedidos] = await Promise.all([
    db().from('profiles').select('*').eq('role', 'patient').order('created_at', { ascending: false }),
    db().from('anamneses').select('user_id, completed'),
    db().from('lab_exams').select('user_id, therapist_reviewed'),
    db().from('checkins').select('user_id'),
    db().from('deletion_requests').select('user_id, created_at, reason').eq('status', 'pending')
  ]);
  const ps = ok(profiles);
  const an = new Map(ok(anamneses).map(a => [a.user_id, a.completed]));
  const ex = ok(exams);
  const ck = ok(checkins);
  const pd = new Map(ok(pedidos).map(p => [p.user_id, { created_at: p.created_at, reason: p.reason }]));
  return ps.map(p => ({
    profile: toUserProfile(p),
    accessStatus: p.access_status === 'revoked' ? 'revoked' : 'active',
    anamneseCompleted: an.get(p.id) ?? false,
    exams: ex.filter(e => e.user_id === p.id).length,
    examsToReview: ex.filter(e => e.user_id === p.id && !e.therapist_reviewed).length,
    checkins: ck.filter(c => c.user_id === p.id).length,
    deletionRequest: pd.get(p.id) ?? null
  }));
}

export async function getPatientDetail(userId: string): Promise<PatientDetail> {
  const [anamnese, exams, checkins, prescription] = await Promise.all([
    getAnamnese(userId),
    listLabExams(userId),
    listCheckins(userId),
    getPrescription(userId)
  ]);
  return {
    anamnese: anamnese ?? { answers: {}, completed: false, updated_at: null },
    exams,
    checkins,
    prescription
  };
}

export async function markExamReviewed(examId: string, reviewed: boolean) {
  ok(await db().from('lab_exams').update({ therapist_reviewed: reviewed }).eq('id', examId));
}

/** Suspende (reembolso, chargeback) ou reativa o acesso. Nada é apagado (D2). */
export async function setAccessStatus(userId: string, status: 'active' | 'revoked') {
  ok(await db().from('profiles').update({ access_status: status }).eq('id', userId));
}

/** Peso informado pela terapeuta (define a dose da ivermectina). */
export async function setPatientWeight(userId: string, weight: number | null) {
  ok(await db().from('profiles').update({ weight }).eq('id', userId));
}
