import React, { useState, useEffect, useCallback } from 'react';
import { NavRoute } from './types';
import { getRouteFromPath, getPathFromRoute, updatePageMetadata } from './lib/router';
import { StorageService, UserProfile } from './lib/storage';

import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { CurriculumSection } from './components/CurriculumSection';
import { PsychologySection } from './components/PsychologySection';
import { ToolkitSection } from './components/ToolkitSection';
import { KnowledgeGraphSection } from './components/KnowledgeGraphSection';
import { LibrarySection } from './components/LibrarySection';
import { CreatorsSection } from './components/CreatorsSection';
import { GetFundedSection } from './components/GetFundedSection';
import { SiteFooter } from './components/SiteFooter';
import { CommandPalette } from './components/CommandPalette';
import { EducationView } from './components/EducationView';
import { ToolkitView } from './components/ToolkitView';
import { GlossaryView } from './components/GlossaryView';
import { BrainView } from './components/BrainView';
import { PropFirmsView } from './components/PropFirmsView';
import { DashboardView } from './components/DashboardView';
import { LegalView } from './components/LegalView';
import { FloatingChat } from './components/FloatingChat';
import { LoginView } from './components/LoginView';

export default function App() {
  // Initialize route from browser URL
  const [currentRoute, setCurrentRoute] = useState<NavRoute>(() =>
    getRouteFromPath(typeof window !== 'undefined' ? window.location.pathname : '/')
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => StorageService.getLocalUser());

  // Check server session on initial app boot
  useEffect(() => {
    let isMounted = true;
    async function checkServerSession() {
      const activeUser = await StorageService.getUser();
      if (isMounted) {
        setUser(activeUser);
      }
    }
    checkServerSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteFromPath(window.location.pathname);
      setCurrentRoute(nextRoute);
      updatePageMetadata(nextRoute);
    };

    window.addEventListener('popstate', handlePopState);
    // Initial metadata update
    updatePageMetadata(currentRoute);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Programmatic navigation updating URL and history
  const handleNavigate = useCallback((route: NavRoute) => {
    setCurrentRoute(route);
    const newPath = getPathFromRoute(route);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    updatePageMetadata(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle Search item clicks
  const handleSearchResultSelect = (url: string) => {
    if (url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    const cleanUrl = url.split('#')[0];
    const targetRoute = getRouteFromPath(cleanUrl);
    handleNavigate(targetRoute);
  };

  const handleSignOut = async () => {
    await StorageService.clearUser();
    setUser(null);
    handleNavigate('home');
  };

  // Helper to determine Education sub-slug
  const getEducationSlug = (): string => {
    if (currentRoute === 'education') {
      return '';
    }
    if (currentRoute.startsWith('education/')) {
      return currentRoute.replace('education/', '');
    }
    return '';
  };

  // Helper to determine Toolkit sub-tool
  const getToolkitSubTool = (): string => {
    if (currentRoute.startsWith('toolkit/')) {
      return currentRoute.replace('toolkit/', '');
    }
    return 'risk-calculator';
  };

  return (
    <div className="min-h-screen bg-[#09090c] text-[#e6e7eb] font-sans selection:bg-[#3a8bff]/30 selection:text-white relative flex flex-col justify-between">
      {/* Institutional Dot Grid Background */}
      <div aria-hidden="true" className="fixed inset-0 -z-30 bg-dotgrid pointer-events-none" />

      {/* Fixed Navigation Header */}
      <SiteHeader
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => handleNavigate('login')}
        userLoggedIn={!!user}
        userName={user?.name}
        onSignOut={handleSignOut}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <div className="flex flex-col items-center w-full overflow-x-hidden">
            <Hero onNavigate={handleNavigate} />
            <CurriculumSection onNavigate={handleNavigate} />
            <PsychologySection onNavigate={handleNavigate} />
            <ToolkitSection onNavigate={handleNavigate} onOpenLogin={() => handleNavigate('login')} />
            <KnowledgeGraphSection onNavigate={handleNavigate} />
            <LibrarySection />
            <GetFundedSection onNavigate={handleNavigate} />
            <CreatorsSection />
          </div>
        )}

        {(currentRoute === 'education' || currentRoute.startsWith('education/')) && (
          <EducationView
            currentSlug={getEducationSlug()}
            onNavigateSlug={(slug) => handleNavigate(slug ? (`education/${slug}` as NavRoute) : 'education')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {(currentRoute === 'toolkit' || currentRoute.startsWith('toolkit/')) && (
          <ToolkitView
            initialTool={getToolkitSubTool()}
            onNavigateTool={(tool) => handleNavigate(tool ? (`toolkit/${tool}` as NavRoute) : 'toolkit')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'glossary' && (
          <GlossaryView onBack={() => handleNavigate('home')} />
        )}

        {currentRoute === 'brain' && (
          <BrainView onBack={() => handleNavigate('home')} />
        )}

        {currentRoute === 'propfirm' && (
          <PropFirmsView onBack={() => handleNavigate('home')} />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardView
            userName={user?.name || 'Claudio_Trader'}
            userEmail={user?.email || 'trader@orderflw.com'}
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'login' && (
          <LoginView
            onNavigate={handleNavigate}
            onLoginSuccess={(profile) => {
              setUser(profile);
            }}
          />
        )}

        {['impressum', 'terms', 'privacy', 'disclaimer'].includes(currentRoute) && (
          <LegalView
            route={currentRoute as 'impressum' | 'terms' | 'privacy' | 'disclaimer'}
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <SiteFooter onNavigate={handleNavigate} />

      {/* Quick Search Modal (⌘K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchResultSelect}
      />

      {/* Floating Orderflow Assistant Chat */}
      <FloatingChat onNavigate={handleNavigate} />
    </div>
  );
}
