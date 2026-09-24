import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { isSupabaseConfigured, supabase } from '../lib/supabase';

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
  
  // Actions
  login: (email: string, role?: UserRole, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setSelectedDay: (day: number) => void;
  saveAnamneseAnswers: (patch: Record<string, unknown>) => void;
  completeAnamnese: () => void;
  togglePreparoItem: (id: string) => void;
  uploadLabExam: (exam: Omit<LabExamFile, 'id' | 'created_at' | 'therapist_reviewed'>) => void;
  saveDailyCheckin: (checkin: Omit<DailyCheckin, 'id' | 'created_at'>) => void;
  updateParasiteCycle: (cycleId: string, updates: Partial<ParasiteCycle>) => void;
  toggleZeoliteDay: (day: number) => void;
  savePrescription: (prescription: Partial<Prescription>) => void;
  setActivePatientIdForAdmin: (patientId: string) => void;
  resetToDefaultData: () => void;
}

/** Anamnese ayurvédica em formato aberto (answers JSONB), conforme o modelo de dados. */
export interface AnamneseRecord {
  answers: Record<string, unknown>;
  completed: boolean;
  updated_at: string | null;
}

const EMPTY_ANAMNESE: AnamneseRecord = {
  answers: {},
  completed: false,
  updated_at: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_USER_PROFILE;
  });

  // Selected day for the 21-day timeline
  const [selectedDay, setSelectedDayState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAY);
    return saved ? Number(saved) : 6;
  });

  // Lab exams
  const [labExams, setLabExams] = useState<LabExamFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_LAB_EXAMS;
  });

  // Daily Check-ins
  const [checkins, setCheckins] = useState<DailyCheckin[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_CHECKINS;
  });

  // Prescription
  const [prescription, setPrescription] = useState<Prescription | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESCRIPTION);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_PRESCRIPTION;
  });

  // Parasite cycles
  const [parasiteCycles, setParasiteCycles] = useState<ParasiteCycle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARASITE);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_PARASITE_CYCLES;
  });

  // Zeolite logged days (1 to 120)
  const [zeoliteLoggedDays, setZeoliteLoggedDays] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ZEOLITE);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [1, 2, 3, 4, 5, 6]; // Days 1 to 6 already checked in demo
  });

  // Anamnese digital (aba Diagnóstico) — rascunho salvo a cada resposta
  const [anamnese, setAnamnese] = useState<AnamneseRecord>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANAMNESE);
    if (saved) {
      try { return { ...EMPTY_ANAMNESE, ...JSON.parse(saved) }; } catch { /* ignore */ }
    }
    return EMPTY_ANAMNESE;
  });

  // Itens do módulo Preparo já providenciados pelo paciente
  const [preparoChecked, setPreparoChecked] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREPARO);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [patientsList] = useState<UserProfile[]>(OTHER_PATIENTS_LIST);
  const [activePatientIdForAdmin, setActivePatientIdForAdmin] = useState<string>('usr_pacificar_01');

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(labExams));
  }, [labExams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    if (prescription) {
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTION, JSON.stringify(prescription));
    }
  }, [prescription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARASITE, JSON.stringify(parasiteCycles));
  }, [parasiteCycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ZEOLITE, JSON.stringify(zeoliteLoggedDays));
  }, [zeoliteLoggedDays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAY, String(selectedDay));
  }, [selectedDay]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANAMNESE, JSON.stringify(anamnese));
  }, [anamnese]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREPARO, JSON.stringify(preparoChecked));
  }, [preparoChecked]);

  const setSelectedDay = (day: number) => {
    if (day >= 1 && day <= 21) {
      setSelectedDayState(day);
    }
  };

  const login = (email: string, role: UserRole = 'patient', name?: string) => {
    if (role === 'admin' || email.includes('admin') || email.includes('anacarla')) {
      setCurrentUser(DEFAULT_ADMIN_PROFILE);
    } else {
      const user: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        email,
        full_name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1))
      };
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setCurrentUser(DEFAULT_ADMIN_PROFILE);
    } else {
      setCurrentUser(DEFAULT_USER_PROFILE);
    }
  };

  /** Auto-save por resposta: o paciente nunca perde o que já escreveu. */
  const saveAnamneseAnswers = (patch: Record<string, unknown>) => {
    setAnamnese(prev => ({
      ...prev,
      answers: { ...prev.answers, ...patch },
      updated_at: new Date().toISOString()
    }));
  };

  const completeAnamnese = () => {
    setAnamnese(prev => ({ ...prev, completed: true, updated_at: new Date().toISOString() }));
  };

  const togglePreparoItem = (id: string) => {
    setPreparoChecked(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const uploadLabExam = (exam: Omit<LabExamFile, 'id' | 'created_at' | 'therapist_reviewed'>) => {
    const newExam: LabExamFile = {
      ...exam,
      id: 'exam_' + Date.now(),
      therapist_reviewed: false,
      created_at: new Date().toISOString()
    };
    setLabExams(prev => [newExam, ...prev]);
  };

  const saveDailyCheckin = (checkinData: Omit<DailyCheckin, 'id' | 'created_at'>) => {
    const newCheckin: DailyCheckin = {
      ...checkinData,
      id: 'chk_d' + checkinData.day_number + '_' + Date.now(),
      created_at: new Date().toISOString()
    };

    setCheckins(prev => {
      const filtered = prev.filter(c => c.day_number !== checkinData.day_number);
      return [...filtered, newCheckin].sort((a, b) => a.day_number - b.day_number);
    });

    // Auto mark zeolite day if checked
    if (checkinData.zeolite_taken) {
      setZeoliteLoggedDays(prev => {
        if (!prev.includes(checkinData.day_number)) {
          return [...prev, checkinData.day_number].sort((a, b) => a - b);
        }
        return prev;
      });
    }

    // Update current day in profile if advancing
    if (currentUser && checkinData.day_number >= currentUser.current_day && checkinData.day_number < 21) {
      setCurrentUser(prev => prev ? { ...prev, current_day: checkinData.day_number + 1 } : null);
    }
  };

  const updateParasiteCycle = (cycleId: string, updates: Partial<ParasiteCycle>) => {
    setParasiteCycles(prev =>
      prev.map(c => (c.id === cycleId ? { ...c, ...updates } : c))
    );
  };

  const toggleZeoliteDay = (day: number) => {
    setZeoliteLoggedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day].sort((a, b) => a - b);
      }
    });
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
  };

  const resetToDefaultData = () => {
    setCurrentUser(DEFAULT_USER_PROFILE);
    setLabExams(DEFAULT_LAB_EXAMS);
    setCheckins(DEFAULT_CHECKINS);
    setPrescription(DEFAULT_PRESCRIPTION);
    setParasiteCycles(DEFAULT_PARASITE_CYCLES);
    setZeoliteLoggedDays([1, 2, 3, 4, 5, 6]);
    setAnamnese(EMPTY_ANAMNESE);
    setPreparoChecked([]);
    setSelectedDayState(6);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'patient',
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
        login,
        logout,
        switchRole,
        setSelectedDay,
        saveAnamneseAnswers,
        completeAnamnese,
        togglePreparoItem,
        uploadLabExam,
        saveDailyCheckin,
        updateParasiteCycle,
        toggleZeoliteDay,
        savePrescription,
        setActivePatientIdForAdmin,
        resetToDefaultData
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
