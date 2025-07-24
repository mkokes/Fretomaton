import type { BridgeRecommendation, StringCompensation, StringGaugeSet, InstrumentStringGauges } from '../types/presets';

// Comprehensive string gauge sets for different instrument types
export const STRING_GAUGE_SETS: InstrumentStringGauges = {
  electricGuitar: [
    {
      id: 'light',
      name: 'Light',
      description: 'Light (9-42)',
      gauges: [0.009, 0.011, 0.016, 0.024, 0.032, 0.042],
      isDefault: true
    },
    {
      id: 'regular',
      name: 'Regular',
      description: 'Regular (10-46)',
      gauges: [0.010, 0.013, 0.017, 0.026, 0.036, 0.046]
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Medium (11-49)',
      gauges: [0.011, 0.014, 0.018, 0.028, 0.038, 0.049]
    },
    {
      id: 'heavy',
      name: 'Heavy',
      description: 'Heavy (12-54)',
      gauges: [0.012, 0.016, 0.024, 0.032, 0.042, 0.054]
    }
  ],
  acousticGuitar: [
    {
      id: 'extraLight',
      name: 'Extra Light',
      description: 'Extra Light (10-47)',
      gauges: [0.010, 0.014, 0.023, 0.030, 0.039, 0.047]
    },
    {
      id: 'light',
      name: 'Light',
      description: 'Light (12-53)',
      gauges: [0.012, 0.016, 0.025, 0.032, 0.042, 0.053],
      isDefault: true
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Medium (13-56)',
      gauges: [0.013, 0.017, 0.026, 0.035, 0.045, 0.056]
    },
    {
      id: 'heavy',
      name: 'Heavy',
      description: 'Heavy (14-59)',
      gauges: [0.014, 0.018, 0.027, 0.039, 0.049, 0.059]
    }
  ],
  bassGuitar: [
    {
      id: 'light',
      name: 'Light',
      description: 'Light (40-95)',
      gauges: [0.040, 0.060, 0.075, 0.095]
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Medium (45-105)',
      gauges: [0.045, 0.065, 0.085, 0.105],
      isDefault: true
    },
    {
      id: 'heavy',
      name: 'Heavy',
      description: 'Heavy (50-110)',
      gauges: [0.050, 0.070, 0.090, 0.110]
    },
    {
      id: 'extraHeavy',
      name: 'Extra Heavy',
      description: 'Extra Heavy (55-115)',
      gauges: [0.055, 0.075, 0.095, 0.115]
    }
  ],
  classicalGuitar: [
    {
      id: 'normalTension',
      name: 'Normal Tension',
      description: 'Normal Tension',
      gauges: [0.028, 0.032, 0.040, 0.029, 0.035, 0.043],
      isDefault: true
    },
    {
      id: 'highTension',
      name: 'High Tension',
      description: 'High Tension',
      gauges: [0.029, 0.033, 0.041, 0.030, 0.036, 0.044]
    },
    {
      id: 'extraHighTension',
      name: 'Extra High Tension',
      description: 'Extra High Tension',
      gauges: [0.030, 0.034, 0.042, 0.031, 0.037, 0.045]
    }
  ],
  ukulele: [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Standard',
      gauges: [0.024, 0.031, 0.037, 0.026],
      isDefault: true
    },
    {
      id: 'concert',
      name: 'Concert',
      description: 'Concert',
      gauges: [0.025, 0.032, 0.038, 0.027]
    },
    {
      id: 'tenor',
      name: 'Tenor',
      description: 'Tenor',
      gauges: [0.026, 0.033, 0.040, 0.029]
    }
  ]
};

