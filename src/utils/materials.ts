import * as THREE from 'three';
import { MetalType } from '../contexts/ConfigContext';

export const getMetalMaterial = (metalType: MetalType, customColor?: string) => {
  const baseColors: Record<MetalType, string> = {
    'yellow-gold': '#FFD700',
    'white-gold': '#E5E4E2',
    'rose-gold': '#B76E79',
    'silver': '#C0C0C0',
    'platinum': '#E5E4E2',
  };

  const color = customColor || baseColors[metalType];

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
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

export const getMetalProperties = (metalType: MetalType) => {
  const properties: Record<MetalType, { name: string; description: string }> = {
    'yellow-gold': { name: 'Yellow Gold', description: 'Classic warm golden color' },
    'white-gold': { name: 'White Gold', description: 'Modern silver-white appearance' },
    'rose-gold': { name: 'Rose Gold', description: 'Romantic pinkish hue' },
    'silver': { name: 'Silver', description: 'Bright silvery finish' },
    'platinum': { name: 'Platinum', description: 'Premium naturally white metal' },
  };
  return properties[metalType];
};
