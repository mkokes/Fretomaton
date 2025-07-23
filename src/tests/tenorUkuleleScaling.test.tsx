import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Tenor Ukulele Scaling Fix', () => {
  it('should generate correct SVG dimensions for tenor ukulele', () => {
    render(<App />);

    // Find and select the tenor ukulele preset from dropdown
    const presetSelect = screen.getByRole('combobox');
    fireEvent.change(presetSelect, { target: { value: 'ukuleleTenor' } });
    
    // Find the template SVG
    const templateSvg = document.querySelector('svg.template-svg');
    expect(templateSvg).toBeInTheDocument();
    
    // Check SVG dimensions
    const width = templateSvg?.getAttribute('width');
    const height = templateSvg?.getAttribute('height');
    const viewBox = templateSvg?.getAttribute('viewBox');
    
    // For tenor ukulele: 17" scale + 2" padding = 19" height, 1.75" neck width + 2" padding = 3.75" width
    expect(width).toBe('3.75in');
    expect(height).toBe('19in');
    expect(viewBox).toBe('0 0 3.75 19');
    
    console.log('Tenor Ukulele SVG Verification:');
    console.log(`- Width: ${width} (expected: 3.75in)`);
    console.log(`- Height: ${height} (expected: 19in)`);
    console.log(`- ViewBox: ${viewBox} (expected: 0 0 3.75 19)`);
    console.log('- SVG units now map 1:1 to physical inches for accurate printing');
  });

  it('should calculate correct first fret distance for tenor ukulele', () => {
    render(<App />);

    // Load tenor ukulele preset
    const presetSelect = screen.getByRole('combobox');
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
    console.log('- This should measure exactly 0.9541" when printed at 100% scale');
    console.log('- Previous scaling issue would have printed ~1.680" (1.76x larger)');
  });

  it('should maintain consistent scaling across different units', () => {
    render(<App />);

    // Load tenor ukulele preset
    const presetSelect = screen.getByRole('combobox');
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
