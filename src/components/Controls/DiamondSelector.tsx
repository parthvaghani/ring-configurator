import React from 'react';
import { DiamondShape } from '../../contexts/ConfigContext';

interface DiamondSelectorProps {
  value: DiamondShape;
  onChange: (shape: DiamondShape) => void;
}

const diamondShapes: { value: DiamondShape; label: string; description: string }[] = [
  { value: 'round', label: 'Round', description: 'Classic brilliant cut' },
  { value: 'princess', label: 'Princess', description: 'Square with sharp corners' },
  { value: 'emerald', label: 'Emerald', description: 'Rectangular step cut' },
  { value: 'cushion', label: 'Cushion', description: 'Square with rounded corners' },
  { value: 'oval', label: 'Oval', description: 'Elongated brilliant cut' },
];

export const DiamondSelector: React.FC<DiamondSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="diamond-selector">
      <label>Diamond Shape</label>
      <div className="shape-grid">
        {diamondShapes.map((shape) => (
          <button
            key={shape.value}
            className={`shape-button ${value === shape.value ? 'active' : ''}`}
            onClick={() => onChange(shape.value)}
            title={shape.description}
          >
            <span className="shape-label">{shape.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
