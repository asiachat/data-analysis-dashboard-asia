// ==========================================
// 🔧 WEEK 2: UploadProgressSimulator.tsx
// ==========================================
// This is a template for your Week 2 progress component!
// Follow your student guide to complete this component.

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const UploadProgressSimulator = () => {
  // Interactive playground state
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  // store color as a hex string so we can use it for borders and BG
  const [color, setColor] = useState('#3b82f6'); // default: Tailwind blue-500
  const [message, setMessage] = useState('Welcome!');
  
  // Progress simulator state
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
    
  // Multiple event handlers working together
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.length > 0) {
      setMessage(`Hello ${e.target.value}! You have ${count} points.`);
    } else {
      setMessage('Welcome!');
    }
  };
  
  const handleCountChange = (amount: number) => {
    const newCount = count + amount;
    setCount(newCount);
    if (name) {
      setMessage(`Hello ${name}! You have ${newCount} points.`);
    }
  };

  // Convert hex color (e.g. #3b82f6) to rgba string with given alpha
  const hexToRgba = (hex: string, alpha = 1) => {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  // 🔄 Event handler functions - what happens when buttons are clicked
  const startUpload = () => {
    setIsUploading(true);
  setProgress(0);
  
  // Simulate upload progress with intervals
  const interval = setInterval(() => {
    setProgress(prevProgress => {
      const newProgress = prevProgress + Math.random() * 15 + 5; // Random chunks
      
      // Complete upload when we reach 100%
      if (newProgress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        return 100;
      }
      
      return newProgress;
    });
  }, 300); // Update every 300ms for smooth animation
  };

  const resetProgress = () => {
    setProgress(0);
  setIsUploading(false);
  };

  const addProgress = () => {
    if (!isUploading && progress < 100) {
      setProgress(prev => Math.min(prev + 25, 100));
    }
  };

  const [bgColor, setBgColor] = useState("#fff");

  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-6">
      {/* Toggle Switch */ }
      <Card className="w-full">
        <br/>
        <CardDescription>
          Click to show secret message!
        </CardDescription>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="justify-right">
              <Button 
                variant={isVisible ? "default" : "outline"}
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {isVisible && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
               I stuck a whole bag of jelly beans up my ass!
              </div>
            )}
          </div>
        </div>
      </CardContent>
      </Card>
            
      {/* 🎮 Interactive Playground Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Buttons and Names</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border-2 space-y-4" 
            style={{ borderColor: color, backgroundColor: hexToRgba(color, 0.08) }}
          >
            <h3 className="text-xl font-bold" style={{ color: color }}>{message}</h3>
            
            <div className="flex items-center space-x-4">
              <input 
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              <Badge variant="outline">Count: {count}</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleCountChange(1)}>+1 Point</Button>
              <Button onClick={() => handleCountChange(5)}>+5 Points</Button>
              <Button variant="destructive" onClick={() => handleCountChange(-1)}>-1 Point</Button>
              <Button variant="outline" onClick={() => setCount(0)}>Reset Count</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📊 Progress Simulator Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>File Upload Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 📊 Progress Bar */}
          <div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 📈 Progress Display */}
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">{progress}%</span>
            <div className="text-sm text-gray-600 mt-2">
              {isUploading && "📤 Uploading file..."}
              {!isUploading && progress === 0 && "📁 Ready to upload"}
              {!isUploading && progress > 0 && progress < 100 && "⏸️ Upload paused"}
              {!isUploading && progress === 100 && "✅ Upload complete!"}
            </div>
          </div>

          {/* 🎮 Control Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={startUpload}
              disabled={isUploading || progress === 100}
            >
              {isUploading ? 'Uploading...' : 'Start Upload'}
            </Button>
            
            <Button
              onClick={addProgress}
              disabled={isUploading || progress >= 100}
              variant="outline"
            >
              +25%
            </Button>
            
            <Button
              onClick={resetProgress}
              disabled={isUploading}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full" style={{ background: bgColor }}>
        <CardHeader>
          <CardTitle>Color Picker</CardTitle>
        </CardHeader>
        <CardDescription>Pick a color and change the background!</CardDescription>
        <CardContent>
          <div className="flex flex-col items-center gap-3 py-2">
            <input
              aria-label="Choose color"
              type="color"
              value={color}
              onChange={(e) => {
                const hex = e.target.value;
                setColor(hex);
                // set a subtle translucent page background derived from the color
                setBgColor(hexToRgba(hex, 0.06));
              }}
              className="w-12 h-12 p-0 border-0 rounded"
            />

            <div className="flex gap-2">
              <Button onClick={() => { setColor('#3b82f6'); setBgColor(hexToRgba('#3b82f6', 0.06)); }}>Blue</Button>
              <Button onClick={() => { setColor('#8b5cf6'); setBgColor(hexToRgba('#8b5cf6', 0.06)); }}>Purple</Button>
              <Button onClick={() => { setColor('#10b981'); setBgColor(hexToRgba('#10b981', 0.06)); }}>Green</Button>
              <Button variant="outline" onClick={() => { setColor('#3b82f6'); setBgColor('#fff'); }}>Reset BG</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Button variant="destructive" onClick={() => { setCount(0); setProgress(0); setBgColor('#fff'); setColor('#3b82f6'); setName(''); }}>
          Reset EVERYTHING
        </Button>
      </div>

    </div>
   
  );
};

export default UploadProgressSimulator;

// 📝 NEXT STEPS:
// 1. Complete the TODO sections following your student guide
// 2. Import this component in src/pages/Index.tsx
// 3. Add it where the Week 2 comments indicate
// 4. Test your component by clicking the buttons!
