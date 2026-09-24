import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  UserProfile,
  UserRole,
  LabExamFile,
  DailyCheckin,
  Prescription,
  ParasiteCycle
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_LAB_EXAMS,
  DEFAULT_CHECKINS,
  DEFAULT_PRESCRIPTION,
  DEFAULT_PARASITE_CYCLES,
  OTHER_PATIENTS_LIST
} from '../data/mockData';
import { getProfile, updateProfile } from '../lib/api/profile';
import { getAnamnese, saveAnamnese, type AnamneseRecord } from '../lib/api/anamnese';
import { listCheckins, upsertCheckin } from '../lib/api/checkins';
import { apagarExame, listLabExams } from '../lib/api/labExams';
import { getPrescription, savePrescription as apiSavePrescription } from '../lib/api/prescriptions';
import { ensureCycles, updateCycle } from '../lib/api/parasiteCycles';
import { listPreparo, listZeoliteDays, setPreparoItem, setZeoliteDay } from '../lib/api/marks';

export type { AnamneseRecord };

/* ═══════════════════════════════════════════════════════════════
   Estado global do app.
   - Com login (T-14): o Supabase é a fonte da verdade. O app abre na hora
     com o cache deste aparelho (por usuário) e, em seguida, carrega do banco.
     Cada ação atualiza a tela na hora e grava no banco em seguida.
   - Sem login (só em desenvolvimento): demonstração com dados fictícios
     guardados no localStorage, como no protótipo.
   ═══════════════════════════════════════════════════════════════ */

interface AppContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  labExams: LabExamFile[];
  checkins: DailyCheckin[];
  prescription: Prescription | null;
  parasiteCycles: ParasiteCycle[];
  zeoliteLoggedDays: number[];
  anamnese: AnamneseRecord;
  preparoChecked: string[];
  selectedDay: number;
  patientsList: UserProfile[];
  activePatientIdForAdmin: string;
  /** true enquanto busca os dados no servidor pela primeira vez nesta abertura */
  syncing: boolean;
  /** Mensagem para a pessoa quando algo não foi salvo/carregado */
  syncError: string | null;
  /** id do usuário logado; null na demonstração local */
  userId: string | null;

  // Actions
  login: (email: string, role?: UserRole, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setSelectedDay: (day: number) => void;
  saveAnamneseAnswers: (patch: Record<string, unknown>) => void;
  completeAnamnese: () => void;
  togglePreparoItem: (id: string) => void;
  uploadLabExam: (exam: Omit<LabExamFile, 'id' | 'created_at' | 'therapist_reviewed'>) => void;
  /** Exame já enviado ao Storage e registrado no banco (T-50) */
  addLabExam: (exam: LabExamFile) => void;
  removeLabExam: (exam: LabExamFile) => Promise<boolean>;
  saveDailyCheckin: (checkin: Omit<DailyCheckin, 'id' | 'created_at'>) => void;
  updateParasiteCycle: (cycleId: string, updates: Partial<ParasiteCycle>) => void;
  toggleZeoliteDay: (day: number) => void;
  savePrescription: (prescription: Partial<Prescription>) => void;
  setActivePatientIdForAdmin: (patientId: string) => void;
  resetToDefaultData: () => void;
  dismissSyncError: () => void;
}

const EMPTY_ANAMNESE: AnamneseRecord = {
  answers: {},
  completed: false,
  updated_at: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

/** Chaves da demonstração local (sem login). */
const STORAGE_KEYS = {
  USER: 'pacificar_user_v1',
  ANAMNESE: 'pacificar_anamnese_v2',
  PREPARO: 'pacificar_preparo_v1',
  EXAMS: 'pacificar_exams_v1',
  CHECKINS: 'pacificar_checkins_v1',
  PRESCRIPTION: 'pacificar_prescription_v1',
  PARASITE: 'pacificar_parasite_v2', // v2: datas lunares calculadas (T-55)
  ZEOLITE: 'pacificar_zeolite_v1',
  DAY: 'pacificar_selected_day_v1'
};

/** Cache offline de quem está logado. Prefixo pacificar_: o "Sair" apaga tudo. */
const cacheKey = (userId: string) => `pacificar_cache_v1_${userId}`;

/** Debounce do auto-save da anamnese: grava ~1 vez por pausa na digitação. */
const ANAMNESE_DEBOUNCE_MS = 800;

const MSG_SALVAR =
  'Não conseguimos salvar no servidor agora. Confira a internet: o que você registrou continua neste aparelho.';
const MSG_CARREGAR =
  'Não conseguimos buscar seus dados agora. Mostrando a última versão guardada neste aparelho.';

interface Snapshot {
  currentUser: UserProfile | null;
  labExams: LabExamFile[];
  checkins: DailyCheckin[];
  prescription: Prescription | null;
  parasiteCycles: ParasiteCycle[];
  zeoliteLoggedDays: number[];
  anamnese: AnamneseRecord;
  preparoChecked: string[];
}

const EMPTY_SNAPSHOT: Snapshot = {
  currentUser: null,
  labExams: [],
  checkins: [],
  prescription: null,
  parasiteCycles: [],
  zeoliteLoggedDays: [],
  anamnese: EMPTY_ANAMNESE,
  preparoChecked: []
};

function lerJSON<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function gravarJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* armazenamento cheio ou bloqueado: segue sem cache */
  }
}

