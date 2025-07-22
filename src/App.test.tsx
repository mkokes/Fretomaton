import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Preset Selection', () => {
  it('should maintain selected preset value in dropdown', () => {
    render(<App />);

    // Find the preset dropdown (it's the only combobox on the page)
    const presetSelect = screen.getByRole('combobox');

    // Initially should show "Select a preset..."
    expect(presetSelect).toHaveValue('');

    // Select a preset
    fireEvent.change(presetSelect, { target: { value: 'fenderStandard' } });

    // The dropdown should now show the selected value
    expect(presetSelect).toHaveValue('fenderStandard');
  });

  it('should update form values when preset is selected', () => {
    render(<App />);

    // Find the preset dropdown and scale length input (first spinbutton)
    const presetSelect = screen.getByRole('combobox');
    const inputs = screen.getAllByRole('spinbutton');
    const scaleLengthInput = inputs[0]; // First input is scale length

    // Select a preset
    fireEvent.change(presetSelect, { target: { value: 'fenderStandard' } });

    // The scale length should be updated (Fender Standard is 25.5")
    expect(scaleLengthInput).toHaveValue(25.5);

    // The dropdown should maintain the selected value
    expect(presetSelect).toHaveValue('fenderStandard');
  });

  it('should reset to empty when empty option is selected', () => {
    render(<App />);

    const presetSelect = screen.getByRole('combobox');

    // Select a preset first
    fireEvent.change(presetSelect, { target: { value: 'fenderStandard' } });
    expect(presetSelect).toHaveValue('fenderStandard');

    // Select the empty option
    fireEvent.change(presetSelect, { target: { value: '' } });
    expect(presetSelect).toHaveValue('');
  });
});
