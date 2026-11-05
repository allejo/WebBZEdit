import { BufferGeometry, Float32BufferAttribute } from 'three';

import { deg2rad } from '../../Utilities/math';
import { Vector2F, Vector3F } from '../../Utilities/types';

// Material group indices; order matches BZFlag's ConeObstacle::MaterialCount
export const CONE_EDGE = 0;
export const CONE_BOTTOM = 1;
export const CONE_START = 2;
export const CONE_END = 3;

const MIN_SIZE = 1.0e-6;

/**
 * Built around the origin with `rotation` = 0; the caller applies position and
 * rotation on the <mesh>. Returns null wherever BZFlag would refuse the cone.
 *
 * @see ConeObstacle::makeMesh() (bzflag/src/obstacle/ConeObstacle.cxx)
 */
export function buildConeGeometry(
  size: Vector3F,
  sweepAngle: number,
  divisions: number,
  texsize: Vector2F,
  flatshading: boolean,
): BufferGeometry | null {
  const [sx, sy, sz] = size.map(Math.abs);

  if (
    sx < MIN_SIZE ||
    sy < MIN_SIZE ||
    sz < MIN_SIZE ||
    Math.abs(texsize[0]) < MIN_SIZE ||
    Math.abs(texsize[1]) < MIN_SIZE
  ) {
    return null;
  }

  // Negative texsize = "world units per texture repeat" instead of an
  // absolute repeat count
  let [tx, ty] = texsize;
  if (tx < 0) {
    // Ramanujan's ellipse circumference, floored so the seam lines up
    const circ =
      Math.PI * (3 * (sx + sy) - Math.sqrt((sx + 3 * sy) * (sy + 3 * sx)));
    tx = -Math.floor(circ / tx);
  }
  if (ty < 0) {
    ty = -(sz / ty);
  }

  // Normalize the sweep to [0, a] starting at r (rotation applied by the mesh)
  let a = deg2rad(Math.min(360, Math.max(-360, sweepAngle)));
  let r = 0;
  if (a < 0) {
    r = a;
    a = -a;
  }

  if (divisions <= Math.floor((a + MIN_SIZE) / Math.PI)) {
    return null;
  }

  const isCircle =
    Math.abs(Math.PI - ((a + Math.PI) % (Math.PI * 2))) < MIN_SIZE;
  const astep = a / divisions;

  // Ring point i in BZW space (z-up) and its texcoord. The texcoord is a
  // top-down planar projection of the ring onto [0, tx] x [0, ty].
  const ringV = (i: number): Vector3F => {
    const ang = r + astep * i;
    return [Math.cos(ang) * sx, Math.sin(ang) * sy, 0];
  };
  const ringT = (i: number): Vector2F => {
    const ang = r + astep * i;
    return [tx * (0.5 + 0.5 * Math.cos(ang)), ty * (0.5 + 0.5 * Math.sin(ang))];
  };

  const apex: Vector3F = [0, 0, sz];
  const center: Vector3F = [0, 0, 0];
  const tMid: Vector2F = [tx * 0.5, ty * 0.5];

  const positions: number[] = [];
  const uvs: number[] = [];
  const geometry = new BufferGeometry();
  let start = 0;

  const tri = (v: Vector3F[], t: Vector2F[]) => {
    for (let k = 0; k < 3; k++) {
      // BZW (x, y, z) -> three.js (x, z, -y)
      positions.push(v[k][0], v[k][2], -v[k][1]);
      uvs.push(t[k][0], t[k][1]);
    }
  };
  const closeGroup = (materialIndex: number) => {
    const count = positions.length / 3 - start;
    geometry.addGroup(start, count, materialIndex);
    start += count;
  };

  // Edge: apex gets the texture center, ring gets the projected circle
  for (let i = 0; i < divisions; i++) {
    tri([apex, ringV(i), ringV(i + 1)], [tMid, ringT(i), ringT(i + 1)]);
  }
  closeGroup(CONE_EDGE);

  // Bottom: texcoords are read backwards (TI macro) so the image isn't
  // mirrored when viewed from below
  for (let i = 0; i < divisions; i++) {
    tri(
      [center, ringV(i + 1), ringV(i)],
      [tMid, ringT(divisions - i - 1), ringT(divisions - i)],
    );
  }
  closeGroup(CONE_BOTTOM);

  if (!isCircle) {
    // Start/end are single triangles mapped onto corners of [0,tx]x[0,ty]
    tri(
      [center, ringV(0), apex],
      [
        [0, 0],
        [tx, 0],
        [0, ty],
      ],
    );
    closeGroup(CONE_START);
    tri(
      [ringV(divisions), center, apex],
      [
        [0, 0],
        [tx, 0],
        [tx, ty],
      ],
    );
    closeGroup(CONE_END);
  }

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

  if (!flatshading) {
    geometry.computeVertexNormals();
  }

  return geometry;
}
