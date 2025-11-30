import InstructorCounterDemo from '../components/InstructorCounterDemo';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * 🎓 INSTRUCTOR DEMO PAGE
 * 
 * Access this page during Week 2 Zoom sessions at:
 * http://localhost:5173/demo-counter
 * 
 * This provides a full-screen interactive demo for useState concepts.
 */

const DemoCounterPage = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 py-8">
        <InstructorCounterDemo />
      </div>
    </ErrorBoundary>
  );
};

export default DemoCounterPage;