import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = ['#ffffff', '#ffd700', '#ff69b4', '#87ceeb', '#98fb98', '#dda0dd'],
}) => {
  return (
    <div className="color-picker">
      <label>{label}</label>
      <div className="color-input-wrapper">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="color-input"
        />
        <span className="color-hex">{value}</span>
      </div>
      <div className="preset-colors">
        {presetColors.map((color) => (
          <button
            key={color}
            className={`preset-color ${value === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
