export interface BasePreset {
  scaleLength: number;
  nutWidth: number;
  bridgeWidth: number;
  frets: number;
  name: string;
  description: string;
}

export interface PresetInstrument extends BasePreset {
  displayLength: string;
}

export interface PresetsData {
  electricGuitars: Record<string, BasePreset>;
  acousticGuitars: Record<string, BasePreset>;
  bassGuitars: Record<string, BasePreset>;
  classical: Record<string, BasePreset>;
  ukuleles: Record<string, BasePreset>;
}

// Bridge compensation types
export interface StringCompensation {
  stringNumber: number;
  compensation: number; // Amount to move bridge saddle back from theoretical position
  reason: string; // Explanation for this compensation amount
}

export interface BridgeRecommendation {
  overallPosition: number; // Distance from nut to bridge center
  compensations: StringCompensation[];
  compensationRange: {
    min: number; // Minimum compensation needed
    max: number; // Maximum compensation needed
  };
  explanation: string;
  tips: string[];
}

export interface CompensationFactors {
  stringGauge: number; // String thickness affects compensation
  stringType: 'wound' | 'plain'; // Wound strings need more compensation
  tension: number; // Higher tension needs more compensation
}

// String gauge set definitions
export interface StringGaugeSet {
  id: string;
  name: string;
  description: string;
  gauges: number[]; // Array of string gauges in inches
  isDefault?: boolean; // Whether this is the default set for the instrument type
}

export interface InstrumentStringGauges {
  electricGuitar: StringGaugeSet[];
  acousticGuitar: StringGaugeSet[];
  bassGuitar: StringGaugeSet[];
  classicalGuitar: StringGaugeSet[];
  ukulele: StringGaugeSet[];
}
