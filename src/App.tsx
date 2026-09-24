/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage, SetPasswordPage } from './pages/auth/AuthScreens';
import { Logo } from './components/ui/Primitives';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineBanner } from './components/layout/OfflineBanner';

import { HomeDailyPage } from './pages/patient/HomeDailyPage';
import { TourOverlay } from './components/onboarding/TourOverlay';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

/* Code splitting (T-72): só a Home vai no pacote inicial; o resto carrega sob demanda.
   Os pedaços continuam no precache do service worker, então o app segue offline. */
const CheckinNightlyPage = lazy(() => import('./pages/patient/CheckinNightlyPage').then(m => ({ default: m.CheckinNightlyPage })));
const WeeklyReportPage = lazy(() => import('./pages/patient/WeeklyReportPage').then(m => ({ default: m.WeeklyReportPage })));
const NutritionGuidePage = lazy(() => import('./pages/patient/NutritionGuidePage').then(m => ({ default: m.NutritionGuidePage })));
const ProtocolsPage = lazy(() => import('./pages/patient/ProtocolsPage').then(m => ({ default: m.ProtocolsPage })));
const ProfilePage = lazy(() => import('./pages/patient/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AnamnesePage = lazy(() => import('./pages/patient/AnamnesePage').then(m => ({ default: m.AnamnesePage })));
const PreparoPage = lazy(() => import('./pages/patient/PreparoPage').then(m => ({ default: m.PreparoPage })));
const ExamesUploadPage = lazy(() => import('./pages/onboarding/ExamesUploadPage').then(m => ({ default: m.ExamesUploadPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

const PageLoading: React.FC = () => (
  <div role="status" className="flex justify-center py-20">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent" aria-hidden="true" />
    <span className="sr-only">Carregando…</span>
  </div>
);

type SubScreen = 'none' | 'checkin' | 'report' | 'exams';

/** O tour roda uma vez por navegador; o menu do topo permite revê-lo. */
const TOUR_KEY = 'pacificar_tour_v1';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hoje');
  const [showTour, setShowTour] = useState(false);

  // Só abre depois da primeira pintura, para os alvos já existirem no DOM
  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) return;
    const t = window.setTimeout(() => setShowTour(true), 650);
    return () => window.clearTimeout(t);
  }, []);

  const finishTour = () => {
    localStorage.setItem(TOUR_KEY, 'done');
    setShowTour(false);
  };

  const replayTour = () => {
    setActiveTab('hoje');
    setSubScreen('none');
    window.scrollTo({ top: 0 });
    setShowTour(true);
  };

  /* Atalho de apresentação: Shift + ? (ou F1) abre o tour de qualquer tela.
     Ignorado enquanto o foco está num campo, para não atrapalhar quem digita. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showTour) return;

      const el = document.activeElement as HTMLElement | null;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement ||
        el?.isContentEditable;
      if (typing) return;

      const isShortcut = e.key === 'F1' || (e.key === '?' && e.shiftKey);
      if (!isShortcut) return;

      e.preventDefault();
      replayTour();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showTour]);
  const [subScreen, setSubScreen] = useState<SubScreen>('none');
  const [reportWeek, setReportWeek] = useState(1);
  const [checkinDay, setCheckinDay] = useState(6);

  const closeSub = () => setSubScreen('none');

  const openReport = (week: number) => {
    setReportWeek(week);
    setSubScreen('report');
  };

  const goToTab = (tab: string) => {
    setActiveTab(tab);
    setSubScreen('none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grain relative flex min-h-dvh flex-col">
      <OfflineBanner />

      <AppHeader activeTab={activeTab} onNavigateToTab={goToTab} onReplayTour={replayTour} />

      {/* Padding inferior reserva espaço para a barra fixa (fixed-element-offset) */}
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 pb-32 pt-6">
        <ErrorBoundary variant="page" resetKeys={[activeTab, subScreen]}>
        <Suspense fallback={<PageLoading />}>
        {subScreen === 'checkin' && (
          <CheckinNightlyPage
            dayNumber={checkinDay}
            onClose={closeSub}
            onOpenReport={openReport}
          />
        )}

        {subScreen === 'report' && (
          <WeeklyReportPage initialWeek={reportWeek} onBack={closeSub} />
        )}

        {subScreen === 'exams' && <ExamesUploadPage onClose={closeSub} />}

        {subScreen === 'none' && (
          <>
            {activeTab === 'hoje' && (
              <HomeDailyPage
                onOpenCheckin={day => {
                  setCheckinDay(day);
                  setSubScreen('checkin');
                }}
                onOpenReport={openReport}
                onOpenNutrition={() => goToTab('nutricao')}
              />
            )}

            {activeTab === 'preparo' && (
              <PreparoPage
                onOpenNutrition={() => goToTab('nutricao')}
                onStartJourney={() => goToTab('hoje')}
              />
            )}

            {activeTab === 'anamnese' && (
              <AnamnesePage onOpenExams={() => setSubScreen('exams')} />
            )}

            {activeTab === 'nutricao' && <NutritionGuidePage />}

            {activeTab === 'protocolos' && <ProtocolsPage />}

            {activeTab === 'perfil' && (
              <ProfilePage
                onOpenAnamnese={() => goToTab('anamnese')}
                onOpenExams={() => setSubScreen('exams')}
                onOpenReport={openReport}
              />
            )}

            {activeTab === 'admin' && <AdminDashboardPage />}
          </>
        )}
        </Suspense>
        </ErrorBoundary>
      </main>

      {subScreen === 'none' && <BottomNav activeTab={activeTab} onSelectTab={goToTab} />}

      {showTour && <TourOverlay onFinish={finishTour} />}
    </div>
  );
};

/** Tela de abertura enquanto a sessão salva no aparelho é lida (instantâneo na prática). */
const Splash: React.FC = () => (
  <div className="grain flex min-h-dvh items-center justify-center bg-canvas" role="status">
    <Logo className="h-14 w-14 animate-pulse" />
    <span className="sr-only">Carregando…</span>
  </div>
);

/**
 * Portão de acesso (T-21): sem sessão, só a tela de login.
 * Em desenvolvimento dá para abrir a demo com dados fictícios sem login.
 */
const AuthGate: React.FC = () => {
  const { session, loading, mustSetPassword } = useAuth();
  const [demo, setDemo] = useState(false);

  if (mustSetPassword) return <SetPasswordPage />;
  if (loading) return <Splash />;
  if (!session && !demo) {
    return <LoginPage onDemo={import.meta.env.DEV ? () => setDemo(true) : undefined} />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