function snapshotDemo(): Snapshot {
  return {
    currentUser: lerJSON(STORAGE_KEYS.USER, DEFAULT_USER_PROFILE),
    labExams: lerJSON(STORAGE_KEYS.EXAMS, DEFAULT_LAB_EXAMS),
    checkins: lerJSON(STORAGE_KEYS.CHECKINS, DEFAULT_CHECKINS),
    prescription: lerJSON(STORAGE_KEYS.PRESCRIPTION, DEFAULT_PRESCRIPTION),
    parasiteCycles: lerJSON(STORAGE_KEYS.PARASITE, DEFAULT_PARASITE_CYCLES),
    zeoliteLoggedDays: lerJSON(STORAGE_KEYS.ZEOLITE, [1, 2, 3, 4, 5, 6]),
    anamnese: { ...EMPTY_ANAMNESE, ...lerJSON<Partial<AnamneseRecord>>(STORAGE_KEYS.ANAMNESE, {}) },
    preparoChecked: lerJSON(STORAGE_KEYS.PREPARO, [])
  };
}

interface AppProviderProps {
  children: React.ReactNode;
  /**
   * Papel lido de profiles.role (T-22). Com sessão real ele manda, e o app não troca de papel.
   * Ausente = demonstração local (só em desenvolvimento, sem login).
   */
  authRole?: UserRole;
  /** id do usuário logado (auth.uid). Ausente = demonstração local. */
  authUserId?: string;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, authRole, authUserId }) => {
  const isDemo = !authUserId;
  const uid = authUserId ?? '';

  const [inicial] = useState<Snapshot>(() =>
    isDemo ? snapshotDemo() : lerJSON(cacheKey(uid), EMPTY_SNAPSHOT)
  );

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(inicial.currentUser);
  const [labExams, setLabExams] = useState<LabExamFile[]>(inicial.labExams);
  const [checkins, setCheckins] = useState<DailyCheckin[]>(inicial.checkins);
  const [prescription, setPrescription] = useState<Prescription | null>(inicial.prescription);
  const [parasiteCycles, setParasiteCycles] = useState<ParasiteCycle[]>(inicial.parasiteCycles);
  const [zeoliteLoggedDays, setZeoliteLoggedDays] = useState<number[]>(inicial.zeoliteLoggedDays);
  const [anamnese, setAnamnese] = useState<AnamneseRecord>(inicial.anamnese);
  const [preparoChecked, setPreparoChecked] = useState<string[]>(inicial.preparoChecked);
  const anamneseRef = useRef<AnamneseRecord>(inicial.anamnese);
  const anamneseTimer = useRef<number | undefined>(undefined);

  const [selectedDay, setSelectedDayState] = useState<number>(() =>
    lerJSON(STORAGE_KEYS.DAY, isDemo ? 6 : (inicial.currentUser?.current_day ?? 1))
  );

  const [patientsList] = useState<UserProfile[]>(OTHER_PATIENTS_LIST);
  const [activePatientIdForAdmin, setActivePatientIdForAdmin] = useState<string>('usr_pacificar_01');

  const [syncing, setSyncing] = useState(!isDemo);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  /* ── Grava no servidor (modo real). Falha vira aviso, nunca quebra a tela. ── */
  const write = useCallback(
    async (fn: () => Promise<unknown>) => {
      if (isDemo) return;
      try {
        await fn();
      } catch (e) {
        // Só a mensagem técnica; nunca o conteúdo (dado de saúde)
        console.warn('[sync] falha ao salvar:', e instanceof Error ? e.message : e);
        setSyncError(MSG_SALVAR);
      }
    },
    [isDemo]
  );

  /* ── Carga inicial do servidor ─────────────────────────────── */
  useEffect(() => {
    if (isDemo) return;
    let ativo = true;
    setSyncing(true);

    (async () => {
      try {
        const profile = await getProfile(uid);
        const [anam, chk, exams, presc, zeo, prep] = await Promise.all([
          getAnamnese(uid),
          listCheckins(uid),
          listLabExams(uid),
          getPrescription(uid),
          listZeoliteDays(uid),
          listPreparo(uid)
        ]);
        // Ciclos lunares nascem no primeiro acesso do paciente (T-55)
        const cycles =
          profile && profile.role === 'patient' ? await ensureCycles(uid, profile.journey_start_date) : [];
        if (!ativo) return;

        setCurrentUser(profile);
        // Não atropela o que a pessoa digitou enquanto o servidor respondia
        if (anamneseTimer.current === undefined) {
          anamneseRef.current = anam ?? EMPTY_ANAMNESE;
          setAnamnese(anamneseRef.current);
        }
        setCheckins(chk);
        setLabExams(prev => {
          // Exames enviados nesta sessão que ainda não existem no banco (upload real: T-50)
          const locais = prev.filter(e => e.id.startsWith('local_'));
          return [...locais, ...exams];
        });
        setPrescription(presc);
        setZeoliteLoggedDays(zeo);
        setPreparoChecked(prep);
        setParasiteCycles(cycles);
        if (profile && localStorage.getItem(STORAGE_KEYS.DAY) === null) {
          setSelectedDayState(Math.min(Math.max(profile.current_day, 1), 21));
        }
        setSyncError(null);
      } catch (e) {
        console.warn('[sync] falha ao carregar:', e instanceof Error ? e.message : e);
        if (ativo) setSyncError(MSG_CARREGAR);
      } finally {
        if (ativo) setSyncing(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [isDemo, uid, reloadKey]);

  /* ── Cache local ───────────────────────────────────────────── */
  useEffect(() => {
    if (isDemo) {
      if (currentUser) gravarJSON(STORAGE_KEYS.USER, currentUser);
      else localStorage.removeItem(STORAGE_KEYS.USER);
      gravarJSON(STORAGE_KEYS.EXAMS, labExams);
      gravarJSON(STORAGE_KEYS.CHECKINS, checkins);
      if (prescription) gravarJSON(STORAGE_KEYS.PRESCRIPTION, prescription);
      gravarJSON(STORAGE_KEYS.PARASITE, parasiteCycles);
      gravarJSON(STORAGE_KEYS.ZEOLITE, zeoliteLoggedDays);
      gravarJSON(STORAGE_KEYS.ANAMNESE, anamnese);
      gravarJSON(STORAGE_KEYS.PREPARO, preparoChecked);
      return;
    }
    // Não grava cache vazio por cima de um bom enquanto o servidor responde
    if (!currentUser) return;
    const snap: Snapshot = {
      currentUser,
      labExams: labExams.filter(e => !e.id.startsWith('local_')),
      checkins,
      prescription,
      parasiteCycles,
      zeoliteLoggedDays,
      anamnese,
      preparoChecked
    };
    gravarJSON(cacheKey(uid), snap);
  }, [
    isDemo,
    uid,
    currentUser,
    labExams,
    checkins,
    prescription,
    parasiteCycles,
    zeoliteLoggedDays,
    anamnese,
    preparoChecked
  ]);

  useEffect(() => {
    gravarJSON(STORAGE_KEYS.DAY, selectedDay);
  }, [selectedDay]);

  /* ── Anamnese: auto-save com debounce ──────────────────────── */
  const pushAnamnese = useCallback(() => {
    anamneseTimer.current = undefined;
    const { answers, completed } = anamneseRef.current;
    void write(() => saveAnamnese(uid, answers, completed));
  }, [uid, write]);

  const flushAnamnese = useCallback(() => {
    if (anamneseTimer.current === undefined) return;
    window.clearTimeout(anamneseTimer.current);
    pushAnamnese();
  }, [pushAnamnese]);

  // Fechou a aba, trocou de app ou bloqueou a tela: grava o que estiver pendente
  useEffect(() => {
    if (isDemo) return;
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushAnamnese();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flushAnamnese);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flushAnamnese);
      flushAnamnese();
    };
  }, [isDemo, flushAnamnese]);

  /** Auto-save por resposta: o paciente nunca perde o que já escreveu. */
  const saveAnamneseAnswers = (patch: Record<string, unknown>) => {
    const next: AnamneseRecord = {
      ...anamneseRef.current,
      answers: { ...anamneseRef.current.answers, ...patch },
      updated_at: new Date().toISOString()
    };
    anamneseRef.current = next;
    setAnamnese(next);
    if (isDemo) return;
    if (anamneseTimer.current !== undefined) window.clearTimeout(anamneseTimer.current);
    anamneseTimer.current = window.setTimeout(pushAnamnese, ANAMNESE_DEBOUNCE_MS);
  };

  const completeAnamnese = () => {
    const next: AnamneseRecord = { ...anamneseRef.current, completed: true, updated_at: new Date().toISOString() };
    anamneseRef.current = next;
    setAnamnese(next);
    if (isDemo) return;
    if (anamneseTimer.current !== undefined) window.clearTimeout(anamneseTimer.current);
    pushAnamnese();
  };

  /* ── Demais ações ──────────────────────────────────────────── */
  const setSelectedDay = (day: number) => {
    if (day >= 1 && day <= 21) {
      setSelectedDayState(day);
    }
  };

  const login = (email: string, role: UserRole = 'patient', name?: string) => {
    if (!isDemo) return; // login real: tela de acesso (T-21)
    if (role === 'admin' || email.includes('admin') || email.includes('anacarla')) {
      setCurrentUser(DEFAULT_ADMIN_PROFILE);
    } else {
      const user: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        email,
        full_name: name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      };
      setCurrentUser(user);
    }
  };

  const logout = () => {
    if (!isDemo) return; // sair de verdade: useAuth().signOut
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    // Com login real o papel vem do banco: trocar pelo app não é permitido
    if (!isDemo) return;
    setCurrentUser(newRole === 'admin' ? DEFAULT_ADMIN_PROFILE : DEFAULT_USER_PROFILE);
  };

  const togglePreparoItem = (id: string) => {
    const checked = !preparoChecked.includes(id);
    setPreparoChecked(prev => (checked ? [...prev, id] : prev.filter(i => i !== id)));
    void write(() => setPreparoItem(uid, id, checked));
  };

  const uploadLabExam = (exam: Omit<LabExamFile, 'id' | 'created_at' | 'therapist_reviewed'>) => {
    // Demonstração local: o envio real (com login) usa enviarExame + addLabExam
    const newExam: LabExamFile = {
      ...exam,
      id: 'local_' + Date.now(),
      therapist_reviewed: false,
      created_at: new Date().toISOString()
    };
    setLabExams(prev => [newExam, ...prev]);
  };

  const addLabExam = (exam: LabExamFile) => setLabExams(prev => [exam, ...prev]);

  const removeLabExam = async (exam: LabExamFile) => {
    if (!isDemo && !exam.id.startsWith('local_')) {
      try {
        await apagarExame(exam);
      } catch (e) {
        console.warn('[sync] falha ao apagar exame:', e instanceof Error ? e.message : e);
        setSyncError(MSG_SALVAR);
        return false;
      }
    }
    setLabExams(prev => prev.filter(e => e.id !== exam.id));
    return true;
  };

  const saveDailyCheckin = (checkinData: Omit<DailyCheckin, 'id' | 'created_at'>) => {
    const newCheckin: DailyCheckin = {
      ...checkinData,
      user_id: isDemo ? checkinData.user_id : uid,
      id: 'chk_d' + checkinData.day_number + '_' + Date.now(),
      created_at: new Date().toISOString()
    };

    setCheckins(prev => {
      const filtered = prev.filter(c => c.day_number !== checkinData.day_number);
      return [...filtered, newCheckin].sort((a, b) => a.day_number - b.day_number);
    });
    void write(async () => {
      const salvo = await upsertCheckin(uid, checkinData);
      setCheckins(prev => prev.map(c => (c.day_number === salvo.day_number ? salvo : c)));
    });

    // Zeólita marcada no check-in conta no protocolo
    if (checkinData.zeolite_taken && !zeoliteLoggedDays.includes(checkinData.day_number)) {
      setZeoliteLoggedDays(prev => [...prev, checkinData.day_number].sort((a, b) => a - b));
      void write(() => setZeoliteDay(uid, checkinData.day_number, true));
    }

    // Avança o dia liberado da jornada
    if (currentUser && checkinData.day_number >= currentUser.current_day && checkinData.day_number < 21) {
      const proximo = checkinData.day_number + 1;
      setCurrentUser(prev => (prev ? { ...prev, current_day: proximo } : null));
      void write(() => updateProfile(uid, { current_day: proximo }));
    }
  };

  const updateParasiteCycle = (cycleId: string, updates: Partial<ParasiteCycle>) => {
    setParasiteCycles(prev => prev.map(c => (c.id === cycleId ? { ...c, ...updates } : c)));
    const { day1_completed, day2_completed, day3_completed, charcoal_taken, h2o2_taken, completed } = updates;
    const patch = Object.fromEntries(
      Object.entries({ day1_completed, day2_completed, day3_completed, charcoal_taken, h2o2_taken, completed }).filter(
        ([, v]) => v !== undefined
      )
    );
    if (Object.keys(patch).length) void write(() => updateCycle(cycleId, patch));
  };

  const toggleZeoliteDay = (day: number) => {
    const marked = !zeoliteLoggedDays.includes(day);
    setZeoliteLoggedDays(prev => (marked ? [...prev, day].sort((a, b) => a - b) : prev.filter(d => d !== day)));
    void write(() => setZeoliteDay(uid, day, marked));
  };

  const savePrescription = (newPrescription: Partial<Prescription>) => {
    setPrescription(prev => {
      if (!prev) {
        return {
          id: 'presc_' + Date.now(),
          user_id: activePatientIdForAdmin,
          dosha_predominant: 'Vata-Pitta',
          massala_recommended: 'Massala Vata',
          aromatherapy_oils: [],
          carrier_oil: 'Óleo de Gergelim Morno',
          supplements_recommended: [],
          therapeutic_teas: [],
          therapist_notes: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...newPrescription
        } as Prescription;
      }
      return {
        ...prev,
        ...newPrescription,
        updated_at: new Date().toISOString()
      };
    });
    // Só grava para pacientes reais do banco (a lista real de pacientes chega na T-57)
    const pacienteReal = /^[0-9a-f-]{36}$/i.test(activePatientIdForAdmin);
    if (authRole === 'admin' && pacienteReal) {
      void write(() => apiSavePrescription(activePatientIdForAdmin, newPrescription, uid));
    }
  };

  const resetToDefaultData = () => {
    if (!isDemo) {
      // Com login: descarta o cache deste aparelho e busca tudo de novo no servidor
      localStorage.removeItem(cacheKey(uid));
      localStorage.removeItem(STORAGE_KEYS.DAY);
      setReloadKey(k => k + 1);
      return;
    }
    setCurrentUser(DEFAULT_USER_PROFILE);
    setLabExams(DEFAULT_LAB_EXAMS);
    setCheckins(DEFAULT_CHECKINS);
    setPrescription(DEFAULT_PRESCRIPTION);
    setParasiteCycles(DEFAULT_PARASITE_CYCLES);
    setZeoliteLoggedDays([1, 2, 3, 4, 5, 6]);
    setAnamnese(EMPTY_ANAMNESE);
    anamneseRef.current = EMPTY_ANAMNESE;
    setPreparoChecked([]);
    setSelectedDayState(6);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: isDemo ? currentUser?.role || 'patient' : (authRole ?? 'patient'),
        labExams,
        checkins,
        prescription,
        parasiteCycles,
        zeoliteLoggedDays,
        anamnese,
        preparoChecked,
        selectedDay,
        patientsList,
        activePatientIdForAdmin,
        syncing,
        syncError,
        userId: isDemo ? null : uid,
        login,
        logout,
        switchRole,
        setSelectedDay,
        saveAnamneseAnswers,
        completeAnamnese,
        togglePreparoItem,
        uploadLabExam,
        addLabExam,
        removeLabExam,
        saveDailyCheckin,
        updateParasiteCycle,
        toggleZeoliteDay,
        savePrescription,
        setActivePatientIdForAdmin,
        resetToDefaultData,
        dismissSyncError: () => setSyncError(null)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
