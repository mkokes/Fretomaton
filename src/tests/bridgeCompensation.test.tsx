import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import {
  calculateBridgeRecommendations,
  getInstrumentType,
  calculateStringCompensation,
  isWoundString,
  getGaugeSetsForInstrument,
  getDefaultGaugeSet,
  getGaugeSetById
} from '../utils/bridgeCompensation';

describe('Bridge Compensation Calculations', () => {
  describe('getInstrumentType', () => {
    it('should identify electric guitar correctly', () => {
      expect(getInstrumentType(25.5, 24)).toBe('electricGuitar');
      expect(getInstrumentType(24.75, 22)).toBe('electricGuitar');
    });

    it('should identify acoustic guitar correctly', () => {
      expect(getInstrumentType(25.4, 20)).toBe('acousticGuitar');
      expect(getInstrumentType(24.9, 20)).toBe('acousticGuitar');
    });

    it('should identify bass guitar correctly', () => {
      expect(getInstrumentType(34.0, 24)).toBe('bassGuitar');
      expect(getInstrumentType(32.0, 24)).toBe('bassGuitar');
    });

    it('should identify ukulele correctly', () => {
      expect(getInstrumentType(17.0, 15)).toBe('ukulele');
      expect(getInstrumentType(15.0, 12)).toBe('ukulele');
    });

    it('should handle metric units correctly', () => {
      // 25.5" = 647.7mm
      expect(getInstrumentType(647.7, 24)).toBe('electricGuitar');
      // 17" = 431.8mm
      expect(getInstrumentType(431.8, 15)).toBe('ukulele');
    });
  });

  describe('isWoundString', () => {
    it('should identify wound strings correctly for electric guitar', () => {
      expect(isWoundString(0.009, 'electricGuitar')).toBe(false); // E high
      expect(isWoundString(0.024, 'electricGuitar')).toBe(true);  // D
      expect(isWoundString(0.042, 'electricGuitar')).toBe(true);  // E low
    });

    it('should identify wound strings correctly for bass', () => {
      expect(isWoundString(0.045, 'bassGuitar')).toBe(true);
      expect(isWoundString(0.105, 'bassGuitar')).toBe(true);
    });

    it('should identify plain strings for ukulele', () => {
      expect(isWoundString(0.024, 'ukulele')).toBe(false);
      expect(isWoundString(0.037, 'ukulele')).toBe(false);
    });
  });

  describe('calculateStringCompensation', () => {
    it('should calculate higher compensation for wound strings', () => {
      const plainCompensation = calculateStringCompensation(0.009, 'plain', 25.5);
      const woundCompensation = calculateStringCompensation(0.024, 'wound', 25.5);
      
      expect(woundCompensation).toBeGreaterThan(plainCompensation);
      expect(woundCompensation).toBeCloseTo(plainCompensation * 2.5, 1);
    });

    it('should scale compensation with string gauge', () => {
      const lightCompensation = calculateStringCompensation(0.009, 'plain', 25.5);
      const heavyCompensation = calculateStringCompensation(0.012, 'plain', 25.5);
      
      expect(heavyCompensation).toBeGreaterThan(lightCompensation);
    });

    it('should scale compensation with scale length', () => {
      const shortScaleComp = calculateStringCompensation(0.024, 'wound', 24.75);
      const longScaleComp = calculateStringCompensation(0.024, 'wound', 25.5);
      
      expect(longScaleComp).toBeGreaterThan(shortScaleComp);
    });
  });

  describe('calculateBridgeRecommendations', () => {
    it('should return valid recommendations for electric guitar', () => {
      const recommendations = calculateBridgeRecommendations(25.5, 24, 'inches');
      
      expect(recommendations.overallPosition).toBeGreaterThan(25.5);
      expect(recommendations.compensations).toHaveLength(6); // 6 strings
      expect(recommendations.compensationRange.min).toBeGreaterThan(0);
      expect(recommendations.compensationRange.max).toBeGreaterThan(recommendations.compensationRange.min);
      expect(recommendations.explanation).toContain('intonation');
      expect(recommendations.tips).toHaveLength(5);
    });

    it('should return valid recommendations for bass guitar', () => {
      const recommendations = calculateBridgeRecommendations(34.0, 24, 'inches');
      
      expect(recommendations.overallPosition).toBeGreaterThan(34.0);
      expect(recommendations.compensations).toHaveLength(4); // 4 strings
      expect(recommendations.compensationRange.max).toBeGreaterThan(0.01); // Bass needs more compensation
    });

    it('should handle metric units correctly', () => {
      const inchRecommendations = calculateBridgeRecommendations(25.5, 24, 'inches');
      const mmRecommendations = calculateBridgeRecommendations(647.7, 24, 'mm');
      
      // Convert mm recommendations to inches for comparison
      const mmToInches = (mm: number) => mm / 25.4;
      
      expect(mmToInches(mmRecommendations.overallPosition)).toBeCloseTo(inchRecommendations.overallPosition, 1);
      expect(mmToInches(mmRecommendations.compensationRange.min)).toBeCloseTo(inchRecommendations.compensationRange.min, 2);
    });

    it('should provide reasonable compensation values', () => {
      const recommendations = calculateBridgeRecommendations(25.5, 24, 'inches');
      
      // Compensation should be reasonable (typically 0.5-3mm for guitars)
      recommendations.compensations.forEach(comp => {
        expect(comp.compensation).toBeGreaterThan(0.001); // > 0.001"
        expect(comp.compensation).toBeLessThan(0.2);      // < 0.2" (5mm)
        expect(comp.reason).toContain('gauge');
      });
    });
  });
});

