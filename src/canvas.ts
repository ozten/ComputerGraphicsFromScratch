import { interpolate } from './util.js';
import { Vector, Color, Vec3, RGBColor, Vector3D } from './vectors.js';

// Constants for canvas dimensions
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 512;

// For simplicity, not required...
export const VIEWPORT_WIDTH = 1.0;
export const VIEWPORT_HEIGHT = 0.7;

export const VIEWPORT_LEFT = -384; // 768 / 2
export const VIEWPORT_RIGHT = 384;
export const VIEWPORT_TOP = 256; // 512 / 2
export const VIEWPORT_BOTTOM = -256;

export const DISTANCE_TO_VIEWPORT = 1;

// Canvas to screen point conversion
export const canvasPtToScreenPt = (canvas: Vector, canvasPt: Vector): Vector => {
  return Vec3.vector(
    canvas.x / 2 + canvasPt.x, 
    canvas.y / 2 + canvasPt.y,
    0
  );
};

// Canvas to viewport position conversion
// Used in Raytracing
export const canvasToViewportPos = (
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

export const viewportToCanvas = (x: number, y: number): Vector3D => {
  console.log(canvas.width, canvas.height);
  console.log('viewportToCanvas', x, y);

  let canvasX = x * canvas.width/VIEWPORT_WIDTH;
  canvasX += canvas.width / 2;
  let canvasY = y * canvas.height / VIEWPORT_HEIGHT;
  canvasY += canvas.height / 2;

  console.log('viewportToCanvas ', canvasX, canvasY);

  // return Vec3.position(canvasX * -1, canvasY * -1, 0);
  return Vec3.position(
    Math.abs(canvas.width - Math.floor(canvasX * -1)), 
    Math.abs(canvas.height - Math.floor(canvasY)), 0);
}

// TODO shouldbe
export const projectVertex = (v: Vector3D): Vector3D =>  {
  const VIEWPORT_Z = 1; // TODO
  let viewportX = v.x * VIEWPORT_Z / v.z;
  let viewportY = v.y * VIEWPORT_Z / v.z;

  console.log(v.x, v.y, v.z, 'projectVertex viewportX, viewportY', viewportX, viewportY);
  return viewportToCanvas(viewportX, viewportY);
}

// Initialize canvas and context
export const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")!;
export const imageData = ctx.createImageData(canvas.width, canvas.height);

// Put a pixel on the canvas
export const putPixel = (canvasPt: Vector, color: Color) => {
  // Normalize up and down for our canvas
  // Normalize book's concept of a canvas against our (center versus top left)
  const theY = Math.abs(CANVAS_HEIGHT - (canvasPt.y + VIEWPORT_TOP));
  const index = (theY * canvas.width + (canvasPt.x + VIEWPORT_RIGHT)) * 4;
  imageData.data[index] = color.r; // Red
  imageData.data[index + 1] = color.g; // Green
  imageData.data[index + 2] = color.b; // Blue
  imageData.data[index + 3] = 255; // Alpha
};

// Draw a test pattern on the canvas
export const testPattern = () => {
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

// Function to render the final image to the canvas
export const renderToCanvas = () => {
  ctx.putImageData(imageData, 0, 0);
};

export function drawLine(p0: Vector3D, p1: Vector3D, color: Color) {
  console.log('drawing', p0.x, p0.y, 'to', p1.x, p1.y);
  if (Math.abs(p1.x - p0.x) > Math.abs(p1.y - p0.y)) {    
    // Line is horizontal-ish
    // make sure x0 < x1
    if (p0.x > p1.x) {      
      var t = p0;
      p0 = p1;
      p1 = t;
    }
    var ys = interpolate(p0.x, p0.y, p1.x, p1.y);
    for (var x=p0.x; x <= p1.x; x++) {      
      var y = ys[x - p0.x];
      // console.log('putPixel(Vec3.vector(x, y, 0), color);      ', x, y);
      putPixel(Vec3.vector(x, y, 0), color);      
    }
    
  } else {
    // Line is vertical-ish
    // Make sure y0 < y1
    if (p0.y > p1.y) {
      var t = p0;
      p0 = p1;
      p1 = t;
    }
    var xs = interpolate(p0.y, p0.x, p1.y, p1.x);
    for (var y=p0.y; y <= p1.y; y++) {
      var x = xs[y - p0.y];
      // console.log('putPixel(Vec3.vector(x, y, 0), color);      ', x, y);
      putPixel(Vec3.vector(x, y, 0), color);
    }
  }
}