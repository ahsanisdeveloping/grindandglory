import { BufferGeometry, Float32BufferAttribute, Shape, Path, ExtrudeGeometry, CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import { mascotConfig } from "./mascot-config";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const body = mascotConfig.body;
const signedPower = (value, power) => Math.sign(value) * Math.pow(Math.abs(value), power);

function tessellateExtrusion(extrusion) {
  const source = extrusion.attributes.position;
  const vertices = [];
  const split = (a, b, c, depth = 0) => {
    const ab = a.distanceToSquared(b), bc = b.distanceToSquared(c), ca = c.distanceToSquared(a);
    if (Math.max(ab,bc,ca) < 0.018 || depth > 12) { vertices.push(...a.toArray(), ...b.toArray(), ...c.toArray()); return; }
    if (ab >= bc && ab >= ca) { const m = a.clone().add(b).multiplyScalar(0.5); split(a,m,c,depth+1); split(m,b,c,depth+1); }
    else if (bc >= ca) { const m = b.clone().add(c).multiplyScalar(0.5); split(a,b,m,depth+1); split(a,m,c,depth+1); }
    else { const m = c.clone().add(a).multiplyScalar(0.5); split(a,b,m,depth+1); split(m,b,c,depth+1); }
  };
  for (let i = 0; i < source.count; i += 3) split(new Vector3().fromBufferAttribute(source,i), new Vector3().fromBufferAttribute(source,i+1), new Vector3().fromBufferAttribute(source,i+2));
  const curved = new BufferGeometry();
  curved.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  extrusion.dispose();
  const geometry = mergeVertices(curved, 0.0001);
  curved.dispose();
  return geometry;
}

// Analytic front surface shared by the body and its fitted face inlay.
export function faceDepth(x, y) {
  const vertical = Math.min(0.999, Math.abs((y - body.center) / body.height));
  const ring = Math.pow(1 - Math.pow(vertical, 2 / body.verticalPower), body.verticalPower / 2);
  const horizontal = Math.min(0.999, Math.abs(x / (body.width * ring)));
  return body.depth * ring * Math.pow(1 - Math.pow(horizontal, 2 / body.horizontalPower), body.horizontalPower / 2);
}

export function createBodyGeometry() {
  const segments = 96;
  const rings = 64;
  const positions = [];
  const indices = [];
  for (let j = 0; j <= rings; j++) {
    const latitude = -Math.PI / 2 + Math.PI * j / rings;
    const radius = Math.pow(Math.cos(latitude), body.verticalPower);
    for (let i = 0; i <= segments; i++) {
      const longitude = i / segments * Math.PI * 2;
      const x = body.width * radius * signedPower(Math.sin(longitude), body.horizontalPower);
      const topDip = 0.12 * Math.exp(-Math.pow(x / 0.55, 2)) * Math.pow(Math.max(0, Math.sin(latitude)), 4);
      positions.push(
        x,
        body.center + body.height * signedPower(Math.sin(latitude), body.verticalPower) - topDip,
        body.depth * radius * signedPower(Math.cos(longitude), body.horizontalPower),
      );
      if (j < rings && i < segments) {
        const a = j * (segments + 1) + i;
        const b = a + segments + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  // Average the longitude seam normals for uninterrupted ceramic highlights.
  const normals = geometry.attributes.normal;
  for (let j = 0; j <= rings; j++) {
    const a = j * (segments + 1), b = a + segments;
    const nx = normals.getX(a) + normals.getX(b), ny = normals.getY(a) + normals.getY(b), nz = normals.getZ(a) + normals.getZ(b);
    const length = Math.hypot(nx, ny, nz) || 1;
    normals.setXYZ(a, nx / length, ny / length, nz / length);
    normals.setXYZ(b, nx / length, ny / length, nz / length);
  }
  return geometry;
}

export function createMaskGeometry() {
  const shape = new Shape();
  shape.moveTo(-1.62, 0.79);
  shape.bezierCurveTo(-1.79, 0.95, -1.62, 1.77, -1.28, 1.91);
  shape.bezierCurveTo(-0.88, 2.12, -0.55, 1.62, 0, 1.62);
  shape.bezierCurveTo(0.55, 1.62, 0.88, 2.12, 1.28, 1.91);
  shape.bezierCurveTo(1.62, 1.77, 1.79, 0.95, 1.62, 0.79);
  shape.bezierCurveTo(1.37, 0.48, 0.83, 0.96, 0, 0.96);
  shape.bezierCurveTo(-0.83, 0.96, -1.37, 0.48, -1.62, 0.79);
  const extrusion = new ExtrudeGeometry(shape, { depth: 0.065, steps: 1, bevelEnabled: true, bevelSize: 0.048, bevelThickness: 0.04, bevelSegments: 5, curveSegments: 40 });
  // Tessellate the broad faces before bending; large flat triangles otherwise
  // cut through the curved head and create visible diagonal shading artifacts.
  const geometry = tessellateExtrusion(extrusion);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    position.setZ(i, position.getZ(i) + faceDepth(position.getX(i), position.getY(i)) + 0.015);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function createCrownGeometry() {
  // Traced from app/assets/iconlogopurple.png in its original pixel coordinates.
  // The scooped shoulders and spear-shaped center are the brand crown, not a stock crown.
  const shape = new Shape();
  shape.moveTo(128, 247);
  shape.lineTo(82, 104);
  shape.lineTo(154, 145);
  shape.bezierCurveTo(128, 193, 198, 221, 232, 173);
  shape.bezierCurveTo(250, 146, 249, 109, 223, 89);
  shape.bezierCurveTo(249, 70, 261, 43, 272, 18);
  shape.bezierCurveTo(283, 43, 295, 70, 321, 89);
  shape.bezierCurveTo(295, 109, 294, 146, 312, 173);
  shape.bezierCurveTo(346, 221, 416, 193, 390, 145);
  shape.lineTo(462, 104);
  shape.lineTo(416, 247);
  shape.bezierCurveTo(381, 221, 340, 220, 312, 268);
  shape.lineTo(232, 268);
  shape.bezierCurveTo(204, 220, 163, 221, 128, 247);
  const diamond = new Path();
  diamond.moveTo(272, 165); diamond.lineTo(250, 201); diamond.lineTo(272, 236); diamond.lineTo(294, 201); diamond.closePath();
  shape.holes.push(diamond);
  const extrusion = new ExtrudeGeometry(shape, { depth: 28, bevelEnabled: true, bevelSize: 5.5, bevelThickness: 5.5, bevelSegments: 6, curveSegments: 48 });
  extrusion.translate(-272, -268, -14);
  extrusion.scale(0.0079, -0.0075, -0.0075);
  const geometry = tessellateExtrusion(extrusion);
  // Analytic normals keep the broad glossy face smooth after bending.
  const position = geometry.attributes.position;
  geometry.computeVertexNormals();
  const originalNormals = geometry.attributes.normal.array.slice();
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i);
    position.setZ(i, position.getZ(i) + 0.35 * (1 - Math.pow(x / 1.65, 2)) + 0.1 * Math.sin(y * 1.5));
  }
  geometry.computeVertexNormals();
  const normals = geometry.attributes.normal;
  for (let i = 0; i < position.count; i++) {
    const nz = originalNormals[i*3+2];
    if (Math.abs(nz) < 0.99) continue;
    const dx = -0.7 * position.getX(i) / (1.65*1.65), dy = 0.15 * Math.cos(position.getY(i) * 1.5);
    const length = Math.hypot(dx,dy,1), sign = Math.sign(nz);
    normals.setXYZ(i,-dx/length*sign,-dy/length*sign,sign/length);
  }
  return geometry;
}

export function createDpadGeometry() {
  const shape = new Shape();
  const s = 0.058, e = 0.19;
  [[-s,e],[s,e],[s,s],[e,s],[e,-s],[s,-s],[s,-e],[-s,-e],[-s,-s],[-e,-s],[-e,s],[-s,s]].forEach(([x,y],i) => i ? shape.lineTo(x,y) : shape.moveTo(x,y));
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth: 0.05, bevelSize: 0.018, bevelThickness: 0.018, bevelEnabled: true, bevelSegments: 4 });
}

export function createSmileGeometry() {
  const points = [];
  for (let i = 0; i <= 24; i++) {
    const angle = Math.PI + i / 24 * Math.PI;
    const x = Math.cos(angle) * 0.225;
    const y = 0.8 + Math.sin(angle) * 0.12;
    points.push(new Vector3(x, y, faceDepth(x, y) + 0.026));
  }
  return new TubeGeometry(new CatmullRomCurve3(points), 32, 0.035, 10, false);
}
