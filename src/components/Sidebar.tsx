import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { getMetalColor } from '../utils/materials';
import { ColorPicker } from './Controls/ColorPicker';
import { DiamondSelector } from './Controls/DiamondSelector';
import { DiamondColorSelector } from './Controls/DiamondColorSelector';
import { BandStyleSelector } from './Controls/BandStyleSelector';
import { MetalTypeSelector } from './Controls/MetalTypeSelector';
import { SizeSlider } from './Controls/SizeSlider';

export const Sidebar: React.FC = () => {
  const { config, updateConfig } = useConfig();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Ring Configurator</h1>
        <p>Customize your perfect ring in 3D</p>
      </div>

      <div className="sidebar-content">
        {/* Diamond Section */}
        <section className="config-section">
          <h2>Diamond</h2>
          <DiamondSelector
            value={config.diamondShape}
            onChange={(shape) => updateConfig({ diamondShape: shape })}
          />
          <DiamondColorSelector
            value={config.diamondColor}
            onChange={(color) => updateConfig({ diamondColor: color })}
          />
        </section>

        {/* Band Section */}
        <section className="config-section">
          <h2>Band</h2>
          <MetalTypeSelector
            value={config.metalType}
            onChange={(type) => {
              const color = getMetalColor(type);
              updateConfig({ metalType: type, bandColor: color });
            }}
          />
          <BandStyleSelector
            value={config.bandStyle}
            onChange={(style) => updateConfig({ bandStyle: style })}
          />
          <ColorPicker
            label="Band Color"
            value={config.bandColor}
            onChange={(color) => updateConfig({ bandColor: color })}
            presetColors={['#ffd700', '#e5e4e2', '#b76e79', '#c0c0c0', '#d4af37', '#8b7355']}
          />
        </section>

        {/* Size Section */}
        <section className="config-section">
          <h2>Size</h2>
          <SizeSlider
            value={config.ringSize}
            onChange={(size) => updateConfig({ ringSize: size })}
          />
        </section>
      </div>

      <div className="sidebar-footer">
        <button className="export-button">Export Configuration</button>
      </div>
    </div>
  );
};
