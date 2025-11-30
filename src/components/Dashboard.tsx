
// ==========================================
// 📊 WEEK 4+: Dashboard.tsx - Main Data Visualization Component
// ==========================================
// This is the main dashboard that displays after data is uploaded
// Students will enhance this component throughout weeks 4-10

import { useState, useMemo, useEffect } from 'react';
import { RefreshCw, Download, BarChart3, LineChart, Table, MessageCircle, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DataRow } from '@/types/data';
import DataTable from './DataTable';
import ChartSection from './ChartSection';
import InsightsPanel from './InsightsPanel';
import ChatInterface from './ChatInterface';
import AssistantErrorBoundary from './AssistantErrorBoundary';
import ErrorBoundary from './ErrorBoundary';
import { generateDataInsights, getDataSummary } from '@/utils/dataAnalysis';

// Extension points (future feature placeholders) intentionally trimmed for cleanliness.

interface DashboardProps {
  data: DataRow[];
  fileName: string;
  onReset: () => void;
}

const Dashboard = ({ data, fileName, onReset }: DashboardProps) => {
  // 🧠 Dashboard state management
  const [activeTab, setActiveTab] = useState('overview');

  // Listen for navigation events dispatched from Index header menu
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>;
      const targetTab = ce.detail;
      if (targetTab) setActiveTab(targetTab);
    };
    window.addEventListener('dashboard:navigate', handler as EventListener);
    return () => window.removeEventListener('dashboard:navigate', handler as EventListener);
  }, []);
  
  // Placeholders for future enhancements removed; add new state here as needed.

  // 📊 Computed values - these recalculate when data changes
  const summary = useMemo(() => getDataSummary(data), [data]);
  const insights = useMemo(() => generateDataInsights(data), [data]);

  // Enhanced export functionality
  const handleExportCSV = () => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${fileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportInsights = () => {
    const reportContent = `Data Analysis Report
Generated: ${new Date().toLocaleDateString()}
Dataset: ${fileName}

DATASET SUMMARY
================
Total Rows: ${summary.totalRows.toLocaleString()}
Total Columns: ${summary.totalColumns}
Numeric Columns: ${summary.numericColumns}
Text Columns: ${summary.textColumns}

KEY INSIGHTS
=============
${insights.map((insight, index) => 
  `${index + 1}. ${insight.title}
   ${insight.description}
   Confidence: ${insight.confidence}
   ${insight.column ? `Column: ${insight.column}` : ''}
`).join('\n')}

MISSING DATA
=============
${Object.entries(summary.missingValues)
  .filter(([_, count]) => count > 0)
  .map(([column, count]) => `${column}: ${count} missing values (${(count/summary.totalRows*100).toFixed(1)}%)`)
  .join('\n') || 'No missing data detected'}

COLUMN TYPES
=============
${Object.entries(summary.columnTypes)
  .map(([column, type]) => `${column}: ${type}`)
  .join('\n')}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insights_${fileName.replace('.csv', '')}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center px-4 py-3 max-w-full">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Analysis Dashboard</h2>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-white mt-0.5">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="font-semibold">{fileName}</span>
              </span>
              <span className="hidden sm:inline">{data.length.toLocaleString()} rows</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export Data</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportInsights}
              className="flex items-center gap-2 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Export Report</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden md:inline">New Dataset</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsContent value="overview" className="space-y-6">
          {/* Charts section - full width */}
          <ErrorBoundary>
            <div className="w-full">
              <ChartSection data={data} />
            </div>
          </ErrorBoundary>
          {/* Insights section - below charts */}
          <ErrorBoundary>
            <div className="w-full">
              <InsightsPanel data={data} insights={insights.slice(0, 6)} />
            </div>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="charts">
          <ErrorBoundary>
            <ChartSection data={data} showAll />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="insights">
          <ErrorBoundary>
            <InsightsPanel data={data} insights={insights} showAll />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="chat">
          <AssistantErrorBoundary>
            <ChatInterface data={data} />
          </AssistantErrorBoundary>
        </TabsContent>

        <TabsContent value="data">
          <ErrorBoundary>
            <DataTable data={data} />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;