import * as THREE from 'three';
import { DiamondShape, BandStyle } from '../contexts/ConfigContext';

// Diamond Geometry Generators - Enhanced with realistic faceting

// Helper function to create faceted surfaces
const createFacetedDiamond = (
  segments: number,
  crownHeight: number,
  pavilionDepth: number,
  girdleRadius: number
): THREE.BufferGeometry => {
  const vertices: number[] = [];
  const indices: number[] = [];

  // Top point (table center)
  vertices.push(0, crownHeight, 0);
  const tableIndex = 0;

  // Table vertices (top flat surface)
  const tableRadius = girdleRadius * 0.5;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(
      Math.cos(angle) * tableRadius,
      crownHeight * 0.9,
      Math.sin(angle) * tableRadius
    );
  }

  // Girdle vertices (widest part)
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(
      Math.cos(angle) * girdleRadius,
      0,
      Math.sin(angle) * girdleRadius
    );
  }

  // Bottom point (culet)
  vertices.push(0, -pavilionDepth, 0);
  const culetIndex = vertices.length / 3 - 1;

  // Create crown facets (top part)
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    // Bezel facets
    indices.push(tableIndex, i + 1, next + 1);
    // Star facets
    indices.push(i + 1, i + segments + 1, next + segments + 1);
    indices.push(i + 1, next + segments + 1, next + 1);
  }

  // Create pavilion facets (bottom part)
  const girdleStart = segments + 1;
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(
      girdleStart + i,
      culetIndex,
      girdleStart + next
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

export const createRoundDiamond = (size: number = 0.5): THREE.BufferGeometry => {
  // Create a realistic round brilliant cut with 57-58 facets
  return createFacetedDiamond(
    24, // segments for smooth round appearance
    size * 0.4, // crown height
    size * 0.8, // pavilion depth (longer for brilliance)
    size // girdle radius
  );
};

export const createPrincessDiamond = (size: number = 0.5): THREE.BufferGeometry => {
  // Create princess cut with X-pattern facets
  const vertices: number[] = [];
  const indices: number[] = [];

  const halfSize = size / 2;
  const crownHeight = size * 0.35;
  const pavilionDepth = size * 0.7;

  // Table corners (top)
  const tableSize = halfSize * 0.6;
  vertices.push(tableSize, crownHeight, tableSize);    // 0
  vertices.push(-tableSize, crownHeight, tableSize);   // 1
  vertices.push(-tableSize, crownHeight, -tableSize);  // 2
  vertices.push(tableSize, crownHeight, -tableSize);   // 3

  // Girdle corners (widest part)
  vertices.push(halfSize, 0, halfSize);    // 4
  vertices.push(-halfSize, 0, halfSize);   // 5
  vertices.push(-halfSize, 0, -halfSize);  // 6
  vertices.push(halfSize, 0, -halfSize);   // 7

  // Mid-girdle points for more facets
  vertices.push(halfSize, 0, 0);     // 8
  vertices.push(0, 0, halfSize);     // 9
  vertices.push(-halfSize, 0, 0);    // 10
  vertices.push(0, 0, -halfSize);    // 11

  // Culet (bottom point)
  vertices.push(0, -pavilionDepth, 0);  // 12

  // Crown facets
  indices.push(0, 1, 9, 0, 9, 4);  // front crown
  indices.push(1, 2, 10, 1, 10, 5); // left crown
  indices.push(2, 3, 11, 2, 11, 6); // back crown
  indices.push(3, 0, 8, 3, 8, 7);   // right crown

  // Table facets
  indices.push(0, 3, 2, 0, 2, 1);

  // Pavilion facets (X-pattern)
  indices.push(4, 9, 12);   // front facets
  indices.push(9, 5, 12);
  indices.push(5, 10, 12);  // left facets
  indices.push(10, 6, 12);
  indices.push(6, 11, 12);  // back facets
  indices.push(11, 7, 12);
  indices.push(7, 8, 12);   // right facets
  indices.push(8, 4, 12);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

export const createEmeraldDiamond = (size: number = 0.5): THREE.BufferGeometry => {
  // Create step-cut emerald with rectangular facets
  const vertices: number[] = [];
  const indices: number[] = [];

  const width = size * 0.7;
  const length = size * 0.9;
  const crownHeight = size * 0.3;
  const pavilionDepth = size * 0.6;

  // Create multiple stepped layers for emerald cut
  const layers = [
    { y: crownHeight, scale: 0.4 },      // table
    { y: crownHeight * 0.6, scale: 0.7 }, // upper crown
    { y: 0, scale: 1.0 },                 // girdle
    { y: -pavilionDepth * 0.4, scale: 0.7 }, // upper pavilion
    { y: -pavilionDepth * 0.8, scale: 0.4 }, // lower pavilion
    { y: -pavilionDepth, scale: 0.1 }     // culet
  ];

  let vertexIndex = 0;
  const layerIndices: number[] = [];

  // Create vertices for each layer
  layers.forEach(layer => {
    const w = width * layer.scale;
    const l = length * layer.scale;

    // Corner vertices
    vertices.push(w, layer.y, l);
    vertices.push(-w, layer.y, l);
    vertices.push(-w, layer.y, -l);
    vertices.push(w, layer.y, -l);

    layerIndices.push(vertexIndex);
    vertexIndex += 4;
  });

  // Connect layers with quads (step-cut pattern)
  for (let i = 0; i < layers.length - 1; i++) {
    const curr = layerIndices[i];
    const next = layerIndices[i + 1];

    for (let j = 0; j < 4; j++) {
      const j_next = (j + 1) % 4;

      // Create quad between layers
      indices.push(
        curr + j, next + j, next + j_next,
        curr + j, next + j_next, curr + j_next
      );
    }

    // Top and bottom faces for each layer
    if (i === 0) {
      // Top face
      indices.push(curr, curr + 1, curr + 2, curr, curr + 2, curr + 3);
    }
    if (i === layers.length - 2) {
      // Bottom face
      indices.push(next, next + 2, next + 1, next, next + 3, next + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

export const createCushionDiamond = (size: number = 0.5): THREE.BufferGeometry => {
  // Create cushion cut with rounded corners and brilliant-style facets
  const vertices: number[] = [];
  const indices: number[] = [];

  const crownHeight = size * 0.35;
  const pavilionDepth = size * 0.7;
  const cornerRadius = size * 0.3;

  // Helper to create rounded square vertices
  const createRoundedSquareLayer = (y: number, scale: number) => {
    const s = size * scale;
    const r = cornerRadius * scale;
    const points: number[][] = [];

    // Create points for rounded square
    const segsPerSide = 3;
    for (let side = 0; side < 4; side++) {
      const angle = (side * Math.PI) / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      for (let i = 0; i < segsPerSide; i++) {
        const t = i / (segsPerSide - 1);
        const cornerAngle = angle + (Math.PI / 2) * t;

        let x, z;
        if (i === 0) {
          // Straight edge
          x = cos * (s - r) - sin * s;
          z = sin * (s - r) + cos * s;
        } else if (i === segsPerSide - 1) {
          // Straight edge
          x = cos * s - sin * (s - r);
          z = sin * s + cos * (s - r);
        } else {
          // Rounded corner
          x = cos * (s - r) + Math.cos(cornerAngle) * r;
          z = sin * (s - r) + Math.sin(cornerAngle) * r;
        }

        points.push([x, y, z]);
      }
    }
    return points;
  };

  // Create top center point
  vertices.push(0, crownHeight, 0);
  const topIndex = 0;

  // Table layer
  const tablePoints = createRoundedSquareLayer(crownHeight * 0.9, 0.5);
  tablePoints.forEach(p => vertices.push(...p));

  // Girdle layer
  const girdlePoints = createRoundedSquareLayer(0, 1.0);
  girdlePoints.forEach(p => vertices.push(...p));

  // Bottom point
  vertices.push(0, -pavilionDepth, 0);
  const bottomIndex = vertices.length / 3 - 1;

  const tableStart = 1;
  const girdleStart = tableStart + tablePoints.length;

  // Crown facets
  for (let i = 0; i < tablePoints.length; i++) {
    const next = (i + 1) % tablePoints.length;
    indices.push(topIndex, tableStart + i, tableStart + next);
    indices.push(
      tableStart + i,
      girdleStart + i,
      girdleStart + next,
      tableStart + i,
      girdleStart + next,
      tableStart + next
    );
  }

  // Pavilion facets
  for (let i = 0; i < girdlePoints.length; i++) {
    const next = (i + 1) % girdlePoints.length;
    indices.push(girdleStart + i, bottomIndex, girdleStart + next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

export const createOvalDiamond = (size: number = 0.5): THREE.BufferGeometry => {
  // Create oval brilliant cut with elongated facets
  const segments = 24;
  const vertices: number[] = [];
  const indices: number[] = [];

  const crownHeight = size * 0.4;
  const pavilionDepth = size * 0.8;
  const radiusX = size * 0.8; // elongated
  const radiusZ = size * 0.6;

  // Top point
  vertices.push(0, crownHeight, 0);
  const topIndex = 0;

  // Table vertices (ellipse)
  const tableRadiusX = radiusX * 0.5;
  const tableRadiusZ = radiusZ * 0.5;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(
      Math.cos(angle) * tableRadiusX,
      crownHeight * 0.9,
      Math.sin(angle) * tableRadiusZ
    );
  }

  // Girdle vertices (ellipse)
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(
      Math.cos(angle) * radiusX,
      0,
      Math.sin(angle) * radiusZ
    );
  }

  // Bottom point (culet)
  vertices.push(0, -pavilionDepth, 0);
  const bottomIndex = vertices.length / 3 - 1;

  const tableStart = 1;
  const girdleStart = tableStart + segments;

  // Crown facets
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    // Bezel facets
    indices.push(topIndex, tableStart + i, tableStart + next);
    // Upper girdle facets
    indices.push(
      tableStart + i,
      girdleStart + i,
      girdleStart + next,
      tableStart + i,
      girdleStart + next,
      tableStart + next
    );
  }

  // Pavilion facets
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(girdleStart + i, bottomIndex, girdleStart + next);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

export const getDiamondGeometry = (shape: DiamondShape, size: number = 0.5): THREE.BufferGeometry => {
  switch (shape) {
    case 'round':
      return createRoundDiamond(size);
    case 'princess':
      return createPrincessDiamond(size);
    case 'emerald':
      return createEmeraldDiamond(size);
    case 'cushion':
      return createCushionDiamond(size);
    case 'oval':
      return createOvalDiamond(size);
    default:
      return createRoundDiamond(size);
  }
};

// Ring Band Geometry Generators
export const createClassicBand = (
  innerRadius: number,
  outerRadius: number,
  _height: number
): THREE.BufferGeometry => {
  return new THREE.TorusGeometry(innerRadius, (outerRadius - innerRadius) / 2, 16, 64);
};

export const createTwistedBand = (
  innerRadius: number,
  outerRadius: number,
  _height: number
): THREE.BufferGeometry => {
  const curve = new THREE.CatmullRomCurve3(
    Array.from({ length: 64 }, (_, i) => {
      const angle = (i / 64) * Math.PI * 2;
      const twist = Math.sin(angle * 4) * 0.05;
      return new THREE.Vector3(
        Math.cos(angle) * innerRadius,
        twist,
        Math.sin(angle) * innerRadius
      );
    }),
    true
  );

  const geometry = new THREE.TubeGeometry(curve, 64, (outerRadius - innerRadius) / 2, 16, true);
  geometry.rotateX(Math.PI / 2);
  return geometry;
};

export const createEngravedBand = (
  innerRadius: number,
  outerRadius: number,
  _height: number
): THREE.BufferGeometry => {
  const geometry = new THREE.TorusGeometry(innerRadius, (outerRadius - innerRadius) / 2, 16, 64);
  const vertices = geometry.attributes.position.array;

  // Add engraving pattern
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    const angle = Math.atan2(z, x);
    const engraving = Math.sin(angle * 20) * 0.02;

    const length = Math.sqrt(x * x + z * z);
    vertices[i] += (x / length) * engraving;
    vertices[i + 2] += (z / length) * engraving;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

export const createChannelBand = (
  innerRadius: number,
  outerRadius: number,
  _height: number
): THREE.BufferGeometry => {
  const geometry = new THREE.TorusGeometry(innerRadius, (outerRadius - innerRadius) / 2, 16, 64);
  const vertices = geometry.attributes.position.array;

  // Create channel effect
  for (let i = 0; i < vertices.length; i += 3) {
    const y = vertices[i + 1];
    if (Math.abs(y) < 0.05) {
      vertices[i + 1] *= 0.8; // Indent the middle
    }
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
};

export const getRingBandGeometry = (
  style: BandStyle,
  ringSize: number
): THREE.BufferGeometry => {
  // Ring size to radius conversion (approximate)
  const innerRadius = 0.8 + (ringSize - 7) * 0.05;
  const outerRadius = innerRadius + 0.3;
  const height = 0.15;

  switch (style) {
    case 'classic':
      return createClassicBand(innerRadius, outerRadius, height);
    case 'twisted':
      return createTwistedBand(innerRadius, outerRadius, height);
    case 'engraved':
      return createEngravedBand(innerRadius, outerRadius, height);
    case 'channel':
      return createChannelBand(innerRadius, outerRadius, height);
    default:
      return createClassicBand(innerRadius, outerRadius, height);
  }
};

// Prong geometry for holding the diamond
export const createProng = (): THREE.BufferGeometry => {
  return new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
};
