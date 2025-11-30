import { Button } from "@/components/ui/button";
import { DataRow } from "@/types/data";

interface AutoLoadButtonProps {
  sampleData: DataRow[];
  onLoad: (data: DataRow[], name: string) => void;
  label?: string;
}

/**
 * AutoLoadButton
 * A tiny component that triggers loading of provided sample data.
 * Intended to be lazy-loaded with Suspense for a snappy UX.
 */
export default function AutoLoadButton({ sampleData, onLoad, label = "Let's Go!" }: AutoLoadButtonProps) {
  return (
    <Button
      onClick={() => onLoad(sampleData, "sample.csv")}
      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      {label}
    </Button>
  );
}
