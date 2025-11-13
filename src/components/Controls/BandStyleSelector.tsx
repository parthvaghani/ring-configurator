import React from 'react';
import { BandStyle } from '../../contexts/ConfigContext';

interface BandStyleSelectorProps {
  value: BandStyle;
  onChange: (style: BandStyle) => void;
}

const bandStyles: { value: BandStyle; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Simple smooth band' },
  { value: 'twisted', label: 'Twisted', description: 'Elegant twisted design' },
  { value: 'engraved', label: 'Engraved', description: 'Detailed engraving pattern' },
  { value: 'channel', label: 'Channel', description: 'Modern channel setting' },
];

export const BandStyleSelector: React.FC<BandStyleSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="band-style-selector">
      <label>Band Style</label>
      <div className="style-grid">
        {bandStyles.map((style) => (
          <button
            key={style.value}
            className={`style-button ${value === style.value ? 'active' : ''}`}
            onClick={() => onChange(style.value)}
            title={style.description}
          >
            <span className="style-label">{style.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
