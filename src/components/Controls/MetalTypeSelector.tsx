import React from 'react';
import { MetalType } from '../../contexts/ConfigContext';
import { getMetalProperties } from '../../utils/materials';

interface MetalTypeSelectorProps {
  value: MetalType;
  onChange: (type: MetalType) => void;
}

const metalTypes: MetalType[] = ['yellow-gold', 'white-gold', 'rose-gold', 'silver', 'platinum'];

export const MetalTypeSelector: React.FC<MetalTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="metal-type-selector">
      <label>Metal Type</label>
      <div className="metal-grid">
        {metalTypes.map((type) => {
          const props = getMetalProperties(type);
          return (
            <button
              key={type}
              className={`metal-button ${value === type ? 'active' : ''}`}
              onClick={() => onChange(type)}
              title={props.description}
            >
              <span className="metal-label">{props.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
