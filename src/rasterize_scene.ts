import { interpolate, interpolateFloat } from "./util.js";
import { RGBColor, Vector3D, Vec3 } from "./vectors.js";
import { Triangle } from "./triangle.js";
import {
  drawLine,
  putPixel,
  renderToCanvas,
  projectVertex,
  VIEWPORT_BOTTOM,
  VIEWPORT_LEFT,
  VIEWPORT_RIGHT,
  VIEWPORT_TOP,
} from "./canvas.js";

import { scene } from "./simple_scene.js";
import { Instance, Transform } from "./object_types.js";
import { red } from "./colors.js";

// 0 to 1 how strongly we will show the color
const intensities: number[] = [0, 0, 1];

function renderTriangle(triangle: Triangle, projected: any) {
  // drawFilledTriangle(
  drawWireframeTriangle(
    Triangle.make(triangle.x, triangle.y, triangle.z, projected, triangle.color)
  );
}

function drawWireframeTriangle(
  triangle: Triangle
  /* projected: any,
  color: Color */
) {
  drawLine(triangle.vertices[0], triangle.vertices[1], triangle.color);
  drawLine(triangle.vertices[1], triangle.vertices[2], triangle.color);
  drawLine(triangle.vertices[2], triangle.vertices[0], triangle.color);
}

function removeLast(anArray) {
  return anArray.slice(0, anArray.length - 1);
}

function drawFilledTriangle(triangle: Triangle) {
  var p0 = triangle.vertices[0];
  var p1 = triangle.vertices[1];
  var p2 = triangle.vertices[2];

  if (p1.y < p0.y) {
    var t = p0;
    p0 = p1;
    p1 = t;
  }
  if (p2.y < p0.y) {
    var t = p0;
    p0 = p2;
    p2 = t;
  }
  if (p2.y < p1.y) {
    var t = p1;
    p1 = p2;
    p2 = t;
  }

  // TODO: these are not baked into the Triangle yet.
  // Chapter 8 is weird, didn't want to commit
  var h0 = intensities[0];
  var h1 = intensities[1];
  var h2 = intensities[2];

  var x01 = removeLast(interpolate(p0.y, p0.x, p1.y, p1.x));
  var h01 = removeLast(interpolateFloat(p0.y, h0, p1.y, h1));
  var x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
  var h12 = interpolateFloat(p1.y, h1, p2.y, h2);
  var x02 = interpolate(p0.y, p0.x, p2.y, p2.x);
  var h02 = interpolateFloat(p0.y, h0, p2.y, h2);

  var x012 = x01.concat(x12);
  var h012 = h01.concat(h12);

  var m = Math.floor(x02.length / 2);
  var xLeft, xRight, hLeft, hRight;
  if (x02[m] < x012[m]) {
    xLeft = x02;
    hLeft = h02;
    xRight = x012;
    hRight = h012;
  } else {
    xLeft = x012;
    hLeft = h012;
    xRight = x02;
    hRight = h02;
  }

  for (var y = p0.y; y <= p2.y; y++) {
    var yMinusP0y = y - p0.y;

    var xLeftThisY = xLeft[yMinusP0y];
    var hLeftThisY = hLeft[yMinusP0y];
    var xRightThisY = xRight[yMinusP0y];
    var hRightThisY = hRight[yMinusP0y];
    var hSegment = interpolateFloat(
      xLeftThisY,
      hLeftThisY,
      xRightThisY,
      hRightThisY
    );

    for (var x = xLeft[y - p0.y]; x < xRight[y - p0.y]; x++) {
      var shadedColor = Vec3.mulScalar(triangle.color, hSegment[yMinusP0y]);
      putPixel(Vec3.vector(x, y, 0), RGBColor.fromVec3(shadedColor));
    }
  }
}

function main() {
  // White background
  for (let canvasX = VIEWPORT_LEFT; canvasX <= VIEWPORT_RIGHT; canvasX++) {
    for (let canvasY = VIEWPORT_BOTTOM; canvasY <= VIEWPORT_TOP; canvasY++) {
      putPixel(
        Vec3.vector(canvasX, canvasY, 0),
        RGBColor.fromRGB(255, 255, 255)
      );
    }
  }

  renderScene();

  renderToCanvas();
}

function renderScene() {
  for (let i = 0; i < scene.instances.length; i++) {
    renderInstance(scene.instances[i]);
  }
}

const applyTransform = (transform: Transform, vertex: Vector3D): Vector3D => {
  console.log("applyingTransform transform.rotation", transform.rotation);
  var scaled = Vec3.mulScalar(vertex, transform.scale);

  var rotated = applyRotateToPoint(
    transform.rotation.x,
    transform.rotation.y,
    transform.rotation.z,
    scaled
  );
  console.log("scaled=", scaled, "rotated too", rotated);
  var pos = Vec3.matrixAdd(rotated, transform.translation);

  return pos;
};

const applyRotateToPoint = (
  angleX: number,
  angleY: number,
  angleZ: number,
  point: Vector3D
): Vector3D => {
  // Convert degrees to radians
  const radX = (angleX * Math.PI) / 180;
  const radY = (angleY * Math.PI) / 180;
  const radZ = (angleZ * Math.PI) / 180;

  let x = point.x;
  let y = point.y;
  let z = point.z;

  // Rotation around X-axis (YZ plane)
  let y1 = y * Math.cos(radX) - z * Math.sin(radX);
  let z1 = y * Math.sin(radX) + z * Math.cos(radX);
  let x1 = x;

  // Rotation around Y-axis (XZ plane)
  let x2 = x1 * Math.cos(radY) + z1 * Math.sin(radY);
  let z2 = -x1 * Math.sin(radY) + z1 * Math.cos(radY);
  let y2 = y1;

  // Rotation around Z-axis (XY plane)
  let x3 = x2 * Math.cos(radZ) - y2 * Math.sin(radZ);
  let y3 = x2 * Math.sin(radZ) + y2 * Math.cos(radZ);
  let z3 = z2;

  return Vec3.position(x3, y3, z3);
};

function renderInstance(instance: Instance) {
  var projected = [];
  var model = instance.model;
  for (var i = 0; i < model.verticies.length; i++) {
    var verts = applyTransform(instance.transform, model.verticies[i]);
    projected.push(projectVertex(verts));
  }
  for (var i = 0; i < model.triangles.length; i++) {
    const triangle = model.triangles[i];
    renderTriangle(triangle, projected);
  }
}

let running = false;
function loop() {
  if (scene.instances[0].transform.rotation.y >= 360) {
    scene.instances[0].transform.rotation.y = 0;
  } else {
    scene.instances[0].transform.rotation.y += 1;
  }
  requestAnimationFrame(() => {
    main();
    if (running) {
      loop();
    }
  });
}

loop();