// Legacy constant for backward compatibility
export const STANDARD_STRING_GAUGES = {
  electricGuitar: STRING_GAUGE_SETS.electricGuitar.find(set => set.isDefault)?.gauges || STRING_GAUGE_SETS.electricGuitar[0].gauges,
  acousticGuitar: STRING_GAUGE_SETS.acousticGuitar.find(set => set.isDefault)?.gauges || STRING_GAUGE_SETS.acousticGuitar[0].gauges,
  classicalGuitar: STRING_GAUGE_SETS.classicalGuitar.find(set => set.isDefault)?.gauges || STRING_GAUGE_SETS.classicalGuitar[0].gauges,
  bassGuitar: STRING_GAUGE_SETS.bassGuitar.find(set => set.isDefault)?.gauges || STRING_GAUGE_SETS.bassGuitar[0].gauges,
  ukulele: STRING_GAUGE_SETS.ukulele.find(set => set.isDefault)?.gauges || STRING_GAUGE_SETS.ukulele[0].gauges
};

// Utility functions for string gauge sets
export function getGaugeSetsForInstrument(instrumentType: keyof typeof STRING_GAUGE_SETS): StringGaugeSet[] {
  return STRING_GAUGE_SETS[instrumentType] || [];
}

export function getDefaultGaugeSet(instrumentType: keyof typeof STRING_GAUGE_SETS): StringGaugeSet {
  const sets = STRING_GAUGE_SETS[instrumentType];
  return sets.find(set => set.isDefault) || sets[0];
}

export function getGaugeSetById(instrumentType: keyof typeof STRING_GAUGE_SETS, gaugeSetId: string): StringGaugeSet | null {
  const sets = STRING_GAUGE_SETS[instrumentType];
  return sets.find(set => set.id === gaugeSetId) || null;
}

// Determine instrument type based on scale length and number of strings
export function getInstrumentType(scaleLength: number, numberOfFrets: number): keyof typeof STANDARD_STRING_GAUGES {
  // Smart unit detection: if scale length is likely in mm, convert to inches
  let scaleLengthInches = scaleLength;

  // If the value is > 100, it's likely in mm (since even the longest guitars are ~35")
  if (scaleLength > 100) {
    scaleLengthInches = scaleLength / 25.4;
  }

  if (scaleLengthInches >= 30) {
    return 'bassGuitar';
  } else if (scaleLengthInches <= 17) {
    return 'ukulele';
  } else if (scaleLengthInches >= 25.55 && scaleLengthInches <= 25.65) {
    // Classical guitars are typically 25.6" (650mm)
    return 'classicalGuitar';
  } else if (scaleLengthInches >= 24 && scaleLengthInches <= 26) {
    // Distinguish between electric and acoustic based on typical fret count
    return numberOfFrets >= 22 ? 'electricGuitar' : 'acousticGuitar';
  }

  return 'electricGuitar'; // Default fallback
}

// Calculate compensation amount for a single string
export function calculateStringCompensation(
  stringGauge: number,
  stringType: 'wound' | 'plain',
  scaleLength: number,
  stringTension: number = 1.0
): number {
  // Base compensation formula based on string gauge and type
  // Wound strings typically need 2-3x more compensation than plain strings
  const baseCompensation = stringGauge * 0.5; // Base factor
  const woundMultiplier = stringType === 'wound' ? 2.5 : 1.0;
  const tensionFactor = Math.sqrt(stringTension); // Higher tension = more compensation
  
  // Scale length factor - longer scales need slightly more compensation
  const scaleFactor = scaleLength / 25.5; // Normalize to standard scale
  
  return baseCompensation * woundMultiplier * tensionFactor * scaleFactor;
}

// Determine if a string is wound based on gauge and instrument type
export function isWoundString(stringGauge: number, instrumentType: keyof typeof STANDARD_STRING_GAUGES): boolean {
  switch (instrumentType) {
    case 'electricGuitar':
      return stringGauge >= 0.024; // Typically D, A, E strings
    case 'acousticGuitar':
      return stringGauge >= 0.024; // Typically D, A, E strings
    case 'classicalGuitar':
      return stringGauge >= 0.029; // Bass strings are wound
    case 'bassGuitar':
      return true; // All bass strings are wound
    case 'ukulele':
      return false; // Ukulele strings are typically plain
    default:
      return stringGauge >= 0.024;
  }
}

