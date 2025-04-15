import { Vector3D, Position, Vector, Normal, Color, Vec3, RGBColor } from './vectors.js';
import { AmbientLight, PointLight, DirectionalLight } from './lighting.js';
import { Sphere, traceRay, withIn, intersectRaySphere } from './ray_trace.js';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, 
  VIEWPORT_WIDTH, VIEWPORT_HEIGHT,
  VIEWPORT_LEFT, VIEWPORT_RIGHT, VIEWPORT_TOP, VIEWPORT_BOTTOM,
  canvasToViewportPos, putPixel, testPattern, renderToCanvas,
  canvas, ctx, imageData
} from './canvas.js';

// Camera's position is O

/*
var raycast = (cameraPos, t, viewportPos) => {
    return Vec3.add(cameraPos, 
                   Vec3.mulScalar(
                        Vec3.sub(viewportPos, cameraPos),
                        t));
};
*/

const ambientLight = new AmbientLight(0.2, RGBColor.fromRGB(255, 255, 255));

const pointLight = new PointLight(0.6, Vec3.position(2, 1, 0), RGBColor.fromRGB(255, 255, 255));

const directionLight = new DirectionalLight(0.2, Vec3.vector(1, 4, 4), RGBColor.fromRGB(255, 255, 255));

const lights = [ambientLight, pointLight, directionLight];

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
const sphere4 = createSphere(Vec3.position(0, -5001, 0), 5000);
sphere4.color = RGBColor.fromRGB(255, 255, 0);

console.log(canvas.width, canvas.height);

// Run the test pattern
testPattern();

let D: Vector;

const spheres = [sphere1, sphere2, sphere3, sphere4];

const viewport = Vec3.vector(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, 0);

const anim = false;

function main() {
  const cameraPos = anim ? Vec3.position(0, 0, Math.cos(new Date().getTime() / 1000)*1.0) : Vec3.position(0, 0, 0);
  for (let canvasX = VIEWPORT_LEFT; canvasX <= VIEWPORT_RIGHT; canvasX++) {
    for (let canvasY = VIEWPORT_BOTTOM; canvasY <= VIEWPORT_TOP; canvasY++) {
      // D is the viewportPos
      D = canvasToViewportPos(
        viewport,
        Vec3.vector(CANVAS_WIDTH, CANVAS_HEIGHT, 0),
        Vec3.vector(canvasX, canvasY, 0)
      );
      const color = traceRay(cameraPos, D, 1, Number.MAX_VALUE, spheres, lights);
      
      putPixel(Vec3.vector(canvasX, canvasY, 0), color);
    }
  }
  
  // Render the final image to the canvas
  renderToCanvas();
  if (anim) requestAnimationFrame(main);  
}


requestAnimationFrame(main);