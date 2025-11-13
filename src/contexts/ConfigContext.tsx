import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DiamondShape = 'round' | 'princess' | 'emerald' | 'cushion' | 'oval';
export type MetalType = 'yellow-gold' | 'white-gold' | 'rose-gold' | 'silver' | 'platinum';
export type BandStyle = 'classic' | 'twisted' | 'engraved' | 'channel';

export interface RingConfig {
  diamondColor: string;
  diamondShape: DiamondShape;
  bandColor: string;
  metalType: MetalType;
  bandStyle: BandStyle;
  ringSize: number;
}

interface ConfigContextType {
  config: RingConfig;
  updateConfig: (updates: Partial<RingConfig>) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<RingConfig>({
    diamondColor: '#ffffff',
    diamondShape: 'round',
    bandColor: '#ffd700',
    metalType: 'yellow-gold',
    bandStyle: 'classic',
    ringSize: 7,
  });

  const updateConfig = (updates: Partial<RingConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
