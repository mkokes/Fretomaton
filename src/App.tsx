import { useState, useMemo } from 'react';
import { Printer, Guitar } from 'lucide-react';
import presetsData from './data/presets.json';
import type { PresetInstrument } from './types/presets';

interface FretPosition {
  fret: number;
  distance: number;
  fromPrevious: number;
}

const FretTemplateCalculator = () => {
  const [scaleLength, setScaleLength] = useState<number>(25.5);
  const [nutStringWidth, setNutStringWidth] = useState<number>(1.375);
  const [bridgeStringWidth, setBridgeStringWidth] = useState<number>(2.0625);
  const [numberOfFrets, setNumberOfFrets] = useState<number>(24);
  const [neckWidth, setNeckWidth] = useState<number>(1.75);
  const [fretWireWidth, setFretWireWidth] = useState<number>(0.04);
  const [units, setUnits] = useState<'inches' | 'mm'>('inches');
  const [selectedPreset, setSelectedPreset] = useState<string>('fenderStandard');

  // Calculate fret positions using the 12th root of 2 formula
  const fretPositions = useMemo((): FretPosition[] => {
    const positions: FretPosition[] = [];
    const factor = Math.pow(2, 1/12);

    for (let fret = 1; fret <= numberOfFrets; fret++) {
      const distance = scaleLength - (scaleLength / Math.pow(factor, fret));
      positions.push({
        fret,
        distance: parseFloat(distance.toFixed(4)),
        fromPrevious: fret === 1 ? distance : distance - positions[fret-2].distance
      });
    }

    return positions;
  }, [scaleLength, numberOfFrets]);

  // Convert units when switching
  const convertValue = (value: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return value;
    if (fromUnit === 'inches' && toUnit === 'mm') return value * 25.4;
    if (fromUnit === 'mm' && toUnit === 'inches') return value / 25.4;
    return value;
  };

  // Handle unit changes and convert existing values
  const handleUnitsChange = (newUnits: 'inches' | 'mm') => {
    if (newUnits !== units) {
      setScaleLength(prev => convertValue(prev, units, newUnits));
      setNutStringWidth(prev => convertValue(prev, units, newUnits));
      setBridgeStringWidth(prev => convertValue(prev, units, newUnits));
      setNeckWidth(prev => convertValue(prev, units, newUnits));
      setFretWireWidth(prev => convertValue(prev, units, newUnits));
      setUnits(newUnits);
    }
  };

  // Calculate string spacing at each fret
  const getStringSpacingAtFret = (fretNumber: number): number => {
    if (fretNumber === 0) return nutStringWidth;
    const ratio = fretPositions[fretNumber - 1]?.distance / scaleLength || 0;
    return nutStringWidth + (bridgeStringWidth - nutStringWidth) * ratio;
  };

  // Preset instruments with unit-aware descriptions
  const getPresetInstruments = (): Record<string, PresetInstrument> => {
    const converted: Record<string, PresetInstrument> = {};

    // Flatten all presets from different categories
    const allPresets = {
      ...presetsData.electricGuitars,
      ...presetsData.acousticGuitars,
      ...presetsData.bassGuitars,
      ...presetsData.classical,
      ...presetsData.ukuleles
    };

    Object.keys(allPresets).forEach(key => {
      const preset = allPresets[key as keyof typeof allPresets];
      converted[key] = {
        ...preset,
        scaleLength: convertValue(preset.scaleLength, 'inches', units),
        nutWidth: convertValue(preset.nutWidth, 'inches', units),
        bridgeWidth: convertValue(preset.bridgeWidth, 'inches', units),
        displayLength: units === 'inches'
          ? `${preset.scaleLength}"`
          : `${(preset.scaleLength * 25.4).toFixed(0)}mm`
      };
    });
    return converted;
  };

  const presetInstruments = getPresetInstruments();

  const loadPreset = (preset: string) => {
    const config = presetInstruments[preset];
    if (config) {
      setScaleLength(config.scaleLength);
      setNutStringWidth(config.nutWidth);
      setBridgeStringWidth(config.bridgeWidth);
      setNumberOfFrets(config.frets);
      setSelectedPreset(preset);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const convertUnits = (value: number): string => {
    if (units === 'mm') {
      return value.toFixed(2);
    }
    return value.toFixed(4);
  };

  // Convert values to inches for consistent SVG scaling regardless of display units
  const toInchesForSVG = (value: number): number => {
    if (units === 'mm') {
      return value / 25.4; // Convert mm to inches for SVG scaling
    }
    return value; // Already in inches
  };

  // Calculate SVG dimensions for 1:1 print scaling
  const getSVGDimensions = () => {
    const scaleInches = toInchesForSVG(scaleLength);
    const neckInches = toInchesForSVG(neckWidth);
    const padding = 1; // 1 inch padding on all sides

    return {
      width: neckInches + (padding * 2),
      height: scaleInches + (padding * 2),
      paddingX: padding,
      paddingY: padding
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Guitar className="w-8 h-8" />
          Fretomaton
        </h1>
        <p className="text-gray-600">Generate precise fret layout templates for guitar, ukulele, and other fretted instruments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 print:hidden">
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

            {/* Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrument Presets
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                onChange={(e) => {
                  if (e.target.value) {
                    loadPreset(e.target.value);
                  } else {
                    setSelectedPreset('');
                  }
                }}
                value={selectedPreset}
              >
                <option value="">Select a preset...</option>

                <optgroup label="Electric Guitars">
                  <option value="fenderStandard">{presetInstruments.fenderStandard?.name} ({presetInstruments.fenderStandard?.displayLength})</option>
                  <option value="gibsonStandard">{presetInstruments.gibsonStandard?.name} ({presetInstruments.gibsonStandard?.displayLength})</option>
                  <option value="prsStandard">{presetInstruments.prsStandard?.name} ({presetInstruments.prsStandard?.displayLength})</option>
                  <option value="shortScale">{presetInstruments.shortScale?.name} ({presetInstruments.shortScale?.displayLength})</option>
                </optgroup>

                <optgroup label="Acoustic Guitars">
                  <option value="martinStandard">{presetInstruments.martinStandard?.name} ({presetInstruments.martinStandard?.displayLength})</option>
                  <option value="taylorStandard">{presetInstruments.taylorStandard?.name} ({presetInstruments.taylorStandard?.displayLength})</option>
                  <option value="gibsonAcoustic">{presetInstruments.gibsonAcoustic?.name} ({presetInstruments.gibsonAcoustic?.displayLength})</option>
                  <option value="parlorGuitar">{presetInstruments.parlorGuitar?.name} ({presetInstruments.parlorGuitar?.displayLength})</option>
                </optgroup>

                <optgroup label="Classical Guitar">
                  <option value="classical">{presetInstruments.classical?.name} ({presetInstruments.classical?.displayLength})</option>
                </optgroup>

                <optgroup label="Bass Guitars">
                  <option value="bassLongScale">{presetInstruments.bassLongScale?.name} ({presetInstruments.bassLongScale?.displayLength})</option>
                  <option value="bassMediumScale">{presetInstruments.bassMediumScale?.name} ({presetInstruments.bassMediumScale?.displayLength})</option>
                  <option value="bassShortScale">{presetInstruments.bassShortScale?.name} ({presetInstruments.bassShortScale?.displayLength})</option>
                  <option value="bassExtraLong">{presetInstruments.bassExtraLong?.name} ({presetInstruments.bassExtraLong?.displayLength})</option>
                </optgroup>

                <optgroup label="Ukuleles">
                  <option value="ukuleleSopranino">{presetInstruments.ukuleleSopranino?.name} ({presetInstruments.ukuleleSopranino?.displayLength})</option>
                  <option value="ukuleleSoprano">{presetInstruments.ukuleleSoprano?.name} ({presetInstruments.ukuleleSoprano?.displayLength})</option>
                  <option value="ukuleleConcert">{presetInstruments.ukuleleConcert?.name} ({presetInstruments.ukuleleConcert?.displayLength})</option>
                  <option value="ukuleleTenor">{presetInstruments.ukuleleTenor?.name} ({presetInstruments.ukuleleTenor?.displayLength})</option>
                  <option value="ukuleleBaritone">{presetInstruments.ukuleleBaritone?.name} ({presetInstruments.ukuleleBaritone?.displayLength})</option>
                  <option value="ukuleleBass">{presetInstruments.ukuleleBass?.name} ({presetInstruments.ukuleleBass?.displayLength})</option>
                  <option value="ukuleleContrabass">{presetInstruments.ukuleleContrabass?.name} ({presetInstruments.ukuleleContrabass?.displayLength})</option>
                </optgroup>
              </select>
            </div>

            {/* Units */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="inches"
                    checked={units === 'inches'}
                    onChange={(e) => handleUnitsChange(e.target.value as 'inches' | 'mm')}
                    className="mr-2"
                  />
                  Inches
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mm"
                    checked={units === 'mm'}
                    onChange={(e) => handleUnitsChange(e.target.value as 'inches' | 'mm')}
                    className="mr-2"
                  />
                  Millimeters
                </label>
              </div>
            </div>

            {/* Scale Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scale Length ({units})
              </label>
              <input
                type="number"
                step="0.001"
                value={scaleLength}
                onChange={(e) => setScaleLength(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Distance from nut to bridge</p>
            </div>

            {/* String Widths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                String Width at Nut ({units})
              </label>
              <input
                type="number"
                step="0.001"
                value={nutStringWidth}
                onChange={(e) => setNutStringWidth(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                String Width at Bridge ({units})
              </label>
              <input
                type="number"
                step="0.001"
                value={bridgeStringWidth}
                onChange={(e) => setBridgeStringWidth(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Additional Parameters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Frets
              </label>
              <input
                type="number"
                min="12"
                max="36"
                value={numberOfFrets}
                onChange={(e) => setNumberOfFrets(parseInt(e.target.value) || 12)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neck Width ({units})
              </label>
              <input
                type="number"
                step="0.001"
                value={neckWidth}
                onChange={(e) => setNeckWidth(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Total width of neck</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fret Wire Width ({units})
              </label>
              <input
                type="number"
                step="0.001"
                value={fretWireWidth}
                onChange={(e) => setFretWireWidth(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Thickness of fret wire for slot cutting</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Results and Template */}
        <div className="lg:col-span-2">
          {/* Calculations Table */}
          <div className="mb-8 print:mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fret Positions</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left">Fret</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Distance from Nut ({units})
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      String Spacing ({units})
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left print:hidden">
                      From Previous ({units})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 font-medium">0 (Nut)</td>
                    <td className="border border-gray-300 px-3 py-2">0.0000</td>
                    <td className="border border-gray-300 px-3 py-2">{convertUnits(nutStringWidth)}</td>
                    <td className="border border-gray-300 px-3 py-2 print:hidden">-</td>
                  </tr>
                  {fretPositions.map((fret) => (
                    <tr key={fret.fret} className={fret.fret === 12 ? 'bg-yellow-50' : ''}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">{fret.fret}</td>
                      <td className="border border-gray-300 px-3 py-2">{convertUnits(fret.distance)}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {convertUnits(getStringSpacingAtFret(fret.fret))}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 print:hidden">
                        {convertUnits(fret.fromPrevious)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 font-medium">Bridge</td>
                    <td className="border border-gray-300 px-3 py-2">{convertUnits(scaleLength)}</td>
                    <td className="border border-gray-300 px-3 py-2">{convertUnits(bridgeStringWidth)}</td>
                    <td className="border border-gray-300 px-3 py-2 print:hidden">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Template */}
          <div className="print:page-break-before">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Template Layout</h2>
            <div className="border border-gray-300 p-4 bg-white">
              <div className="text-xs text-gray-600 mb-2">
                Scale: {convertUnits(scaleLength)}{units} | Nut: {convertUnits(nutStringWidth)}{units} | Bridge: {convertUnits(bridgeStringWidth)}{units} | {numberOfFrets} frets
              </div>
              <div className="text-xs text-red-600 mb-2 font-semibold">
                ⚠️ Print at 100% scale (no scaling) for accurate measurements
              </div>
              <svg
                width={`${getSVGDimensions().width}in`}
                height={`${getSVGDimensions().height}in`}
                viewBox={`0 0 ${getSVGDimensions().width} ${getSVGDimensions().height}`}
                className="template-svg border border-gray-200"
                style={{ maxWidth: '400px', height: 'auto' }}
              >
                {/* Nut label - positioned above the fretboard */}
                <text
                  x={getSVGDimensions().paddingX + toInchesForSVG(neckWidth) / 2}
                  y={getSVGDimensions().paddingY - 0.1}
                  textAnchor="middle"
                  className="fill-black font-bold"
                  fontSize="0.15"
                >
                  NUT
                </text>

                {/* Neck outline - now vertical with top offset */}
                <line
                  x1={getSVGDimensions().paddingX}
                  y1={getSVGDimensions().paddingY}
                  x2={getSVGDimensions().paddingX}
                  y2={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  stroke="black"
                  strokeWidth="0.03"
                />
                <line
                  x1={getSVGDimensions().paddingX + toInchesForSVG(neckWidth)}
                  y1={getSVGDimensions().paddingY}
                  x2={getSVGDimensions().paddingX + toInchesForSVG(neckWidth)}
                  y2={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  stroke="black"
                  strokeWidth="0.03"
                />

                {/* Nut - now horizontal at top with offset */}
                <line
                  x1={getSVGDimensions().paddingX}
                  y1={getSVGDimensions().paddingY}
                  x2={getSVGDimensions().paddingX + toInchesForSVG(neckWidth)}
                  y2={getSVGDimensions().paddingY}
                  stroke="black"
                  strokeWidth="0.05"
                />

                {/* Frets - now horizontal lines with offset */}
                {fretPositions.map((fret) => (
                  <g key={fret.fret}>
                    <line
                      x1={getSVGDimensions().paddingX}
                      y1={getSVGDimensions().paddingY + toInchesForSVG(fret.distance)}
                      x2={getSVGDimensions().paddingX + toInchesForSVG(neckWidth)}
                      y2={getSVGDimensions().paddingY + toInchesForSVG(fret.distance)}
                      stroke={fret.fret === 12 ? "red" : "gray"}
                      strokeWidth={fret.fret === 12 ? "0.03" : "0.015"}
                    />
                    {/* White background for fret numbers - left side */}
                    <rect
                      x={getSVGDimensions().paddingX - 0.8}
                      y={getSVGDimensions().paddingY + toInchesForSVG(fret.distance) - 0.08}
                      width="0.7"
                      height="0.16"
                      fill="white"
                      stroke="none"
                      opacity="0.9"
                    />
                    <text
                      x={getSVGDimensions().paddingX - 0.45}
                      y={getSVGDimensions().paddingY + toInchesForSVG(fret.distance) + 0.05}
                      textAnchor="middle"
                      className="fill-black font-bold"
                      fontSize="0.12"
                      stroke="white"
                      strokeWidth="0.01"
                    >
                      {fret.fret}
                    </text>
                    {/* White background for measurements - right side */}
                    <rect
                      x={getSVGDimensions().paddingX + toInchesForSVG(neckWidth) + 0.1}
                      y={getSVGDimensions().paddingY + toInchesForSVG(fret.distance) - 0.06}
                      width="0.7"
                      height="0.12"
                      fill="white"
                      stroke="none"
                      opacity="0.9"
                    />
                    <text
                      x={getSVGDimensions().paddingX + toInchesForSVG(neckWidth) + 0.45}
                      y={getSVGDimensions().paddingY + toInchesForSVG(fret.distance) + 0.04}
                      textAnchor="middle"
                      className="fill-black font-bold"
                      fontSize="0.08"
                      stroke="white"
                      strokeWidth="0.005"
                    >
                      {convertUnits(fret.distance)}
                    </text>
                  </g>
                ))}

                {/* Bridge - now horizontal at bottom with offset */}
                <line
                  x1={getSVGDimensions().paddingX}
                  y1={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  x2={getSVGDimensions().paddingX + toInchesForSVG(neckWidth)}
                  y2={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  stroke="black"
                  strokeWidth="0.05"
                />

                {/* Bridge label */}
                <text
                  x={getSVGDimensions().paddingX + toInchesForSVG(neckWidth) / 2}
                  y={getSVGDimensions().paddingY + toInchesForSVG(scaleLength) + 0.3}
                  textAnchor="middle"
                  className="fill-black font-bold"
                  fontSize="0.15"
                >
                  BRIDGE
                </text>

                {/* Centerline with offset */}
                <line
                  x1={getSVGDimensions().paddingX + toInchesForSVG(neckWidth) / 2}
                  y1={getSVGDimensions().paddingY}
                  x2={getSVGDimensions().paddingX + toInchesForSVG(neckWidth) / 2}
                  y2={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  stroke="green"
                  strokeWidth="0.01"
                  strokeDasharray="0.1,0.1"
                />

                {/* String spacing indicators - now vertical with offset */}
                <line
                  x1={getSVGDimensions().paddingX + (toInchesForSVG(neckWidth) - toInchesForSVG(nutStringWidth)) / 2}
                  y1={getSVGDimensions().paddingY}
                  x2={getSVGDimensions().paddingX + (toInchesForSVG(neckWidth) - toInchesForSVG(bridgeStringWidth)) / 2}
                  y2={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  stroke="blue"
                  strokeWidth="0.01"
                  strokeDasharray="0.05,0.05"
                />
                <line
                  x1={getSVGDimensions().paddingX + (toInchesForSVG(neckWidth) + toInchesForSVG(nutStringWidth)) / 2}
                  y1={getSVGDimensions().paddingY}
                  x2={getSVGDimensions().paddingX + (toInchesForSVG(neckWidth) + toInchesForSVG(bridgeStringWidth)) / 2}
                  y2={getSVGDimensions().paddingY + toInchesForSVG(scaleLength)}
                  stroke="blue"
                  strokeWidth="0.01"
                  strokeDasharray="0.05,0.05"
                />
              </svg>

              {/* Legend */}
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-black"></div>
                  <span>Fret slots (cut here)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span>12th fret (octave)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500 border-dashed border-t"></div>
                  <span>Centerline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500 border-dashed border-t"></div>
                  <span>String spacing guides</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FretTemplateCalculator;
