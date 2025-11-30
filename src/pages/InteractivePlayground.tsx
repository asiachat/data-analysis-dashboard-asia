import { Suspense, lazy } from 'react';
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

	return (
		<ErrorBoundary>
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate(-1)}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
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
		</ErrorBoundary>
	);
}