// Calculate bridge recommendations for the current instrument
export function calculateBridgeRecommendations(
  scaleLength: number,
  numberOfFrets: number,
  units: 'inches' | 'mm' = 'inches',
  customStringGauges?: number[]
): BridgeRecommendation {
  // Convert scale length to inches for calculations
  const scaleLengthInches = units === 'mm' ? scaleLength / 25.4 : scaleLength;

  // Determine instrument type and get appropriate string gauges
  const instrumentType = getInstrumentType(scaleLengthInches, numberOfFrets);
  const stringGauges = customStringGauges || STANDARD_STRING_GAUGES[instrumentType];
  
  // Calculate compensation for each string
  const compensations: StringCompensation[] = stringGauges.map((gauge, index) => {
    const stringNumber = index + 1;
    const isWound = isWoundString(gauge, instrumentType);
    const compensation = calculateStringCompensation(gauge, isWound ? 'wound' : 'plain', scaleLengthInches);
    
    // Convert back to display units
    const compensationInUnits = units === 'mm' ? compensation * 25.4 : compensation;
    
    return {
      stringNumber,
      compensation: compensationInUnits,
      reason: `${isWound ? 'Wound' : 'Plain'} string (${gauge}" gauge) requires ${compensationInUnits.toFixed(3)}${units} compensation`
    };
  });
  
  // Calculate overall bridge position and compensation range
  const compensationAmounts = compensations.map(c => c.compensation);
  const minCompensation = Math.min(...compensationAmounts);
  const maxCompensation = Math.max(...compensationAmounts);
  const avgCompensation = compensationAmounts.reduce((sum, comp) => sum + comp, 0) / compensationAmounts.length;
  
  // Overall bridge position (scale length + average compensation)
  const overallPosition = scaleLength + avgCompensation;
  
  // Convert compensation range to display units
  const compensationRange = {
    min: minCompensation,
    max: maxCompensation
  };
  
  // Generate explanation and tips
  const explanation = `For optimal intonation, individual bridge saddles should be positioned with compensation ranging from ${minCompensation.toFixed(3)}${units} to ${maxCompensation.toFixed(3)}${units} behind the theoretical bridge position.`;
  
  const tips = [
    `Start with the bridge positioned at ${overallPosition.toFixed(3)}${units} from the nut`,
    `Adjust individual saddles: plain strings need less compensation, wound strings need more`,
    `Use a tuner to fine-tune each string's intonation at the 12th fret`,
    `The thickest strings typically need the most compensation`,
    `Check intonation after any string gauge changes`
  ];
  
  return {
    overallPosition,
    compensations,
    compensationRange,
    explanation,
    tips
  };
}

// Get instrument-specific recommendations
export function getInstrumentSpecificTips(instrumentType: keyof typeof STANDARD_STRING_GAUGES): string[] {
  switch (instrumentType) {
    case 'electricGuitar':
      return [
        'Electric guitars typically need 1-3mm of compensation',
        'Tremolo bridges may require additional setup considerations',
        'Check intonation after adjusting string height or pickup height'
      ];
    case 'acousticGuitar':
      return [
        'Acoustic guitars often need slightly more compensation than electrics',
        'Consider the bridge saddle angle for optimal intonation',
        'Heavier string gauges will require more compensation'
      ];
    case 'classicalGuitar':
      return [
        'Classical guitars with nylon strings need minimal compensation',
        'Wound bass strings still require more compensation than treble strings',
        'Temperature and humidity can affect nylon string intonation'
      ];
    case 'bassGuitar':
      return [
        'Bass guitars typically need 3-6mm of compensation',
        'All strings are wound and require significant compensation',
        'Longer scale lengths may need proportionally more compensation'
      ];
    case 'ukulele':
      return [
        'Ukuleles need minimal compensation due to plain strings',
        'Compensation is usually less than 1mm per string',
        'Re-entrant tuning (high G) may affect compensation needs'
      ];
    default:
      return [];
  }
}
