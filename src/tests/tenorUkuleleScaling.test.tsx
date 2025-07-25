import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Tenor Ukulele Scaling Fix', () => {
  it('should generate correct SVG dimensions for tenor ukulele', () => {
    render(<App />);

    // Find and select the tenor ukulele preset from dropdown
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
    fireEvent.change(presetSelect, { target: { value: 'ukuleleTenor' } });
    
    // Find the template SVG
    const templateSvg = document.querySelector('svg.template-svg');
    expect(templateSvg).toBeInTheDocument();
    
    // Check SVG dimensions
    const width = templateSvg?.getAttribute('width');
    const height = templateSvg?.getAttribute('height');
    
    // For tenor ukulele with calibration factor (0.9541/0.89 ≈ 1.072):
    // 17" scale + 2" padding = 19" * 1.072 ≈ 20.37" height
    // 1.75" neck width + 2" padding = 3.75" * 1.072 ≈ 4.02" width
    const calibrationFactor = 0.9541 / 0.89;

    // Check that dimensions are calibrated (should be larger than base dimensions)
    const widthValue = parseFloat(width?.replace('in', '') || '0');
    const heightValue = parseFloat(height?.replace('in', '') || '0');

    expect(widthValue).toBeGreaterThan(4.0); // Should be larger due to calibration
    expect(widthValue).toBeLessThan(4.1); // But not too large
    expect(heightValue).toBeGreaterThan(20.3); // Should be larger due to calibration
    expect(heightValue).toBeLessThan(20.5); // But not too large
    expect(width).toMatch(/^\d+\.\d+in$/); // Should be in inches format
    expect(height).toMatch(/^\d+\.\d+in$/); // Should be in inches format
    
    console.log('Tenor Ukulele SVG Verification (with calibration):');
    console.log(`- Width: ${width} (calibrated from 3.75in)`);
    console.log(`- Height: ${height} (calibrated from 19in)`);
    console.log(`- Calibration factor: ${calibrationFactor.toFixed(3)} (corrects 0.89" to 0.9541")`);
    console.log('- SVG dimensions adjusted to ensure accurate physical printing');
  });

  it('should calculate correct first fret distance for tenor ukulele', () => {
    render(<App />);

    // Load tenor ukulele preset
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
    fireEvent.change(presetSelect, { target: { value: 'ukuleleTenor' } });
    
    // Find the first fret measurement in the table
    // Look for the table row with fret number 1 and get its distance
    const tableRows = document.querySelectorAll('tbody tr');
    let firstFretDistance = '';

    for (const row of tableRows) {
      const fretCell = row.querySelector('td:first-child');
      if (fretCell?.textContent === '1') {
        const distanceCell = row.querySelector('td:nth-child(2)');
        firstFretDistance = distanceCell?.textContent || '';
        break;
      }
    }

    // The first fret should be at 0.9541" from the nut
    expect(firstFretDistance).toBe('0.9541');
    
    console.log('First Fret Distance Verification:');
    console.log(`- Calculated distance: ${firstFretDistance}" (expected: 0.9541")`);
    console.log('- With calibration factor, this should now measure exactly 0.9541" when printed');
    console.log('- Calibration corrects for browser scaling discrepancies (was measuring 0.89")');
  });

  it('should maintain consistent scaling across different units', () => {
    render(<App />);

    // Load tenor ukulele preset
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
    fireEvent.change(presetSelect, { target: { value: 'ukuleleTenor' } });
    
    // Check initial SVG dimensions (should be in inches)
    const templateSvg = document.querySelector('svg.template-svg');
    const initialWidth = templateSvg?.getAttribute('width');
    const initialHeight = templateSvg?.getAttribute('height');
    
    // Switch to metric units
    const metricRadio = screen.getByDisplayValue('mm');
    fireEvent.click(metricRadio);
    
    // SVG dimensions should remain the same (always in inches for printing)
    const finalWidth = templateSvg?.getAttribute('width');
    const finalHeight = templateSvg?.getAttribute('height');
    
    expect(finalWidth).toBe(initialWidth);
    expect(finalHeight).toBe(initialHeight);
    
    console.log('Unit Consistency Verification:');
    console.log(`- SVG width remains: ${finalWidth} (consistent across unit systems)`);
    console.log(`- SVG height remains: ${finalHeight} (consistent across unit systems)`);
    console.log('- SVG always uses inches for 1:1 print scaling regardless of display units');
  });
});
