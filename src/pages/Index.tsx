// ==========================================
// Index.tsx - Application Homepage & Layout Shell
// ==========================================
// Provides: global header, static sidebar, dark mode toggle, demo data loader
// Renders either the upload prompt (AutoLoadButton) or the main Dashboard.
// Simplified from teaching scaffold: removed unused demo imports & week markers.

import { useState, useEffect, Suspense, lazy } from 'react';
import { Footprints } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from '@/components/Dashboard';
import { DataRow } from '@/types/data';
import Footer from '@/components/Footer';
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy-load only components actually used
const lazyWithDelay = (factory: () => Promise<any>, ms = 1250) =>
  lazy(() => new Promise(resolve => setTimeout(() => factory().then(resolve), ms)));
// Slightly increased delay so the demo loader is noticeable
const AutoLoadButton = lazyWithDelay(() => import('@/components/AutoLoadButton'));


function Index() {
  // Data & file name state
  const [data, setData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState<string>('');

  // Quick sample data (useful for testing charts/insights without uploading a file)
  const sampleData: DataRow[] = [
    { Month: 'January', Steps: 175025 },
    { Month: 'February', Steps: 186570 },
    { Month: 'March', Steps: 189042 },
    { Month: 'April',Steps: 216891 },
    { Month: 'May', Steps: 117887 },
    { Month: 'June', Steps: 146268 },
    { Month: 'July', Steps: 205597},
    { Month: 'August', Steps: 210894},
    { Month: 'September', Steps: 228040},
    { Month: 'October', Steps: 299116},
    { Month: 'November', Steps: 200747},
    { Month: 'December', Steps: 255845}
  ];

  // Handler invoked when demo data is loaded
  const handleDataLoad = (loadedData: DataRow[], name: string) => {
    setData(loadedData);
    setFileName(name);
    if (import.meta.env.DEV) {
      console.log('Data loaded:', loadedData.length, 'rows');
    }
  };

  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to document root for proper cascade
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950' : 'bg-gradient-to-br from-slate-50 via-green-50 to-blue-100'}`}>
        {/* Accessibility: Skip link for keyboard users */}
        <a href="#main" className="skip-link">Skip to main content</a>
        {/* Global Header */}
        <header className={`sticky top-0 z-20 backdrop-blur ${darkMode ? 'bg-gray-900/80 border-b border-gray-800' : 'bg-white/80 border-b shadow-sm'}`}>
          <div className="px-4 py-3 flex items-center justify-between ml-64">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}> 
                <Footprints className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent ${darkMode ? 'text-blue-300' : ''}`}>Go the Distance!</h1>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-white' : 'text-foreground'}`}>Data analysis application for walkers</p>
              </div>
            </div>
            {/* Dark mode toggle button */}
            <Button
              variant={darkMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={darkMode}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M6.34 17.66l-.71-.71" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
              )}
            </Button>
          </div>
        </header>

        {/* Static Sidebar */}
        <div className={`fixed top-0 left-0 h-full z-40 w-64 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} shadow-xl border-r flex flex-col`}>
          <HeaderMenu dataLoaded={data.length > 0} darkMode={darkMode} />
        </div>

        {/* Hero / Content */}
        <main id="main" role="main" className="flex-1 ml-64 px-4 py-8 max-w-full overflow-x-hidden"> 
          <div className="max-w-5xl mx-auto text-center mb-8">
            <p className="text-lg text-foreground dark:text-white mb-2">Welcome to Go the Distance, an interactive data tool for walking!</p>
            <p className="text-muted-foreground dark:text-white">
              Here you can visualize the amount of steps you take. Use insights to see where you are and how you can go further.
              Let's improve ourselves, one step at a time!
            </p>
            <p className="text-muted-foreground dark:text-white">
              -- Created with care by Asia Chatmon 💚
            </p>
          </div>

          {/* Upload or Dashboard */}
          {data.length === 0 ? (
            <Card className={`border-0 shadow-xl backdrop-blur-sm max-w-2xl mx-auto ${darkMode ? 'bg-white text-gray-900' : 'bg-white/80'}`}> 
              <CardHeader className="text-center">
                <CardTitle className={`text-2xl ${darkMode ? 'text-gray-900' : ''}`}>Let's Get Stepping!</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-700' : ''}>
                  No need to manually upload! Just press the button below to automatically load your data!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 flex gap-2 justify-center">
                  <Suspense fallback={<div className="h-10 flex items-center justify-center text-muted-foreground">Preparing demo loader...</div>}>
                    <AutoLoadButton sampleData={sampleData} onLoad={handleDataLoad} />
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Dashboard
              data={data}
              fileName={fileName}
              onReset={() => {
                setData([]);
                setFileName('');
              }}
            />
          )}
        </main>
        <div className="ml-64">
          <Footer name="Asia Chatmon" />
        </div>
      </div>
    </ErrorBoundary>
  );
  
};


// Static sidebar menu component
function HeaderMenu({ dataLoaded, darkMode = false }: { dataLoaded: boolean, darkMode?: boolean }) {
  const itemClass = (enabled: boolean) => `block w-full text-left px-3 py-2 rounded-md text-sm ${enabled ? (darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100') : 'opacity-50 cursor-not-allowed'}`;
  const navigateTab = (tab: string) => {
    window.dispatchEvent(new CustomEvent('dashboard:navigate', { detail: tab }));
    const main = document.querySelector('main');
    if (main) main.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className={`flex flex-col h-full p-4 ${darkMode ? 'text-white' : ''}`}>
      <div className="font-bold text-lg mb-4 flex items-center gap-2">
        <div className={`p-2 rounded-md ${darkMode ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}> 
          <Footprints className="h-6 w-6 text-white" />
        </div>
        <span>Menu</span>
      </div>
      <a href="/interactive-playground" className={`block px-3 py-2 rounded-md text-sm ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>Playground</a>
      <div className={`border-t my-2 ${darkMode ? 'border-gray-700' : ''}`} />
      <button className={itemClass(dataLoaded)} onClick={() => dataLoaded && navigateTab('overview')}>Overview</button>
      <button className={itemClass(dataLoaded)} onClick={() => dataLoaded && navigateTab('charts')}>Charts</button>
      <button className={itemClass(dataLoaded)} onClick={() => dataLoaded && navigateTab('insights')}>Insights</button>
      <button className={itemClass(dataLoaded)} onClick={() => dataLoaded && navigateTab('chat')}>Chat</button>
      <button className={itemClass(dataLoaded)} onClick={() => dataLoaded && navigateTab('data')}>Data</button>
      {!dataLoaded && (
        <div className={`text-xs mt-2 px-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Load data to enable dashboard tabs.</div>
      )}
      <div className="flex-1" />
    </div>
  );
}
export default Index;