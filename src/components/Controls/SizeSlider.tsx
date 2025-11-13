import React from 'react';

interface SizeSliderProps {
  value: number;
  onChange: (size: number) => void;
  min?: number;
  max?: number;
}

export const SizeSlider: React.FC<SizeSliderProps> = ({
  value,
  onChange,
  min = 4,
  max = 12,
}) => {
  return (
    <div className="size-slider">
      <label>Ring Size: {value}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider"
      />
      <div className="size-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
