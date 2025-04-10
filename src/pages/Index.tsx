
import { useState } from "react";
import FiberVisualizer from "@/components/FiberVisualizer";
import ControlPanel from "@/components/ControlPanel";

const Index = () => {
  // Fiber parameters
  const [incidenceAngle, setIncidenceAngle] = useState(45);
  const [coreIndex, setCoreIndex] = useState(1.47);
  const [claddingIndex, setCladdingIndex] = useState(1.45);
  const [isGradedIndex, setIsGradedIndex] = useState(false);
  
  // Signal loss parameters
  const [showAttenuation, setShowAttenuation] = useState(false);
  const [attenuationValue, setAttenuationValue] = useState(1.0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Optical Fiber Transmission Visualizer</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore how light propagates through optical fibers using total internal reflection.
            Adjust parameters to see the effects on signal transmission and loss.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <FiberVisualizer
              incidenceAngle={incidenceAngle}
              coreIndex={coreIndex}
              claddingIndex={claddingIndex}
              isGradedIndex={isGradedIndex}
              showAttenuation={showAttenuation}
              attenuationValue={attenuationValue}
            />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-medium mb-2 text-purple-700">Total Internal Reflection</h3>
                <p className="text-gray-600">
                  Occurs when light hits the core-cladding boundary at an angle greater than the critical angle,
                  causing light to stay within the fiber core.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-medium mb-2 text-purple-700">Refractive Index</h3>
                <p className="text-gray-600">
                  Determines how much light bends when crossing material boundaries. The difference between core (n₁) and cladding (n₂) indices enables light guiding.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-medium mb-2 text-purple-700">Signal Loss</h3>
                <p className="text-gray-600">
                  Attenuation reduces signal power over distance. Modal dispersion occurs when different ray paths take different times to travel through the fiber.
                </p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <ControlPanel
              incidenceAngle={incidenceAngle}
              setIncidenceAngle={setIncidenceAngle}
              coreIndex={coreIndex}
              setCoreIndex={setCoreIndex}
              claddingIndex={claddingIndex}
              setCladdingIndex={setCladdingIndex}
              isGradedIndex={isGradedIndex}
              setIsGradedIndex={setIsGradedIndex}
              showAttenuation={showAttenuation}
              setShowAttenuation={setShowAttenuation}
              attenuationValue={attenuationValue}
              setAttenuationValue={setAttenuationValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
