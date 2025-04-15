import { Vector, Color, Vec3, RGBColor } from './vectors.js';

// Constants for canvas dimensions
export const CANVAS_WIDTH = 768;
export const CANVAS_HEIGHT = 512;

// For simplicity, not required...
export const VIEWPORT_WIDTH = 1;
export const VIEWPORT_HEIGHT = 1;

export const VIEWPORT_LEFT = -384; // 768 / 2
export const VIEWPORT_RIGHT = 384;
export const VIEWPORT_TOP = 256; // 512 / 2
export const VIEWPORT_BOTTOM = -256;

// Canvas to screen point conversion
export const canvasPtToScreenPt = (canvas: Vector, canvasPt: Vector): Vector => {
  return Vec3.vector(
    canvas.x / 2 + canvasPt.x, 
    canvas.y / 2 + canvasPt.y,
    0
  );
};

// Canvas to viewport position conversion
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
