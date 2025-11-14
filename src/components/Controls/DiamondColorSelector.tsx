import React from 'react';

interface DiamondColor {
  name: string;
  value: string;
  description: string;
}

const diamondColors: DiamondColor[] = [
  { name: 'Ruby', value: '#f70db1', description: 'Deep pink gemstone' },
  { name: 'Faint', value: '#CFECEC', description: 'Light blue tint' },
  { name: 'Fancy', value: '#a9cbe2', description: 'Sky blue shade' },
  { name: 'Aqua', value: '#62cffe', description: 'Bright aqua blue' },
  { name: 'Swiss', value: '#76dce4', description: 'Swiss blue topaz' },
  { name: 'Yellow', value: '#efe75b', description: 'Canary yellow' },
  { name: 'Orange', value: '#eb8e17', description: 'Vibrant orange' },
  { name: 'Green', value: '#17ebb5', description: 'Mint green' },
  { name: 'Emerald', value: '#5eca00', description: 'Rich emerald' },
  { name: 'Rose', value: '#fa37d7', description: 'Rose pink' },
  { name: 'Violet', value: '#c200f2', description: 'Deep violet' },
  { name: 'Clear', value: '#ffffff', description: 'Classic clear diamond' },
];

interface DiamondColorSelectorProps {
  value: string;
  onChange: (color: string) => void;
}

export const DiamondColorSelector: React.FC<DiamondColorSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="diamond-color-selector">
      <label>Diamond Color</label>
      <div className="diamond-colors-grid">
        {diamondColors.map((color) => (
          <button
            key={color.name}
            className={`diamond-color-option ${value === color.value ? 'active' : ''}`}
            onClick={() => onChange(color.value)}
            title={color.description}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: color.value }}
            />
            <span className="color-name">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
