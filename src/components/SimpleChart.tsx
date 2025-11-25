import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; //importing chart properties and ReCharts
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


    const salesData = [
  { month: 'Jan', sales: 65 },
  { month: 'Feb', sales: 85 },
  { month: 'Mar', sales: 75 },
  { month: 'Apr', sales: 95 },
  { month: 'May', sales: 110 },
  { month: 'Jun', sales: 125 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e42'];


const SimpleChart = ({data = salesData}) => {
const [chartType, setChartType] = useState('bar');

if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available for charting.</div>;
  }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Week 5: Charts</CardTitle>
            </CardHeader>
        <div>
        <div className="flex justify-center gap-3">
            <Button onClick={() => setChartType('bar')}>Bar</Button>
            <br/>
            <Button onClick={() => setChartType('line')}>Line</Button>
        </div>

<ResponsiveContainer width="100%" height={300}>
{chartType === 'bar' && (
    <BarChart data={salesData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="sales" fill="purple" />
    </BarChart> )}
    </ResponsiveContainer>

    <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' && (
    <LineChart data={salesData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="sales" stroke="blue" />
  </LineChart> )}
    </ResponsiveContainer>
</div>
</Card>
    );

}

















// const SimpleChart = () => {
//     // adding sample data
//     const barLineData = [
//   { month: 'Jan', sales: 100 },
//   { month: 'Feb', sales: 150 },
//   { month: 'Mar', sales: 200 }
// ];
// const pieData = [
//   { name: 'Jan', value: 100 },
//   { name: 'Feb', value: 150 },
//   { name: 'Mar', value: 200 }
// ];
// const scatterData = [
//   { x: 1, y: 100 },
//   { x: 2, y: 150 },
//   { x: 3, y: 200 }
// ];
// const COLORS = ['#3b82f6', '#10b981', '#f59e42'];
// const [chartType, setChartType] = useState('bar');
//     return (
//         // buttons!!!!
// <div>

// <div>
//   <button onClick={() => setChartType('bar')}>Bar</button>
//   <br/>
//   <button onClick={() => setChartType('line')}>Line</button>
//   <br/>
//   <button onClick={() => setChartType('pie')}>Pie</button>
//   <br/>
//   <button onClick={() => setChartType('scatter')}>Scatter</button>
//   </div>

// <ResponsiveContainer width="100%" height={300}>
// {chartType === 'bar' && (
//     <BarChart data={barLineData}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="month" />
//       <YAxis />
//       <Tooltip />
//       <Bar dataKey="sales" fill="#3b82f6" />
//     </BarChart> )}
//     </ResponsiveContainer>

//     <ResponsiveContainer>
//     {chartType === 'line' && (
//     <LineChart data={barLineData}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="month" />
//       <YAxis />
//       <Tooltip />
//       <Line type="monotone" dataKey="sales" stroke="#10b981" />
//     </LineChart>
//   )}
//     </ResponsiveContainer>
    
//     <ResponsiveContainer>
//         {chartType === 'pie' && (
//     <PieChart>
//       <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
//         {pieData.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//         ))}
//       </Pie>
//       <Tooltip />
//     </PieChart>
//         )}
//     </ResponsiveContainer>

//     <ResponsiveContainer>
//         {chartType === 'scatter' && (
//     <ScatterChart>
//       <CartesianGrid />
//       <XAxis dataKey="x" name="X" />
//       <YAxis dataKey="y" name="Y" />
//       <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//       <Scatter name="Sales" data={scatterData} fill="#f59e42" />
//     </ScatterChart>
//   )}
//     </ResponsiveContainer>
// </div>


//     );
// }
export default SimpleChart;