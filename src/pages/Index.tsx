// ==========================================
// 🏠 WEEK 1: Index.tsx - Homepage Component
// ==========================================
// This is your main homepage! You will customize this in Week 1
// and add interactive components starting in Week 2.

// 📦 React imports - the core tools for building components
import { useState } from 'react';

// 🎨 Icon imports - beautiful icons for your UI
import { Upload, BarChart3, PieChart, TrendingUp, Database, Divide } from 'lucide-react';

// 🧩 UI Component imports - pre-built components for your interface
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// 📊 Data-related imports - components that handle your data

import Dashboard from '@/components/Dashboard';
import { DataRow } from '@/types/data';
import Footer from '@/components/Footer';
// 🆕 WEEK 3: Import NameInput demo
import { Suspense, lazy } from 'react';
// Helper to add an artificial delay to dynamic imports so fallbacks remain visible
const lazyWithDelay = (factory: () => Promise<any>, ms = 800) =>
  lazy(() => new Promise(resolve => setTimeout(() => factory().then(resolve), ms)));
const NameInput = lazyWithDelay(() => import('@/components/NameInput'));

// 🔧 WEEK 2: Import your UploadProgressSimulator component here (lazy-loaded below)
// 🔧 WEEK 3+: Additional imports will be added as you progress
  const DataAnalyzer = lazyWithDelay(() => import('@/components/DataAnalyzer'));
  const SimpleChart = lazyWithDelay(() => import('@/components/SimpleChart'));
  const MockAIChat = lazyWithDelay(() => import('@/components/MockAIChat'));
  const UploadProgressSimulator = lazyWithDelay(() => import('@/components/UploadProgressSimulator'));
  const DataUpload = lazyWithDelay(() => import('@/components/DataUpload'));
  import ErrorBoundary from "@/components/ErrorBoundary";
  
  
const Index = () => {
  // 🧠 Component State - this is your component's memory!
  // useState lets your component remember and change data
  const [data, setData] = useState<DataRow[]>([]);      // Stores uploaded data
  const [fileName, setFileName] = useState<string>(''); // Remembers file name
  const [showPlayground, setShowPlayground] = useState(false); // Toggle playground visibility

  // Quick sample data (useful for testing charts/insights without uploading a file)
  const sampleData: DataRow[] = [
    { Product: 'T-Shirts', Sales: 150, Month: 'January' },
    { Product: 'Jeans', Sales: 200, Month: 'January' },
    { Product: 'Shoes', Sales: 175, Month: 'January' },
    { Product: 'T-Shirts', Sales: 180, Month: 'February' },
    { Product: 'Jeans', Sales: 220, Month: 'February' },
    { Product: 'Shoes', Sales: 160, Month: 'February' },
  ];

  // 🔄 Event Handler - function that runs when data is uploaded
  const handleDataLoad = (loadedData: DataRow[], name: string) => {
    setData(loadedData);
    setFileName(name);
    console.log('Data loaded:', loadedData.length, 'rows');
  };

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-100">
      {/* 🎨 Hero Section - The top part of your homepage */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          {/* 🎯 Logo and Title */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-full">
              <Database className="h-12 w-12 text-white" />
            </div>
          </div>
          
          
          {/* 📝 WEEK 1: Students customize this title with their name */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Asia's Data Hub
          </h1>
          <p className="text-xl text-slate-600 mb-2">Data Insight Engine</p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Upload your dataset and instantly discover insights, visualize trends, and explore your data with interactive charts and analytics.
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Analyze anything! Built by Asia, future data scientist</p>
          <br/>
          {/* 🆕 WEEK 3: Live Event Handling Demo (removed NameInput from homepage) */}
          

        {/* 🔧 WEEK 2: ADD YOUR PROGRESS COMPONENT HERE! */}
        {/* This is where students will add their UploadProgressSimulator component */}

  <div>
  {/*Toggle Switch for Playground */}
<Button onClick={() => setShowPlayground(!showPlayground)}>
  {showPlayground ? 'Hide Interactive Playground' : 'Click Here for Interactive Playground!'}
</Button>

{/*Conditionally render playground components based on toggle */}
{showPlayground && (
  <>
    {/*lazy loading for all the components */}
        <Card className="bg-white/50 backdrop-blur-sm border-purple-200 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-3 h-6 w-6 text-green-600" />
              Week 2: Interactive Progress Demo
            </CardTitle>
            <CardDescription>
              Try our upload progress simulator built with React state!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-24 flex items-center justify-center text-muted-foreground">Loading demo...</div>}>
              <UploadProgressSimulator />
            </Suspense>
          </CardContent>
        </Card>

<br/>

<div className="mt-8 mb-8 flex justify-center">
            <Suspense fallback={<div className="h-10 flex items-center justify-center text-muted-foreground">Loading name input...</div>}>
              <NameInput />
            </Suspense>
          </div> 

        <div>
          <Suspense fallback={<div className="h-16 flex items-center justify-center text-muted-foreground">Loading analyzer...</div>}>
            <DataAnalyzer/>
          </Suspense>
        </div>

        <br/>

        <div>
          <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
            <SimpleChart/>
          </Suspense>
        </div>

        <br/>

        {data.length === 0 && (
          <div>
            <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground">Loading assistant...</div>}>
              <MockAIChat data={data} />
            </Suspense>
          </div>
        )}
        <br/>
  </>
)}

        {data.length === 0 ? (
          <>
            {/* 🎨 Features Grid - Shows what your app can do */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* 📤 Upload Feature Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Easy Data Upload</CardTitle>
                  <CardDescription>
                    Simply drag and drop your CSV files or click to browse. Support for various data formats.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* 📊 Charts Feature Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-xl">Interactive Charts</CardTitle>
                  <CardDescription>
                    Automatically generate bar charts, line graphs, pie charts, and more from your data.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* 🧠 Insights Feature Card */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl">Smart Insights</CardTitle>
                  <CardDescription>
                    Discover patterns, trends, and statistical insights automatically generated from your dataset.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* 📤 Upload Section - Where users upload their data */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>
                  Upload your CSV file to begin exploring your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/*Added a lazy load to Data Upload with delay. */}
                <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground">Loading Data Upload...</div>}>
                <DataUpload onDataLoad={handleDataLoad} />
                </Suspense>
                <div className="mt-4 flex gap-2 justify-center">
                  <Button onClick={() => handleDataLoad(sampleData, 'sample.csv')}>Load sample data</Button>
                  <Button variant="ghost" onClick={() => { setData([]); setFileName(''); }}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Dashboard data={data} fileName={fileName} onReset={() => {
              setData([]);
              setFileName('');
            }} />
          </>
        )}
      </div>
      </div>
      </div>
      <Footer name="Asia Chatmon" />
    </div>
  
    </ErrorBoundary>
    
  );
  
};

export default Index;