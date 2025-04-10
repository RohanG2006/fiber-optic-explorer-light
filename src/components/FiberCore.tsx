
import React from "react";

interface FiberCoreProps {
  width: number;
  height: number;
  coreColor?: string;
  claddingColor?: string;
  claddingThickness?: number;
  isGradedIndex?: boolean;
}

const FiberCore: React.FC<FiberCoreProps> = ({
  width,
  height,
  coreColor = "#D6BCFA",
  claddingColor = "#E5DEFF",
  claddingThickness = 20,
  isGradedIndex = false,
}) => {
  // Calculate dimensions
  const totalHeight = height + claddingThickness * 2;
  
  return (
    <g>
      {/* Cladding */}
      <rect
        x={0}
        y={-totalHeight / 2}
        width={width}
        height={totalHeight}
        fill={claddingColor}
        rx={totalHeight / 2}
        ry={totalHeight / 2}
        className="opacity-80"
      />
      
      {/* Core */}
      {isGradedIndex ? (
        <React.Fragment>
          {/* Graded index core represented by concentric zones */}
          <defs>
            <radialGradient id="gradedCoreGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor={coreColor} stopOpacity="1" />
              <stop offset="80%" stopColor={coreColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={claddingColor} stopOpacity="0.6" />
            </radialGradient>
          </defs>
          <rect
            x={0}
            y={-height / 2}
            width={width}
            height={height}
            fill="url(#gradedCoreGradient)"
            rx={4}
            ry={height / 2}
          />
        </React.Fragment>
      ) : (
        /* Step-index core */
        <rect
          x={0}
          y={-height / 2}
          width={width}
          height={height}
          fill={coreColor}
          rx={4}
          ry={height / 2}
          className="opacity-90"
        />
      )}
      
      {/* Core boundary lines for visual clarity */}
      <line
        x1={0}
        y1={-height / 2}
        x2={width}
        y2={-height / 2}
        stroke="#9b87f5"
        strokeWidth={1}
        strokeDasharray="5,5"
        className="opacity-60"
      />
      <line
        x1={0}
        y1={height / 2}
        x2={width}
        y2={height / 2}
        stroke="#9b87f5"
        strokeWidth={1}
        strokeDasharray="5,5"
        className="opacity-60"
      />
    </g>
  );
};

export default FiberCore;
