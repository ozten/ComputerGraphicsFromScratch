import { Vector3D, Position, Vector, Normal, Color, Vec3, RGBColor } from './vectors.js';

// Constants for canvas and viewport dimensions
const CANVAS_WIDTH = 768;
const CANVAS_HEIGHT = 512;

// For simplicity, not required...
const VIEWPORT_WIDTH = 1;
const VIEWPORT_HEIGHT = 1;

const VIEWPORT_LEFT = -384; // 768 / 2
const VIEWPORT_RIGHT = 384;
const VIEWPORT_TOP = 256; // 512 / 2
const VIEWPORT_BOTTOM = -256;

// Camera's position is O

// Vector operations are now handled by the Vec3 class in vectors.ts

// Canvas to screen point conversion
const canvasPtToScreenPt = (canvas: Vector, canvasPt: Vector): Vector => {
  return Vec3.vector(
    canvas.x / 2 + canvasPt.x, 
    canvas.y / 2 + canvasPt.y,
    0
  );
};

// Canvas to viewport position conversion
const canvasToViewportPos = (
  viewport: Vector,
  canvas: Vector,
  canvasPt: Vector
): Vector => {
  return Vec3.vector(
    (canvasPt.x * viewport.x) / canvas.x,
    (canvasPt.y * viewport.y) / canvas.x,
    1
  );
};

/*
var raycast = (cameraPos, t, viewportPos) => {
    return Vec3.add(cameraPos, 
                   Vec3.mulScalar(
                        Vec3.sub(viewportPos, cameraPos),
                        t));
};
*/

interface Sphere {
  centerPos: Position;
  radius: number;
  color?: Color;
}

const createSphere = (centerPos: Position, radius: number): Sphere => {
  return {
    centerPos,
    radius,
  };
};

const sphere1 = createSphere(Vec3.position(0, -1, 3), 1);
sphere1.color = RGBColor.fromRGB(255, 0, 0);
const sphere2 = createSphere(Vec3.position(2, 0, 4), 1);
sphere2.color = RGBColor.fromRGB(0, 0, 255);
const sphere3 = createSphere(Vec3.position(-2, 0, 4), 1);
sphere3.color = RGBColor.fromRGB(0, 255, 0);

// vec3Dot(P - C, P - C) = r * r
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const imageData = ctx.createImageData(canvas.width, canvas.height);
console.log(canvas.width, canvas.height);

const putPixel = (canvasPt: Vector, color: Color) => {
  // Normalize up and down for our canvas
  // Normalize book's concept of a canvas against our (center versus top left)
  const theY = Math.abs(CANVAS_HEIGHT - (canvasPt.y + VIEWPORT_TOP));
  const index = (theY * canvas.width + (canvasPt.x + VIEWPORT_RIGHT)) * 4;
  imageData.data[index] = color.r; // Red
  imageData.data[index + 1] = color.g; // Green
  imageData.data[index + 2] = color.b; // Blue
  imageData.data[index + 3] = 255; // Alpha
};

const testPattern = () => {
  // Example: fill canvas with a gradient pixel-by-pixel
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      putPixel(
        Vec3.vector(x, y, 0), 
        RGBColor.fromRGB(x % 256, y % 256, 0)
      );
    }
  }
};
testPattern();

let D: Vector;

const intersectRaySphere = (cameraPos: Position, viewportPos: Vector, sphere: Sphere): number | [number, number] => {
  const r = sphere.radius;
  const CO = Vec3.sub(cameraPos, sphere.centerPos);

  const a = Vec3.dot(viewportPos, viewportPos);
  const b = 2 * Vec3.dot(CO, D);
  const c = Vec3.dot(CO, CO) - r * r;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return Number.MAX_VALUE;
  }
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [t1, t2];
};

const spheres = [sphere1, sphere2, sphere3];

const withIn = (val: number, min: number, max: number): boolean => {
  return val > min && val < max;
};

const traceRay = (cameraPos: Position, viewportPos: Vector, tMin: number, tMax: number): Color => {
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
    return RGBColor.fromRGB(0, 150, 150);
  }

  return closestSphere.color || RGBColor.fromRGB(0, 0, 0);
};

const cameraPos = Vec3.position(0, 0, 0);

const viewport = Vec3.vector(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0);

const distances: Vector[] = [];
for (let canvasX = VIEWPORT_LEFT; canvasX <= VIEWPORT_RIGHT; canvasX++) {
  for (let canvasY = VIEWPORT_BOTTOM; canvasY <= VIEWPORT_TOP; canvasY++) {
    // D is the viewportPos
    D = canvasToViewportPos(
      viewport,
      Vec3.vector(CANVAS_WIDTH, CANVAS_HEIGHT, 0),
      Vec3.vector(canvasX, canvasY, 0)
    );
    const color = traceRay(cameraPos, D, 1, Number.MAX_VALUE);
    
    putPixel(Vec3.vector(canvasX, canvasY, 0), color);
  }
}

ctx.putImageData(imageData, 0, 0);
