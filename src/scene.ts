const X = 0;
const WIDTH = 0;
const R = 0;
const HEIGHT = 0;
const Y = 1;
const G = 1;
const Z = 2;
const B = 2;
const A = 3;
const W = 3;

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

var vec3Add = (p1, p2) => {
  return [p1[X] + p2[X], p1[Y] + p2[Y], p1[Z] + p2[Z]];
};

var vec3Sub = (p1, p2) => {
  return [p1[X] - p2[X], p1[Y] - p2[Y], p1[Z] - p2[Z]];
};

var vec3Mul = (p1, p2) => {
  return [p1[X] * p2[X], p1[Y] * p2[Y], p1[Z] * p2[Z]];
};

var vec3MulScalar = (p1, s) => {
  return [p1[X] * s, p1[Y] * s, p1[Z] * s];
};

var vec3SubScalar = (p1, s) => {
  return [p1[X] - s, p1[Y] - s, p1[Z] - s];
};

var vec3Div = (p1, p2) => {
  return [p1[X] / p2[X], p1[Y] / p2[Y], p1[Z] / p2[Z]];
};

// Angle between vectors
var vec3Dot = (p1, p2) => {
  return p1[X] * p2[X] + p1[Y] * p2[Y] + p1[Z] * p2[Z];
};

// A Vector perpendicular to the two input vectors
var vec3Cross = (p1, p2) => {
  return [
    p1[Y] * p2[Z] - p1[Z] * p2[Y], // X component
    p1[Z] * p2[X] - p1[X] * p2[Z], // Y component
    p1[X] * p2[Y] - p1[Y] * p2[X], // Z component
  ];
};

// Vector length/magnitude
var vec3Length = (v) => {
  return Math.sqrt(v[X] * v[X] + v[Y] * v[Y] + v[Z] * v[Z]);
};

// Vector normalization (returns a unit vector in the same direction)
var vec3Normalize = (v) => {
  const length = vec3Length(v);

  // Avoid division by zero
  if (length === 0) {
    return [0, 0, 0];
  }

  return [v[X] / length, v[Y] / length, v[Z] / length];
};

/*

      CanvasWidth
Sx  = -----------  + CanvasX
           2

      CanvasHeight
Sy  = -----------  + CanvasY
           2
*/
var canvasPtToScreenPt /* [ScreenX, ScreenY] */ = (canvas, canvasPt) => {
  return [canvas[X] / 2 + canvasPt[X], canvas[Y] / 2 + canvasPt[Y]];
};

var canvasToViewportPos /* [ViewportX, ViewportY] */ = (
  viewport,
  canvas,
  canvasPt
) => {
  return [
    (canvasPt[X] * viewport[WIDTH]) / canvas[WIDTH],
    (canvasPt[Y] * viewport[HEIGHT]) / canvas[WIDTH],
    1,
  ];
};

/*
var raycast = (cameraPos, t, viewportPos) => {
    return vec3Add(cameraPos, 
                   vec3MulScalar(
                        vec3Sub(viewportPos, cameraPos),
                        t));
};
*/

interface Sphere {
  centerPos: number[];
  radius: number;
  color?: number[];
}

var Sphere = (centerPos, radius): Sphere => {
  return {
    centerPos,
    radius,
  };
};

var sphere1 = Sphere([0, -1, 3], 1);
sphere1.color = [255, 0, 0];
var sphere2 = Sphere([2, 0, 4], 1);
sphere2.color = [0, 0, 255];
var sphere3 = Sphere([-2, 0, 4], 1);
sphere3.color = [0, 255, 0];

// vec3Dot(P - C, P - C) = r * r
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const imageData = ctx.createImageData(canvas.width, canvas.height);
console.log(canvas.width, canvas.height);

var putPixel = (canvasPt, color) => {
  // Normalize up and down for our canvas
  // Normalize book's concept of a canvas against our (center versus top left)
  var theY = Math.abs(CANVAS_HEIGHT - (canvasPt[Y] + VIEWPORT_TOP));
  const index = (theY * canvas.width + (canvasPt[X] + VIEWPORT_RIGHT)) * 4;
  imageData.data[index] = color[R]; // Red
  imageData.data[index + 1] = color[G]; // Green
  imageData.data[index + 2] = color[B]; // Blue
  imageData.data[index + 3] = 255; // Alpha
};

var testPattern = () => {
  // Example: fill canvas with a gradient pixel-by-pixel
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      putPixel([x, y], [x % 256, y % 256, 0]);
    }
  }
};
testPattern();

var D: number[];

var intersectRaySphere = (cameraPos, viewportPos, sphere) => {
  var r = sphere.radius;
  var CO = vec3Sub(cameraPos, sphere.centerPos);

  var a = vec3Dot(viewportPos, viewportPos);
  var b = 2 * vec3Dot(CO, D);
  var c = vec3Dot(CO, CO) - r * r;

  var discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return Number.MAX_VALUE;
  }
  var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [t1, t2];
};

var spheres = [sphere1, sphere2, sphere3];

var withIn = (val, min, max) => {
  return val > min && val < max;
};

var traceRay = (cameraPos, viewportPos, tMin, tMax) => {
  var closestT = Number.MAX_VALUE;
  var closestSphere = null;

  for (var i = 0; i < spheres.length; i++) {
    var curSphere = spheres[i];
    var ts = intersectRaySphere(cameraPos, viewportPos, curSphere);
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
    return [255, 255, 255];
  }

  return closestSphere.color;
};

var cameraPos = [0, 0, 0];

var viewport = [VIEWPORT_WIDTH, VIEWPORT_HEIGHT];

var distances = [];
for (var canvasX = VIEWPORT_LEFT; canvasX <= VIEWPORT_RIGHT; canvasX++) {
  for (var canvasY = VIEWPORT_BOTTOM; canvasY <= VIEWPORT_TOP; canvasY++) {
    // D is the viewportPos
    var D = canvasToViewportPos(
      viewport,
      [CANVAS_WIDTH, CANVAS_HEIGHT],
      [canvasX, canvasY]
    );
    var color = traceRay(cameraPos, D, 1, Number.MAX_VALUE);
    
    putPixel([canvasX, canvasY], color);
  }
}

ctx.putImageData(imageData, 0, 0);