describe('String Gauge Selection', () => {
  describe('getGaugeSetsForInstrument', () => {
    it('should return correct gauge sets for electric guitar', () => {
      const gaugeSets = getGaugeSetsForInstrument('electricGuitar');

      expect(gaugeSets).toHaveLength(4);
      expect(gaugeSets.map(s => s.id)).toEqual(['light', 'regular', 'medium', 'heavy']);
      expect(gaugeSets.find(s => s.id === 'light')?.description).toBe('Light (9-42)');
    });

    it('should return correct gauge sets for acoustic guitar', () => {
      const gaugeSets = getGaugeSetsForInstrument('acousticGuitar');

      expect(gaugeSets).toHaveLength(4);
      expect(gaugeSets.map(s => s.id)).toEqual(['extraLight', 'light', 'medium', 'heavy']);
      expect(gaugeSets.find(s => s.id === 'light')?.description).toBe('Light (12-53)');
    });

    it('should return correct gauge sets for bass guitar', () => {
      const gaugeSets = getGaugeSetsForInstrument('bassGuitar');

      expect(gaugeSets).toHaveLength(4);
      expect(gaugeSets.map(s => s.id)).toEqual(['light', 'medium', 'heavy', 'extraHeavy']);
      expect(gaugeSets.find(s => s.id === 'medium')?.description).toBe('Medium (45-105)');
    });

    it('should return correct gauge sets for classical guitar', () => {
      const gaugeSets = getGaugeSetsForInstrument('classicalGuitar');

      expect(gaugeSets).toHaveLength(3);
      expect(gaugeSets.map(s => s.id)).toEqual(['normalTension', 'highTension', 'extraHighTension']);
    });

    it('should return correct gauge sets for ukulele', () => {
      const gaugeSets = getGaugeSetsForInstrument('ukulele');

      expect(gaugeSets).toHaveLength(3);
      expect(gaugeSets.map(s => s.id)).toEqual(['standard', 'concert', 'tenor']);
    });
  });

  describe('getDefaultGaugeSet', () => {
    it('should return default gauge set for each instrument type', () => {
      expect(getDefaultGaugeSet('electricGuitar').id).toBe('light');
      expect(getDefaultGaugeSet('acousticGuitar').id).toBe('light');
      expect(getDefaultGaugeSet('bassGuitar').id).toBe('medium');
      expect(getDefaultGaugeSet('classicalGuitar').id).toBe('normalTension');
      expect(getDefaultGaugeSet('ukulele').id).toBe('standard');
    });

    it('should return first gauge set if no default is marked', () => {
      // This tests the fallback behavior
      const gaugeSets = getGaugeSetsForInstrument('electricGuitar');
      const defaultSet = getDefaultGaugeSet('electricGuitar');

      expect(defaultSet).toBeDefined();
      expect(gaugeSets).toContain(defaultSet);
    });
  });

  describe('getGaugeSetById', () => {
    it('should return correct gauge set by ID', () => {
      const gaugeSet = getGaugeSetById('electricGuitar', 'heavy');

      expect(gaugeSet).toBeDefined();
      expect(gaugeSet?.id).toBe('heavy');
      expect(gaugeSet?.description).toBe('Heavy (12-54)');
      expect(gaugeSet?.gauges).toEqual([0.012, 0.016, 0.024, 0.032, 0.042, 0.054]);
    });

    it('should return null for invalid gauge set ID', () => {
      const gaugeSet = getGaugeSetById('electricGuitar', 'nonexistent');

      expect(gaugeSet).toBeNull();
    });

    it('should return null for gauge set ID from wrong instrument type', () => {
      const gaugeSet = getGaugeSetById('electricGuitar', 'normalTension'); // Classical guitar gauge

      expect(gaugeSet).toBeNull();
    });
  });

  describe('calculateBridgeRecommendations with custom gauges', () => {
    it('should use custom string gauges when provided', () => {
      const customGauges = [0.008, 0.010, 0.015, 0.022, 0.030, 0.038]; // Super light set
      const recommendations = calculateBridgeRecommendations(25.5, 24, 'inches', customGauges);

      expect(recommendations.compensations).toHaveLength(6);

      // Custom gauges should result in different compensation than default
      const defaultRecommendations = calculateBridgeRecommendations(25.5, 24, 'inches');
      expect(recommendations.compensations[0].compensation).not.toBe(defaultRecommendations.compensations[0].compensation);
    });

    it('should fall back to default gauges when custom gauges not provided', () => {
      const recommendations = calculateBridgeRecommendations(25.5, 24, 'inches');
      const recommendationsWithUndefined = calculateBridgeRecommendations(25.5, 24, 'inches', undefined);

      expect(recommendations.compensations).toEqual(recommendationsWithUndefined.compensations);
    });
  });
});

