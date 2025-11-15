import { useState } from 'react'; // tracking both dataset and analysis results
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DataAnalyzer = () => {
const [analysis, setAnalysis] = useState(null);
const [currentDataset, setCurrentDataset] = useState('temperatures');
const datasets = {
  temperatures: [72, 75, 68, 80, 77, 74, 69, 78, 76, 73],
  testScores: [88, 92, 79, 95, 87, 90, 84, 89, 93, 86],
  salesFigures: [1200, 1450, 980, 1680, 1250, 1520, 1100, 1400]
};

const analyzeData = () => {
    // dataset selection based on user choice
  const data = datasets[currentDataset]; // keeping track of current dataset

  // filtering out anything that is not a "number" and doesn't exist
  const validNumbers = data.filter(item => typeof item === 'number' && !isNaN(item)); 
  
  // error handling
  if (validNumbers.length === 0) { 
    setAnalysis({ error: 'No valid numbers found' }); // shows if list is empty
    return;
  }
 

  // calculations
  const sum = validNumbers.reduce((total, num) => total + num, 0);
  const average = sum / validNumbers.length;
  const maximum = Math.max(...validNumbers);
  const minimum = Math.min(...validNumbers);
  const range = maximum - minimum;
  const sorted = [...validNumbers].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]; 

// / setting analysis state to all calculations; keeps track to display on UI
  setAnalysis({
    sum,
    average: Number(average.toFixed(2)),
    maximum,
    minimum,
    range,
    median: Number(median.toFixed(2)),
    count: validNumbers.length
  }); 
};

return (
<Card className="w-full"> 
    <CardHeader> 
    <CardTitle>Week 4: Data Analysis</CardTitle>
    </CardHeader> 
<div>
<select
  value={currentDataset}
  onChange={(e) => setCurrentDataset(e.target.value)}
  className="flex justify-center p-2 border rounded"
>
  <option value="temperatures">Temperatures (°F)</option>
  <option value="testScores">Test Scores</option>
  <option value="salesFigures">Sales Figures ($)</option>
</select> 
<div className="flex justify-center gap-3 mb-3">
<Button onClick={analyzeData} >Analyze Data</Button>
<Button onClick = {() => setAnalysis(null)} variant="outline">
    Clear
</Button>
<br/>
</div>
{analysis && (
  <div>
    {analysis.error ? (
      <div className="p-3 bg-red-50 text-red-800 rounded">{analysis.error}</div>
    ) : (
      <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 rounded">
        <div><strong>Count:</strong> {analysis.count}</div>
        <div><strong>Sum:</strong> {analysis.sum}</div>
        <div><strong>Average:</strong> {analysis.average}</div>
        <div><strong>Median:</strong> {analysis.median}</div>
        <div><strong>Maximum:</strong> {analysis.maximum}</div>
        <div><strong>Minimum:</strong> {analysis.minimum}</div>
        <div><strong>Range:</strong> {analysis.range}</div>
        <div><strong>Data Points:</strong> {analysis.count}</div>
      </div>
    )}

  </div>
 
)}

</div>
</Card>
);
 

}

export default DataAnalyzer;