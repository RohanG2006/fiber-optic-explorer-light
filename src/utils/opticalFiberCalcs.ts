
/**
 * Calculates whether total internal reflection occurs based on critical angle
 * @param n1 - Refractive index of core
 * @param n2 - Refractive index of cladding
 * @param incidenceAngle - Angle of incidence in degrees
 * @returns boolean indicating if TIR occurs
 */
export const isTotalInternalReflection = (
  n1: number,
  n2: number,
  incidenceAngle: number
): boolean => {
  // Calculate critical angle using Snell's law
  const criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
  return incidenceAngle > criticalAngle;
};

/**
 * Calculates the reflection angle (same as incidence for specular reflection)
 * @param incidenceAngle - Angle of incidence in degrees
 * @returns reflection angle in degrees
 */
export const calculateReflectionAngle = (incidenceAngle: number): number => {
  return incidenceAngle; // For specular reflection, angle of reflection equals angle of incidence
};

/**
 * Calculates the refraction angle using Snell's law
 * @param n1 - Refractive index of incident medium (core)
 * @param n2 - Refractive index of transmission medium (cladding)
 * @param incidenceAngle - Angle of incidence in degrees
 * @returns refraction angle in degrees, or null if TIR occurs
 */
export const calculateRefractionAngle = (
  n1: number,
  n2: number,
  incidenceAngle: number
): number | null => {
  // Convert angle to radians
  const incidenceRadians = incidenceAngle * (Math.PI / 180);
  
  // Apply Snell's law
  const sinRefraction = (n1 / n2) * Math.sin(incidenceRadians);
  
  // Check if total internal reflection occurs
  if (Math.abs(sinRefraction) > 1) {
    return null; // TIR occurs
  }
  
  // Calculate refraction angle in degrees
  return Math.asin(sinRefraction) * (180 / Math.PI);
};

/**
 * Calculates signal attenuation based on distance
 * @param distance - Distance traveled in meters
 * @param attenuationCoefficient - Attenuation coefficient in dB/m
 * @returns Power level (0-1) after attenuation
 */
export const calculateAttenuation = (
  distance: number,
  attenuationCoefficient: number
): number => {
  // Power attenuation in dB
  const attenuationDb = attenuationCoefficient * distance;
  // Convert dB to linear scale (power ratio)
  return Math.pow(10, -attenuationDb / 10);
};

/**
 * Calculates modal dispersion based on path difference
 * @param coreRadius - Radius of the fiber core
 * @param coreIndex - Refractive index of the core
 * @param NA - Numerical aperture of the fiber
 * @returns Modal dispersion in ns/km
 */
export const calculateModalDispersion = (
  coreRadius: number,
  coreIndex: number,
  NA: number
): number => {
  // Modal dispersion calculation for step-index fiber
  return (coreIndex * NA * NA) / (2 * 3e8) * 1e12; // Result in ns/km
};

/**
 * Calculates the numerical aperture of the fiber
 * @param n1 - Refractive index of core
 * @param n2 - Refractive index of cladding
 * @returns Numerical aperture value
 */
export const calculateNA = (n1: number, n2: number): number => {
  return Math.sqrt(n1 * n1 - n2 * n2);
};

/**
 * Generates ray path coordinates for visualization
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param fiberLength - Length of the fiber
 * @param coreHeight - Height of the fiber core 
 * @param incidenceAngle - Angle of incidence in degrees
 * @returns Array of point coordinates for the ray path
 */
export const generateRayPath = (
  startX: number,
  startY: number,
  fiberLength: number,
  coreHeight: number,
  incidenceAngle: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];
  let currentX = startX;
  let currentY = startY;
  
  // Convert angle to radians and normalize
  const angleRadians = (90 - incidenceAngle) * (Math.PI / 180);
  let raySlope = Math.tan(angleRadians); // Changed from const to let since we modify it later
  
  // Add the starting point
  points.push({ x: currentX, y: currentY });
  
  // Core boundaries (upper and lower)
  const upperBoundary = coreHeight / 2;
  const lowerBoundary = -coreHeight / 2;
  
  // Direction of the ray (positive or negative slope)
  let rayDirection = Math.sign(raySlope);
  if (rayDirection === 0) rayDirection = 1; // Handle horizontal ray
  
  // Generate ray path until we reach the fiber end
  while (currentX < startX + fiberLength) {
    // Calculate distance to next boundary intersection
    let distanceToNextBoundary;
    const nextBoundary = rayDirection > 0 ? upperBoundary : lowerBoundary;
    
    // Avoid division by zero for horizontal rays
    if (raySlope === 0) {
      currentX = startX + fiberLength;
      points.push({ x: currentX, y: currentY });
      break;
    }
    
    // Calculate the X-distance to the next boundary intersection
    distanceToNextBoundary = Math.abs((nextBoundary - currentY) / raySlope);
    
    // Check if the ray reaches the fiber end before the next boundary
    if (currentX + distanceToNextBoundary > startX + fiberLength) {
      // Calculate the final Y position at the fiber end
      const finalY = currentY + raySlope * (startX + fiberLength - currentX);
      currentX = startX + fiberLength;
      currentY = finalY;
      points.push({ x: currentX, y: currentY });
      break;
    }
    
    // Move to the boundary intersection
    currentX += distanceToNextBoundary;
    currentY = nextBoundary;
    points.push({ x: currentX, y: currentY });
    
    // Reflect the ray (change direction)
    rayDirection *= -1;
    raySlope *= -1;
  }
  
  return points;
};
