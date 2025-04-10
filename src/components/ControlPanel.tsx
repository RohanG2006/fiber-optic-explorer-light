
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { isTotalInternalReflection, calculateNA } from "@/utils/opticalFiberCalcs";

interface ControlPanelProps {
  incidenceAngle: number;
  setIncidenceAngle: (value: number) => void;
  coreIndex: number;
  setCoreIndex: (value: number) => void;
  claddingIndex: number;
  setCladdingIndex: (value: number) => void;
  isGradedIndex: boolean;
  setIsGradedIndex: (value: boolean) => void;
  showAttenuation: boolean;
  setShowAttenuation: (value: boolean) => void;
  attenuationValue: number;
  setAttenuationValue: (value: number) => void;
}

export const ControlPanel = ({
  incidenceAngle,
  setIncidenceAngle,
  coreIndex,
  setCoreIndex,
  claddingIndex,
  setCladdingIndex,
  isGradedIndex,
  setIsGradedIndex,
  showAttenuation,
  setShowAttenuation,
  attenuationValue,
  setAttenuationValue,
}: ControlPanelProps) => {
  const [customPreset, setCustomPreset] = useState(true);
  
  // Critical angle calculation
  const criticalAngle = Math.asin(claddingIndex / coreIndex) * (180 / Math.PI);
  const isTIR = isTotalInternalReflection(coreIndex, claddingIndex, incidenceAngle);
  const NA = calculateNA(coreIndex, claddingIndex);
  
  // Material presets
  const presets = [
    { name: "Custom", core: coreIndex, cladding: claddingIndex },
    { name: "Glass-Air", core: 1.5, cladding: 1.0 },
    { name: "Silica Fiber", core: 1.47, cladding: 1.45 },
    { name: "Plastic Fiber", core: 1.49, cladding: 1.39 },
  ];
  
  const applyPreset = (preset: typeof presets[0]) => {
    setCoreIndex(preset.core);
    setCladdingIndex(preset.cladding);
    setCustomPreset(preset.name === "Custom");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Optical Fiber Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Material Presets */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Material Presets</h3>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant={customPreset && preset.name === "Custom" ? "default" : "outline"}
                size="sm"
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1 ${
                  (!customPreset && preset.core === coreIndex && preset.cladding === claddingIndex) ||
                  (customPreset && preset.name === "Custom")
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Refractive Indices */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="core-index">Core Index (n₁)</Label>
              <Badge variant="outline">{coreIndex.toFixed(2)}</Badge>
            </div>
            <Slider
              id="core-index"
              min={1.1}
              max={2.0}
              step={0.01}
              value={[coreIndex]}
              onValueChange={(value) => {
                setCoreIndex(value[0]);
                setCustomPreset(true);
              }}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="cladding-index">Cladding Index (n₂)</Label>
              <Badge variant="outline">{claddingIndex.toFixed(2)}</Badge>
            </div>
            <Slider
              id="cladding-index"
              min={1.0}
              max={coreIndex - 0.01}
              step={0.01}
              value={[claddingIndex]}
              onValueChange={(value) => {
                setCladdingIndex(value[0]);
                setCustomPreset(true);
              }}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Incidence Angle */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="incidence-angle">Input Angle</Label>
            <div className="flex gap-2">
              <Badge variant={isTIR ? "default" : "destructive"}>
                {isTIR ? "TIR" : "Leaky"}
              </Badge>
              <Badge variant="outline">{incidenceAngle.toFixed(1)}°</Badge>
            </div>
          </div>
          <Slider
            id="incidence-angle"
            min={0}
            max={89}
            step={0.5}
            value={[incidenceAngle]}
            onValueChange={(value) => setIncidenceAngle(value[0])}
          />
        </div>
        
        {/* Fiber Information */}
        <div className="space-y-2 rounded-md bg-muted p-3 text-sm">
          <div className="flex justify-between">
            <span>Critical Angle:</span>
            <span className="font-medium">{criticalAngle.toFixed(1)}°</span>
          </div>
          <div className="flex justify-between">
            <span>Numerical Aperture:</span>
            <span className="font-medium">{NA.toFixed(3)}</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Fiber Type Toggle */}
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="graded-index">Graded-Index Fiber</Label>
          <Switch
            id="graded-index"
            checked={isGradedIndex}
            onCheckedChange={setIsGradedIndex}
          />
        </div>
        
        {/* Attenuation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="show-attenuation">Show Signal Loss</Label>
            <Switch
              id="show-attenuation"
              checked={showAttenuation}
              onCheckedChange={setShowAttenuation}
            />
          </div>
          
          {showAttenuation && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="attenuation-value">Attenuation (dB/km)</Label>
                <Badge variant="outline">{attenuationValue.toFixed(1)}</Badge>
              </div>
              <Slider
                id="attenuation-value"
                min={0.1}
                max={10}
                step={0.1}
                value={[attenuationValue]}
                onValueChange={(value) => setAttenuationValue(value[0])}
                disabled={!showAttenuation}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
