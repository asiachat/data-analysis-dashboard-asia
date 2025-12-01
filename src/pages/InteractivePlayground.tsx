import { Suspense, lazy, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DataRow } from '@/types/data';

// Lazy loaders with slight delay to show fallbacks
const lazyWithDelay = (factory: () => Promise<any>, ms = 800) =>
	lazy(() => new Promise(resolve => setTimeout(() => factory().then(resolve), ms)));

const NameInput = lazyWithDelay(() => import('@/components/NameInput'));
const DataAnalyzer = lazyWithDelay(() => import('@/components/DataAnalyzer'));
const SimpleChart = lazyWithDelay(() => import('@/components/SimpleChart'));
const MockAIChat = lazyWithDelay(() => import('@/components/MockAIChat'));
const UploadProgressSimulator = lazyWithDelay(() => import('@/components/UploadProgressSimulator'));

export default function InteractivePlayground() {
	// This page focuses on interactive demos; data upload is handled elsewhere.
	const data: DataRow[] = [];
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(false);

	// Apply dark mode class to document root
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [darkMode]);

	return (
		<ErrorBoundary>
			<div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950' : 'bg-gradient-to-br from-slate-50 via-green-50 to-blue-100'}`}>
				<div className="container mx-auto px-4 py-8">
					<div className="mb-6 flex items-center justify-between">
						<Button
							variant="outline"
							size="sm"
							onClick={() => navigate(-1)}
							className="flex items-center gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back
						</Button>
						
						{/* Dark mode toggle */}
						<Button
							variant={darkMode ? 'secondary' : 'outline'}
							size="sm"
							onClick={() => setDarkMode(!darkMode)}
							title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
							aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
							aria-pressed={darkMode}
						>
							{darkMode ? (
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
							)}
						</Button>
					</div>
				<h1 className="text-3xl font-bold mb-4">Interactive Playground</h1>
				<p className="text-slate-600 dark:text-white mb-6">Explore demos like upload progress, name input, analyzer, chart, and assistant.</p>

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

				<div className="mt-8 mb-8 flex justify-center">
					<Suspense fallback={<div className="h-10 flex items-center justify-center text-muted-foreground">Loading name input...</div>}>
						<NameInput />
					</Suspense>
				</div>

				<div>
					<Suspense fallback={<div className="h-16 flex items-center justify-center text-muted-foreground">Loading analyzer...</div>}>
						<DataAnalyzer />
					</Suspense>
				</div>

				<div className="mt-6">
					<Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground">Loading chart...</div>}>
						<SimpleChart />
					</Suspense>
				</div>

				<div className="mt-6">
					<Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground">Loading assistant...</div>}>
						<MockAIChat data={data} />
					</Suspense>
				</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}