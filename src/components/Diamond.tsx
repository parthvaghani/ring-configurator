import React, { useMemo, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useConfig } from '../contexts/ConfigContext';
import { getDiamondGeometry } from '../utils/geometries';
import { getDiamondMaterial } from '../utils/materials';
import * as THREE from 'three';

// Component for loading GLTF model (round shape only)
const DiamondModel: React.FC<{ color: string }> = ({ color }) => {
  let gltf;

  try {
    gltf = useGLTF('/models/diamonds/diamond.gltf');
  } catch (error) {
    console.error('Failed to load diamond model:', error);
    return <ProceduralDiamond />;
  }

  const material = useMemo(
    () => getDiamondMaterial(color),
    [color]
  );

  // Clone the scene and apply custom material
  const scene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;

    const clonedScene = gltf.scene.clone();

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material;
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });

    return clonedScene;
  }, [gltf?.scene, material]);

  if (!scene) return <ProceduralDiamond />;

  return (
    <primitive
      object={scene}
      position={[0, 1.2, 0]}
      scale={0.5}
    />
  );
};

// Fallback component using procedural geometry
const ProceduralDiamond: React.FC = () => {
  const { config } = useConfig();

  const geometry = useMemo(
    () => getDiamondGeometry(config.diamondShape, 0.5),
    [config.diamondShape]
  );

  const material = useMemo(
    () => getDiamondMaterial(config.diamondColor),
    [config.diamondColor]
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, 1.2, 0]}
      castShadow
      receiveShadow
    />
  );
};

export const Diamond: React.FC = () => {
  const { config } = useConfig();

  // Use GLB model for round shape, procedural for others
  if (config.diamondShape === 'round') {
    return (
      <Suspense fallback={<ProceduralDiamond />}>
        <DiamondModel color={config.diamondColor} />
      </Suspense>
    );
  }

  // Use procedural geometry for other shapes
  return <ProceduralDiamond />;
};
