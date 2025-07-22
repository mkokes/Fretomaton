import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('SVG Template Layout', () => {
  it('should display NUT label in the SVG', () => {
    render(<App />);
    
    // Look for the NUT text in the SVG
    const nutLabel = screen.getByText('NUT');
    expect(nutLabel).toBeInTheDocument();
  });

  it('should display BRIDGE label in the SVG', () => {
    render(<App />);
    
    // Look for the BRIDGE text in the SVG
    const bridgeLabel = screen.getByText('BRIDGE');
    expect(bridgeLabel).toBeInTheDocument();
  });

  it('should have proper SVG structure with viewBox', () => {
    render(<App />);
    
    // Find the SVG element
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('viewBox');
    
    // Check that viewBox includes space for labels (should be larger than just the fretboard)
    const viewBox = svgElement?.getAttribute('viewBox');
    expect(viewBox).toMatch(/0 0 \d+\.?\d* \d+\.?\d*/); // Should match "0 0 width height" pattern
  });
});