describe('Bridge Compensation UI Integration', () => {
  it('should display bridge compensation section', () => {
    render(<App />);

    expect(screen.getByText('Bridge Compensation Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Why Bridge Compensation Matters')).toBeInTheDocument();
  });

  it('should display string gauge selection dropdown', () => {
    render(<App />);

    expect(screen.getByText('String Gauge Set')).toBeInTheDocument();

    // Should show gauge selection dropdown
    const gaugeSelect = screen.getByDisplayValue(/Light \(9-42\)/);
    expect(gaugeSelect).toBeInTheDocument();
  });

  it('should show appropriate gauge options for electric guitar', () => {
    render(<App />);

    const gaugeSelect = screen.getByDisplayValue(/Light \(9-42\)/);

    // Check that electric guitar gauge options are available in the dropdown
    const lightOption = screen.getByRole('option', { name: 'Light (9-42)' });
    expect(lightOption).toBeInTheDocument();

    // Open dropdown and check options
    fireEvent.click(gaugeSelect);
    expect(screen.getByRole('option', { name: 'Regular (10-46)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium (11-49)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Heavy (12-54)' })).toBeInTheDocument();
  });

  it('should update gauge options when instrument preset changes', () => {
    render(<App />);

    // Initially should show electric guitar gauges
    expect(screen.getByDisplayValue(/Light \(9-42\)/)).toBeInTheDocument();

    // Switch to bass preset
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
    fireEvent.change(presetSelect, { target: { value: 'bassLongScale' } });

    // Should now show bass gauge options
    expect(screen.getByDisplayValue(/Medium \(45-105\)/)).toBeInTheDocument();

    // Check that bass gauge options are available
    const gaugeSelect = screen.getByDisplayValue(/Medium \(45-105\)/);
    fireEvent.click(gaugeSelect);
    expect(screen.getByText('Light (40-95)')).toBeInTheDocument();
    expect(screen.getByText('Heavy (50-110)')).toBeInTheDocument();
  });

  it('should update compensation when gauge set changes', () => {
    render(<App />);

    // Get initial compensation values
    const initialCompensation = screen.getAllByText(/^\+\d+\.\d+$/);
    const initialValues = initialCompensation.map(el => parseFloat(el.textContent?.replace('+', '') || '0'));

    // Change to heavy gauge set
    const gaugeSelect = screen.getByDisplayValue(/Light \(9-42\)/);
    fireEvent.change(gaugeSelect, { target: { value: 'heavy' } });

    // Should now show Heavy gauge set
    expect(screen.getByDisplayValue(/Heavy \(12-54\)/)).toBeInTheDocument();

    // Compensation values should be different (heavier strings need more compensation)
    const newCompensation = screen.getAllByText(/^\+\d+\.\d+$/);
    const newValues = newCompensation.map(el => parseFloat(el.textContent?.replace('+', '') || '0'));

    // Heavy strings should generally need more compensation
    const maxNewCompensation = Math.max(...newValues);
    const maxInitialCompensation = Math.max(...initialValues);
    expect(maxNewCompensation).toBeGreaterThan(maxInitialCompensation);
  });

  it('should show compensation table with correct headers', () => {
    render(<App />);

    expect(screen.getByText('String')).toBeInTheDocument();
    expect(screen.getByText('Gauge')).toBeInTheDocument();
    expect(screen.getByText(/Compensation \(inches\)/)).toBeInTheDocument();
    expect(screen.getByText(/Saddle Position \(inches\)/)).toBeInTheDocument();
  });

  it('should display string gauges in compensation table', () => {
    render(<App />);

    // Should show string gauges for light electric guitar set (9-42)
    expect(screen.getByText('.009"')).toBeInTheDocument(); // High E
    expect(screen.getByText('.011"')).toBeInTheDocument(); // B
    expect(screen.getByText('.016"')).toBeInTheDocument(); // G
    expect(screen.getByText('.024"')).toBeInTheDocument(); // D
    expect(screen.getByText('.032"')).toBeInTheDocument(); // A
    expect(screen.getByText('.042"')).toBeInTheDocument(); // Low E
  });

  it('should update displayed gauges when gauge set changes', () => {
    render(<App />);

    // Initially should show light gauges
    expect(screen.getByText('.009"')).toBeInTheDocument();

    // Change to heavy gauge set
    const gaugeSelect = screen.getByDisplayValue(/Light \(9-42\)/);
    fireEvent.change(gaugeSelect, { target: { value: 'heavy' } });

    // Should now show heavy gauges (12-54)
    expect(screen.getByText('.012"')).toBeInTheDocument(); // High E
    expect(screen.getByText('.054"')).toBeInTheDocument(); // Low E

    // Light gauges should no longer be visible
    expect(screen.queryByText('.009"')).not.toBeInTheDocument();
  });

  it('should show selected gauge set in explanation section', () => {
    render(<App />);

    // Should show current gauge set in explanation
    expect(screen.getByText(/Selected gauge set:/)).toBeInTheDocument();

    // Look for the gauge set in the explanation section specifically
    const explanationSection = screen.getByText(/Selected gauge set:/).closest('p');
    expect(explanationSection).toHaveTextContent('Light (9-42)');

    // Change gauge set
    const gaugeSelect = screen.getByDisplayValue(/Light \(9-42\)/);
    fireEvent.change(gaugeSelect, { target: { value: 'medium' } });

    // Should update explanation
    const updatedExplanationSection = screen.getByText(/Selected gauge set:/).closest('p');
    expect(updatedExplanationSection).toHaveTextContent('Medium (11-49)');
  });

  it('should display string-specific compensation values', () => {
    render(<App />);
    
    // Should show 6 strings for default electric guitar
    expect(screen.getByText('String 1')).toBeInTheDocument();
    expect(screen.getByText('String 6')).toBeInTheDocument();
    
    // Should show compensation values (positive numbers with + prefix)
    const compensationCells = screen.getAllByText(/^\+\d+\.\d+$/);
    expect(compensationCells.length).toBeGreaterThan(0);
  });

  it('should update compensation when units change', () => {
    render(<App />);
    
    // Initially should show inches
    expect(screen.getByText(/Compensation \(inches\)/)).toBeInTheDocument();
    
    // Switch to millimeters
    const mmRadio = screen.getByLabelText('Millimeters');
    fireEvent.click(mmRadio);
    
    // Should now show mm
    expect(screen.getByText(/Compensation \(mm\)/)).toBeInTheDocument();
    expect(screen.getByText(/Saddle Position \(mm\)/)).toBeInTheDocument();
  });

  it('should update compensation when preset changes', () => {
    render(<App />);
    
    // Get initial compensation values
    const initialCompensation = screen.getAllByText(/^\+\d+\.\d+$/);
    const initialCount = initialCompensation.length;
    
    // Switch to bass preset
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
    fireEvent.change(presetSelect, { target: { value: 'bassLongScale' } });
    
    // Should now show 4 strings instead of 6
    const bassCompensation = screen.getAllByText(/^\+\d+\.\d+$/);
    expect(bassCompensation.length).toBe(4);
    expect(bassCompensation.length).toBeLessThan(initialCount);
    
    // Bass should have higher compensation values
    const bassValues = bassCompensation.map(el => parseFloat(el.textContent?.replace('+', '') || '0'));
    const maxBassCompensation = Math.max(...bassValues);
    expect(maxBassCompensation).toBeGreaterThan(0.01); // Should be > 0.01" for bass
  });

  it('should show setup tips and explanations', () => {
    render(<App />);
    
    expect(screen.getByText('Setup Tips')).toBeInTheDocument();
    expect(screen.getByText(/Start with the bridge positioned at/)).toBeInTheDocument();
    expect(screen.getByText(/plain strings need less compensation/)).toBeInTheDocument();
  });

  it('should show instrument-specific tips', () => {
    render(<App />);

    // Should show electric guitar specific tips by default
    const electricTips = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes('Electric Guitar Specific:') || false;
    });
    expect(electricTips.length).toBeGreaterThan(0);

    // Switch to bass
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
    fireEvent.change(presetSelect, { target: { value: 'bassLongScale' } });

    // Should now show bass specific tips
    const bassTips = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes('Bass Guitar Specific:') || false;
    });
    expect(bassTips.length).toBeGreaterThan(0);
    expect(screen.getByText(/Bass guitars typically need 3-6mm/)).toBeInTheDocument();
  });

  it('should include bridge compensation in SVG template', () => {
    render(<App />);
    
    // Check that SVG contains compensation zone elements
    const svg = document.querySelector('svg.template-svg');
    expect(svg).toBeInTheDocument();
    
    // Should have compensation zone rectangle
    const compensationZone = svg?.querySelector('rect[fill="orange"]');
    expect(compensationZone).toBeInTheDocument();
    
    // Should have individual string compensation indicators
    const stringIndicators = svg?.querySelectorAll('circle[fill="red"]');
    expect(stringIndicators?.length).toBeGreaterThan(0);
  });

  it('should update SVG compensation zone when scale length changes', () => {
    render(<App />);
    
    const svg = document.querySelector('svg.template-svg');
    const initialCompZone = svg?.querySelector('rect[fill="orange"]');
    const initialHeight = initialCompZone?.getAttribute('height');
    
    // Change scale length
    const scaleInput = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
    fireEvent.change(scaleInput, { target: { value: '24.75' } });
    
    // Compensation zone should update
    const updatedCompZone = svg?.querySelector('rect[fill="orange"]');
    const updatedHeight = updatedCompZone?.getAttribute('height');
    
    // Heights should be different (different scale lengths need different compensation)
    expect(updatedHeight).not.toBe(initialHeight);
  });
});
