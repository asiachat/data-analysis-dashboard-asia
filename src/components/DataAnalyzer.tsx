import {useState} from "react";

const DataAnalyzer = () => {
    const sampleData = 
    [23, 45, 67, 89, 34, 56, 78, 90, 12, 45, 67, 89];
    const [analysis, setAnalysis] = useState<{sum?: number; average?: number; maximum?: number; minimum?: number; count?: number; error?: string }>({});

    
  
  const analyzeData = () => {
    const validNumbers = sampleData.filter(item => typeof item === 'number' && !isNaN(item));
    if (validNumbers.length === 0) {
      setAnalysis({ error: 'No valid numbers found' });
      return;
    }
    const sum = validNumbers.reduce((total, num) => total + num, 0);
    const average = sum / validNumbers.length;
    const maximum = Math.max(...validNumbers);
    const minimum = Math.min(...validNumbers);
    setAnalysis({sum, average, maximum, minimum, count: validNumbers.length});

};

return (
   <div>    
      <h1>Data Analyzer Component</h1>
      <div>
        <button onClick={analyzeData}>Analyze Data</button>
        {analysis && (
          analysis.error ? (
            <div style={{ color: 'red'}}>{analysis.error}</div>
          ) : (
            <ul>
            <li>Count: {analysis.count}</li>
            <li>Sum: {analysis.sum}</li>
            <li>Average: {analysis.average}</li>
            <li>Maximum: {analysis.maximum}</li>
            <li>Minimum: {analysis.minimum}</li>
            </ul>
         )
      )}
    </div>

</div>

);

};




export default DataAnalyzer;