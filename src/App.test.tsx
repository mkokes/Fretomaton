import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Preset Selection', () => {
  it('should maintain selected preset value in dropdown', () => {
    render(<App />);

    // Find the preset dropdown (it's the only combobox on the page)
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset

    // Initially should show "fenderStandard" since that matches the default values
    expect(presetSelect).toHaveValue('fenderStandard');

    // Select a different preset
    fireEvent.change(presetSelect, { target: { value: 'gibsonStandard' } });

    // The dropdown should now show the newly selected value
    expect(presetSelect).toHaveValue('gibsonStandard');
  });

  it('should update form values when preset is selected', () => {
    render(<App />);

    // Find the preset dropdown and scale length input (first spinbutton)
    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset
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

    const comboboxes = screen.getAllByRole('combobox');
    const presetSelect = comboboxes[0]; // First combobox is the instrument preset

    // Initially should have fenderStandard selected
    expect(presetSelect).toHaveValue('fenderStandard');

    // Select the empty option
    fireEvent.change(presetSelect, { target: { value: '' } });
    expect(presetSelect).toHaveValue('');
  });
});
