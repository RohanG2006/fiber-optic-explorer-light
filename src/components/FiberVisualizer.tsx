
import { useState, useEffect } from "react";
import FiberCore from "./FiberCore";
import RayPath from "./RayPath";
import { calculateAttenuation, generateRayPath } from "@/utils/opticalFiberCalcs";
import { cn } from "@/lib/utils";

interface FiberVisualizerProps {
  incidenceAngle: number;
  coreIndex: number;
  claddingIndex: number;
  isGradedIndex: boolean;
  showAttenuation: boolean;
  attenuationValue: number;
}

const FiberVisualizer = ({
  incidenceAngle,
  coreIndex,
  claddingIndex,
  isGradedIndex,
  showAttenuation,
  attenuationValue,
}: FiberVisualizerProps) => {
  // SVG dimensions and scaling
  const svgWidth = 800;
  const svgHeight = 400;
  const fiberLength = 700;
  const coreHeight = 100;
  const viewBoxWidth = fiberLength + 100;
  const viewBoxHeight = svgHeight;
  
  // Ray paths
  const [primaryRayPath, setPrimaryRayPath] = useState<{x: number; y: number}[]>([]);
  const [secondaryRayPaths, setSecondaryRayPaths] = useState<Array<{x: number; y: number}[]>>([]);
  
  // Ray intensities for attenuation visualization
  const [rayIntensities, setRayIntensities] = useState<number[]>([1, 1, 1, 1, 1]);
  
  // Is total internal reflection occurring?
  const isTIR = incidenceAngle > Math.asin(claddingIndex / coreIndex) * (180 / Math.PI);
  
  // Calculate ray paths when input parameters change
  useEffect(() => {
    // Generate the primary ray path
    const primaryPath = generateRayPath(50, 0, fiberLength, coreHeight, incidenceAngle);
    setPrimaryRayPath(primaryPath);
    
    // Generate additional rays with small angle variations to visualize dispersion
    const secondaryPaths = [];
    const angleVariations = isGradedIndex ? [0.5, 1.0] : [1.5, 3.0];
    
    for (const variation of angleVariations) {
      const upperAngle = Math.min(incidenceAngle + variation, 89);
      const lowerAngle = Math.max(incidenceAngle - variation, 1);
      
      secondaryPaths.push(generateRayPath(50, 0, fiberLength, coreHeight, upperAngle));
      secondaryPaths.push(generateRayPath(50, 0, fiberLength, coreHeight, lowerAngle));
    }
    
    setSecondaryRayPaths(secondaryPaths);
    
    // Calculate attenuation if enabled
    if (showAttenuation) {
      // Calculate number of reflections as rough estimate of distance
      const numReflections = primaryPath.length - 1;
      // Use reflections count as a proxy for distance (in km)
      const distance = numReflections * 0.2;
      
      // Calculate attenuation for each ray
      const intensities = [1];
      for (let i = 1; i < 5; i++) {
        // More reflections = more distance traveled = more attenuation
        const rayDistance = distance * (1 + (i * 0.1));
        intensities.push(calculateAttenuation(rayDistance, attenuationValue));
      }
      
      setRayIntensities(intensities);
    } else {
      setRayIntensities([1, 1, 1, 1, 1]); // Reset all intensities to 1 (no attenuation)
    }
  }, [incidenceAngle, coreHeight, fiberLength, isGradedIndex, attenuationValue, showAttenuation, coreIndex, claddingIndex]);
  
  return (
    <div className="w-full h-full overflow-hidden rounded-lg border bg-background p-2">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Center the SVG vertically */}
        <g transform={`translate(0, ${viewBoxHeight / 2})`}>
          {/* Fiber core and cladding */}
          <FiberCore
            width={fiberLength}
            height={coreHeight}
            isGradedIndex={isGradedIndex}
          />
          
          {/* Light source indicator */}
          <circle
            cx={25}
            cy={0}
            r={15}
            fill="#F97316"
            className={cn(
              "animate-pulse-opacity",
              {"opacity-50": !isTIR}
            )}
          />
          
          {/* Light rays */}
          <g className="rays">
            {/* Secondary rays (for dispersion visualization) */}
            {secondaryRayPaths.map((path, index) => (
              <RayPath
                key={`secondary-ray-${index}`}
                points={path}
                strokeColor="#F97316"
                strokeWidth={1.2}
                isTIR={isTIR}
                intensity={rayIntensities[Math.min(index + 1, rayIntensities.length - 1)]}
                delay={50 * (index + 1)}
              />
            ))}
            
            {/* Primary ray */}
            <RayPath
              points={primaryRayPath}
              strokeColor="#F97316"
              strokeWidth={2.5}
              isTIR={isTIR}
              intensity={rayIntensities[0]}
            />
          </g>
          
          {/* Angle indicator */}
          <g transform="translate(50, 0)">
            <path
              d={`M 0 0 L ${30 * Math.cos((90 - incidenceAngle) * Math.PI / 180)} ${-30 * Math.sin((90 - incidenceAngle) * Math.PI / 180)}`}
              stroke="#6E59A5"
              strokeWidth={1.5}
              strokeDasharray="3,2"
              opacity={0.8}
              fill="none"
            />
            <path
              d={`M 5 0 A 5 5 0 0 0 ${5 + 5 * Math.cos((90 - incidenceAngle) * Math.PI / 180)} ${-5 * Math.sin((90 - incidenceAngle) * Math.PI / 180)}`}
              stroke="#6E59A5"
              strokeWidth={1}
              fill="none"
            />
            <text
              x={15 * Math.cos((90 - incidenceAngle/2) * Math.PI / 180)}
              y={-15 * Math.sin((90 - incidenceAngle/2) * Math.PI / 180)}
              fontSize="10"
              fill="#6E59A5"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {incidenceAngle.toFixed(0)}°
            </text>
          </g>
          
          {/* Labels */}
          <text x={fiberLength / 2} y={-coreHeight / 2 - 20} textAnchor="middle" fill="#1A1F2C" fontSize="12">
            Cladding (n₂ = {claddingIndex.toFixed(2)})
          </text>
          <text x={fiberLength / 2} y={0} textAnchor="middle" fill="#1A1F2C" fontSize="12">
            Core (n₁ = {coreIndex.toFixed(2)})
          </text>
          
          {/* Signal status indicator */}
          <g transform={`translate(${fiberLength + 20}, 0)`}>
            <circle
              r={15}
              fill={isTIR ? "#10b981" : "#ef4444"}
              opacity={isTIR ? rayIntensities[0] : 0.3}
              className={isTIR ? "animate-pulse-opacity" : ""}
            />
            <text
              x={0}
              y={30}
              textAnchor="middle"
              fill={isTIR ? "#10b981" : "#ef4444"}
              fontSize="11"
              fontWeight="bold"
            >
              {isTIR ? "Signal" : "No Signal"}
            </text>
            {showAttenuation && isTIR && (
              <text
                x={0}
                y={45}
                textAnchor="middle"
                fill="#6b7280"
                fontSize="10"
              >
                {(rayIntensities[0] * 100).toFixed(1)}% Power
              </text>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default FiberVisualizer;
