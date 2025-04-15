import { computeLighting, Light } from './lighting.js';
import { Vector3D, Position, Vector, Normal, Color, Vec3, RGBColor } from './vectors.js';

// Define the Sphere interface
export interface Sphere {
  centerPos: Position;
  radius: number;
  color?: Color;
}

// Helper function to check if a value is within a range
export const withIn = (val: number, min: number, max: number): boolean => {
  return val > min && val < max;
};

// Ray-sphere intersection calculation
export const intersectRaySphere = (
  cameraPos: Position, 
  viewportPos: Vector, 
  sphere: Sphere
): number | [number, number] => {
  const r = sphere.radius;
  const CO = Vec3.sub(cameraPos, sphere.centerPos);

  const a = Vec3.dot(viewportPos, viewportPos);
  const b = 2 * Vec3.dot(CO, viewportPos);
  const c = Vec3.dot(CO, CO) - r * r;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return Number.MAX_VALUE;
  }
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [t1, t2];
};

// Main ray tracing function
export const traceRay = (
  cameraPos: Position, 
  viewportPos: Vector, 
  tMin: number, 
  tMax: number,
  spheres: Sphere[],
  lights: Light[]
): Color => {
  let closestT = Number.MAX_VALUE;
  let closestSphere: Sphere | null = null;

  for (let i = 0; i < spheres.length; i++) {
    const curSphere = spheres[i];
    const ts = intersectRaySphere(cameraPos, viewportPos, curSphere);
    if (Array.isArray(ts) && ts.length > 0 && withIn(ts[0], tMin, tMax) && ts[0] < closestT) {
      closestT = ts[0];
      closestSphere = curSphere;
    }
    if (Array.isArray(ts) && ts.length > 1 && withIn(ts[1], tMin, tMax) && ts[1] < closestT) {
      closestT = ts[1];
      closestSphere = curSphere;
    }
  }
  if (closestSphere == null) {
    const white = Math.random() * 15 + (255 - 15);
    return RGBColor.fromRGB(white, white, white);
  }
  

  const point: Position = Vec3.toPosition(Vec3.mulScalar( Vec3.sub(viewportPos, cameraPos), closestT));
  
  const surfaceDir = Vec3.sub(point, closestSphere.centerPos);
  const intensity = computeLighting(point, Vec3.normalize(surfaceDir), lights);
  return RGBColor.fromVec3(Vec3.mulScalar(closestSphere.color, intensity));
};
