import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FretTemplateCalculator from '../App';

describe('Unit Conversion Display Bug Fix', () => {
  it('should show correct unit labels in table headers', () => {
    render(<FretTemplateCalculator />);

    // Initially should show inches
    expect(screen.getByText('Distance from Nut (inches)')).toBeInTheDocument();
    expect(screen.getByText('String Spacing (inches)')).toBeInTheDocument();

    // Switch to millimeters
    const mmRadio = screen.getByLabelText('Millimeters');
    fireEvent.click(mmRadio);

    // Should now show mm
    expect(screen.getByText('Distance from Nut (mm)')).toBeInTheDocument();
    expect(screen.getByText('String Spacing (mm)')).toBeInTheDocument();
  });

  it('should convert input values correctly when switching units', () => {
    render(<FretTemplateCalculator />);

    // Initially in inches - check that scale length shows as inches
    const scaleInput = screen.getByDisplayValue('25.5');
    expect(scaleInput).toBeInTheDocument();

    // Switch to millimeters
    const mmRadio = screen.getByLabelText('Millimeters');
    fireEvent.click(mmRadio);

    // The scale length should now be converted to mm (25.5 * 25.4 = 647.7)
    // Let's check for the actual converted value
    const inputs = screen.getAllByRole('spinbutton');
    const convertedScaleInput = inputs[0] as HTMLInputElement; // First input is scale length
    expect(parseFloat(convertedScaleInput.value)).toBeCloseTo(647.7, 1);
  });

  it('should not double-convert display values', () => {
    render(<FretTemplateCalculator />);

    // Switch to millimeters
    const mmRadio = screen.getByLabelText('Millimeters');
    fireEvent.click(mmRadio);

    // Check that values in the table are reasonable for mm (not double-converted)
    // The nut string width should be around 34.93mm (1.375" * 25.4)
    // NOT around 887mm which would be double-converted
    const nutRow = screen.getByText('0 (Nut)').closest('tr');
    expect(nutRow).toBeInTheDocument();

    // Look for a value that's in the reasonable mm range (30-40mm) not the double-converted range (800-900mm)
    const nutWidthCell = nutRow?.children[2]; // String spacing column
    const nutWidthText = nutWidthCell?.textContent || '';
    const nutWidthValue = parseFloat(nutWidthText);

    // Should be around 34.93mm, definitely not around 887mm
    expect(nutWidthValue).toBeGreaterThan(30);
    expect(nutWidthValue).toBeLessThan(40);
    expect(nutWidthValue).not.toBeGreaterThan(100); // Ensure it's not double-converted
  });

  it('should maintain consistent SVG scaling across unit systems', () => {
    render(<FretTemplateCalculator />);

    // Find the template SVG by class
    const templateSvg = document.querySelector('svg.template-svg');
    expect(templateSvg).toBeInTheDocument();

    // Initially in inches (25.5" scale length)
    // SVG viewBox should now use real dimensions: ~25.5 + 2 = 27.5 height
    const initialViewBox = templateSvg?.getAttribute('viewBox');
    const initialHeight = initialViewBox?.split(' ')[3];
    const initialHeightNum = parseFloat(initialHeight || '0');

    // Should be around 27.5 for 25.5" scale length with 2" padding
    expect(initialHeightNum).toBeGreaterThan(25);
    expect(initialHeightNum).toBeLessThan(30);

    // Switch to millimeters
    const mmRadio = screen.getByLabelText('Millimeters');
    fireEvent.click(mmRadio);

    // SVG viewBox should still be based on inches (converted from mm)
    // 647mm / 25.4 = ~25.5", so viewBox height should still be ~27.5 (25.5 + 2" padding)
    const mmViewBox = templateSvg?.getAttribute('viewBox');
    const mmHeight = mmViewBox?.split(' ')[3];
    const mmHeightNum = parseFloat(mmHeight || '0');

    // Should still be around 27.5, NOT around 650+ (raw mm values)
    expect(mmHeightNum).toBeGreaterThan(25);
    expect(mmHeightNum).toBeLessThan(30);
    expect(mmHeightNum).not.toBeGreaterThan(100); // Ensure it's not using raw mm values

    // The heights should be very close (within 1% due to rounding)
    const heightDifference = Math.abs(initialHeightNum - mmHeightNum);
    const percentDifference = (heightDifference / initialHeightNum) * 100;
    expect(percentDifference).toBeLessThan(1);
  });
});
