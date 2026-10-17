import * as THREE from "three";

/** Procedural geometry keeps the scene self-contained: no model or texture requests. */
export function createController() {
  const group = new THREE.Group();
  // Soft-touch plum and tonal inlays pick up the site's ink and muted text colors.
  const shell = new THREE.MeshPhysicalMaterial({ color: "#351431", metalness: 0, roughness: 0.86, clearcoat: 0, specularIntensity: 0.15 });
  const face = new THREE.MeshPhysicalMaterial({ color: "#60485b", metalness: 0, roughness: 0.8, clearcoat: 0, specularIntensity: 0.18 });
  const trim = new THREE.MeshStandardMaterial({ color: "#8e7b8a", metalness: 0.06, roughness: 0.84 });
  const rubber = new THREE.MeshStandardMaterial({ color: "#30232e", metalness: 0, roughness: 0.95 });
  const accent = new THREE.MeshStandardMaterial({ color: "#b8a6b3", metalness: 0, roughness: 0.85 });
  const front = new THREE.Group();
  front.name = "controller-front";
  const shape = new THREE.Shape();
  shape.moveTo(-1.15, 0.62);
  shape.bezierCurveTo(-1.62, 0.6, -1.7, -0.15, -1.85, -0.85);
  shape.bezierCurveTo(-1.96, -1.42, -1.42, -1.54, -1.12, -1.04);
  shape.lineTo(-0.65, -0.45);
  shape.quadraticCurveTo(0, -0.65, 0.65, -0.45);
  shape.lineTo(1.12, -1.04);
  shape.bezierCurveTo(1.42, -1.54, 1.96, -1.42, 1.85, -0.85);
  shape.bezierCurveTo(1.7, -0.15, 1.62, 0.6, 1.15, 0.62);
  shape.quadraticCurveTo(0, 0.78, -1.15, 0.62);
  const body = new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: true, bevelSegments: 8, steps: 1, bevelSize: 0.16, bevelThickness: 0.16, curveSegments: 40 });
  body.translate(0, 0.25, -0.21);
  group.add(new THREE.Mesh(body, shell));
  const faceGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: true, bevelSegments: 5, bevelSize: 0.08, bevelThickness: 0.025, curveSegments: 40 });
  faceGeometry.scale(0.97, 0.97, 1);
  faceGeometry.translate(0, 0.25, 0.39);
  front.add(new THREE.Mesh(faceGeometry, face));

  function disc(x: number, y: number, radius: number, depth: number, z: number, material: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 40), material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    front.add(mesh);
    return mesh;
  }
  for (const x of [-0.57, 0.57]) {
    disc(x, -0.15, 0.26, 0.04, 0.46, trim);
    disc(x, -0.15, 0.22, 0.13, 0.54, rubber);
    disc(x, -0.15, 0.18, 0.035, 0.62, rubber);
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.006, 8, 40), trim);
    groove.position.set(x, -0.15, 0.64);
    front.add(groove);
  }
  // A single bevelled cross avoids hard intersecting blocks at the center.
  const cross = new THREE.Shape();
  const crossPoints = [[-0.07, 0.23], [0.07, 0.23], [0.07, 0.07], [0.23, 0.07], [0.23, -0.07], [0.07, -0.07], [0.07, -0.23], [-0.07, -0.23], [-0.07, -0.07], [-0.23, -0.07], [-0.23, 0.07], [-0.07, 0.07]];
  crossPoints.forEach(([x, y], index) => index === 0 ? cross.moveTo(x, y) : cross.lineTo(x, y));
  cross.closePath();
  const pad = new THREE.Mesh(new THREE.ExtrudeGeometry(cross, { depth: 0.06, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.018, bevelThickness: 0.018 }), rubber);
  pad.position.set(-1.1, 0.43, 0.45);
  front.add(pad);
  for (const [x, y] of [[1.1, 0.65], [1.32, 0.43], [1.1, 0.21], [0.88, 0.43]]) {
    disc(x, y, 0.105, 0.12, 0.43, accent);
  }
  const inlay = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.015, 0.015), trim);
  inlay.position.set(0, 0.65, 0.45);
  front.add(inlay);
  disc(0, 0.12, 0.06, 0.03, 0.46, trim);
  for (const x of [-0.18, 0.18]) {
    const menu = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.07, 4, 12), trim);
    menu.rotation.z = Math.PI / 2;
    menu.position.set(x, 0.4, 0.46);
    front.add(menu);
  }
  // Rotate a shared copy so both outward faces show the same control layout.
  const back = front.clone(true);
  back.name = "controller-back";
  back.rotation.y = Math.PI;
  group.add(front, back);
  // Rear shoulder controls remain visible as the controller turns.
  for (const x of [-1.05, 1.05]) {
    const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.61, 0.16, 0.32), rubber);
    shoulder.position.set(x, 0.89, 0);
    group.add(shoulder);
  }

  // The logo's sweeping three-point crown, including its diamond cutout.
  const crown = new THREE.Shape();
  crown.moveTo(-1.18, 1.12);
  crown.lineTo(-1.58, 2.3);
  crown.lineTo(-0.97, 1.94);
  crown.bezierCurveTo(-1.17, 1.48, -0.38, 1.36, -0.25, 2.08);
  crown.quadraticCurveTo(-0.2, 2.3, -0.4, 2.43);
  crown.quadraticCurveTo(-0.14, 2.62, 0, 3.02);
  crown.quadraticCurveTo(0.14, 2.62, 0.4, 2.43);
  crown.quadraticCurveTo(0.2, 2.3, 0.25, 2.08);
  crown.bezierCurveTo(0.38, 1.36, 1.17, 1.48, 0.97, 1.94);
  crown.lineTo(1.58, 2.3);
  crown.lineTo(1.18, 1.12);
  crown.quadraticCurveTo(0.72, 1.44, 0.32, 0.98);
  crown.lineTo(-0.32, 0.98);
  crown.quadraticCurveTo(-0.72, 1.44, -1.18, 1.12);
  const diamond = new THREE.Path();
  diamond.moveTo(0, 1.88);
  diamond.lineTo(-0.16, 1.58);
  diamond.lineTo(0, 1.3);
  diamond.lineTo(0.16, 1.58);
  diamond.closePath();
  crown.holes.push(diamond);
  const crownGeometry = new THREE.ExtrudeGeometry(crown, { depth: 0.18, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.045, bevelThickness: 0.045, curveSegments: 36 });
  crownGeometry.translate(0, 0, -0.09);
  const crownMesh = new THREE.Mesh(crownGeometry, [face, shell]);
  crownMesh.name = "logo-crown";
  group.add(crownMesh);
  return group;
}
