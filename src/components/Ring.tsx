import React, { useMemo } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { getRingBandGeometry, createProng } from '../utils/geometries';
import { getMetalMaterial } from '../utils/materials';

export const Ring: React.FC = () => {
  const { config } = useConfig();

  const bandGeometry = useMemo(
    () => getRingBandGeometry(config.bandStyle, config.ringSize),
    [config.bandStyle, config.ringSize]
  );

  const prongGeometry = useMemo(() => createProng(), []);

  const material = useMemo(
    () => getMetalMaterial(config.metalType, config.bandColor),
    [config.metalType, config.bandColor]
  );

  // Position prongs around the diamond
  const prongPositions = useMemo(() => {
    const positions = [];
    const radius = 0.35;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        y: 0.8,
      });
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Ring Band */}
      <mesh
        geometry={bandGeometry}
        material={material}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Prongs */}
      {prongPositions.map((pos, index) => (
        <mesh
          key={index}
          geometry={prongGeometry}
          material={material}
          position={[pos.x, pos.y, pos.z]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
};
