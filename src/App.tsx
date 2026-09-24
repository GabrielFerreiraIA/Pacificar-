/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineBanner } from './components/layout/OfflineBanner';

import { HomeDailyPage } from './pages/patient/HomeDailyPage';
import { CheckinNightlyPage } from './pages/patient/CheckinNightlyPage';
import { WeeklyReportPage } from './pages/patient/WeeklyReportPage';
import { NutritionGuidePage } from './pages/patient/NutritionGuidePage';
import { ProtocolsPage } from './pages/patient/ProtocolsPage';
import { ProfilePage } from './pages/patient/ProfilePage';
import { AnamnesePage } from './pages/patient/AnamnesePage';
import { PreparoPage } from './pages/patient/PreparoPage';
import { ExamesUploadPage } from './pages/onboarding/ExamesUploadPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { TourOverlay } from './components/onboarding/TourOverlay';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';

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
        </ErrorBoundary>
      </main>

      {subScreen === 'none' && <BottomNav activeTab={activeTab} onSelectTab={goToTab} />}

      {showTour && <TourOverlay onFinish={finishTour} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
