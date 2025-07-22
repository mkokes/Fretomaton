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
