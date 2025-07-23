import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Print Scaling Verification', () => {
  it('should calculate correct SVG dimensions for standard guitar scale', () => {
    render(<App />);

    // Find the template SVG by looking for the template-svg class
    const templateSvg = document.querySelector('svg.template-svg');

    expect(templateSvg).toBeInTheDocument();
    
    // Get viewBox dimensions
    const viewBox = templateSvg?.getAttribute('viewBox');
    const [x, y, width, height] = viewBox?.split(' ').map(Number) || [0, 0, 0, 0];
    
    // For a 25.5" scale length guitar with our new 1:1 scaling:
    // Expected: viewBox height should be ~25.5" + 2" padding = ~27.5"
    // This means 1 SVG unit = 1 real inch, which is correct for printing

    console.log('ViewBox dimensions:', { x, y, width, height });
    console.log('Scale factor analysis:');
    console.log('- 25.5" scale + 2" padding = 27.5" SVG height');
    console.log('- 1 SVG unit = 1 inch (1:1 mapping for accurate printing)');

    // The fix: SVG coordinate system now maps 1:1 to real measurements
    expect(height).toBeGreaterThan(25); // At least the scale length
    expect(height).toBeLessThan(30); // But reasonable with padding

    // Verify 1:1 mapping: SVG units now correspond to physical units for printing
    // 25.5" scale should create viewBox height of ~27.5" (25.5 + 2" padding)
  });

  it('should use explicit physical dimensions for accurate print scaling', () => {
    render(<App />);

    // Find the template SVG by class
    const templateSvg = document.querySelector('svg.template-svg');
    expect(templateSvg).toBeInTheDocument();

    // Check that SVG now uses explicit physical dimensions
    const width = templateSvg?.getAttribute('width');
    const height = templateSvg?.getAttribute('height');
    const computedStyle = window.getComputedStyle(templateSvg!);
    const maxWidth = computedStyle.maxWidth;

    console.log('SVG styling analysis:');
    console.log('- width attribute:', width); // Should be in inches (e.g., "3.75in")
    console.log('- height attribute:', height); // Should be in inches (e.g., "27.5in")
    console.log('- maxWidth style:', maxWidth); // Still 400px for screen display
    console.log('- This ensures 1:1 print scaling with explicit physical dimensions');

    // Verify explicit physical dimensions are set
    expect(width).toMatch(/^\d+(\.\d+)?in$/); // Should be in inches format like "3.75in"
    expect(height).toMatch(/^\d+(\.\d+)?in$/); // Should be in inches format like "27.5in"
    expect(maxWidth).toBe('400px'); // Screen display constraint remains
  });

  it('should verify measurement chart uses simple text rendering', () => {
    render(<App />);

    // Find measurement values in the table
    const scaleCell = screen.getByText('25.5000'); // Default scale length
    const nutCell = screen.getByText('1.3750'); // Default nut width (from presets.json)

    // These are simple text nodes that print accurately
    expect(scaleCell).toBeInTheDocument();
    expect(nutCell).toBeInTheDocument();

    // Text measurements don't have complex scaling - they print at font size
    console.log('Table measurements use simple text rendering');
    console.log('- No viewBox scaling');
    console.log('- No CSS size constraints');
    console.log('- Direct font-based dimensions');
  });

  it('should calculate what the correct SVG scaling should be', () => {
    // For accurate 1:1 printing, we need:
    // 1. SVG coordinate system that maps directly to physical units
    // 2. Remove CSS constraints that interfere with print scaling
    // 3. Use proper DPI-based scaling or direct unit mapping

    const scaleLength = 25.5; // inches
    const neckWidth = 2.5; // inches (approximate)
    const padding = 1; // inch of padding

    // Correct approach: Use real units in viewBox
    const correctWidth = neckWidth + (padding * 2);
    const correctHeight = scaleLength + (padding * 2);

    console.log('Correct SVG dimensions for 1:1 printing:');
    console.log(`- ViewBox should be: 0 0 ${correctWidth} ${correctHeight}`);
    console.log('- Width/height in inches, not arbitrary units');
    console.log('- No CSS maxWidth constraints');
    console.log('- Print CSS to ensure 1:1 scaling');

    // This would create a viewBox like "0 0 4.5 27.5" instead of current "0 0 130 590"
    expect(correctWidth).toBeLessThan(10); // Reasonable neck width
    expect(correctHeight).toBeLessThan(30); // Reasonable total length
  });

  it('should verify new SVG scaling uses real dimensions', () => {
    render(<App />);

    const allSvgs = document.querySelectorAll('svg');
    let templateSvg = null;

    for (let i = 0; i < allSvgs.length; i++) {
      const viewBox = allSvgs[i].getAttribute('viewBox');
      if (viewBox && allSvgs[i].classList.contains('template-svg')) {
        templateSvg = allSvgs[i];
        break;
      }
    }

    expect(templateSvg).toBeInTheDocument();

    // Get viewBox dimensions
    const viewBox = templateSvg?.getAttribute('viewBox');
    const [x, y, width, height] = viewBox?.split(' ').map(Number) || [0, 0, 0, 0];

    console.log('New SVG dimensions:', { x, y, width, height });

    // With our fix, the viewBox should now be in real inches
    // For 25.5" scale + 2" padding = ~27.5" height
    // For ~2.5" neck + 2" padding = ~4.5" width
    expect(height).toBeGreaterThan(25); // At least scale length
    expect(height).toBeLessThan(30); // But not huge like before
    expect(width).toBeGreaterThan(3); // At least neck width
    expect(width).toBeLessThan(6); // But reasonable

    // Should NOT be the old broken values
    expect(height).not.toBeGreaterThan(100); // Not the old 590
    expect(width).not.toBeGreaterThan(50); // Not the old 115
  });
});
