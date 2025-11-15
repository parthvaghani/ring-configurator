import * as THREE from 'three';
import { MetalType } from '../contexts/ConfigContext';

export const getMetalMaterial = (metalType: MetalType) => {

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(getMetalColor(metalType)),
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.5,
  });
};

export const getDiamondMaterial = (color: string) => {
  // Enhanced diamond material with realistic optical properties
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.0,
    roughness: 0.0, // Perfectly smooth for maximum sparkle
    transmission: 0.98, // High transmission for light passing through
    thickness: 1.0, // Thicker for better refraction
    envMapIntensity: 3.0, // Higher environment reflection
    clearcoat: 1.0, // Perfect clearcoat for glossy surface
    clearcoatRoughness: 0.0, // Mirror-like clearcoat
    ior: 2.417, // Diamond's index of refraction (exact value)
    reflectivity: 1.0, // Maximum reflectivity
    sheen: 0.5, // Add sheen for extra sparkle
    sheenRoughness: 0.1,
    sheenColor: new THREE.Color('#ffffff'),
    specularIntensity: 1.0, // Maximum specular highlights
    specularColor: new THREE.Color('#ffffff'),
    attenuationColor: new THREE.Color(color).multiplyScalar(0.3), // Subtle color tint inside
    attenuationDistance: 0.5,
    side: THREE.DoubleSide, // Render both sides for proper refraction
  });
};

// Metal base colors used in the 3D scene
export const getMetalColor = (metalType: MetalType): string => {
  const colors: Record<MetalType, string> = {
    'yellow-gold': '#f6c25b',
    'white-gold': '#f5f5f5',
    'rose-gold': '#f4a8a2',
    'silver': '#e0e0e0',
    'platinum': '#f1f1f1',
  };
  return colors[metalType];
};

export const getMetalProperties = (metalType: MetalType) => {
  const properties: Record<MetalType, { name: string; description: string; color: string }> = {
    'yellow-gold': { name: 'Yellow Gold', description: 'Classic warm golden color', color: '#f6c25b' },
    'white-gold': { name: 'White Gold', description: 'Modern silver-white appearance', color: '#f5f5f5' },
    'rose-gold': { name: 'Rose Gold', description: 'Romantic pinkish hue', color: '#f4a8a2' },
    'silver': { name: 'Silver', description: 'Bright silvery finish', color: '#e0e0e0' },
    'platinum': { name: 'Platinum', description: 'Premium naturally white metal', color: '#f1f1f1' },
  };
  return properties[metalType];
};
