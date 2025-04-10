
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RayPathProps {
  points: { x: number; y: number }[];
  strokeColor?: string;
  strokeWidth?: number;
  isTIR?: boolean;
  intensity?: number;
  delay?: number;
}

export const RayPath = ({
  points,
  strokeColor = "#F97316",
  strokeWidth = 2,
  isTIR = true,
  intensity = 1,
  delay = 0,
}: RayPathProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  
  // Generate SVG path data string from points
  const getPathData = (): string => {
    if (points.length === 0) return "";
    
    return points.reduce((path, point, index) => {
      return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`);
    }, "");
  };

  useEffect(() => {
    // Reset animation when points change
    if (pathRef.current) {
      pathRef.current.style.animation = 'none';
      // Force reflow - use getBoundingClientRect instead of offsetWidth for SVG elements
      void pathRef.current.getBoundingClientRect();
      pathRef.current.style.animation = '';
    }
  }, [points]);

  return (
    <path
      ref={pathRef}
      d={getPathData()}
      fill="none"
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeDasharray="5,0" // No dash for continuous line
      style={{
        opacity: intensity,
        animationDelay: `${delay}ms`,
      }}
      className={cn(
        "transition-opacity duration-300",
        isTIR ? "animate-ray-propagate" : "animate-fade-in"
      )}
    />
  );
};

export default RayPath;
