
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadialBarChart, RadialBar } from 'recharts';
import { DataRow } from '@/types/data';
import { getDataSummary, getColumnValues } from '@/utils/dataAnalysis';

// ChartSection - Renders bar, line, and radial charts for the first few numeric columns.
// Simplified from teaching scaffold; focuses on clear, performant visualization.

interface ChartSectionProps {
  data: DataRow[];
  showAll?: boolean;
}

// Color palette for charts - Green palette that works in both light and dark modes
const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#34d399', '#6ee7b7', '#a7f3d0', '#14b8a6', '#0d9488', '#0f766e', '#115e59'];

const ChartSection = ({ data, showAll = false }: ChartSectionProps) => {
  // Memoized summary prevents unnecessary recomputation on re-renders.
  const summary = useMemo(() => getDataSummary(data), [data]);
  
  // Select up to 2 numeric columns (10 if showAll) for charting.
  const numericColumns = useMemo(() => {
    return Object.entries(summary.columnTypes)
      .filter(([_, type]) => type === 'numeric')
      .map(([column]) => column)
      .slice(0, showAll ? 10 : 2);
  }, [summary, showAll]);

  // Prepare chart data: first 20 rows, with month/name labeling.
  const chartData = useMemo(() => {
    if (numericColumns.length === 0) return [];

    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    const keys = Object.keys(data[0] || {});
    const monthKey = keys.find(k => k.toLowerCase().includes('month'))
      || keys.find(k => k.toLowerCase().includes('date'));

    const toMonthLabel = (val: any): string | null => {
      if (val == null) return null;
      // Already a month name string
      if (typeof val === 'string') {
        const lower = val.toLowerCase();
        const matchIdx = monthNames.findIndex(m => m.toLowerCase().startsWith(lower.slice(0,3)) || m.toLowerCase() === lower);
        if (matchIdx >= 0) return monthNames[matchIdx];
        // Try parse date string
        const d = new Date(val);
        if (!isNaN(d.getTime())) return monthNames[d.getMonth()];
        return val; // fallback to raw string
      }
      // Numeric month (1-12)
      if (typeof val === 'number') {
        if (val >= 1 && val <= 12) return monthNames[val - 1];
        return String(val);
      }
      // Date object
      if (val instanceof Date && !isNaN(val.getTime())) {
        return monthNames[val.getMonth()];
      }
      return null;
    };

    return data.slice(0, 20).map((row, index) => {
      const item: any = { name: `Row ${index + 1}` };
      if (monthKey) {
        const label = toMonthLabel((row as any)[monthKey]);
        if (label) item.name = label;
      }
      numericColumns.forEach(col => {
        item[col] = typeof row[col] === 'number' ? row[col] : 0;
      });
      return item;
    });
  }, [data, numericColumns]);

  // Emoji dot renderer for line chart points.
  const makeFaceDot = (threshold: number) => (props: any) => {
    const { cx, cy, value } = props;
    if (value === undefined || value === null || cx === undefined || cy === undefined) return null;
    const isHappy = Number(value) >= threshold;
    const emoji = isHappy ? '😊' : '😞';
    return (
      <text x={cx} y={cy} dy={6} textAnchor="middle" fontSize={14} aria-label={isHappy ? 'happy value' : 'sad value'}>
        {emoji}
      </text>
    );
  };

  // Empty state if no numeric columns available.
  if (numericColumns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-white text-center py-8">
            No numeric columns found for visualization. Upload data with numeric values to see charts.
          </p>
          {/* Week 4 enhancement: Add helpful tips for data format and examples */}
        </CardContent>
      </Card>
    );
  }

  // Main chart rendering.

  return (
    <Card role="group" aria-labelledby="charts-title">
      <CardHeader>
        <CardTitle id="charts-title">Data Visualizations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="radial">Ring Chart</TabsTrigger>
          </TabsList>

          {/* Bar Chart Tab */}
          <TabsContent value="bar" aria-label="Bar chart showing numeric column comparisons by month" role="tabpanel">
            <div className="h-[400px] w-full" role="img" aria-label={`Bar chart comparing ${numericColumns.join(', ')} across data rows or months`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* Show every month label */}
                  <XAxis dataKey="name" interval={0} />
                  <YAxis />
                  <Tooltip />
                  {numericColumns.map((column, idx) => (
                    <Bar 
                      key={column} 
                      dataKey={column} 
                      fill={COLORS[idx % COLORS.length]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Line Chart Tab */}
          <TabsContent value="line" aria-label="Line chart showing trends in numeric columns" role="tabpanel">
            <div className="h-[400px] w-full" role="img" aria-label={`Line chart displaying trends for ${numericColumns.join(', ')} over each row or month`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* Ensure all month labels are rendered */}
                  <XAxis dataKey="name" interval={0} />
                  <YAxis />
                  <Tooltip />
                  {numericColumns.map((column, idx) => (
                    <Line 
                      key={column}
                      type="monotone" 
                      dataKey={column} 
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2}
                      dot={makeFaceDot(150000)}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Radial Chart Tab */}
          <TabsContent value="radial" aria-label="Ring chart visualizing first numeric column distribution" role="tabpanel">
            <div className="h-[500px] w-full flex flex-col items-center justify-center gap-4" role="img" aria-label={`Ring chart showing distribution of ${numericColumns[0]} across up to eleven entries`}>
              <RadialBarChart
                width={400}
                height={400}
                cx={200}
                cy={200}
                innerRadius={60}
                outerRadius={150}
                barSize={12}
                data={chartData.slice(0, 12).map((row, index) => ({ name: row.name, value: row[numericColumns[0]] || 0, fill: COLORS[index % COLORS.length] }))}
              >
                <RadialBar background dataKey="value" />
                <Tooltip />
              </RadialBarChart>
              <div className="flex flex-wrap gap-3 justify-center max-w-2xl px-4">
                {chartData.slice(0, 12).map((row, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm">{row.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartSection;
